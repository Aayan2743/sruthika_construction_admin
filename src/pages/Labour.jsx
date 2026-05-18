import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  FileText,
} from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import TablePagination, { DEFAULT_TABLE_PAGE_SIZE } from "../components/TablePagination";
import { getLabourWorkReport, getWorkEditHistory } from "../api/reportApi";
import { getProjects } from "../api/projectApi";

const defaultColumns = [
  { key: "date", label: "Date", visible: true },
  { key: "party", label: "Party", visible: true },
  { key: "gender", label: "Gender", visible: true },
  { key: "workDone", label: "Work done", visible: true },
  { key: "measurements", label: "Measurements", visible: true },
  { key: "reasonEdit", label: "Reason(Edit)", visible: true },
  { key: "reasonDelete", label: "Reason(Delete)", visible: true },
];

export default function Labour() {
  const navigate = useNavigate(); 
  const [rows, setRows] = useState([]);
  const [project, setProject] = useState("");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const [columns, setColumns] = useState(defaultColumns);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [editHistoryOpen, setEditHistoryOpen] = useState(false);
  const [editHistoryLoading, setEditHistoryLoading] = useState(false);
  const [editHistoryData, setEditHistoryData] = useState([]);
  const [editHistoryError, setEditHistoryError] = useState(null);
  const [editHistoryRowLabel, setEditHistoryRowLabel] = useState("");

  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);

  
  const [selectedColumnKey, setSelectedColumnKey] = useState("date");
  const [showFilterRow, setShowFilterRow] = useState(false);
  const [showManageColumns, _setShowManageColumns] = useState(false);
  const [manageSearch, setManageSearch] = useState("");

  const [_sortConfig, _setSortConfig] = useState({ key: "", direction: "" });
  const [filterState, setFilterState] = useState({ column: "date", operator: "contains", value: "" });

  const _headerMenuRef = useRef(null);
  const manageColumnsRef = useRef(null);
  const [projects, setProjects] = useState([]);

  
const fetchProjects = async () => {
  try {
    const res = await getProjects();

    console.log("ADMIN PROJECTS:", res.data);
    console.log("REPORTS RAW:", res);
console.log("REPORTS DATA:", res.data);

    const data = Array.isArray(res.data?.data)
  ? res.data.data
  : Array.isArray(res.data)
  ? res.data
  : [];

    setProjects(data);

  } catch (err) {
    console.log("Project fetch error:", err);
  }
};


const fetchReports = async (projectId, filterDate) => {
  setIsLoading(true);
  setError(null);
  try {
    const params = {};
    if (projectId) params.project_id = projectId;
    if (filterDate) params.date = filterDate;

    const res = await getLabourWorkReport(params);
    const data = res?.data?.data || [];

    const formatted = data.map((item) => {
      const male = Number(item.male_count) || 0;
      const female = Number(item.female_count) || 0;
      return {
        id: item.work_group_id,
        date: item.date,
        party: item.party,
        gender: `M: ${male}  F: ${female}`,
        workDone: item.work_done,
        measurements: item.measurement || "-",
        reasonEdit: item.edit_reason || "-",
        reasonDelete: item.delete_reason || "-",
      };
    });

    setRows(formatted);
  } catch (err) {
    console.error("Error fetching labour work reports:", err);
    setError("Failed to load labour data. Please try again.");
    setRows([]);
  } finally {
    setIsLoading(false);
  }
};

