import React, { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { ArrowLeft, Save, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const stockDummyDetails = [
  {
    id: 1,
    date: "2026-04-13",
    vendor: "ABC Suppliers",
    item: "OPC Cement (43 grade)",
    open: "400 bags",
    received: "200 bags",
    cumulative: "600 bags",
    balance: "565 bags",
    reasonEdit: "Received quantity updated after warehouse recount",
    editedDate: "2026-04-12",
  },
  {
    id: 2,
    date: "2026-04-12",
    vendor: "XYZ Traders",
    item: "TMT Steel Fe-500",
    open: "80 rods",
    received: "40 rods",
    cumulative: "120 rods",
    balance: "95 rods",
    reasonEdit: "Balance corrected after site issue to welding bay",
    editedDate: "2026-04-12",
  },
  {
    id: 3,
    date: "2026-04-14",
    vendor: "BuildMart",
    item: "Fly ash bricks",
    open: "2,400 pcs",
    received: "1,200 pcs",
    cumulative: "3,600 pcs",
    balance: "3,250 pcs",
    reasonEdit: "Extra lot approved by project manager",
    editedDate: "2026-04-14",
  },
  {
    id: 4,
    date: "2026-04-14",
    vendor: "River Supplies",
    item: "River sand (fine)",
    open: "12 trucks",
    received: "5 trucks",
    cumulative: "17 trucks",
    balance: "14 trucks",
    reasonEdit: "Dispatch timing adjusted for plaster crew",
    editedDate: "2026-04-14",
  },
  {
    id: 5,
    date: "2026-04-13",
    vendor: "Stone Depot",
    item: "20mm crushed stone",
    open: "6 trucks",
    received: "4 trucks",
    cumulative: "10 trucks",
    balance: "8 trucks",
    reasonEdit: "Additional load for backfilling zone approved",
    editedDate: "2026-04-13",
  },
];

export default function StockDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedRow = location.state?.selectedRow;

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(selectedRow || {});

  const getDisplayData = () => {
    if (selectedRow) {
      const matched = stockDummyDetails.find((item) => item.id === selectedRow.id);
      return matched ? [matched] : [selectedRow];
    }
    return stockDummyDetails;
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
            onClick={() => navigate("/dashboard/stock")}
            className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-2xl text-foreground transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Stock</span>
          </button>
          <h2 className="text-2xl font-bold text-foreground">
            Stock Details - {displayData[0]?.vendor || ""}
            {displayData[0]?.item ? (
              <span className="block text-base font-medium text-muted-foreground mt-1">{displayData[0].item}</span>
            ) : null}
          </h2>
        </div>

        {/* Last edited date */}
        {displayData[0]?.date && (
          <p className="text-sm text-muted-foreground">
            Last edited on:{" "}
            <span className="text-green-400 font-normal">
              {displayData[0].date}
            </span>
          </p>
        )}

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[980px]">
            <thead>
              <tr className="bg-secondary/50">
                <th className="py-3 px-4 font-semibold text-foreground text-center border-b border-border border-r border-border whitespace-nowrap">Date</th>
                <th className="py-3 px-4 font-semibold text-foreground text-center border-b border-border border-r border-border whitespace-nowrap">Vendor</th>
                <th className="py-3 px-4 font-semibold text-foreground text-center border-b border-border border-r border-border min-w-[140px]">Item name</th>
                <th className="py-3 px-4 font-semibold text-foreground text-center border-b border-border border-r border-border whitespace-nowrap">Open</th>
                <th className="py-3 px-4 font-semibold text-foreground text-center border-b border-border border-r border-border whitespace-nowrap">Received</th>
                <th className="py-3 px-4 font-semibold text-foreground text-center border-b border-border border-r border-border whitespace-nowrap">Cumulative</th>
                <th className="py-3 px-4 font-semibold text-foreground text-center border-b border-border border-r border-border whitespace-nowrap">Balance</th>
                <th className="py-3 px-4 font-semibold text-foreground text-center border-b border-border last:border-r-0 min-w-[220px]">Reason (Edit)</th>
              </tr>
            </thead>
            <tbody>
              {displayData.map((row, index) => (
                <tr key={row.id || index} className="hover:bg-secondary/30 transition">

                  <td className="py-3 px-4 border-b border-border border-r border-border text-foreground whitespace-nowrap text-center">
                    {isEditing ? (
                      <input type="date" value={editData.date || row.date}
                        onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                        className="w-full h-9 rounded-xl border border-border bg-background px-3 text-center text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    ) : <span>{row.date}</span>}
                  </td>

                  <td className="py-3 px-4 border-b border-border border-r border-border text-foreground whitespace-nowrap text-center font-medium">
                    {isEditing ? (
                      <input type="text" value={editData.vendor || row.vendor}
                        onChange={(e) => setEditData({ ...editData, vendor: e.target.value })}
                        className="w-full h-9 rounded-xl border border-border bg-background px-3 text-center text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    ) : row.vendor}
                  </td>

                  <td className="py-3 px-4 border-b border-border border-r border-border text-foreground text-center min-w-[140px] whitespace-normal break-words">
                    {isEditing ? (
                      <input type="text" value={editData.item ?? row.item ?? ""}
                        onChange={(e) => setEditData({ ...editData, item: e.target.value })}
                        className="w-full h-9 rounded-xl border border-border bg-background px-3 text-center text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    ) : (row.item ?? "-")}
                  </td>

                  <td className="py-3 px-4 border-b border-border border-r border-border text-foreground whitespace-nowrap text-center">
                    {isEditing ? (
                      <input type="text" value={editData.open ?? row.open}
                        onChange={(e) => setEditData({ ...editData, open: e.target.value })}
                        className="w-full h-9 rounded-xl border border-border bg-background px-3 text-center text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    ) : row.open}
                  </td>

                  <td className="py-3 px-4 border-b border-border border-r border-border text-foreground whitespace-nowrap text-center">
                    {isEditing ? (
                      <input type="text" value={editData.received ?? row.received}
                        onChange={(e) => setEditData({ ...editData, received: e.target.value })}
                        className="w-full h-9 rounded-xl border border-border bg-background px-3 text-center text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    ) : row.received}
                  </td>

                  <td className="py-3 px-4 border-b border-border border-r border-border text-foreground whitespace-nowrap text-center">
                    {isEditing ? (
                      <input type="text" value={editData.cumulative ?? row.cumulative}
                        onChange={(e) => setEditData({ ...editData, cumulative: e.target.value })}
                        className="w-full h-9 rounded-xl border border-border bg-background px-3 text-center text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    ) : row.cumulative}
                  </td>

                  <td className="py-3 px-4 border-b border-border border-r border-border text-foreground whitespace-nowrap text-center">
                    {isEditing ? (
                      <input type="text" value={editData.balance ?? row.balance}
                        onChange={(e) => setEditData({ ...editData, balance: e.target.value })}
                        className="w-full h-9 rounded-xl border border-border bg-background px-3 text-center text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    ) : row.balance}
                  </td>

                  <td className="py-3 px-4 border-b border-border last:border-r-0 text-foreground text-center min-w-[220px] whitespace-normal break-words">
                    {isEditing ? (
                      <input type="text" value={editData.reasonEdit || row.reasonEdit}
                        onChange={(e) => setEditData({ ...editData, reasonEdit: e.target.value })}
                        placeholder="Enter reason for edit..."
                        className="w-full h-9 rounded-xl border border-border bg-background px-3 text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    ) : (
                      row.reasonEdit && row.reasonEdit !== "-" ? (
                        <span className="text-green-400 font-normal text-sm">{row.reasonEdit}</span>
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
            Showing <strong>1</strong> of <strong>{displayData.length}</strong> record{displayData.length !== 1 ? "s" : ""}
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg border border-border bg-card text-foreground hover:bg-secondary transition-all text-sm font-medium disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium">1</button>
            <button className="px-3 py-1.5 rounded-lg border border-border bg-card text-foreground hover:bg-secondary transition-all text-sm font-medium">
              Next
            </button>
          </div>
        </div>

        {/* Cancel/Save buttons */}
        {isEditing && (
          <div className="flex justify-end gap-3">
            <button onClick={() => { setEditData(selectedRow); setIsEditing(false); }}
              className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-2xl transition-all font-medium">
              <X className="w-4 h-4" /> Cancel
            </button>
            <button onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-2xl transition-all font-medium shadow-md">
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
