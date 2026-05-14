import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  ChevronDown,
} from "lucide-react";
import {
  getProjects,
  addProject,
  deleteProjectApi,
  updateProjectApi,
  getUsers,
} from "../api/projectApi";
import AdminLayout from "../components/AdminLayout";

const statusColors = {
  Active:   "bg-green-100 text-green-600",
  Inactive: "bg-red-100 text-red-600",
  Pending:  "bg-amber-100 text-amber-600",
};

// ─── Slide Panel ────────────────────────────────────────────────────────────
function SlidePanel({ open, onClose, children }) {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      <div className="fixed top-0 right-0 z-50 h-full w-full max-w-[370px] bg-card border-l border-border shadow-2xl overflow-y-auto">
        {children}
      </div>
    </>
  );
}

// ─── Labeled Input ───────────────────────────────────────────────────────────
function LabeledInput({ label, type = "text", value, onChange, placeholder }) {
  return (
    <div className="relative">
      {label && (
        <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground z-10">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-11 rounded-2xl border border-border bg-background px-4 text-foreground outline-none focus:ring-2 focus:ring-primary/30 dark:[color-scheme:dark]"
      />
    </div>
  );
}

// ─── Labeled Select ──────────────────────────────────────────────────────────
function LabeledSelect({ label, value, onChange, children }) {
  return (
    <div className="relative">
      {label && (
        <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground z-10">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        className="w-full h-11 rounded-2xl border border-border bg-background px-4 pr-10 text-foreground outline-none appearance-none focus:ring-2 focus:ring-primary/30"
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
const Projects = () => {
  const [projects, setProjects]   = useState([]);
  const [managers, setManagers]   = useState([]);
  const [filter,   setFilter]     = useState("All");
  const [search,   setSearch]     = useState("");
  const [openAddPanel,  setOpenAddPanel]  = useState(false);
  const [openEditPanel, setOpenEditPanel] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading]     = useState(false);

  const emptyForm = {
    name: "", manager_id: "", location: "",
    startDate: "", budget: "", status: "Active",
  };
  const [form, setForm] = useState(emptyForm);
  const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 5;

  // ── Fetch on mount ──────────────────────────────────────────────────────
  useEffect(() => {
    fetchProjects();
    fetchManagers();
  }, []);
useEffect(() => {
  setCurrentPage(1);
}, [search, filter]);
  const fetchProjects = async () => {
    try {
      const res = await getProjects();
      // Handle both { data: [...] } and { data: { data: [...] } }
      const list = res.data?.data ?? res.data ?? [];
      setProjects(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("fetchProjects ❌", err);
    }
  };

  const fetchManagers = async () => {
    try {
      const res = await getUsers();
      console.log("RAW getUsers response 👉", res.data);

      // Support multiple response shapes
      const allUsers = res.data?.data ?? res.data?.users ?? res.data ?? [];
      const list = Array.isArray(allUsers) ? allUsers : [];

      console.log("All users list 👉", list);

      // ── FIX: case-insensitive role match + fallback (show ALL if none match) ──
      const MANAGER_ROLES = ["manager", "project manager", "site manager", "supervisor"];

      let filtered = list.filter((u) =>
        MANAGER_ROLES.includes((u.role ?? u.user_role ?? "").toLowerCase())
      );

      // If API returns no role field or none matched, show everyone so
      // the dropdown is never empty (you can tighten this once you confirm field name)
      if (filtered.length === 0) {
        console.warn(
          "No users matched manager roles — showing all users as fallback.\n" +
          "Check the 'role' field name in your user object:",
          list[0]
        );
        filtered = list;
      }

      setManagers(filtered);
    } catch (err) {
      console.error("fetchManagers ❌", err);
    }
  };

  // ── Filtered table rows ─────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return projects.filter((p) => {
      const matchStatus =
  filter === "All" ||
  (filter === "Active" && Number(p.status) === 1) ||
  (filter === "Inactive" && Number(p.status) === 0);
      const managerName = (p.manager?.name ?? p.manager ?? "").toLowerCase();
      const matchSearch =
        (p.name        ?? "").toLowerCase().includes(q) ||
        (p.location    ?? "").toLowerCase().includes(q) ||
        managerName.includes(q) ||
        (p.start_date  ?? p.startDate ?? "").includes(q);

      return matchStatus && matchSearch;
    });
  }, [projects, filter, search]);
const totalPages = Math.ceil(filtered.length / itemsPerPage);

const paginatedData = useMemo(() => {
  const start = (currentPage - 1) * itemsPerPage;
  return filtered.slice(start, start + itemsPerPage);
}, [filtered, currentPage]);
  const resetForm = () => setForm(emptyForm);

  // ── Add Project ─────────────────────────────────────────────────────────
  const handleAddProject = async () => {
    if (!form.name.trim())       return alert("Please enter project name");
    if (!form.manager_id)        return alert("Please select a manager");
    if (!form.location.trim())   return alert("Please enter location");
    if (!form.startDate)         return alert("Please select start date");

    try {
      setLoading(true);
      const payload = {
        name:       form.name.trim(),
        manager_id: Number(form.manager_id),
        location:   form.location.trim(),
        start_date: form.startDate,
        budget:     form.budget.trim() || undefined,
        status:     form.status === "Active",
      };
      await addProject(payload);
      setOpenAddPanel(false);
      resetForm();
      fetchProjects();
    } catch (err) {
      console.error("addProject ❌", err.response?.data ?? err);
      alert("Failed to add project. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // ── Edit Click ──────────────────────────────────────────────────────────
  const handleEditClick = (project) => {
    setEditingId(project.id);
    setForm({
      name:       project.name        ?? "",
      manager_id: project.manager?.id ?? project.manager_id ?? "",
      location:   project.location    ?? "",
      startDate:  project.start_date  ?? project.startDate ?? "",
      budget:     project.budget      ?? "",
      status:     project.status === true  ? "Active"
                : project.status === false ? "Inactive"
                : project.status           ?? "Active",
    });
    setOpenEditPanel(true);
  };

  // ── Update Project ──────────────────────────────────────────────────────
  const handleUpdateProject = async () => {
    if (!form.name.trim())     return alert("Please enter project name");
    if (!form.manager_id)      return alert("Please select a manager");
    if (!form.location.trim()) return alert("Please enter location");
    if (!form.startDate)       return alert("Please select start date");

    try {
      setLoading(true);
      const payload = {
        name:       form.name.trim(),
        manager_id: Number(form.manager_id),
        location:   form.location.trim(),
        start_date: form.startDate,
        budget:     form.budget.trim() || undefined,
        status:     form.status === "Active",
      };
      await updateProjectApi(editingId, payload);
      setOpenEditPanel(false);
      setEditingId(null);
      resetForm();
      fetchProjects();
    } catch (err) {
      console.error("updateProject ❌", err.response?.data ?? err);
      alert("Failed to update project. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // ── Delete Project ──────────────────────────────────────────────────────
  const handleDeleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await deleteProjectApi(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("deleteProject ❌", err);
      alert("Failed to delete project.");
    }
  };

  // ── Helper: display status ──────────────────────────────────────────────
  const displayStatus = (status) => {
  if (status === 1 || status === "1" || status === true) return "Active";
  if (status === 0 || status === "0" || status === false) return "Inactive";
  return "-";
};

  // ── Manager Dropdown Options ────────────────────────────────────────────
  const ManagerOptions = () => (
    <>
      <option value="">Select Manager</option>
      {managers.map((m) => (
        <option key={m.id} value={m.id}>
          {m.name ?? m.full_name ?? m.username ?? `User #${m.id}`}
        </option>
      ))}
    </>
  );

  // ── Shared Form Fields ──────────────────────────────────────────────────
  const FormFields = ({ isEdit = false }) => (
    <div className="px-6 space-y-5">
      <LabeledInput
        label="Project Name"
        value={form.name}
        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
        placeholder="Enter project name"
      />

      {/* Manager Dropdown */}
      <LabeledSelect
        label="Assign Manager"
        value={form.manager_id}
        onChange={(e) => setForm((p) => ({ ...p, manager_id: e.target.value }))}
      >
        <ManagerOptions />
      </LabeledSelect>

      <LabeledInput
        label="Location"
        value={form.location}
        onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
        placeholder="Enter location"
      />

      <LabeledInput
        label="Start Date"
        type="date"
        value={form.startDate}
        onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
      />

      <LabeledInput
        label="Budget"
        value={form.budget}
        onChange={(e) => setForm((p) => ({ ...p, budget: e.target.value }))}
        placeholder="e.g. ₹5L"
      />

      <LabeledSelect
        label="Status"
        value={form.status}
        onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
      >
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
        <option value="Pending">Pending</option>
      </LabeledSelect>

      <button
        onClick={isEdit ? handleUpdateProject : handleAddProject}
        disabled={loading}
        className="w-full h-12 mt-2 rounded-2xl bg-primary text-white font-semibold shadow-md shadow-primary/25 hover:opacity-90 transition disabled:opacity-60"
      >
        {loading ? "Saving..." : isEdit ? "Update Project" : "Add Project"}
      </button>
    </div>
  );

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <>
      <AdminLayout>
        <div className="space-y-4">

          {/* Top bar */}
                  <div className="flex items-center justify-between gap-4 flex-wrap">
            <p className="text-sm md:text-[15px] leading-6 text-muted-foreground">
              {projects.length} total construction projects.
            </p>
            <button
              onClick={() => { resetForm(); setOpenAddPanel(true); }}
              className="h-10 px-4 rounded-xl bg-primary text-white text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition shadow-md shadow-primary/25 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Add Project
            </button>
          </div>

          {/* Search + Filter */}
                    {/* Search + Filter */}
          <div className="flex items-center gap-2 sm:gap-3 flex-nowrap overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="relative flex-shrink-0 w-[160px] sm:w-[200px] lg:w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Search..."
                className="w-full h-10 pl-10 pr-3 rounded-lg bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
              />
            </div>
            {["All", "Active", "Inactive",].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`h-9 sm:h-10 px-3 sm:px-5 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition flex-shrink-0 ${
                  filter === s
                    ? "bg-primary text-white shadow-md shadow-primary/25"
                    : "bg-transparent text-foreground hover:bg-secondary"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          {/* Table */}
          <div className="bg-card rounded-xl border border-border overflow-hidden overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <table className="w-full text-sm border-collapse min-w-[800px]">
  <thead>
    <tr className="bg-secondary/50">
     {["Project Name","Manager","Start Date","Location","Budget","Status","Actions"].map((h, i) => (
  <th
    key={h}
    className={`py-4 px-5 font-semibold text-foreground 
    border-b border-r border-border last:border-r-0
    ${i === 6 ? "text-right" : "text-left"}`}
  >
    {h}
  </th>
))}
    </tr>
  </thead>

  <tbody>
    {paginatedData.map((project) => {
      const statusLabel = displayStatus(project.status);

      return (
        <tr key={project.id} className="hover:bg-secondary/30 transition">
         <td className="py-4 px-5 border-b border-r border-border">
  {project.name}
</td>

<td className="py-4 px-5 border-b border-r border-border">
  {project.manager?.name ?? project.manager ?? "-"}
</td>

<td className="py-4 px-5 border-b border-r border-border">
  {project.start_date ?? project.startDate ?? "-"}
</td>

<td className="py-4 px-5 border-b border-r border-border">
  {project.location ?? "-"}
</td>

<td className="py-4 px-5 border-b border-r border-border">
  {project.budget ?? "-"}
</td>

<td className="py-4 px-5 border-b border-r border-border">
  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[statusLabel] ?? "bg-gray-100 text-gray-600"}`}>
    {statusLabel}
  </span>
</td>

          <td className="py-4 px-5 border-b border-border text-right">
            <div className="flex items-center justify-end gap-4">
              <button onClick={() => handleEditClick(project)}>
                <Pencil className="w-4 h-4 text-black"  />
              </button>
              <button onClick={() => handleDeleteProject(project.id)}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </td>
        </tr>
      );
    })}
  </tbody>
</table>


          </div>
        </div>
      </AdminLayout>
      <div className="flex items-center justify-between px-4 py-4 border-t border-border">
  
  {/* Previous */}
  <button
    disabled={currentPage === 1}
    onClick={() => setCurrentPage((p) => p - 1)}
    className="px-4 py-2 rounded-lg border border-border text-sm disabled:opacity-50"
  >
    Previous
  </button>

  {/* Page Info */}
  <p className="text-sm text-muted-foreground font-medium">
    Page {currentPage} of {totalPages}
  </p>

  {/* Next */}
  <button
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage((p) => p + 1)}
    className="px-4 py-2 rounded-lg border border-border text-sm disabled:opacity-50"
  >
    Next
  </button>

</div>

      {/* ADD PANEL */}
      <SlidePanel open={openAddPanel} onClose={() => setOpenAddPanel(false)}>
        <div className="h-full flex flex-col bg-card">
          <div className="flex items-center justify-between px-6 pt-8 pb-5">
            <h2 className="text-2xl font-heading font-bold text-foreground">Add Project</h2>
            <button onClick={() => setOpenAddPanel(false)} className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-secondary transition">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
          <FormFields isEdit={false} />
        </div>
      </SlidePanel>

      {/* EDIT PANEL */}
      <SlidePanel open={openEditPanel} onClose={() => setOpenEditPanel(false)}>
        <div className="h-full flex flex-col bg-card">
          <div className="flex items-center justify-between px-6 pt-8 pb-5">
            <h2 className="text-2xl font-heading font-bold text-foreground">Edit Project</h2>
            <button onClick={() => setOpenEditPanel(false)} className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-secondary transition">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
          <FormFields isEdit={true} />
        </div>
      </SlidePanel>
    </>
  );
};``

export default Projects;