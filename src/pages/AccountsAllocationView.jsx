import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import TablePagination, { DEFAULT_TABLE_PAGE_SIZE } from "../components/TablePagination";
import { getManagerExpenseDetails } from "../api/accountApi";

export default function AccountsAllocationView() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedRow = location.state?.selectedRow;

  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [manager, setManager] = useState(null);
  const [project, setProject] = useState(null);
  const [totalExpense, setTotalExpense] = useState("0");

  const fetchExpenseDetails = async (pageNum) => {
    if (!selectedRow?.id) return;

    setIsLoading(true);
    setError(null);
    try {
      const res = await getManagerExpenseDetails(selectedRow.id, {
        page: pageNum,
        per_page: DEFAULT_TABLE_PAGE_SIZE,
      });

      const data = res?.data;
      if (data?.success) {
        setRows(data.data || []);
        setManager(data.manager || null);
        setProject(data.project || null);
        setTotalExpense(data.total_expense || "0");

        const pag = data.pagination;
        setTotalPages(pag?.last_page || 1);
        setTotalRecords(pag?.total || 0);
      }
    } catch (err) {
      console.error("Error fetching manager expense details:", err);
      setError("Failed to load expense details. Please try again.");
      setRows([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [selectedRow?.id]);

  useEffect(() => {
    fetchExpenseDetails(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, selectedRow?.id]);

  const totalAmount = useMemo(
    () => rows.reduce((sum, row) => sum + Number(row.amount || 0), 0),
    [rows]
  );

  const entriesCount = totalRecords > 0 ? totalRecords : rows.length;

  return (
    <AdminLayout>
      <div className="space-y-4 pt-1">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => navigate("/dashboard/accounts")}
              className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-2xl text-foreground transition-all shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">Expense entries</h1>
              {selectedRow ? (
                <p className="text-sm text-muted-foreground mt-1">
                  {manager?.name || selectedRow.name}
                  {project?.name || selectedRow.project ? ` · ${project?.name || selectedRow.project}` : ""}
                  {entriesCount > 0
                    ? ` · ${entriesCount} entries · ₹${Number(totalExpense).toLocaleString("en-IN")}`
                    : ""}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground mt-1">Open this page from Accounts using View on a row.</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-secondary/50">
                  <th className="py-3 px-4 font-semibold text-foreground text-left border-b border-border border-r border-border whitespace-nowrap">
                    Date
                  </th>
                  <th className="py-3 px-4 font-semibold text-foreground text-left border-b border-border border-r border-border whitespace-nowrap">
                    Project
                  </th>
                  <th className="py-3 px-4 font-semibold text-foreground text-left border-b border-border border-r border-border whitespace-nowrap">
                    Type
                  </th>
                  <th className="py-3 px-4 font-semibold text-foreground text-left border-b border-border border-r border-border whitespace-nowrap">
                    Vendor Name
                  </th>
                  <th className="py-3 px-4 font-semibold text-foreground text-left border-b border-border border-r border-border whitespace-nowrap">
                    Remarks
                  </th>
                  <th className="py-3 px-4 font-semibold text-foreground text-right border-b border-border whitespace-nowrap">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted-foreground border-b border-border">
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-red-500 border-b border-border">
                      {error}
                    </td>
                  </tr>
                ) : !selectedRow ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted-foreground border-b border-border">
                      No row selected.
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted-foreground border-b border-border">
                      No expense entries for this allocation.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={row.id} className="hover:bg-secondary/30 transition">
                      <td className="py-3 px-4 border-b border-border border-r border-border whitespace-nowrap">
                        {row.date
                          ? new Date(row.date + "T12:00:00").toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "numeric",
                              day: "numeric",
                            })
                          : "-"}
                      </td>
                      <td className="py-3 px-4 border-b border-border border-r border-border">
                        {row.project || "-"}
                      </td>
                      <td className="py-3 px-4 border-b border-border border-r border-border">
                        {row.type || "-"}
                      </td>
                      <td className="py-3 px-4 border-b border-border border-r border-border">
                        {row.vendor_name || row.vendor || "-"}
                      </td>
                      <td className="py-3 px-4 border-b border-border border-r border-border">
                        {row.remarks || "-"}
                      </td>
                      <td className="py-3 px-4 border-b border-border text-right font-medium text-green-600 tabular-nums">
                        ₹{Number(row.amount).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selectedRow && entriesCount > 0 ? (
          <TablePagination
            variant="page"
            page={page}
            pageSize={DEFAULT_TABLE_PAGE_SIZE}
            total={entriesCount}
            onPageChange={setPage}
          />
        ) : null}
      </div>
    </AdminLayout>
  );
}
