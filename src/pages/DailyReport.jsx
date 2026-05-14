import React, { useState, useEffect } from "react";
import { Search, Plus, X, ChevronDown } from "lucide-react";
import AdminLayout from "../components/AdminLayout";

// 1. Initial realistic dummy data
const initialReports = [
  { id: 1, site: "Project Alpha", supervisor: "Ravi Sharma", date: "2026-04-12", workforce: 42, status: "Submitted" },
  { id: 2, site: "Project Beta", supervisor: "Anjali Verma", date: "2026-04-12", workforce: 35, status: "Pending" },
  { id: 3, site: "Project Gamma", supervisor: "Vikram Singh", date: "2026-04-12", workforce: 28, status: "Submitted" },
  { id: 4, site: "Project Delta", supervisor: "Pooja Mehta", date: "2026-04-12", workforce: 31, status: "Draft" },
];

// 2. Slide Panel Component (Projects page jaisa)
function SlidePanel({ open, onClose, children }) {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      <div className="fixed top-0 right-0 z-50 h-full w-full max-w-[370px] bg-card border-l border-border shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200">
        {children}
      </div>
    </>
  );
}

export default function DailyReport() {
  const [search, setSearch] = useState("");
  const [openAddPanel, setOpenAddPanel] = useState(false);
  const [projectList, setProjectList] = useState([]);

  // Reports ka state (localStorage se load karega agar available ho, warna dummy data)
  const [reports, setReports] = useState(() => {
    const saved = localStorage.getItem("dailyReportsData");
    return saved ? JSON.parse(saved) : initialReports;
  });

  // Form ka state
  const [form, setForm] = useState({
    site: "",
    supervisor: "",
    date: "",
    workforce: "",
    status: "Draft",
  });

  // 3. LocalStorage mein save karega jab bhi reports update hongi
  useEffect(() => {
    localStorage.setItem("dailyReportsData", JSON.stringify(reports));
  }, [reports]);

  // Projects dropdown ke liye list fetch karna
  useEffect(() => {
    const savedProjects = localStorage.getItem("projectsData");
    if (savedProjects) {
      setProjectList(JSON.parse(savedProjects));
    } else {
      // Fallback agar projects page se data na mile
      setProjectList([
        { name: "Project Alpha" },
        { name: "Project Beta" },
        { name: "Project Gamma" },
      ]);
    }
  }, []);

  const filtered = reports.filter(
    (r) =>
      r.site.toLowerCase().includes(search.toLowerCase()) ||
      r.supervisor.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => {
    setForm({
      site: projectList.length > 0 ? projectList[0].name : "",
      supervisor: "",
      date: "",
      workforce: "",
      status: "Draft",
    });
  };

  const handleAddReport = () => {
    if (!form.site) return alert("Please select a site.");
    if (!form.supervisor.trim()) return alert("Please enter supervisor name.");
    if (!form.date) return alert("Please select a date.");
    if (!form.workforce) return alert("Please enter workforce count.");

    const newReport = {
      id: Date.now(),
      site: form.site,
      supervisor: form.supervisor,
      date: form.date, // Standard date format YYYY-MM-DD
      workforce: Number(form.workforce),
      status: form.status,
    };

    setReports([newReport, ...reports]); // Naya report sabse upar add hoga
    setOpenAddPanel(false);
    resetForm();
  };

  return (
    <>
      <AdminLayout>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <p className="text-sm md:text-[15px] leading-6 text-muted-foreground">
              {reports.length} daily report entries. Review workforce updates and submission status by site.
            </p>

            <button 
              onClick={() => {
                resetForm();
                setOpenAddPanel(true);
              }}
              className="h-11 px-5 rounded-2xl bg-primary text-white text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition shadow-md shadow-primary/25"
            >
              <Plus className="w-4 h-4" />
              Add Report
            </button>
          </div>

          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search reports..."
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition shadow-sm"
            />
          </div>

          <div className="bg-card rounded-[24px] border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="text-left py-4 px-5 font-medium text-muted-foreground">Site</th>
                  <th className="text-left py-4 px-5 font-medium text-muted-foreground">Supervisor</th>
                  <th className="text-left py-4 px-5 font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-4 px-5 font-medium text-muted-foreground">Workforce</th>
                  <th className="text-left py-4 px-5 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((report) => (
                    <tr
                      key={report.id}
                      className="border-b border-border last:border-0 hover:bg-secondary/30 transition"
                    >
                      <td className="py-4 px-5 font-medium text-foreground">{report.site}</td>
                      <td className="py-4 px-5 text-muted-foreground">{report.supervisor}</td>
                      <td className="py-4 px-5 text-muted-foreground">{report.date}</td>
                      <td className="py-4 px-5 font-medium text-foreground">{report.workforce}</td>
                      <td className="py-4 px-5">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            report.status === "Submitted"
                              ? "bg-green-100 text-green-600"
                              : report.status === "Pending"
                              ? "bg-amber-100 text-amber-600"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {report.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-10 text-center text-muted-foreground">
                      No reports found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </AdminLayout>

      {/* ====== ADD REPORT SLIDE PANEL ====== */}
      <SlidePanel open={openAddPanel} onClose={() => setOpenAddPanel(false)}>
        <div className="h-full flex flex-col bg-card">
          <div className="flex items-center justify-between px-6 pt-8 pb-5 border-b border-border">
            <h2 className="text-2xl font-heading font-bold text-foreground">Add Report</h2>
            <button
              onClick={() => setOpenAddPanel(false)}
              className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-secondary transition"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <div className="px-6 py-6 space-y-5">
            
            <div className="relative">
              <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">
                Site (Project)
              </label>
              <select
                value={form.site}
                onChange={(e) => setForm((prev) => ({ ...prev, site: e.target.value }))}
                className="w-full h-11 rounded-2xl border border-border bg-background px-4 pr-10 text-foreground outline-none appearance-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">Select Site</option>
                {projectList.map((p, idx) => (
                  <option key={idx} value={p.name}>{p.name}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>

            <div className="relative">
              <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">
                Supervisor
              </label>
              <input
                type="text"
                value={form.supervisor}
                onChange={(e) => setForm((prev) => ({ ...prev, supervisor: e.target.value }))}
                placeholder="Enter supervisor name"
                className="w-full h-11 rounded-2xl border border-border bg-background px-4 text-foreground outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="relative">
              <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">
                Date
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                className="w-full h-11 rounded-2xl border border-border bg-background px-4 pr-10 text-foreground outline-none focus:ring-2 focus:ring-primary/30 dark:[color-scheme:dark]"
              />
            </div>

            <div className="relative">
              <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">
                Workforce Count
              </label>
              <input
                type="number"
                value={form.workforce}
                onChange={(e) => setForm((prev) => ({ ...prev, workforce: e.target.value }))}
                placeholder="e.g. 25"
                className="w-full h-11 rounded-2xl border border-border bg-background px-4 text-foreground outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="relative">
              <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                className="w-full h-11 rounded-2xl border border-border bg-background px-4 pr-10 text-foreground outline-none appearance-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="Draft">Draft</option>
                <option value="Pending">Pending</option>
                <option value="Submitted">Submitted</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>

            <button
              onClick={handleAddReport}
              className="w-full h-12 mt-2 rounded-2xl bg-primary text-white font-semibold shadow-md shadow-primary/25 hover:opacity-90 transition"
            >
              Add Report
            </button>
          </div>
        </div>
      </SlidePanel>
    </>
  );
}