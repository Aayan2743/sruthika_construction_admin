import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile closed by default

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">

      {/* ✅ Sidebar (ONLY ONE) */}
      <div className="flex-shrink-0">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* ✅ Main Content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-[200px] overflow-hidden">

        {/* Header */}
        <Header
          onToggleSidebar={() =>
            setSidebarOpen((prev) => !prev)
          }
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-background p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}