import React, { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { ArrowLeft, Save, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const machineryDummyDetails = [
  {
    id: 1, sno: 1,
    date: "2025-04-13",          // ✅ edited date (original tha 10)
    equipment: "Excavator",
    vendor: "ABC Rentals",
    start: "08:00",
    close: "14:00",              // edited (was 12:30)
    total: "6 hrs",              // edited (was 4.5 hrs)
    workDetails: "Foundation excavation and soil testing",
    reasonEdit: "Work hours extended due to additional excavation required",
    editedDate: "2025-04-12",    // ✅ jis din edit hua
  },
  {
    id: 2, sno: 2,
    date: "2025-04-14",          // edited (original tha 11)
    equipment: "Concrete Mixer",
    vendor: "PQR Machinery",     // edited (was XYZ Equipment)
    start: "09:00",
    close: "06:00",
    total: "9 hrs",              // edited (was 8 hrs)
    workDetails: "Slab concrete mixing - 2nd floor",
    reasonEdit: "Vendor replaced after equipment breakdown on site",
    editedDate: "2025-04-13",
  },
  {
    id: 3, sno: 3,
    date: "2025-04-10",
    equipment: "Tower Crane",
    vendor: "Lift Corp",
    start: "07:30",
    close: "01:30",
    total: "6 hrs",
    workDetails: "Steel lifting",
    reasonEdit: "-",
    editedDate: "-",
  },
  {
    id: 4, sno: 4,
    date: "2025-04-11",          // edited (original tha 09)
    equipment: "Vibrator",
    vendor: "Tool Masters",
    start: "10:00",
    close: "04:30",              // edited (was 03:00)
    total: "6.5 hrs",            // edited (was 5 hrs)
    workDetails: "Column compaction - Block B",
    reasonEdit: "Extra hours added after supervisor inspection on 10-Apr",
    editedDate: "2025-04-10",
  },
  {
    id: 5, sno: 5,
    date: "2025-04-15",          // edited (original tha 12)
    equipment: "JCB",
    vendor: "Earth Movers",
    start: "08:30",
    close: "01:30",              // edited (was 11:30)
    total: "5 hrs",              // edited (was 3 hrs)
    workDetails: "Site leveling and debris removal",
    reasonEdit: "Date rescheduled due to rain delay on original date",
    editedDate: "2025-04-14",
  },
];

export default function MachineryDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedRow = location.state?.selectedRow;

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(selectedRow || {});

  const getDisplayData = () => {
    if (selectedRow) {
      const matched = machineryDummyDetails.find(
        (item) => item.id === selectedRow.id
      );
      return matched ? [matched] : [selectedRow];
    }
    return machineryDummyDetails;
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
            onClick={() => navigate("/dashboard/machinery")}
            className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-2xl text-foreground transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Machinery</span>
          </button>
          <h2 className="text-2xl font-bold text-foreground">
            Machinery Details - {displayData[0]?.equipment || ""}
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
          <table className="w-full text-sm border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-secondary/50">
                <th className="py-3 px-4 font-semibold text-foreground text-center border-b border-border border-r border-border whitespace-nowrap">S.No</th>
                <th className="py-3 px-4 font-semibold text-foreground text-center border-b border-border border-r border-border whitespace-nowrap">Date</th>
                <th className="py-3 px-4 font-semibold text-foreground text-center border-b border-border border-r border-border whitespace-nowrap">Equipment</th>
                <th className="py-3 px-4 font-semibold text-foreground text-center border-b border-border border-r border-border whitespace-nowrap">Vendor</th>
                <th className="py-3 px-4 font-semibold text-foreground text-center border-b border-border border-r border-border whitespace-nowrap">Start</th>
                <th className="py-3 px-4 font-semibold text-foreground text-center border-b border-border border-r border-border whitespace-nowrap">Close</th>
                <th className="py-3 px-4 font-semibold text-foreground text-center border-b border-border border-r border-border whitespace-nowrap">Total</th>
                <th className="py-3 px-4 font-semibold text-foreground text-center border-b border-border border-r border-border whitespace-nowrap">Work Details</th>
                <th className="py-3 px-4 font-semibold text-foreground text-center border-b border-border last:border-r-0 whitespace-nowrap">Reason (Edit)</th>
              </tr>
            </thead>
            <tbody>
              {displayData.map((row, index) => (
                <tr key={row.id || index} className="hover:bg-secondary/30 transition">

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

                  {/* Equipment */}
                  <td className="py-3 px-4 border-b border-border border-r border-border text-foreground whitespace-nowrap text-center font-medium">
                    {isEditing ? (
                      <input type="text" value={editData.equipment || row.equipment}
                        onChange={(e) => setEditData({ ...editData, equipment: e.target.value })}
                        className="w-full h-9 rounded-xl border border-border bg-background px-3 text-center text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    ) : row.equipment}
                  </td>

                  {/* Vendor */}
                  <td className="py-3 px-4 border-b border-border border-r border-border text-foreground whitespace-nowrap text-center">
                    {isEditing ? (
                      <input type="text" value={editData.vendor || row.vendor}
                        onChange={(e) => setEditData({ ...editData, vendor: e.target.value })}
                        className="w-full h-9 rounded-xl border border-border bg-background px-3 text-center text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    ) : row.vendor}
                  </td>

                  {/* Start */}
                  <td className="py-3 px-4 border-b border-border border-r border-border text-foreground whitespace-nowrap text-center">
                    {isEditing ? (
                      <input type="text" value={editData.start || row.start}
                        onChange={(e) => setEditData({ ...editData, start: e.target.value })}
                        className="w-24 h-9 rounded-xl border border-border bg-background px-3 text-center text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    ) : <span>{row.start}</span>}
                  </td>

                  {/* Close */}
                  <td className="py-3 px-4 border-b border-border border-r border-border text-foreground whitespace-nowrap text-center">
                    {isEditing ? (
                      <input type="text" value={editData.close || row.close}
                        onChange={(e) => setEditData({ ...editData, close: e.target.value })}
                        className="w-24 h-9 rounded-xl border border-border bg-background px-3 text-center text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    ) : <span>{row.close}</span>}
                  </td>

                  {/* Total */}
                  <td className="py-3 px-4 border-b border-border border-r border-border text-foreground whitespace-nowrap text-center">
                    {isEditing ? (
                      <input type="text" value={editData.total || row.total}
                        onChange={(e) => setEditData({ ...editData, total: e.target.value })}
                        className="w-24 h-9 rounded-xl border border-border bg-background px-3 text-center text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    ) : <span>{row.total}</span>}
                  </td>

                  {/* Work Details */}
                  <td className="py-3 px-4 border-b border-border border-r border-border text-foreground text-center min-w-[180px]">
                    {isEditing ? (
                      <input type="text" value={editData.workDetails || row.workDetails}
                        onChange={(e) => setEditData({ ...editData, workDetails: e.target.value })}
                        className="w-full h-9 rounded-xl border border-border bg-background px-3 text-center text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    ) : row.workDetails}
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