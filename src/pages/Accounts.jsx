import React, { useEffect, useMemo, useState } from "react";
import { Eye, Pencil, Plus, Trash2, X, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import TablePagination from "../components/TablePagination";
import {
  getAllocations,
  addAllocation,
  updateAllocation,
  deleteAllocation,
} from "../api/accountApi";
import { getUsers, getProjects } from "../api/projectApi";

const usersData = [
  { name: "Ravi Kumar", email: "ravi@gmail.com", role: "manager" },
  { name: "Amit", email: "amit@gmail.com", role: "manager" },
  { name: "Priya Verma", email: "priya@gmail.com", role: "accountant" },
];

const emptyForm = {
  user_id: "",
  project_id: "",
  amountAllocated: "",
  name: "",
  designation: "",
  mailId: "",
};

function SlidePanel({ open, onClose, children }) {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      <div className="fixed top-0 right-0 z-50 h-full w-full max-w-[420px] bg-card border-l border-border shadow-2xl overflow-y-auto">
        {children}
      </div>
    </>
  );
}

const getProjectsFromStorage = () => {
  const savedProjects = localStorage.getItem("projectsData");
  return savedProjects ? JSON.parse(savedProjects) : [];
};

export default function Accounts() {
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState("");
 const [rows, setRows] = useState([]);
const [totalPages, setTotalPages] = useState(1);
  const [projectOptions, _setProjectOptions] = useState(getProjectsFromStorage);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState("add");
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
  user_id: "",
  project_id: "",
  amountAllocated: "",
  designation: "",
  name: "",
  mailId: "",
});
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
const [projects, setProjects] = useState([]);
const [recordTotal, setRecordTotal] = useState(0);
const itemsPerPage = 5;

useEffect(() => {
  fetchUsers();
  fetchProjects();
}, []);

useEffect(() => {
  fetchAllocations();
}, [currentPage]);

const fetchUsers = async () => {
  try {
    const res = await getUsers({ per_page: 100 }); // get all
    setUsers(res.data.data || []);
  } catch (err) {
    console.error(err);
  }
};