useEffect(() => {
  fetchProjects();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

useEffect(() => {
  fetchReports(project, date);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [project, date]);

  // Handle click on Reason(Edit) button
  //const handleReasonEditClick = (row) => {
    // Navigate to labour-details with row data
   // navigate(`/dashboard/labour-details`, { state: { rowData: row } });
  //};

  
  const handleReasonEditClick = async (row) => {
    const workGroupId = row.id;
    if (!workGroupId) return;

    setEditHistoryRowLabel(`${row.party || "Unknown"} · ${row.date || ""}`);
    setEditHistoryOpen(true);
    setEditHistoryLoading(true);
    setEditHistoryError(null);
    setEditHistoryData([]);

    try {
      const res = await getWorkEditHistory(workGroupId);
      if (res?.data?.success) {
        setEditHistoryData(res.data.data || []);
      } else {
        setEditHistoryData([]);
      }
    } catch (err) {
      console.error("Error fetching edit history:", err);
      setEditHistoryError("Failed to load edit history.");
    } finally {
      setEditHistoryLoading(false);
    }
  };

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

   const _openColumnMenu = (key) => {
    setSelectedColumnKey(key);
    setFilterState((prev) => ({ ...prev, column: key }));
    setHeaderMenuOpen((prev) => (selectedColumnKey === key ? !prev : true));
  };

  // Check if any dropdown is open to expand container height dynamically
  const isAnyMenuOpen = headerMenuOpen || showManageColumns;

  return (
    <AdminLayout>
      <div className="space-y-4 pt-1">
        <p className="text-sm md:text-[15px] leading-6 text-muted-foreground">
          Data comes from manager daily reports.
        </p>

        {/* UPAR WALA BOX */}
        <div className="rounded-[28px] border border-border bg-card p-4 md:p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative min-w-[220px]">
              <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">Project</label>
              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="w-full h-11 rounded-2xl border border-border bg-background px-4 pr-10 text-foreground outline-none appearance-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">All Projects</option>
                {projects.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name || item.projectName}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>

            <div className="relative min-w-[185px]">
              <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-11 rounded-2xl border border-border bg-background px-4 text-foreground outline-none focus:ring-2 focus:ring-primary/30 dark:[color-scheme:dark]"
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

        {/* NICHE WALA BOX */}
        <div className="bg-card rounded-[28px] border border-border shadow-sm overflow-hidden relative">
          <div className={`overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${isAnyMenuOpen ? 'min-h-[480px]' : ''}`}>
            <table className="w-full text-sm border border-border border-collapse">
              <thead>
                <tr className="border-b border-border bg-card">
                  {visibleColumns.map((col) => (
                    <th key={col.key} className="border border-border px-4 py-4 text-center font-semibold whitespace-nowrap">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {showFilterRow && (
                  <tr className="border-b border-border">
                    <td className="border border-border px-4 py-3 whitespace-nowrap">
                      <div className="max-w-[660px] rounded-2xl bg-card shadow-xl border border-border p-5 flex items-center gap-4">
                        <button type="button" onClick={() => setShowFilterRow(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-secondary transition">
                          <X className="w-5 h-5 text-muted-foreground" />
                        </button>
                        <div className="relative min-w-[170px]">
                          <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">Columns</label>
                          <select value={filterState.column} onChange={(e) => setFilterState((prev) => ({ ...prev, column: e.target.value }))} className="w-full h-11 rounded-2xl border border-border bg-background px-4 pr-10 appearance-none">
                            {columns.map((col) => <option key={col.key} value={col.key}>{col.label}</option>)}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="relative min-w-[170px]">
                          <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">Operator</label>
                          <select value={filterState.operator} onChange={(e) => setFilterState((prev) => ({ ...prev, operator: e.target.value }))} className="w-full h-11 rounded-2xl border border-border bg-background px-4 pr-10 appearance-none">
                            <option value="contains">contains</option>
                            <option value="does not contain">does not contain</option>
                            <option value="equals">equals</option>
                            <option value="does not equal">does not equal</option>
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="relative flex-1 min-w-[210px]">
                          <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">Value</label>
                          <input type="text" value={filterState.value} onChange={(e) => setFilterState((prev) => ({ ...prev, value: e.target.value }))} placeholder="Filter value" className="w-full h-11 rounded-2xl border border-border bg-background px-4 text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
                {isLoading ? (
                  <tr>
                    <td colSpan={visibleColumns.length} className="h-[200px] text-center text-muted-foreground">
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={visibleColumns.length} className="h-[200px] text-center text-red-500">
                      {error}
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={visibleColumns.length} className="h-[200px] text-center text-foreground">
                      No rows found
                    </td>
                  </tr>
                ) : (
                  paginatedRows.map((row, index) => (
                    <tr key={row.id ?? index} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                      {visibleColumns.map((col) => (
                        <td key={col.key} className="py-4 px-4 border-b border-border border-r border-border last:border-r-0 text-foreground whitespace-nowrap text-center">
                          {col.key === "reasonEdit" ? (
                           <button
  onClick={() => handleReasonEditClick(row)}
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
                )}              </tbody>
            </table>
          </div>

          {showManageColumns && (
            <div ref={manageColumnsRef} className="absolute left-2 top-[80px] w-[335px] rounded-2xl border border-border bg-card shadow-xl z-50 overflow-hidden">
              <div className="p-4 border-b border-border relative">
                <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input value={manageSearch} onChange={(e) => setManageSearch(e.target.value)} type="text" placeholder="Search" className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-background" />
              </div>
              <div className="p-4 space-y-4 max-h-[360px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {searchedColumns.map((col) => (
                  <button key={col.key} type="button" onClick={() => toggleColumn(col.key)} className="w-full flex items-center gap-3 text-left">
                    <span className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${col.visible ? "bg-primary border-primary text-primary-foreground" : "bg-background border-border text-transparent"}`}>
                      {col.visible && <Check className="w-4 h-4" />}
                    </span>
                    <span className="text-foreground">{col.label}</span>
                  </button>
                ))}
              </div>
              <div className="border-t border-border p-4 flex items-center justify-between">
                <button type="button" onClick={toggleAllColumns} className="flex items-center gap-3 text-foreground">
                  <span className="w-5 h-5 rounded-md bg-primary text-primary-foreground flex items-center justify-center border border-primary"><Check className="w-4 h-4" /></span>
                  <span>Show/Hide All</span>
                </button>
                <button type="button" onClick={resetColumns} className="text-muted-foreground hover:text-foreground transition">Reset</button>
              </div>
            </div>
          )}

        </div>

        {/* EDIT HISTORY MODAL */}
        {editHistoryOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={() => setEditHistoryOpen(false)} />
            <div className="relative z-10 w-full max-w-[720px] max-h-[85vh] bg-card rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col">
              <div className="flex items-center justify-between p-5 border-b border-border">
                <div>
                  <h2 className="text-lg font-bold text-foreground">Edit History</h2>
                  <p className="text-sm text-muted-foreground">{editHistoryRowLabel}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditHistoryOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-secondary transition"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <div className="overflow-y-auto p-5 flex-1">
                {editHistoryLoading ? (
                  <p className="text-center text-muted-foreground py-8">Loading...</p>
                ) : editHistoryError ? (
                  <p className="text-center text-red-500 py-8">{editHistoryError}</p>
                ) : editHistoryData.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No edit history found.</p>
                ) : (
                  <div className="space-y-4">
                    {editHistoryData.map((entry) => (
                      <div key={entry.id} className="rounded-xl border border-border bg-background p-4 space-y-2">
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
                          <span className="text-muted-foreground">Reason:</span>
                          <span className="font-medium text-foreground">{entry.reason || "-"}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Old Work Done: </span>
                            <span className="text-foreground">{entry.old_work_done || "-"}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Old Measurement: </span>
                            <span className="text-foreground">{entry.old_measurement || "-"}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Old Date: </span>
                            <span className="text-foreground">{entry.old_date || "-"}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Labour Name: </span>
                            <span className="text-foreground">{entry.labour_name || "-"}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Edited At: </span>
                            <span className="text-foreground">{entry.edited_at || "-"}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <TablePagination
          variant="page"
          page={page}
          pageSize={DEFAULT_TABLE_PAGE_SIZE}
          total={rows.length}
          onPageChange={setPage}
        />
      </div>
    </AdminLayout>
  );
}