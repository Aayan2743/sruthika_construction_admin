import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown, ArrowUp, ArrowDown, MoreVertical, Filter,
  EyeOff, Columns3, X, Search, Check,
} from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import TablePagination, { DEFAULT_TABLE_PAGE_SIZE } from "../components/TablePagination";
import { getStockHistoryReport } from "../api/reportApi";
import { getProjects } from "../api/projectApi";

const defaultColumns = [
  { key: "date", label: "Date", visible: true },
  { key: "vendor", label: "Vendor", visible: true },
  { key: "item", label: "Item name", visible: true },
  { key: "open", label: "Open", visible: true },
  { key: "received", label: "Received", visible: true },
  { key: "cumulative", label: "Cumulative", visible: true },
  { key: "balance", label: "Balance", visible: true },
  { key: "reasonEdit", label: "Reason (Edit)", visible: true },
  { key: "reasonDelete", label: "Reason (Delete)", visible: true },
];

export default function Stock() {
  const [date, setDate] = useState("");
  const [project, setProject] = useState("");
  const [columns, setColumns] = useState(defaultColumns);
  const [rows, setRows] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyRowLabel, setHistoryRowLabel] = useState("");
  const [editHistories, setEditHistories] = useState([]);
  const [deleteHistories, setDeleteHistories] = useState([]);

  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);
  const [selectedColumnKey, setSelectedColumnKey] = useState("date");
  const [showFilterRow, setShowFilterRow] = useState(false);
  const [showManageColumns, setShowManageColumns] = useState(false);
  const [manageSearch, setManageSearch] = useState("");

  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [filterState, setFilterState] = useState({ column: "date", operator: "contains", value: "" });

  const headerMenuRef = useRef(null);
  const manageColumnsRef = useRef(null);

  const fetchProjects = async () => {
    try {
      const res = await getProjects();
      const data = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];
      setProjects(data);
    } catch (err) {
      console.error("Project fetch error:", err);
    }
  };

  const fetchStockReport = async (projectId, filterDate) => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {};
      if (projectId) params.project_id = projectId;
      if (filterDate) params.date = filterDate;

      const res = await getStockHistoryReport(params);
      const data = res?.data?.data || [];

      const formatted = data.map((item) => ({
        id: item.id,
        date: item.date,
        vendor: item.vendor || "-",
        item: item.item_name || "-",
        open: item.opening_balance || "0",
        received: item.received || "0",
        cumulative: String(
          (parseFloat(item.opening_balance || 0) + parseFloat(item.received || 0)).toFixed(2)
        ),
        balance: item.balance || "0",
        reasonEdit: item.edit_reason || "-",
        reasonDelete: item.delete_reason || "-",
        _editHistories: item.edit_histories || [],
        _deleteHistories: item.delete_histories || [],
      }));

      setRows(formatted);
    } catch (err) {
      console.error("Error fetching stock history report:", err);
      setError("Failed to load stock data. Please try again.");
      setRows([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    fetchStockReport(project, date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, date]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (headerMenuRef.current && !headerMenuRef.current.contains(event.target)) setHeaderMenuOpen(false);
      if (manageColumnsRef.current && !manageColumnsRef.current.contains(event.target)) setShowManageColumns(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [project, date]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(rows.length / DEFAULT_TABLE_PAGE_SIZE));
    setPage((p) => Math.min(p, totalPages));
  }, [rows.length]);

  const paginatedRows = useMemo(
    () => rows.slice((page - 1) * DEFAULT_TABLE_PAGE_SIZE, page * DEFAULT_TABLE_PAGE_SIZE),
    [rows, page]
  );

  const visibleColumns = columns.filter((col) => col.visible);

  const searchedColumns = columns.filter((col) =>
    col.label.toLowerCase().includes(manageSearch.toLowerCase())
  );

  const toggleColumn = (key) => {
    setColumns((prev) => prev.map((col) => (col.key === key ? { ...col, visible: !col.visible } : col)));
  };

  const toggleAllColumns = () => {
    const allVisible = columns.every((col) => col.visible);
    setColumns((prev) => prev.map((col) => ({ ...col, visible: !allVisible })));
  };

  const resetColumns = () => setColumns(defaultColumns);

  const openColumnMenu = (key) => {
    setSelectedColumnKey(key);
    setFilterState((prev) => ({ ...prev, column: key }));
    setHeaderMenuOpen((prev) => (selectedColumnKey === key ? !prev : true));
  };

  const isAnyMenuOpen = headerMenuOpen || showManageColumns;

  return (
    <AdminLayout>
      <div className="space-y-4 pt-1">
        <p className="text-sm md:text-[15px] leading-6 text-muted-foreground">Stock rows are shared with daily site reports (project + date).</p>

        <div className="rounded-[28px] border border-border bg-card p-4 md:p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative min-w-[220px]">
              <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">Project</label>
              <select value={project} onChange={(e) => setProject(e.target.value)} className="w-full h-11 rounded-2xl border border-border bg-background px-4 pr-10 appearance-none text-foreground">
                <option value="">All Projects</option>
                {projects.map((p) => (<option key={p.id} value={p.id}>{p.name || p.projectName}</option>))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
            <div className="relative min-w-[220px]">
              <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full h-11 rounded-2xl border border-border bg-background px-4 text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <button type="button" onClick={() => { setDate(""); setProject(""); }} className="text-sm font-semibold text-foreground hover:text-primary transition self-start sm:self-center">Clear</button>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[1040px]">
            <thead>
              <tr className="bg-secondary/50">
                {visibleColumns.map((col) => (
                  <th
                    key={col.key}
                    className={`py-3 px-4 font-semibold text-foreground border-b border-border border-r border-border last:border-r-0 ${
                      col.key === "reasonDelete"
                        ? "text-left min-w-[180px] max-w-[260px]"
                        : col.key === "item"
                          ? "text-left min-w-[140px] max-w-[220px] whitespace-normal"
                          : "text-center whitespace-nowrap"
                    }`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={visibleColumns.length} className="py-10 text-center text-muted-foreground">Loading...</td></tr>
              ) : error ? (
                <tr><td colSpan={visibleColumns.length} className="py-10 text-center text-red-500">{error}</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={visibleColumns.length} className="py-10 text-center text-muted-foreground">No rows found</td></tr>
              ) : (
                paginatedRows.map((row) => (
                  <tr key={row.id} className="hover:bg-secondary/30 transition">
                    {visibleColumns.map((col) => (
                      <td
                        key={col.key}
                        className={`py-3 px-4 border-b border-border border-r border-border last:border-r-0 align-middle ${
                          col.key === "reasonDelete"
                            ? "text-left text-sm whitespace-normal break-words max-w-[260px]"
                            : col.key === "item"
                              ? "text-left text-sm whitespace-normal break-words max-w-[220px]"
                              : "text-center whitespace-nowrap"
                        }`}
                      >
                        {col.key === "reasonEdit" ? (
                          <button
                            type="button"
                            onClick={() => {
                              setHistoryRowLabel(`${row.vendor || "Unknown"} · ${row.item || ""} · ${row.date || ""}`);
                              setEditHistories(row._editHistories || []);
                              setDeleteHistories(row._deleteHistories || []);
                              setHistoryOpen(true);
                            }}
                            className="px-4 py-1.5 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-full transition-all"
                          >
                            View
                          </button>
                        ) : (
                          row[col.key] ?? "-"
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        </div>
        <TablePagination
          variant="page"
          page={page}
          pageSize={DEFAULT_TABLE_PAGE_SIZE}
          total={rows.length}
          onPageChange={setPage}
        />
      </div>

      {/* HISTORY MODAL */}
      {historyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setHistoryOpen(false)} />
          <div className="relative z-10 w-full max-w-[720px] max-h-[85vh] bg-card rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div>
                <h2 className="text-lg font-bold text-foreground">Stock History</h2>
                <p className="text-sm text-muted-foreground">{historyRowLabel}</p>
              </div>
              <button
                type="button"
                onClick={() => setHistoryOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-secondary transition"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="overflow-y-auto p-5 flex-1 space-y-6">
              {/* Edit Histories */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Edit Histories</h3>
                {editHistories.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No edit history found.</p>
                ) : (
                  <div className="space-y-3">
                    {editHistories.map((entry) => (
                      <div key={entry.id} className="rounded-xl border border-border bg-background p-4 space-y-2">
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
                          <span className="text-muted-foreground">Reason:</span>
                          <span className="font-medium text-foreground">{entry.reason || "-"}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Edited At: </span>
                          <span className="text-foreground">{entry.created_at || "-"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Delete Histories */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Delete Histories</h3>
                {deleteHistories.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No delete history found.</p>
                ) : (
                  <div className="space-y-3">
                    {deleteHistories.map((entry) => (
                      <div key={entry.id} className="rounded-xl border border-border bg-background p-4 space-y-2">
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
                          <span className="text-muted-foreground">Reason:</span>
                          <span className="font-medium text-foreground">{entry.reason || "-"}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Deleted At: </span>
                          <span className="text-foreground">{entry.created_at || "-"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}