const fetchProjects = async () => {
  try {
    const res = await getProjects({ per_page: 100 });
    setProjects(res.data.data || []);
  } catch (err) {
    console.error(err);
  }
};

  const fetchAllocations = async () => {
  try {
    const res = await getAllocations({
      page: currentPage,
      per_page: 5,
    });

    setRows(res.data.data || []);
    const pag = res.data.pagination;
    setTotalPages(pag?.last_page || 1);
    setRecordTotal(
      typeof pag?.total === "number"
        ? pag.total
        : Array.isArray(res.data.data)
          ? res.data.data.length
          : 0
    );

  } catch (error) {
    console.error(error);
  }
};

  const filteredRows = useMemo(() => {
  return rows.filter((row) => {
    return selectedDate ?row.created_at?.split("T")[0] === selectedDate  : true;
  });
}, [rows, selectedDate]);




 const totalAllocated = rows.reduce(
  (sum, row) => sum + Number(row.amount || 0),
  0
);

  const handleDelete = async (id) => {
  try {
    if (!window.confirm("Delete this allocation?")) return;

    const res = await deleteAllocation(id);

    if (res.data.success) {
      alert(res.data.message);
      fetchAllocations();
    }

  } catch (error) {
    console.error(error);
  }
};
  const openAllocateDrawer = () => {
    setDrawerMode("add");
    setEditingId(null);
    setFormData(emptyForm);
    setDrawerOpen(true);
  };

  const openEditDrawer = (row) => {
  setDrawerMode("edit");
  setEditingId(row.id);

  const matchedUser = users.find(
    (u) =>
      u.email?.toLowerCase().trim() ===
      row.email?.toLowerCase().trim()
  );

  const matchedProject = projects.find(
    (p) =>
      p.name?.toLowerCase().trim() ===
      row.project?.toLowerCase().trim()
  );

  // 🔥 HARD SAFETY
  if (!matchedUser || !matchedProject) {
    alert("User or Project mapping failed ❌");
    console.log("ROW:", row);
    console.log("USERS:", users);
    console.log("PROJECTS:", projects);
    return;
  }

  setFormData({
    user_id: matchedUser.id,
    project_id: matchedProject.id,
    amountAllocated: row.amount || "",
    designation: row.designation || "",
    name: row.name || "",
    mailId: row.email || "",
  });

  setDrawerOpen(true);
};

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleView = (row) => {
    navigate("/dashboard/accounts-allocation-view", { state: { selectedRow: row } });
  };

  const handleSave = async () => {
  try {
    if (!formData.user_id) return alert("Select user");
    if (!formData.project_id) return alert("Select project");
    if (!formData.amountAllocated) return alert("Enter amount");

    if (drawerMode === "add") {
      const payload = {
        user_id: Number(formData.user_id),
        project_id: Number(formData.project_id),
        amount: Number(formData.amountAllocated),
        remarks: "Allocated via UI",
      };

      const res = await addAllocation(payload);

      if (res.data.success) {
        alert(res.data.message);
        fetchAllocations();
        closeDrawer();
      }

    } else {
  const payload = {
    user_id: Number(formData.user_id),        // ✅ REQUIRED
    project_id: Number(formData.project_id),  // ✅ REQUIRED
    amount: Number(formData.amountAllocated),
    remarks: "Updated via UI",
  };

  const res = await updateAllocation(editingId, payload);

  if (res.data.success) {
    alert(res.data.message);
    fetchAllocations();
    closeDrawer();
  }
}
  } catch (error) {
    console.error("SAVE ERROR ❌", error.response?.data || error);
    alert("Something went wrong");
  }
};
  return (
    <>
      <AdminLayout>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <p className="text-sm md:text-[15px] leading-6 text-muted-foreground">
              {rows.length} account entries.
            </p>

            <button
              type="button"
              onClick={openAllocateDrawer}
              className="h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 transition shadow-sm shadow-primary/25"
            >
              <Plus className="w-4 h-4" />
              Allocate to manager
            </button>
          </div>

         <div className="flex items-center gap-6 flex-wrap">

  {/* DATE + CLEAR GROUP */}
  <div className="flex items-center gap-3">

    <div className="relative w-[220px]">
      <label className="absolute left-4 -top-2.5 bg-background px-1 text-xs text-muted-foreground">
        Date
      </label>

      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        className="w-full h-10 px-4 rounded-lg bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
      />
    </div>

    <button
      type="button"
      onClick={() => setSelectedDate("")}
      className="text-sm font-medium text-foreground hover:text-primary transition"
    >
      Clear
    </button>

  </div>

</div>

          <div className="text-sm font-medium text-foreground">
            Current Balance: ₹{totalAllocated.toLocaleString()}
          </div>

          <div className="bg-card rounded-xl border border-border overflow-hidden overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
  <table className="w-full text-sm border-collapse min-w-[650px]">

    {/* HEADER */}
    <thead>
      <tr className="bg-secondary/50">
        <th className="text-left py-3 px-4 border-b  border-r border-border">
          Name
        </th>

        <th className="text-left py-3 px-4 border-b border-r border-border">
          Designation
        </th>

        <th className="text-left py-3 px-4 border-b  border-r border-border">
          Mail ID
        </th>

        <th className="text-left py-3 px-4 border-b  border-r border-border">
          Project
        </th>

        <th className="text-left py-3 px-4 border-b  border-r border-border">
          Amount Allocated
        </th>

        <th className="text-left py-3 px-4 border-b border-border">
          Action
        </th>
      </tr>
    </thead>

    {/* BODY */}
    <tbody>
      {filteredRows.length === 0 ? (
        <tr>
          <td colSpan="6" className="h-[220px] text-center align-middle text-muted-foreground border-b border-border">
            No rows
          </td>
        </tr>
      ) : (
        filteredRows.map((row) => (
          <tr key={row.id}>
            
            <td className="py-3 px-4 border-b  border-r border-border whitespace-nowrap">
              {row.name}
            </td>

            <td className="py-3 px-4 border-b border-r border-border whitespace-nowrap">
              {row.designation}
            </td>

            <td className="py-3 px-4 border-b border-r border-border whitespace-nowrap">
             {row.email}
            </td>

            <td className="py-3 px-4 border-b  border-r border-border whitespace-nowrap">
              {row.project || "-"}
            </td>

            <td className="py-3 px-4 border-b  border-r border-border whitespace-nowrap">
              ₹{Number(row.amount).toLocaleString()}
            </td>

            <td className="py-3 px-4 border-b border-border whitespace-nowrap">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleView(row)}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600"
                >
                  View
                </button>

                <button
  onClick={() => {
    if (!users.length || !projects.length) {
      alert("Data still loading, please wait...");
      return;
    }
    openEditDrawer(row);
  }}
>
  Edit
</button>
                <button
                  onClick={() => handleDelete(row.id)}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500"
                >
                  Delete
                </button>
              </div>
            </td>

          </tr>
        ))
      )}
    </tbody>

  </table>

          </div>

          <TablePagination
            variant="page"
            page={currentPage}
            pageSize={itemsPerPage}
            total={recordTotal > 0 ? recordTotal : rows.length}
            onPageChange={setCurrentPage}
          />
        </div>
      </AdminLayout>

      <SlidePanel open={drawerOpen} onClose={closeDrawer}>
        <div className="p-7 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-heading font-bold text-foreground">
              {drawerMode === "add" ? "Allocate to manager" : "Edit Account"}
            </h2>

            <button
              type="button"
              onClick={closeDrawer}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-secondary transition"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* DESIGNATION */}
