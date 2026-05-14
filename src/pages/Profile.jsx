import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Shield,
  Save,
  Loader2,
} from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { getProfile, updateProfile } from "../api/profileApi";

export default function Profile() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    status: "",
    oldPassword: "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getProfile();
      if (data.success) {
        const { name, email, phone, role, status } = data.data;
        setForm((prev) => ({
          ...prev,
          name: name || "",
          email: email || "",
          phone: phone || "",
          role: role || "",
          status: status || "",
        }));
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSavedMessage("");
    setError("");

    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
    };

    // Include password fields only if new password is provided
    if (form.newPassword) {
      payload.oldPassword = form.oldPassword;
      payload.newPassword = form.newPassword;
    }

    try {
      const { data } = await updateProfile(payload);
      if (data.success) {
        setSavedMessage("Profile saved successfully");
        // Clear password fields after successful update
        setForm((prev) => ({ ...prev, oldPassword: "", newPassword: "" }));
        setTimeout(() => setSavedMessage(""), 3000);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap pt-1">
          <p className="text-sm md:text-[15px] leading-6 text-muted-foreground">
            View and manage your account details.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <p className="text-sm font-medium text-red-600 dark:text-red-400 transition-all">
            {error}
          </p>
        )}

        {/* Success message */}
        {savedMessage && (
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 transition-all">
            {savedMessage}
          </p>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="grid gap-6">
            <div className="bg-card border border-border rounded-[24px] p-6 md:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-6 border-b border-border">
                <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg font-bold shrink-0 shadow-md shadow-blue-600/20">
                  <span className="leading-none">
                    {form.name?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>

                <div className="min-w-0">
                  <h2 className="text-xl font-heading font-bold text-foreground">
                    {form.name || "User"}
                  </h2>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-600/10 text-blue-600">
                      <Shield className="w-3.5 h-3.5" />
                      {form.role || "Admin"}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-600">
                      {form.status || "Active Account"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2 pt-6">
                <Field
                  label="Full Name"
                  icon={User}
                  value={form.name}
                  onChange={(value) => setForm((prev) => ({ ...prev, name: value }))}
                />
                <Field
                  label="Email Address"
                  icon={Mail}
                  value={form.email}
                  onChange={(value) => setForm((prev) => ({ ...prev, email: value }))}
                />
                <Field
                  label="Phone Number"
                  icon={Phone}
                  value={form.phone}
                  onChange={(value) => setForm((prev) => ({ ...prev, phone: value }))}
                />
                <Field
                  label="Role"
                  icon={Shield}
                  value={form.role}
                  readOnly
                />
                <Field
                  label="Old Password"
                  icon={Shield}
                  type="password"
                  value={form.oldPassword || ""}
                  onChange={(value) =>
                    setForm((prev) => ({ ...prev, oldPassword: value }))
                  }
                />
                <Field
                  label="New Password"
                  icon={Shield}
                  type="password"
                  value={form.newPassword || ""}
                  onChange={(value) =>
                    setForm((prev) => ({ ...prev, newPassword: value }))
                  }
                />
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="h-10 px-4 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-md shadow-blue-600/20 hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function Field({ label, icon, value, onChange, readOnly = false, type = "text" }) {
  const Icon = icon;

  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">
        {label}
      </label>

      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type={type}
          value={value}
          readOnly={readOnly}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full h-12 rounded-2xl border border-border bg-background pl-11 pr-4 text-foreground outline-none shadow-sm transition focus:ring-2 focus:ring-blue-600/20"
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      </div>
    </div>
  );
}