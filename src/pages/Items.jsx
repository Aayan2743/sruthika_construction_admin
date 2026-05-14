import { useState, useEffect, useMemo, useCallback } from "react";
import { Search, Pencil, Trash2, ChevronDown } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import TablePagination, { DEFAULT_TABLE_PAGE_SIZE } from "../components/TablePagination";
import {
  getManagerItems,
  addManagerItem,
  updateManagerItem,
  deleteManagerItem,
} from "../api/itemsApi";

/** Values must match backend validation (e.g. Laravel `in:material,machinery,...`). */
const ITEM_TYPES = [
  { value: "material", label: "Material" },
  { value: "machinery", label: "Machinery" },
];

function normalizeItemType(type) {
  const t = String(type ?? "").trim().toLowerCase();
  return ITEM_TYPES.some((o) => o.value === t) ? t : "material";
}

function typeLabel(type) {
  const v = normalizeItemType(type);
  return ITEM_TYPES.find((o) => o.value === v)?.label ?? type ?? "—";
}

function parseItemsList(res) {
  const body = res?.data;
  const inner = body?.data;
  if (Array.isArray(inner)) return inner;
  if (inner && Array.isArray(inner.items)) return inner.items;
  if (inner && Array.isArray(inner.data)) return inner.data;
  if (Array.isArray(body?.items)) return body.items;
  return [];
}

export default function Items() {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ type: "material", name: "" });
  const [page, setPage] = useState(1);

  const loadItems = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const res = await getManagerItems();
      setItems(parseItemsList(res));
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to load items";
      setError(msg);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const filtered = useMemo(
    () =>
      items.filter((item) => {
        const q = search.toLowerCase();
        return (
          (item.name || "").toLowerCase().includes(q) ||
          (item.type || "").toLowerCase().includes(q)
        );
      }),
    [items, search]
  );

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(filtered.length / DEFAULT_TABLE_PAGE_SIZE));
    setPage((p) => Math.min(p, totalPages));
  }, [filtered.length]);

  const paginatedData = useMemo(
    () => filtered.slice((page - 1) * DEFAULT_TABLE_PAGE_SIZE, page * DEFAULT_TABLE_PAGE_SIZE),
    [filtered, page]
  );

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.type.trim() || !form.name.trim()) {
      alert("Please fill all fields");
      return;
    }

    const payload = {
      name: form.name.trim(),
      type: normalizeItemType(form.type),
    };
    setSaving(true);
    try {
      if (editId != null) {
        const res = await updateManagerItem(editId, payload);
        if (res.data?.success === false) {
          throw new Error(res.data?.message || "Update failed");
        }
        alert(res.data?.message || "Item updated");
      } else {
        const res = await addManagerItem(payload);
        if (res.data?.success === false) {
          throw new Error(res.data?.message || "Add failed");
        }
        alert(res.data?.message || "Item added");
      }
      setShowModal(false);
      setEditId(null);
      setForm({ type: "material", name: "" });
      await loadItems();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Request failed";
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      const res = await deleteManagerItem(id);
      if (res.data?.success === false) {
        throw new Error(res.data?.message || "Delete failed");
      }
      alert(res.data?.message || "Item deleted successfully");
      await loadItems();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Delete failed";
      alert(msg);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <p className="text-xl font-semibold">Items</p>
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setForm({ type: "material", name: "" });
              setShowModal(true);
            }}
            className="h-10 px-4 rounded-xl bg-primary text-white text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition shadow-md shadow-primary/25 whitespace-nowrap"
          >
            + Add Item
          </button>
        </div>

        {error ? (
          <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
            {error}
          </p>
        ) : null}

        <div className="relative flex-shrink-0 w-full sm:w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search items..."
            className="w-full h-10 pl-10 pr-3 rounded-lg bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
          />
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <table className="w-full text-sm border-collapse min-w-[500px]">
            <thead>
              <tr className="bg-secondary/50">
                <th className="py-3 px-4 font-semibold text-foreground text-center border-b border-r border-border">
                  Type
                </th>
                <th className="py-3 px-4 font-semibold text-foreground text-center border-b border-r border-border">
                  Item Name
                </th>
                <th className="py-3 px-4 font-semibold text-foreground text-center border-b border-border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-muted-foreground">
                    Loading…
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-10 text-center text-muted-foreground">
                    No items found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((item) => (
                  <tr key={item.id} className="hover:bg-secondary/30 transition">
                    <td className="py-3 px-4 border-b border-r border-border text-center">{typeLabel(item.type)}</td>
                    <td className="py-3 px-4 border-b border-r border-border text-center">{item.name}</td>
                    <td className="py-3 px-4 border-b border-border text-center">
                      <div className="flex items-center justify-center gap-4">
                        <button
                          type="button"
                          onClick={() => {
                            setEditId(item.id);
                            setForm({
                              type: normalizeItemType(item.type),
                              name: item.name || "",
                            });
                            setShowModal(true);
                          }}
                          className="p-1 rounded-lg hover:bg-secondary transition"
                          aria-label="Edit item"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="p-1 rounded-lg hover:bg-secondary transition"
                          aria-label="Delete item"
                        >
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

        {!loading ? (
          <TablePagination
            variant="page"
            page={page}
            pageSize={DEFAULT_TABLE_PAGE_SIZE}
            total={filtered.length}
            onPageChange={setPage}
          />
        ) : null}

        {showModal && (
          <div className="fixed inset-0 z-50 flex flex-col sm:flex-row">
            <div className="flex-1 bg-black/40" onClick={() => !saving && setShowModal(false)} aria-hidden />

            <div className="w-full sm:max-w-md bg-card h-auto sm:h-full shadow-xl p-7 animate-slideIn">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {editId != null ? "Edit Item" : "Add Item"}
              </h2>

              <form onSubmit={handleSave} className="space-y-5">
                <div className="relative">
                  <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground z-10">
                    Type
                  </label>
                  <select
                    value={normalizeItemType(form.type)}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    disabled={saving}
                    className="w-full h-11 rounded-2xl border border-border bg-background px-4 pr-10 text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
                  >
                    {ITEM_TYPES.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>

                <input
                  placeholder="Item Name"
                  className="w-full h-11 rounded-2xl border border-border bg-background px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  disabled={saving}
                />

                <div className="flex gap-3">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => setShowModal(false)}
                    className="flex-1 h-12 rounded-2xl border border-border font-semibold hover:bg-secondary transition disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 h-12 rounded-2xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition disabled:opacity-50"
                  >
                    {saving ? "Please wait…" : editId != null ? "Update" : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
