import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
} from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import {
  getUsers,
  createUser,
  deleteUserApi,
  updateUserApi,
} from "../api/projectApi";



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

export default function Users() {
  const [activeTab, setActiveTab] = useState("users");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);

  const [openAddUserPanel, setOpenAddUserPanel] = useState(false);
  const [_openEditUserPanel, setOpenEditUserPanel] = useState(false);

  const [editingUserId, setEditingUserId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Manager",
    username: "",
    password: "",
    status: "Active",
  });



  const fetchUsers = async () => {
  try {
    const res = await getUsers({
      page,
      per_page: 10,
    });
     
    
   setUsers(res.data.data || []);
    setTotalPages(res.data.pagination?.last_page || 1);

  } catch (error) {
    console.error(error);
  }
}; 

useEffect(() => {
  fetchUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [page]);

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase();

    return users.filter(
      (u) =>
        (u.name || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q) ||
        (u.role || "").toLowerCase().includes(q) ||
        (u.phone?.toString() || "").includes(q)
    );
  }, [search, users]);

  const resetUserForm = () => {
    setUserForm({
      name: "",
      email: "",
      phone: "",
      role: "Manager",
      username: "",
      password: "",
      status: "Active",
    });
  };

  const handleAddUser = async () => {
    try {
      if (!userForm.name.trim()) {
        alert("Please enter name");
        return;
      }

      if (!userForm.email.trim()) {
        alert("Please enter email");
        return;
      }

      if (!userForm.role.trim()) {
        alert("Please select role");
        return;
      }

      const payload = {
  name: userForm.name,
  email: userForm.email,
  phone: userForm.phone, // string ✅
  password: userForm.password || "123456",
  role: userForm.role.toLowerCase(), // ✅
  status: userForm.status === "Active" ? "1" : "0", // string ✅
};
      await createUser(payload);

      alert("User created ✅");
      setOpenAddUserPanel(false);
      resetUserForm();
      fetchUsers();
    } catch (error) {
      console.error("ADD USER ERROR ❌", error.response?.data);
    }
  };

  const handleEditUserClick = (user) => {
    setEditingUserId(user.id);
    setUserForm({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
      username: user.username,
      password: user.password,
      status: user.status,
    });
    setOpenAddUserPanel(true);
  };

