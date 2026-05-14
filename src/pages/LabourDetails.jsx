import React, { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { ArrowLeft, Edit3, Save, X, History } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function LabourDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedRow = location.state?.selectedRow;

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(selectedRow || {});
  const [editHistory, setEditHistory] = useState([]); // Edit history store karega

  // Edited dummy data - pehle se edited hua data dikhane ke liye
  const editedDummyData = [
    {
      id: 1,
      originalDate: "2026-05-01",
      date: "2026-05-03", // Edited date (changed from May 1 to May 3)
      party: "ABC Construction",
      m: 30, // Edited (25 se 30)
      f: 20, // Edited (15 se 20)
      workDone: "Foundation digging and leveling completed",
      measurements: "550 sq.ft", // Edited (500 se 550)
      reasonEdit: "Worker count increased after site inspection on 02-May-2026",
      editedBy: "Site Manager",
      editedDate: "2026-05-02",
    },
    {
      id: 2,
      originalDate: "2026-05-01",
      date: "2026-05-01", // Same date
      party: "XYZ Builders",
      m: 30,
      f: 20,
      workDone: "Brick wall construction 1st floor",
      measurements: "850 bricks", // Edited (800 se 850)
      reasonEdit: "Added 5 extra masons as per site visit on 01-May-2026",
      editedBy: "Supervisor",
      editedDate: "2026-05-01",
    },
    {
      id: 3,
      originalDate: "2026-05-02",
      date: "2026-05-04", // Edited date
      party: "ABC Construction",
      m: 28,
      f: 18,
      workDone: "Cement mixing and pouring for foundation",
      measurements: "250 bags cement", // Edited (200 se 250)
      reasonEdit: "Measurement updated after quality check on 03-May-2026",
      editedBy: "Quality Inspector",
      editedDate: "2026-05-03",
    },
    {
      id: 4,
      originalDate: "2026-05-02",
      date: "2026-05-02", // Same date
      party: "PQR Infrastructure",
      m: 20,
      f: 12,
      workDone: "Plumbing work started",
      measurements: "1000 ft pipes",
      reasonEdit: "-", // No edit
      editedBy: "-",
      editedDate: "-",
    },
    {
      id: 5,
      originalDate: "2026-05-03",
      date: "2026-05-05", // Edited date
      party: "LMN Contractors",
      m: 40, // Edited (35 se 40)
      f: 15, // Edited (10 se 15)
      workDone: "Roof slab preparation and reinforcement",
      measurements: "1300 sq.ft", // Edited (1200 se 1300)
      reasonEdit: "Additional workers deployed due to deadline on 04-May-2026",
      editedBy: "Project Manager",
      editedDate: "2026-05-04",
    },
  ];

  // Agar selectedRow hai to match karo edited data se, nahi to editedDummyData dikhao
  const getDisplayData = () => {
    if (selectedRow) {
      // Find matching edited data for the selected row
      const matchedData = editedDummyData.find(
        (item) => item.id === selectedRow.id
      );
      return matchedData ? [matchedData] : [selectedRow];
    }
    return editedDummyData; // Show all edited dummy data
  };

  const displayData = getDisplayData();

  const handleSave = () => {
    // Save current edit to history
    const newEdit = {
      ...editData,
      editTimestamp: new Date().toISOString(),
    };
    setEditHistory([...editHistory, newEdit]);
    
    console.log("Saved data:", editData);
    console.log("Edit history:", [...editHistory, newEdit]);
    
    setIsEditing(false);
    alert("Changes saved successfully! Edit history updated.");
  };

  return (
    <AdminLayout>
      <div className="space-y-4 pt-1">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard/labour")}
              className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-2xl text-foreground transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Labour</span>
            </button>
            <h2 className="text-2xl font-bold text-foreground">
              {selectedRow
                ? `Vendor Details - ${displayData[0]?.party || selectedRow.party}`
                : "Vendor Details - Edited Data"}
            </h2>
          </div>

        
        </div>

         {/* Last edited date info */}
       {selectedRow && displayData[0]?.date && (
  <p className="text-sm text-muted-foreground">
    Last edited on: <span className="text-green-400 font-normal">{displayData[0].date}</span>
  </p>
)}
        {/* Table Format */}
       <div className="bg-card rounded-xl border border-border overflow-hidden overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
    <table className="w-full text-sm border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-secondary/50">
  <th className="py-3 px-4 font-semibold text-foreground text-center border-b border-border border-r border-border whitespace-nowrap">Date</th>
  <th className="py-3 px-4 font-semibold text-foreground text-center border-b border-border border-r border-border whitespace-nowrap">Party</th>
  <th className="py-3 px-4 font-semibold text-foreground text-center border-b border-border border-r border-border whitespace-nowrap">M</th>
  <th className="py-3 px-4 font-semibold text-foreground text-center border-b border-border border-r border-border whitespace-nowrap">F</th>
  <th className="py-3 px-4 font-semibold text-foreground text-center border-b border-border border-r border-border whitespace-nowrap">Work done</th>
  <th className="py-3 px-4 font-semibold text-foreground text-center border-b border-border border-r border-border whitespace-nowrap">Measurements</th>
  <th className="py-3 px-4 font-semibold text-foreground text-center border-b border-border last:border-r-0 whitespace-nowrap">Reason (Edit)</th>
</tr>
              </thead>
                           <tbody>
                {displayData.map((row, index) => (
                 <tr key={row.id || index} className="hover:bg-secondary/30 transition">
                    
                    {/* Date */}
                    <td className="py-3 px-4 border-b border-border border-r border-border text-foreground whitespace-nowrap text-center">

                      {isEditing ? (
                        <input
                          type="date"
                          value={editData.date || row.date}
                          onChange={(e) => setEditData({...editData, date: e.target.value})}
                          className="w-full h-9 rounded-xl border border-border bg-background px-3 text-center text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      ) : (
                        <span>{row.date}</span>
                      )}
                    </td>

                    {/* Party */}
                    <td className="py-3 px-4 border-b border-border border-r border-border text-foreground whitespace-nowrap text-center font-medium">

                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.party || row.party}
                          onChange={(e) => setEditData({...editData, party: e.target.value})}
                          className="w-full h-9 rounded-xl border border-border bg-background px-3 text-center text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      ) : (
                        row.party
                      )}
                    </td>

                    {/* M */}
                   <td className="py-3 px-4 border-b border-border border-r border-border text-foreground whitespace-nowrap text-center">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editData.m || row.m}
                          onChange={(e) => setEditData({...editData, m: e.target.value})}
                          className="w-20 h-9 rounded-xl border border-border bg-background px-3 text-center text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      ) : (
                        <span>{row.m}</span>
                      )}
                    </td>

                    {/* F */}
                   <td className="py-3 px-4 border-b border-border border-r border-border text-foreground whitespace-nowrap text-center">

                      {isEditing ? (
                        <input
                          type="number"
                          value={editData.f || row.f}
                          onChange={(e) => setEditData({...editData, f: e.target.value})}
                          className="w-20 h-9 rounded-xl border border-border bg-background px-3 text-center text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      ) : (
                        <span>{row.f}</span>
                      )}
                    </td>

                    {/* Work Done */}
                   <td className="py-3 px-4 border-b border-border border-r border-border text-foreground text-center min-w-[200px]">                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.workDone || row.workDone}
                          onChange={(e) => setEditData({...editData, workDone: e.target.value})}
                          className="w-full h-9 rounded-xl border border-border bg-background px-3 text-center text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      ) : (
                        row.workDone
                      )}
                    </td>

                    {/* Measurements */}
                   <td className="py-3 px-4 border-b border-border border-r border-border text-foreground whitespace-nowrap text-center">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.measurements || row.measurements}
                          onChange={(e) => setEditData({...editData, measurements: e.target.value})}
                          className="w-full h-9 rounded-xl border border-border bg-background px-3 text-center text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      ) : (
                        <span>{row.measurements}</span>
                      )}
                    </td>

                    {/* Reason(Edit) */}
                    <td className="py-3 px-4 border-b border-border last:border-r-0 text-foreground text-center min-w-[250px]">                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.reasonEdit || row.reasonEdit}
                          onChange={(e) => setEditData({...editData, reasonEdit: e.target.value})}
                          placeholder="Enter reason for edit..."
                          className="w-full h-9 rounded-xl border border-border bg-background px-3 text-center text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      ) : (
                        <div>
                          {row.reasonEdit && row.reasonEdit !== "-" ? (
                            <span className="text-green-400 font-normal text-sm">
                              {row.reasonEdit}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </div>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          

          {/* Footer Info */}
         
        </div>
                {/* Pagination */}
        <div className="border-t border-border px-4 py-3 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing <strong>1</strong> of <strong>{displayData.length}</strong> record{displayData.length !== 1 ? 's' : ''}
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg border border-border bg-card text-foreground hover:bg-secondary transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed" disabled>
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

        {/* Cancel Edit Button */}
        {isEditing && (
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setEditData(selectedRow);
                setIsEditing(false);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-2xl transition-all font-medium"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-2xl transition-all font-medium shadow-md"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}