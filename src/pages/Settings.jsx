import { useEffect, useState } from "react";
import {
  Save,
  Shield,
  Bell,
  Palette,
  Lock,
  UserCog,
} from "lucide-react";
import AdminLayout from "../components/AdminLayout";

export default function Settings() {
  const [form, setForm] = useState(() => ({
    companyName: "SR",
    emailNotifications: true,
    smsNotifications: false,
    darkSidebar: localStorage.getItem("theme") === "dark",
    allowUserEdit: true,
    twoFactorAuth: false,
  }));

  useEffect(() => {
    const handleThemeSync = () => {
      setForm((prev) => ({
        ...prev,
        darkSidebar: localStorage.getItem("theme") === "dark",
      }));
    };

    window.addEventListener("storage", handleThemeSync);
    window.addEventListener("theme-change", handleThemeSync);

    return () => {
      window.removeEventListener("storage", handleThemeSync);
      window.removeEventListener("theme-change", handleThemeSync);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    if (form.darkSidebar) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    window.dispatchEvent(new Event("theme-change"));
  }, [form.darkSidebar]);

  const handleToggle = (key) => {
    setForm((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <p className="text-sm md:text-[15px] leading-6 text-muted-foreground">
          Configure system preferences and account controls.
        </p>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <UserCog className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-heading text-lg font-semibold text-foreground">
                  General
                </h2>
                <p className="text-sm text-muted-foreground">
                  Manage application identity and usage settings
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Company Name
                </label>
                <input
                  value={form.companyName}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, companyName: e.target.value }))
                  }
                  className="w-full h-11 rounded-xl border border-border bg-background px-4 text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Enter company name"
                />
              </div>

              <ToggleRow
                icon={Palette}
                title="Dark Sidebar Theme"
                desc="Use premium dark navigation style"
                checked={form.darkSidebar}
                onChange={() => handleToggle("darkSidebar")}
              />

              <ToggleRow
                icon={UserCog}
                title="Allow User Edit"
                desc="Users can update their own profile details"
                checked={form.allowUserEdit}
                onChange={() => handleToggle("allowUserEdit")}
              />
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Bell className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 className="font-heading text-lg font-semibold text-foreground">
                  Notifications
                </h2>
                <p className="text-sm text-muted-foreground">
                  Configure how users receive alerts
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <ToggleRow
                icon={Bell}
                title="Email Notifications"
                desc="Receive updates through email"
                checked={form.emailNotifications}
                onChange={() => handleToggle("emailNotifications")}
              />

              <ToggleRow
                icon={Bell}
                title="SMS Notifications"
                desc="Receive critical alerts through SMS"
                checked={form.smsNotifications}
                onChange={() => handleToggle("smsNotifications")}
              />
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm xl:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                {/* Theme success color apply kiya */}
                <Shield className="w-5 h-5 text-success" />
              </div>
              <div>
                <h2 className="font-heading text-lg font-semibold text-foreground">
                  Security
                </h2>
                <p className="text-sm text-muted-foreground">
                  Protect access and strengthen authentication rules
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <ToggleRow
                icon={Lock}
                title="Two Factor Authentication"
                desc="Add extra login protection for admin users"
                checked={form.twoFactorAuth}
                onChange={() => handleToggle("twoFactorAuth")}
              />

              <div className="rounded-2xl bg-secondary p-4">
                <p className="text-sm font-medium text-foreground">
                  Password Policy
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Minimum 8 characters, include uppercase, lowercase and number.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="h-11 px-5 rounded-xl bg-primary text-primary-foreground font-semibold shadow-sm hover:bg-primary/90 transition flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Settings
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}

function ToggleRow({ icon, title, desc, checked, onChange }) {
  const Icon = icon;

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background/60 p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="font-medium text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground mt-1">{desc}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onChange}
        aria-pressed={checked}
        className={`relative h-6 w-11 rounded-full transition ${
          checked ? "bg-primary" : "bg-muted"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}