const _handleUpdateUser = async () => {
  try {
    const payload = {
      name: userForm.name,
      email: userForm.email,
      phone: userForm.phone,
      password: userForm.password || "123456",
      role: userForm.role.toLowerCase(),
      status: userForm.status === "Active" ? "1" : "0",
    };

    const res = await updateUserApi(editingUserId, payload);

    if (res.data.success) {
      alert(res.data.message); // "User updated successfully"
    }

    setOpenEditUserPanel(false);
    setEditingUserId(null);
    resetUserForm();

    fetchUsers();

  } catch (error) {
    console.error("UPDATE ERROR ❌", error.response?.data || error);
  }
};
  const handleDeleteUser = async (id) => {
  try {
    const confirmDelete = window.confirm("Delete this user?");
    if (!confirmDelete) return;

    const res = await deleteUserApi(id);

    if (res.data.success) {
      alert(res.data.message); // "User deleted successfully"
    }

    fetchUsers();

  } catch (error) {
    console.error("DELETE ERROR ❌", error.response?.data || error);
  }
};
  return (
    <>
      <AdminLayout>
        <div className="space-y-4">
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <p className="text-sm md:text-[15px] leading-6 text-muted-foreground">
              Manage supervisors, managers, and vendor accounts from one place.
            </p>

            <button
              onClick={() => {
                resetUserForm();
                setOpenAddUserPanel(true);
              }}
              className="h-11 px-5 rounded-2xl bg-primary text-white text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition shadow-md shadow-primary/25"
            >
              <Plus className="w-4 h-4" />
              Add user
            </button>
          </div>

          {/* TABS */}
          <div className="space-y-4">
            <div className="w-full max-w-[520px] rounded-2xl border border-border bg-card px-4 pt-3">
              <div className="flex items-center gap-8">
                <button
                  onClick={() => setActiveTab("users")}
                  className={`pb-3 text-sm font-semibold border-b-2 transition ${
                    activeTab === "users"
                      ? "text-foreground border-primary"
                      : "text-muted-foreground border-transparent"
                  }`}
                >
                  Managers / Supervisors
                </button>
              </div>
            </div>

            {/* SEARCH */}
            <div className="relative w-full max-w-[430px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Search users..."
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
              />
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-card rounded-xl border border-border overflow-hidden overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <table className="w-full text-sm border-collapse min-w-[800px]">
  <thead>
    <tr className="bg-secondary/50">
      <th className="text-left py-3 px-4 border-b  border-r border-border">Name</th>
      <th className="text-left py-3 px-4 border-b  border-r border-border">Email</th>
      <th className="text-left py-3 px-4 border-b  border-r border-border">Phone</th>
      <th className="text-left py-3 px-4 border-b  border-r border-border">Role</th>
      <th className="text-left py-3 px-4 border-b  border-r border-border">Project</th>
     
      <th className="text-left py-3 px-4 border-b  border-r border-border">Status</th>
      <th className="text-right py-3 px-4 border-b border-border">Actions</th>
    </tr>
  </thead>

  <tbody>
    {filteredUsers.map((user) => (
      <tr key={user.id}>
       <td className="py-3 px-4 border-b border-r border-border">{user.name}</td>
<td className="py-3 px-4 border-b border-r border-border">{user.email}</td>
<td className="py-3 px-4 border-b border-r border-border">{user.phone || "-"}</td>
<td className="py-3 px-4 border-b border-r border-border">{user.role}</td>
<td className="py-3 px-4 border-b border-r border-border">{user.project || "N/A"}</td>

<td className="py-3 px-4 border-b border-r border-border">
 {Number(user.status) === 1 ? "Active" : "Inactive"}
</td>

        <td className="py-3 px-4 border-b border-border text-right">
          <div className="flex justify-end gap-3">
            <button onClick={() => handleEditUserClick(user)}>
              <Pencil className="w-4 h-4" />
            </button>
            <button onClick={() => handleDeleteUser(user.id)}>
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        </td>
      </tr>
    ))}

    {filteredUsers.length === 0 && (
      <tr>
        <td colSpan="7" className="text-center py-10 border-b border-border">
          No users found.
        </td>
      </tr>
    )}
  </tbody>
</table>
          </div>
          <div className="flex flex-row justify-between items-center gap-3 mt-4 px-4">
 <button
    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
    disabled={page === 1}
    className="px-4 py-2 rounded-lg border border-border text-sm disabled:opacity-50 hover:bg-secondary transition"
  >
    Previous
  </button>

  <span className="text-sm text-muted-foreground font-medium">
    Page {page} of {totalPages}
  </span>

  <button
    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
    disabled={page === totalPages}
    className="px-4 py-2 rounded-lg border border-border text-sm disabled:opacity-50 hover:bg-secondary transition"
  >
    Next
  </button>
</div>
        </div>
      </AdminLayout>

      {/* ADD USER */}
      <SlidePanel open={openAddUserPanel} onClose={() => setOpenAddUserPanel(false)}>
        <div className="p-7 space-y-5">
          <h2 className="text-2xl font-bold">Add user</h2>
<input
  type="text"
  placeholder="Name"
  value={userForm.name}
  onChange={(e) =>
    setUserForm((prev) => ({ ...prev, name: e.target.value }))
  }
  className="w-full h-11 rounded-2xl border border-border bg-background px-4"
/>

<input
  type="email"
  placeholder="Email"
  value={userForm.email}
  onChange={(e) =>
    setUserForm((prev) => ({ ...prev, email: e.target.value }))
  }
  className="w-full h-11 rounded-2xl border border-border bg-background px-4"
/>

<input
  type="text"
  placeholder="Phone"
  value={userForm.phone}
  onChange={(e) =>
    setUserForm((prev) => ({ ...prev, phone: e.target.value }))
  }
  className="w-full h-11 rounded-2xl border border-border bg-background px-4"
/>

<div className="relative">
  <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">
    Role
  </label>
  <select
    value={userForm.role}
    onChange={(e) =>
      setUserForm((prev) => ({ ...prev, role: e.target.value }))
    }
    className="w-full h-11 rounded-2xl border border-border bg-background px-4 pr-10 appearance-none"
  >
    <option value="Manager">Manager</option>
    <option value="Supervisor">Supervisor</option>
    <option value="Accountant">Accountant</option>
  </select>
  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4" />
</div>



<input
  type="text"
  placeholder="Password"
  value={userForm.password}
  onChange={(e) =>
    setUserForm((prev) => ({ ...prev, password: e.target.value }))
  }
  className="w-full h-11 rounded-2xl border border-border bg-background px-4"
/>

<div className="relative">
  <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground">
    Status
  </label>
  <select
    value={userForm.status}
    onChange={(e) =>
      setUserForm((prev) => ({ ...prev, status: e.target.value }))
    }
    className="w-full h-11 rounded-2xl border border-border bg-background px-4 pr-10 appearance-none"
  >
    <option value="Active">Active</option>
    <option value="Inactive">Inactive</option>
  </select>
  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4" />
</div>

<button
  onClick={editingUserId ? _handleUpdateUser : handleAddUser}
  className="w-full h-12 rounded-2xl bg-primary text-white font-semibold"
>
  Save
</button>
        </div>
      </SlidePanel>
    </>
  );
}