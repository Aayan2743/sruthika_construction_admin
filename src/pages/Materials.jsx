import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import TablePagination, { DEFAULT_TABLE_PAGE_SIZE } from "../components/TablePagination";
import { ChevronDown, X } from "lucide-react";
import { getMaterialEntryHistory } from "../api/reportApi";
import { getProjects } from "../api/projectApi";

export default function Materials() {
  const [project, setProject] = useState("");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Edit details modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editModalData, setEditModalData] = useState(null);

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

  const fetchMaterialEntries = async (projectId, filterDate) => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {};
      if (projectId) params.project_id = projectId;
      if (filterDate) params.date = filterDate;

      const res = await getMaterialEntryHistory(params);
      const data = res?.data?.data || [];

      const formatted = data.map((item) => ({
        id: item.id,
        sno: item.s_no,
        date: item.date,
        vendor: item.vendor || "-",
        itemName: item.item_name || "-",
        quantity: item.quantity || "0",
        reasonEdit: item.edit_reason || "-",
        reasonDelete: "-",
        _changes: item.changes || null,
        _manager: item.manager || null,
      }));

      setRows(formatted);
    } catch (err) {
      console.error("Error fetching material entry history:", err);
      setError("Failed to load material data. Please try again.");
      setRows([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    fetchMaterialEntries(project, date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, date]);

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

  const handleViewClick = (row) => {
    setEditModalData(row);
    setEditModalOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-4 pt-1">

        {/* FILTER SECTION */}
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
              <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
            </div>

            {/* Date Filter */}
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

        {/* TABLE */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <table className="w-full border-collapse text-sm min-w-[500px]">
              <thead>
                <tr className="bg-secondary/50">
                  <th className="py-3 px-4 font-semibold text-foreground text-left border-b border-border border-r border-border">S.No</th>
                  <th className="py-3 px-4 font-semibold text-foreground text-left border-b border-border border-r border-border">Date</th>
                  <th className="py-3 px-4 font-semibold text-foreground text-left border-b border-border border-r border-border">Vendor</th>
                  <th className="py-3 px-4 font-semibold text-foreground text-left border-b border-border border-r border-border">Item Name</th>
                  <th className="py-3 px-4 font-semibold text-foreground text-right border-b border-border border-r border-border">Quantity</th>
                  <th className="py-3 px-4 font-semibold text-foreground text-center border-b border-border border-r border-border">Reason(Edit)</th>
                  <th className="py-3 px-4 font-semibold text-foreground text-center border-b border-border">Reason(Delete)</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-10 text-muted-foreground">
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="7" className="text-center py-10 text-red-500">
                      {error}
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-10 text-muted-foreground">
                      No data found
                    </td>
                  </tr>
                ) : (
                  paginatedRows.map((row) => (
                    <tr key={row.id} className="hover:bg-secondary/30 transition">
                      <td className="py-3 px-4 border-b border-border border-r border-border">{row.sno}</td>
                      <td className="py-3 px-4 border-b border-border border-r border-border whitespace-nowrap">{row.date}</td>
                      <td className="py-3 px-4 border-b border-border border-r border-border">{row.vendor}</td>
                      <td className="py-3 px-4 border-b border-border border-r border-border">{row.itemName}</td>
                      <td className="py-3 px-4 border-b border-border border-r border-border text-right">{row.quantity}</td>
                      <td className="py-3 px-4 border-b border-border border-r border-border text-center">
                        <button
                          onClick={() => handleViewClick(row)}
                          className="px-4 py-1.5 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-full transition-all"
                        >
                          View
                        </button>
                      </td>
                      <td className="py-3 px-4 border-b border-border text-center">{row.reasonDelete}</td>
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

        {/* EDIT DETAILS MODAL */}
        {editModalOpen && editModalData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={() => setEditModalOpen(false)} />
            <div className="relative z-10 w-full max-w-[560px] max-h-[85vh] bg-card rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col">
              <div className="flex items-center justify-between p-5 border-b border-border">
                <div>
                  <h2 className="text-lg font-bold text-foreground">Edit Details</h2>
                  <p className="text-sm text-muted-foreground">
                    {editModalData.vendor} · {editModalData.itemName} · {editModalData.date}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-secondary transition"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <div className="overflow-y-auto p-5 flex-1 space-y-4">
                {/* Manager */}
                {editModalData._manager && (
                  <div className="rounded-xl border border-border bg-background p-4">
                    <span className="text-sm text-muted-foreground">Edited by: </span>
                    <span className="text-sm font-medium text-foreground">{editModalData._manager.name}</span>
                  </div>
                )}

                {/* Edit Reason */}
                <div className="rounded-xl border border-border bg-background p-4">
                  <span className="text-sm text-muted-foreground">Reason: </span>
                  <span className="text-sm font-medium text-foreground">{editModalData.reasonEdit}</span>
                </div>

                {/* Changes */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">Changes</h3>
                  {editModalData._changes ? (
                    <div className="space-y-3">
                      {Object.entries(editModalData._changes).map(([field, values]) => (
                        <div key={field} className="rounded-xl border border-border bg-background p-4">
                          <p className="text-sm font-semibold text-foreground capitalize mb-2">{field}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex-1 rounded-lg bg-red-50 border border-red-100 p-3">
                              <span className="text-red-500 font-medium">Old: </span>
                              <span className="text-foreground">{values.old}</span>
                            </div>
                            <span className="text-muted-foreground font-bold">→</span>
                            <div className="flex-1 rounded-lg bg-green-50 border border-green-100 p-3">
                              <span className="text-green-600 font-medium">New: </span>
                              <span className="text-foreground">{values.new}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No changes recorded.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}