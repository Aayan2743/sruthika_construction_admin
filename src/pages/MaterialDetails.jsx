import React, { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { ArrowLeft, Save, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const materialDummyDetails = [
  {
    sno: 1,
    date: "2025-04-10",
    supplier: "Sharma Suppliers",
    others: "Cement bags",
    gravel: 120,
    reasonEdit: "Quantity updated after delivery check on 09-Apr-2025",
    editedDate: "2025-04-10",
  },
  {
    sno: 2,
    date: "2025-04-11",
    supplier: "Patel Traders",
    others: "Binding wire",
    gravel: 140,
    reasonEdit: "Supplier changed after quality inspection on 10-Apr-2025",
    editedDate: "2025-04-11",
  },
  {
    sno: 3,
    date: "2025-04-12",
    supplier: "RK Materials",
    others: "Waterproofing powder",
    gravel: 100,
    reasonEdit: "-",
    editedDate: "-",
  },
];

export default function MaterialDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedRow = location.state?.selectedRow;

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(selectedRow || {});

  const getDisplayData = () => {
    if (selectedRow) {
      const matched = materialDummyDetails.find(
        (item) => item.sno === selectedRow.sno
      );
      return matched ? [matched] : [selectedRow];
    }
    return materialDummyDetails;
  };

  const displayData = getDisplayData();

  const handleSave = () => {
    console.log("Saved:", editData);
    setIsEditing(false);
    alert("Changes saved successfully!");
  };

  return (
    <AdminLayout>
      <div className="space-y-4 pt-1">

        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard/materials")}
            className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-2xl text-foreground transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Materials</span>
          </button>
          <h2 className="text-2xl font-bold text-foreground">
            Material Details - {displayData[0]?.supplier || ""}
          </h2>
        </div>

        {/* Last edited date */}
        {displayData[0]?.editedDate && displayData[0].editedDate !== "-" && (
          <p className="text-sm text-muted-foreground">
            Last edited on:{" "}
            <span className="text-green-400 font-normal">
              {displayData[0].date}
            </span>
          </p>
        )}

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <table className="w-full text-sm border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-secondary/50">
                <th className="py-3 px-4 font-semibold text-foreground text-center border-b border-border border-r border-border whitespace-nowrap">S.No</th>
                <th className="py-3 px-4 font-semibold text-foreground text-center border-b border-border border-r border-border whitespace-nowrap">Date</th>
                <th className="py-3 px-4 font-semibold text-foreground text-center border-b border-border border-r border-border whitespace-nowrap">Vendor</th>
                <th className="py-3 px-4 font-semibold text-foreground text-center border-b border-border border-r border-border whitespace-nowrap">Item Name</th>
                <th className="py-3 px-4 font-semibold text-foreground text-center border-b border-border border-r border-border whitespace-nowrap">Quantity</th>
                <th className="py-3 px-4 font-semibold text-foreground text-center border-b border-border last:border-r-0 whitespace-nowrap">Reason (Edit)</th>
              </tr>
            </thead>
            <tbody>
              {displayData.map((row, index) => (
                <tr key={row.sno || index} className="hover:bg-secondary/30 transition">

                  {/* S.No */}
                  <td className="py-3 px-4 border-b border-border border-r border-border text-foreground whitespace-nowrap text-center">
                    {row.sno}
                  </td>

                  {/* Date */}
                  <td className="py-3 px-4 border-b border-border border-r border-border text-foreground whitespace-nowrap text-center">
                    {isEditing ? (
                      <input type="date" value={editData.date || row.date}
                        onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                        className="w-full h-9 rounded-xl border border-border bg-background px-3 text-center text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    ) : <span>{row.date}</span>}
                  </td>

                  {/* Vendor */}
                  <td className="py-3 px-4 border-b border-border border-r border-border text-foreground whitespace-nowrap text-center font-medium">
                    {isEditing ? (
                      <input type="text" value={editData.supplier || row.supplier}
                        onChange={(e) => setEditData({ ...editData, supplier: e.target.value })}
                        className="w-full h-9 rounded-xl border border-border bg-background px-3 text-center text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    ) : row.supplier}
                  </td>

                  {/* Item Name */}
                  <td className="py-3 px-4 border-b border-border border-r border-border text-foreground whitespace-nowrap text-center">
                    {isEditing ? (
                      <input type="text" value={editData.others || row.others}
                        onChange={(e) => setEditData({ ...editData, others: e.target.value })}
                        className="w-full h-9 rounded-xl border border-border bg-background px-3 text-center text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    ) : row.others}
                  </td>

                  {/* Quantity */}
                  <td className="py-3 px-4 border-b border-border border-r border-border text-foreground whitespace-nowrap text-center">
                    {isEditing ? (
                      <input type="text" value={editData.gravel || row.gravel}
                        onChange={(e) => setEditData({ ...editData, gravel: e.target.value })}
                        className="w-full h-9 rounded-xl border border-border bg-background px-3 text-center text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    ) : <span>{row.gravel}</span>}
                  </td>

                  {/* Reason Edit */}
                  <td className="py-3 px-4 border-b border-border last:border-r-0 text-foreground text-center min-w-[250px]">
                    {isEditing ? (
                      <input type="text" value={editData.reasonEdit || row.reasonEdit}
                        onChange={(e) => setEditData({ ...editData, reasonEdit: e.target.value })}
                        placeholder="Enter reason for edit..."
                        className="w-full h-9 rounded-xl border border-border bg-background px-3 text-center text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    ) : (
                      row.reasonEdit && row.reasonEdit !== "-" ? (
                        <span className="text-green-400 font-normal text-sm">
                          {row.reasonEdit}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t border-border px-4 py-3 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing <strong>1</strong> of{" "}
            <strong>{displayData.length}</strong>{" "}
            record{displayData.length !== 1 ? "s" : ""}
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg border border-border bg-card text-foreground hover:bg-secondary transition-all text-sm font-medium disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
              1
            </button>
            <button className="px-3 py-1.5 rounded-lg border border-border bg-card text-foreground hover:bg-secondary transition-all text-sm font-medium">
              Next
            </button>
          </div>
        </div>

        {/* Cancel/Save */}
        {isEditing && (
          <div className="flex justify-end gap-3">
            <button
              onClick={() => { setEditData(selectedRow); setIsEditing(false); }}
              className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-2xl transition-all font-medium"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-2xl transition-all font-medium shadow-md"
            >
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}