<select
  value={formData.designation}
  onChange={(e) => {
    setFormData((prev) => ({
      ...prev,
      designation: e.target.value,
      user_id: "",
      name: "",
      mailId: "",
    }));
  }}
  className="w-full h-11 rounded-2xl border border-border bg-background px-4"
>
  <option value="">Select Designation</option>
  <option value="manager">Manager</option>
  <option value="accountant">Accountant</option>
</select>
{/* MAIL ID */}
<select
  value={formData.user_id}
  onChange={(e) => {
    const selectedUser = users.find(
      (u) => u.id == e.target.value
    );
    setFormData((prev) => ({
      ...prev,
      user_id: e.target.value,
      name: selectedUser?.name || "",
      mailId: selectedUser?.email || "",
    }));
  }}
  className="w-full h-11 rounded-2xl border border-border bg-background px-4 text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30"
>
  <option value="">Select user</option>

  {users
    .filter((u) =>
      formData.designation ? u.role === formData.designation : true
    )
    .map((user) => (
      <option key={user.id} value={user.id}>
        {user.name} ({user.email})
      </option>
    ))}
</select>

{/* NAME (AUTO FILLED) */}
<input
  type="text"
  value={formData.name}
  readOnly
  placeholder="Name"
  className="w-full h-11 rounded-2xl border border-border bg-background px-4 text-foreground placeholder:text-muted-foreground"
/>
          <div className="relative">
            <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">
              Project
            </label>
          <select
  value={formData.project_id}
  onChange={(e) =>
    setFormData((prev) => ({
      ...prev,
      project_id: e.target.value,
    }))
  }
  className="w-full h-11 rounded-2xl border border-border bg-background px-4 pr-10 text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30"
>
  <option value="">Select project</option>

  {projects.map((project) => (
    <option key={project.id} value={project.id}>
      {project.name}
    </option>
  ))}
</select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>

          <input
            type="number"
            placeholder="Amount Allocated"
            value={formData.amountAllocated}
            onChange={(e) => setFormData((prev) => ({ ...prev, amountAllocated: e.target.value }))}
            className="w-full h-11 rounded-2xl border border-border bg-background px-4"
          />

          <button
            type="button"
            onClick={handleSave}
            className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-semibold"
          >
            {drawerMode === "add" ? "Save" : "Update"}
          </button>
        </div>
      </SlidePanel>
    </>
  );
}