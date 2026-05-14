import { useState, useEffect } from "react";
import { Search, Pencil, Trash2, ChevronDown, Plus, X } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import {
  getVendors,
  addVendorApi,
  updateVendorApi,
  deleteVendorApi,
} from "../api/projectApi";

// ✅ Users jaisa SlidePanel
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

export default function Vendor() {
  const [search, setSearch] = useState("");
  const [vendors, setVendors] = useState([]);
  const [showPanel, setShowPanel] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: "", contact: "", type: [] });
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  const fetchVendors = async () => {
    try {
      const res = await getVendors();
      setVendors(res.data.data || []);
    } catch (error) {
      console.error("VENDOR FETCH ERROR ❌", error);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        contact: form.contact,
        notes: form.notes,
        type: form.type,
      };
      if (editId) {
        await updateVendorApi(editId, payload);
        alert("Vendor Updated ✅");
      } else {
        await addVendorApi(payload);
        alert("Vendor Added ✅");
      }
      setShowPanel(false);
      setEditId(null);
      setForm({ name: "", contact: "", type: [] });
      fetchVendors();
    } catch (error) {
      console.error("SAVE ERROR ❌", error.response?.data);
    }
  };

  const handleDelete = async (id) => {
    try {
      if (!window.confirm("Delete this vendor?")) return;
      await deleteVendorApi(id);
      alert("Deleted ✅");
      fetchVendors();
    } catch (error) {
      console.error("DELETE ERROR ❌", error.response?.data);
    }
  };

  const filtered = vendors.filter((v) => {
    const q = search.toLowerCase();
    return (
      (v.name || "").toLowerCase().includes(q) ||
      (v.type?.[0] || "").toLowerCase().includes(q)
    );
  });

  const paginatedData = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const pages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <>
      <AdminLayout>
        <div className="space-y-4">

          {/* ✅ HEADER — Users jaisa */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
  <h2 className="text-xl font-semibold text-foreground">Vendors</h2>
            <button
              onClick={() => {
                setEditId(null);
                setForm({ name: "", contact: "", type: [] });
                setShowPanel(true);
              }}
              className="h-11 px-5 rounded-2xl bg-primary text-white text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition shadow-md shadow-primary/25"
            >
              <Plus className="w-4 h-4" />
              Add Vendor
            </button>
          </div>

          {/* ✅ SEARCH — Users jaisa */}
          <div className="relative w-full max-w-[430px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search vendors..."
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
            />
          </div>

          {/* ✅ TABLE — Users jaisa */}
          <div className="bg-card rounded-xl border border-border overflow-hidden overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <table className="w-full text-sm border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-secondary/50">
                 <th className="text-center py-3 px-4 font-semibold text-foreground border-b border-r border-border">
  Type
</th>
<th className="text-center py-3 px-4 font-semibold text-foreground border-b border-r border-border">
  Name
</th>
<th className="text-center py-3 px-4 font-semibold text-foreground border-b border-r border-border">
  Contact
</th>
<th className="text-center py-3 px-4 font-semibold text-foreground border-b border-border">
  Actions
</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-10 text-muted-foreground border-b border-border">
                      No vendors found.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((vendor) => (
                    <tr key={vendor.id} className="hover:bg-secondary/30 transition">
                     <td className="py-3 px-4 border-b border-r border-border capitalize text-center">
  {vendor.type?.[0]}
</td>
<td className="py-3 px-4 border-b border-r border-border text-center">
  {vendor.name}
</td>
<td className="py-3 px-4 border-b border-r border-border text-center">
  {vendor.contact}
</td>
<td className="py-3 px-4 border-b border-border">
  <div className="flex justify-center gap-3">
                          <button
                            onClick={() => {
                              setEditId(vendor.id);
                              setForm({
                                name: vendor.name,
                                contact: vendor.contact,
                                notes: vendor.notes,
                                type: vendor.type || [],
                              });
                              setShowPanel(true);
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(vendor.id)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ✅ PAGINATION — Users jaisa */}
          <div className="flex flex-row justify-between items-center gap-3 mt-4 px-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-4 py-2 rounded-lg border border-border text-sm disabled:opacity-50 hover:bg-secondary transition"
            >
              Previous
            </button>
            <span className="text-sm text-muted-foreground font-medium">
              Page {currentPage} of {pages || 1}
            </span>
            <button
              disabled={currentPage === pages || pages === 0}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-4 py-2 rounded-lg border border-border text-sm disabled:opacity-50 hover:bg-secondary transition"
            >
              Next
            </button>
          </div>

        </div>
      </AdminLayout>

      {/* ✅ SLIDE PANEL — Users jaisa */}
      <SlidePanel open={showPanel} onClose={() => setShowPanel(false)}>
        <div className="p-7 space-y-5">

          {/* Panel Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">
              {editId ? "Edit Vendor" : "Add Vendor"}
            </h2>
            <button
              onClick={() => setShowPanel(false)}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-secondary transition"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-5">

            {/* ✅ TYPE — Users ke Role jaisa */}
            <div className="relative">
              <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground z-10">
                Type
              </label>
              <div
                onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                className="w-full h-11 rounded-2xl border border-border bg-background px-4 pr-10 flex items-center justify-between cursor-pointer"
              >
                <span className="text-sm text-foreground">
                  {form.type.length > 0 ? form.type.join(", ") : "Select Type"}
                </span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </div>

              {showTypeDropdown && (
                <div className="absolute top-13 w-full bg-card border border-border rounded-xl shadow-md z-20 mt-1">
                  {["labour", "material", "machinery"].map((item) => (
                    <label
                      key={item}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-secondary cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={form.type.includes(item)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setForm({ ...form, type: [...form.type, item] });
                          } else {
                            setForm({ ...form, type: form.type.filter((t) => t !== item) });
                          }
                        }}
                        className="accent-primary"
                      />
                      <span className="capitalize text-sm text-foreground">{item}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* ✅ NAME — Users jaisa */}
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full h-11 rounded-2xl border border-border bg-background px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />

            {/* ✅ CONTACT — Users jaisa */}
            <input
              type="text"
              placeholder="Contact"
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
              className="w-full h-11 rounded-2xl border border-border bg-background px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />

            {/* ✅ SAVE BUTTON — Users jaisa */}
            <button
              type="submit"
              className="w-full h-12 rounded-2xl bg-primary text-white font-semibold hover:opacity-90 transition"
            >
              {editId ? "Update" : "Save"}
            </button>

          </form>
        </div>
      </SlidePanel>
    </>
  );
}