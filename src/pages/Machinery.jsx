import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  Filter,
  EyeOff,
  Columns3,
  X,
  Search,
  Check,
} from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import TablePagination, { DEFAULT_TABLE_PAGE_SIZE } from "../components/TablePagination";
import { getEquipmentEntryHistory } from "../api/reportApi";
import { getProjects } from "../api/projectApi";

const defaultColumns = [
  { key: "sno", label: "S.No", visible: true },
  { key: "date", label: "Date", visible: true },
  { key: "equipment", label: "Equipment", visible: true },
  { key: "vendor", label: "Vendor", visible: true },
  { key: "start", label: "Start", visible: true },
  { key: "close", label: "Close", visible: true },
  { key: "total", label: "Total", visible: true },
  { key: "workDetails", label: "Work Details", visible: true },
  { key: "reasonEdit", label: "Reason(Edit)", visible: true },
  { key: "reasonDelete", label: "Reason(Delete)", visible: true },
];

export default function Machinery() {
  const [project, setProject] = useState("");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const [columns, setColumns] = useState(defaultColumns);
  const [rows, setRows] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Edit histories modal state
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyRowLabel, setHistoryRowLabel] = useState("");
  const [editHistories, setEditHistories] = useState([]);

  const [_headerMenuOpen, setHeaderMenuOpen] = useState(false);
  const [selectedColumnKey, setSelectedColumnKey] = useState("date");
  const [showFilterRow, _setShowFilterRow] = useState(false);
  const [showManageColumns, setShowManageColumns] = useState(false);
  const [manageSearch, setManageSearch] = useState("");

  const [sortConfig, _setSortConfig] = useState({
    key: "",
    direction: "",
  });

  const [filterState, setFilterState] = useState({
    column: "date",
    operator: "contains",
    value: "",
  });

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

  const fetchEquipmentEntries = async (projectId, filterDate) => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {};
      if (projectId) params.project_id = projectId;
      if (filterDate) params.date = filterDate;

      const res = await getEquipmentEntryHistory(params);
      const data = res?.data?.data || [];

      const formatted = data.map((item) => ({
        id: item.id,
        sno: item.s_no,
        date: item.date || "-",
        equipment: item.equipment || "-",
        vendor: item.vendor || "-",
        start: item.start_time || "-",
        close: item.end_time || "-",
        total: item.total_hours ? `${item.total_hours} hrs` : "-",
        workDetails: item.work_done || "-",
        reasonEdit: item.edit_histories?.length > 0 ? "View" : "-",
        reasonDelete: item.delete_reason || "-",   // <-- change here
        _editHistories: item.edit_histories || [],
      }));

      setRows(formatted);
    } catch (err) {
      console.error("Error fetching equipment entry history:", err);
      setError("Failed to load machinery data. Please try again.");
      setRows([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    fetchEquipmentEntries(project, date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, date]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (headerMenuRef.current && !headerMenuRef.current.contains(event.target)) {
        setHeaderMenuOpen(false);
      }
      if (manageColumnsRef.current && !manageColumnsRef.current.contains(event.target)) {
        setShowManageColumns(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredRows = useMemo(() => {
    let data = rows;

    if (showFilterRow && filterState.value.trim()) {
      data = data.filter((row) => {
        const rowValue = String(row[filterState.column] ?? "").toLowerCase();
        const filterValue = filterState.value.toLowerCase();

        switch (filterState.operator) {
          case "contains":
            return rowValue.includes(filterValue);
          case "does not contain":
            return !rowValue.includes(filterValue);
          case "equals":
            return rowValue === filterValue;
          case "does not equal":
            return rowValue !== filterValue;
          case "starts with":
            return rowValue.startsWith(filterValue);
          case "ends with":
            return rowValue.endsWith(filterValue);
          case "is empty":
            return rowValue.trim() === "";
          case "is not empty":
            return rowValue.trim() !== "";
          default:
            return true;
        }
      });
    }

    if (sortConfig.key && sortConfig.direction) {
      data = [...data].sort((a, b) => {
        const aVal = String(a[sortConfig.key] ?? "").toLowerCase();
        const bVal = String(b[sortConfig.key] ?? "").toLowerCase();

        if (sortConfig.direction === "asc") {
          return aVal.localeCompare(bVal);
        }
        return bVal.localeCompare(aVal);
      });
    }

    return data;
  }, [rows, showFilterRow, filterState, sortConfig]);

  useEffect(() => {
    setPage(1);
  }, [project, date]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(filteredRows.length / DEFAULT_TABLE_PAGE_SIZE));
    setPage((p) => Math.min(p, totalPages));
  }, [filteredRows.length]);

  const paginatedRows = useMemo(
    () => filteredRows.slice((page - 1) * DEFAULT_TABLE_PAGE_SIZE, page * DEFAULT_TABLE_PAGE_SIZE),
    [filteredRows, page]
  );

  const visibleColumns = columns.filter((col) => col.visible);

  const toggleColumn = (key) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const toggleAllColumns = () => {
    const allVisible = columns.every((col) => col.visible);
    setColumns((prev) =>
      prev.map((col) => ({ ...col, visible: !allVisible }))
    );
  };

  const resetColumns = () => {
    setColumns(defaultColumns);
  };

  const searchedColumns = columns.filter((col) =>
    col.label.toLowerCase().includes(manageSearch.toLowerCase())
  );

  const _openColumnMenu = (key) => {
    setSelectedColumnKey(key);
    setFilterState((prev) => ({ ...prev, column: key }));
    setHeaderMenuOpen((prev) => (selectedColumnKey === key ? !prev : true));
  };

  const handleViewClick = (row) => {
    setHistoryRowLabel(`${row.equipment || "Unknown"} · ${row.vendor || ""} · ${row.date || ""}`);
    setEditHistories(row._editHistories || []);
    setHistoryOpen(true);
  };

  const headerCellClass = (key) =>
    `py-3 px-4 font-semibold text-foreground border-b border-border border-r border-border last:border-r-0 ${
      key === "workDetails"
        ? "text-left min-w-[160px] max-w-[min(320px,32vw)] whitespace-normal"
        : "text-center whitespace-nowrap"
    }`;

  const bodyCellClass = (key) =>
    `py-3 px-4 border-b border-border border-r border-border last:border-r-0 align-middle ${
      key === "workDetails"
        ? "text-left text-sm max-w-[min(320px,32vw)] whitespace-normal break-words"
        : "text-center whitespace-nowrap"
    }`;

  return (
    <AdminLayout>
      <div className="relative space-y-4 pt-1">
        <p className="text-sm md:text-[15px] leading-6 text-muted-foreground">
          Data comes from manager daily reports.
        </p>

        <div className="rounded-[28px] border border-border bg-card p-4 md:p-5 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Project Dropdown */}
            <div className="relative min-w-[220px]">
              <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">
                Project
              </label>
              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="w-full h-11 rounded-2xl border border-border bg-background px-4 pr-10 appearance-none"
              >
                <option value="">All Projects</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name || p.projectName}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>

            {/* Date Filter + Clear */}
            <div className="flex items-center gap-3">
              <div className="relative min-w-[220px]">
                <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-11 rounded-2xl border border-border bg-background px-4"
                />
              </div>
              <button
                type="button"
                onClick={() => setDate("")}
                className="text-sm font-semibold text-foreground hover:text-primary flex-shrink-0"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm min-w-[1100px]">
              <thead>
                <tr className="bg-secondary/50">
                  {visibleColumns.map((col) => (
                    <th key={col.key} className={headerCellClass(col.key)}>
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={visibleColumns.length} className="py-10 text-center text-muted-foreground">
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={visibleColumns.length} className="py-10 text-center text-red-500">
                      {error}
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={visibleColumns.length} className="py-10 text-center text-muted-foreground">
                      No machinery rows for this filter
                    </td>
                  </tr>
                ) : (
                  paginatedRows.map((row) => (
                    <tr key={row.id} className="hover:bg-secondary/30 transition">
                      {visibleColumns.map((col) => (
                        <td key={col.key} className={bodyCellClass(col.key)}>
                          {col.key === "reasonEdit" ? (
                            row._editHistories?.length > 0 ? (
                              <button
                                type="button"
                                onClick={() => handleViewClick(row)}
                                className="px-4 py-1.5 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-full transition-all"
                              >
                                View
                              </button>
                            ) : (
                              "-"
                            )
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
          total={filteredRows.length}
          onPageChange={setPage}
        />

        {/* EDIT HISTORIES MODAL */}
        {historyOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={() => setHistoryOpen(false)} />
            <div className="relative z-10 w-full max-w-[720px] max-h-[85vh] bg-card rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col">
              <div className="flex items-center justify-between p-5 border-b border-border">
                <div>
                  <h2 className="text-lg font-bold text-foreground">Edit History</h2>
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
              <div className="overflow-y-auto p-5 flex-1 space-y-4">
                {editHistories.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No edit history found.</p>
                ) : (
                  editHistories.map((entry) => (
                    <div key={entry.id} className="rounded-xl border border-border bg-background p-4 space-y-3">
                      {/* Remarks */}
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
                        <span className="text-muted-foreground">Remarks:</span>
                        <span className="font-medium text-foreground">{entry.remarks || "-"}</span>
                      </div>

                      {/* Changes */}
                      {entry.changes && Object.keys(entry.changes).length > 0 && (
                        <div className="space-y-2">
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Changes</span>
                          {Object.entries(entry.changes).map(([field, values]) => (
                            <div key={field} className="flex items-center gap-3 text-sm">
                              <span className="text-muted-foreground capitalize min-w-[100px]">{field.replace(/_/g, " ")}:</span>
                              <span className="px-2 py-0.5 rounded bg-red-50 text-red-600 font-medium">{values.old || "-"}</span>
                              <span className="text-muted-foreground">→</span>
                              <span className="px-2 py-0.5 rounded bg-green-50 text-green-600 font-medium">{values.new || "-"}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Timestamp */}
                      <div className="text-sm">
                        <span className="text-muted-foreground">Edited At: </span>
                        <span className="text-foreground">{entry.created_at || "-"}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {showManageColumns && (
          <div
            ref={manageColumnsRef}
            className="absolute left-2 top-[95px] w-[335px] rounded-2xl border border-border bg-card shadow-xl z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={manageSearch}
                  onChange={(e) => setManageSearch(e.target.value)}
                  type="text"
                  placeholder="Search"
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-background"
                />
              </div>
            </div>

            <div className="p-4 space-y-4 max-h-[360px] overflow-y-auto sidebar-scroll-hidden">
              {searchedColumns.map((col) => (
                <button
                  key={col.key}
                  type="button"
                  onClick={() => toggleColumn(col.key)}
                  className="w-full flex items-center gap-3 text-left"
                >
                  <span
                    className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                      col.visible
                        ? "bg-primary border-primary text-primary-foreground"
                        : "bg-background border-border text-transparent"
                    }`}
                  >
                    {col.visible && <Check className="w-4 h-4" />}
                  </span>
                  <span className="text-foreground">{col.label}</span>
                </button>
              ))}
            </div>

            <div className="border-t border-border p-4 flex items-center justify-between">
              <button
                type="button"
                onClick={toggleAllColumns}
                className="flex items-center gap-3 text-foreground"
              >
                <span className="w-5 h-5 rounded-md bg-primary text-primary-foreground flex items-center justify-center border border-primary">
                  <Check className="w-4 h-4" />
                </span>
                <span>Show/Hide All</span>
              </button>

              <button
                type="button"
                onClick={resetColumns}
                className="text-muted-foreground hover:text-foreground transition"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}