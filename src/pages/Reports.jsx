import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  Filter,
  EyeOff,
  Columns3,
  X,
  Search,
  Check,
} from "lucide-react";
import AdminLayout from "../components/AdminLayout";

const tabs = ["Labour", "Machinery", "Materials"];

const vendorsRows = [
  { id: 1, name: "ABC Labour Contractors", type: "labour", contact: "9000000001", notes: "" },
  { id: 2, name: "XYZ Equipment", type: "machinery", contact: "9000000002", notes: "" },
  { id: 3, name: "BuildMart Supplies", type: "material", contact: "9000000003", notes: "" },
  { id: 4, name: "Prime Stock Agency", type: "stock", contact: "9000000004", notes: "" },
  { id: 5, name: "Stone Depot", type: "material", contact: "9000000005", notes: "" },
];

const defaultColumnsMap = {
  Labour: [
    { key: "date", label: "Date", visible: true },
    { key: "manager", label: "Manager", visible: true },
    { key: "party", label: "Party", visible: true },
    { key: "m", label: "M", visible: true },
    { key: "f", label: "F", visible: true },
    { key: "work", label: "Work", visible: true },
    { key: "meas", label: "Meas.", visible: true },
    { key: "reasonEdit", label: "Reason(Edit)", visible: true },
    { key: "reasonDelete", label: "Reason(Delete)", visible: true },
  ],
  Machinery: [
    { key: "name", label: "Name", visible: true },
    { key: "start", label: "Start", visible: true },
    { key: "close", label: "Close", visible: true },
    { key: "hrs", label: "Hrs", visible: true },
    { key: "work", label: "Work", visible: true },
    { key: "action", label: "Action", visible: true },
    { key: "reasonEdit", label: "Reason(Edit)", visible: true },
    { key: "reasonDelete", label: "Reason(Delete)", visible: true },
  ],
  Materials: [
    { key: "item", label: "Item", visible: true },
    { key: "quantity", label: "Quantity", visible: true },
    { key: "action", label: "Action", visible: true },
    { key: "reasonEdit", label: "Reason(Edit)", visible: true },
    { key: "reasonDelete", label: "Reason(Delete)", visible: true },
  ],
  Stock: [
    { key: "date", label: "Date", visible: true },
    { key: "manager", label: "Manager", visible: true },
    { key: "item", label: "Item", visible: true },
    { key: "open", label: "Open", visible: true },
    { key: "in", label: "In", visible: true },
    { key: "out", label: "Out", visible: true },
    { key: "close", label: "Close", visible: true },
  ],
};

const initialRowsMap = {
  Labour: [
    { id: 1, project: "Project Alpha", date: "2025-04-10", manager: "Rohit Sharma", party: "Labour Team A", m: 12, f: 4, work: "Brick masonry", meas: "120 sq ft", reasonEdit: "-", reasonDelete: "-" },
    { id: 2, project: "Project Beta", date: "2025-04-11", manager: "Priya Verma", party: "Labour Team B", m: 8, f: 3, work: "Plastering", meas: "85 sq ft", reasonEdit: "-", reasonDelete: "-" },
    { id: 3, project: "Project Alpha", date: "2025-04-12", manager: "Rohit Sharma", party: "Labour Team C", m: 10, f: 2, work: "Shuttering", meas: "60 sq ft", reasonEdit: "-", reasonDelete: "-" },
    { id: 4, project: "Project Gamma", date: "2025-04-13", manager: "Amit Kumar", party: "Labour Team D", m: 14, f: 5, work: "Tile laying", meas: "140 sq ft", reasonEdit: "-", reasonDelete: "-" },
    { id: 5, project: "Project Alpha", date: "2025-04-14", manager: "Rohit Sharma", party: "Labour Team E", m: 9, f: 4, work: "Painting", meas: "200 sq ft", reasonEdit: "-", reasonDelete: "-" },
  ],
  Machinery: [
    { id: 1, project: "Project Alpha", name: "Excavator", start: "08:00", close: "12:30", hrs: "4.5", work: "Foundation excavation", action: "Digging", reasonEdit: "-", reasonDelete: "-" },
    { id: 2, project: "Project Gamma", name: "JCB", start: "09:00", close: "01:00", hrs: "4", work: "Site leveling", action: "Leveling", reasonEdit: "-", reasonDelete: "-" },
    { id: 3, project: "Project Beta", name: "Crane", start: "07:00", close: "11:00", hrs: "4", work: "Steel beam lifting", action: "Lifting", reasonEdit: "-", reasonDelete: "-" },
    { id: 4, project: "Project Alpha", name: "Concrete Mixer", start: "10:00", close: "03:00", hrs: "5", work: "Concrete mixing", action: "Mixing", reasonEdit: "-", reasonDelete: "-" },
    { id: 5, project: "Project Gamma", name: "Vibrator", start: "08:30", close: "11:30", hrs: "3", work: "Column compaction", action: "Compacting", reasonEdit: "-", reasonDelete: "-" },
  ],
  Materials: [
    { id: 1, project: "Project Alpha", item: "Cement", quantity: "50 bags", action: "Used", reasonEdit: "-", reasonDelete: "-" },
    { id: 2, project: "Project Beta", item: "Steel", quantity: "20 rods", action: "Used", reasonEdit: "-", reasonDelete: "-" },
    { id: 3, project: "Project Gamma", item: "Bricks", quantity: "1000 pcs", action: "Received", reasonEdit: "-", reasonDelete: "-" },
    { id: 4, project: "Project Alpha", item: "Sand", quantity: "5 trucks", action: "Used", reasonEdit: "-", reasonDelete: "-" },
    { id: 5, project: "Project Beta", item: "Gravel", quantity: "3 trucks", action: "Received", reasonEdit: "-", reasonDelete: "-" },
  ],
  Stock: [
    { id: 1, project: "Project Alpha", date: "2025-04-10", manager: "Rohit Sharma", item: "Cement", open: 120, in: 50, out: 30, close: 140, actions: "-" },
    { id: 2, project: "Project Gamma", date: "2025-04-12", manager: "Amit Kumar", item: "Steel", open: 80, in: 20, out: 15, close: 85, actions: "-" },
    { id: 3, project: "Project Beta", date: "2025-04-11", manager: "Priya Verma", item: "Bricks", open: 500, in: 200, out: 150, close: 550, actions: "-" },
    { id: 4, project: "Project Alpha", date: "2025-04-13", manager: "Rohit Sharma", item: "Sand", open: 300, in: 100, out: 80, close: 320, actions: "-" },
    { id: 5, project: "Project Gamma", date: "2025-04-14", manager: "Amit Kumar", item: "Gravel", open: 220, in: 60, out: 40, close: 240, actions: "-" },
  ],
  Managers: [
    { id: 1, project: "Project Alpha", date: "2025-04-10", manager: "Rohit Sharma", description: "Daily site progress reviewed and approved.", actions: "-" },
    { id: 2, project: "Project Beta", date: "2025-04-11", manager: "Priya Verma", description: "Material delay reported by supplier.", actions: "-" },
    { id: 3, project: "Project Gamma", date: "2025-04-12", manager: "Amit Kumar", description: "Machinery breakdown resolved by noon.", actions: "-" },
    { id: 4, project: "Project Alpha", date: "2025-04-13", manager: "Rohit Sharma", description: "Concrete pour completed for slab section B.", actions: "-" },
    { id: 5, project: "Project Beta", date: "2025-04-14", manager: "Priya Verma", description: "Additional labour requested for finishing work.", actions: "-" },
  ],
  Vendors: vendorsRows,
};

const cloneColumns = (tab) => defaultColumnsMap[tab].map((col) => ({ ...col }));

const createColumnsState = () => ({
  Labour: cloneColumns("Labour"),
  Machinery: cloneColumns("Machinery"),
  Materials: cloneColumns("Materials"),
});

const createSortState = () => ({
  Labour: { key: "", direction: "" },
  Machinery: { key: "", direction: "" },
  Materials: { key: "", direction: "" },
  Stock: { key: "", direction: "" },
  Managers: { key: "", direction: "" },
  Vendors: { key: "", direction: "" },
});

const createFilterState = () => ({
  Labour: { column: "date", operator: "contains", value: "" },
  Machinery: { column: "date", operator: "contains", value: "" },
  Materials: { column: "date", operator: "contains", value: "" },
  Stock: { column: "date", operator: "contains", value: "" },
  Managers: { column: "date", operator: "contains", value: "" },
  Vendors: { column: "name", operator: "contains", value: "" },
});

const createShowFilterRows = () => ({
  Labour: false,
  Machinery: false,
  Materials: false,
  Stock: false,
  Managers: false,
  Vendors: false,
});

const createManageSearchState = () => ({
  Labour: "",
  Machinery: "",
  Materials: "",
  Stock: "",
  Managers: "",
  Vendors: "",
});

const getStoredProjects = () => {
  const saved = localStorage.getItem("projectsData");
  try {
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export default function Reports() {
  const [projectList, setProjectList] = useState(getStoredProjects);

  const [project, setProject] = useState(() => {
    const projects = getStoredProjects();
    return projects.length > 0 ? projects[0].name : "";
  });

  const [fromDate, setFromDate] = useState("");
  const [activeTab, setActiveTab] = useState("Labour");

  const [columnsByTab, setColumnsByTab] = useState(createColumnsState);
  const [sortByTab, _setSortByTab] = useState(createSortState);
  const [filterByTab, setFilterByTab] = useState(createFilterState);
  const [showFilterRowByTab, setShowFilterRowByTab] = useState(createShowFilterRows);
  const [manageSearchByTab, setManageSearchByTab] = useState(createManageSearchState);

  const [_headerMenuOpen, setHeaderMenuOpen] = useState(false);
  const [selectedColumnKey, setSelectedColumnKey] = useState("");
  const [showManageColumns, setShowManageColumns] = useState(false);

  const headerMenuRef = useRef(null);
  const manageColumnsRef = useRef(null);

  const isVendorsTab = activeTab === "Vendors";

  useEffect(() => {
    const latestProjects = getStoredProjects();
    setProjectList(latestProjects);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (headerMenuRef.current && !headerMenuRef.current.contains(event.target)) {
        setHeaderMenuOpen(false);
      }
      if (manageColumnsRef.current && !manageColumnsRef.current.contains(event.target)) {
        setShowManageColumns(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const rows = initialRowsMap[activeTab];
  const columns = columnsByTab[activeTab];
  const visibleColumns = columns ? columns.filter((col) => col.visible) : [];
  const sortConfig = sortByTab[activeTab];
  const filterState = filterByTab[activeTab];
  const showFilterRow = showFilterRowByTab[activeTab];
  const manageSearch = manageSearchByTab[activeTab];

  const searchedColumns = columns
    ? columns.filter((col) =>
        col.label.toLowerCase().includes(manageSearch.toLowerCase())
      )
    : [];

  const filteredRows = useMemo(() => {
    let data = [...(rows || [])];

    if (!isVendorsTab) {
      data = data.filter((row) => {
        const projectMatch = project ? row.project === project : true;
        const fromMatch = fromDate ? row.date >= fromDate : true;
        return projectMatch && fromMatch;
      });
    }

    if (!isVendorsTab && showFilterRow && filterState.value.trim()) {
      data = data.filter((row) => {
        const rowValue = String(row[filterState.column] ?? "").toLowerCase();
        const filterValue = filterState.value.toLowerCase();
        switch (filterState.operator) {
          case "contains": return rowValue.includes(filterValue);
          case "does not contain": return !rowValue.includes(filterValue);
          case "equals": return rowValue === filterValue;
          case "does not equal": return rowValue !== filterValue;
          case "starts with": return rowValue.startsWith(filterValue);
          case "ends with": return rowValue.endsWith(filterValue);
          case "is empty": return rowValue.trim() === "";
          case "is not empty": return rowValue.trim() !== "";
          default: return true;
        }
      });
    }

    if (!isVendorsTab && sortConfig.key && sortConfig.direction) {
      data = [...data].sort((a, b) => {
        const aVal = String(a[sortConfig.key] ?? "").toLowerCase();
        const bVal = String(b[sortConfig.key] ?? "").toLowerCase();
        return sortConfig.direction === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      });
    }

    return data;
  }, [rows, isVendorsTab, project, fromDate, showFilterRow, filterState, sortConfig]);

  const toggleColumn = (key) => {
    setColumnsByTab((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      ),
    }));
  };

  const toggleAllColumns = () => {
    const allVisible = columns.every((col) => col.visible);
    setColumnsByTab((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].map((col) => ({ ...col, visible: !allVisible })),
    }));
  };

  const resetColumns = () => {
    setColumnsByTab((prev) => ({
      ...prev,
      [activeTab]: cloneColumns(activeTab),
    }));
    setManageSearchByTab((prev) => ({ ...prev, [activeTab]: "" }));
  };

  const _openColumnMenu = (key) => {
    if (isVendorsTab) return;
    setSelectedColumnKey(key);
    setFilterByTab((prev) => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], column: key },
    }));
    setHeaderMenuOpen((prev) => (selectedColumnKey === key ? !prev : true));
  };

  const updateFilterState = (field, value) => {
    setFilterByTab((prev) => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], [field]: value },
    }));
  };

  const renderTable = () => {
    return (
      // ✅ FIX 1: Horizontal scroll wrapper — table scrolls, page doesn't break
      <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <table className="w-full border-collapse text-sm" style={{ minWidth: `${visibleColumns.length * 120}px` }}>
          <thead>
            <tr className="bg-secondary/50">
              {visibleColumns.map((col) => (
                <th
                  key={col.key}
                  className="px-3 py-2.5 font-semibold text-foreground whitespace-nowrap border-b border-border border-r border-border last:border-r-0 text-center"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {!isVendorsTab && showFilterRow && (
              <tr className="border-b border-border">
                {/* ✅ FIX 2: Filter row scrolls inside table properly */}
                <td colSpan={visibleColumns.length} className="border-b border-border px-3 py-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setShowFilterRowByTab((prev) => ({ ...prev, [activeTab]: false }))
                      }
                      className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-secondary transition flex-shrink-0"
                    >
                      <X className="w-5 h-5 text-muted-foreground" />
                    </button>

                    <div className="relative min-w-[140px] flex-1">
                      <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground z-10">
                        Columns
                      </label>
                      <select
                        value={filterState.column}
                        onChange={(e) => updateFilterState("column", e.target.value)}
                        className="w-full h-11 rounded-2xl border border-border bg-background px-4 pr-10 appearance-none"
                      >
                        {columns.map((col) => (
                          <option key={col.key} value={col.key}>{col.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>

                    <div className="relative min-w-[140px] flex-1">
                      <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground z-10">
                        Operator
                      </label>
                      <select
                        value={filterState.operator}
                        onChange={(e) => updateFilterState("operator", e.target.value)}
                        className="w-full h-11 rounded-2xl border border-border bg-background px-4 pr-10 appearance-none"
                      >
                        <option value="contains">contains</option>
                        <option value="does not contain">does not contain</option>
                        <option value="equals">equals</option>
                        <option value="does not equal">does not equal</option>
                        <option value="starts with">starts with</option>
                        <option value="ends with">ends with</option>
                        <option value="is empty">is empty</option>
                        <option value="is not empty">is not empty</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>

                    <div className="relative min-w-[140px] flex-1">
                      <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground z-10">
                        Value
                      </label>
                      <input
                        type="text"
                        value={filterState.value}
                        onChange={(e) => updateFilterState("value", e.target.value)}
                        placeholder="Filter value"
                        className="w-full h-11 rounded-2xl border border-border bg-background px-4 text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                  </div>
                </td>
              </tr>
            )}

            {filteredRows.length > 0 ? (
              filteredRows.map((row) => (
                <tr key={row.id} className="hover:bg-secondary/30 transition-colors">
                  {visibleColumns.map((col) => (
                    <td
                      key={col.key}
                      className="px-4 py-3 whitespace-nowrap border-b border-border border-r border-border last:border-r-0 text-center"
                    >
                      {row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={visibleColumns.length}
                  className="h-[220px] text-center align-middle text-foreground"
                >
                  No rows found for this project
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <p className="text-sm md:text-[15px] leading-6 text-muted-foreground">
          Filter manager submissions by project and date. Edit or delete rows as needed.
        </p>

        {/* ✅ FIX 3: Filter card — stacks properly on mobile */}
        <div className="rounded-[28px] border border-border bg-card p-4 md:p-5 shadow-sm">
  <div className="flex flex-col lg:flex-row lg:items-center gap-4">

    {/* Project */}
    <div className="relative min-w-[240px]">
      <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground z-10">
        Project
      </label>
      <select
        value={project}
        onChange={(e) => setProject(e.target.value)}
        className="w-full h-11 rounded-2xl border border-border bg-background px-4 pr-10 appearance-none"
      >
        <option value="">All Projects</option>
        {projectList.map((p) => (
          <option key={p.id} value={p.name}>{p.name}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
    </div>

    {/* Date + Clear */}
    <div className="flex items-center gap-3">
      <div className="relative min-w-[185px]">
        <label className="absolute left-4 -top-2.5 bg-card px-1 text-xs text-muted-foreground z-10">
          Date
        </label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="w-full h-11 rounded-2xl border border-border bg-background px-4"
        />
      </div>
      <button
        type="button"
        onClick={() => setFromDate("")}
        className="text-sm font-semibold text-foreground hover:text-primary flex-shrink-0"
      >
        Clear
      </button>
    </div>

  </div>
</div>
        <div className="bg-card rounded-[28px] border border-border overflow-visible relative">

          {/* ✅ FIX 4: Tabs — evenly spaced, no cut-off, wraps on small screens */}
          <div className="border-b border-border px-2 py-2">
           <div className="flex items-center justify-center gap-4 sm:gap-20 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
  {tabs.map((tab) => (
    <button
      key={tab}
      onClick={() => setActiveTab(tab)}
      className={`flex-shrink-0 px-5 py-2 text-sm font-semibold rounded-lg transition whitespace-nowrap ${
        activeTab === tab
          ? "bg-primary text-white"
          : "text-muted-foreground hover:bg-muted"
      }`}
    >
      {tab}
    </button>
  ))}
</div>
          </div>

          <div className="p-3 md:p-4">
            <div className="border border-border rounded-xl overflow-hidden">
              {renderTable()}
            </div>
          </div>

          {/* Manage Columns Panel */}
          {!isVendorsTab && showManageColumns && (
            <div
              ref={manageColumnsRef}
              // ✅ FIX 5: Manage columns panel — responsive position on mobile
              className="absolute left-3 right-3 md:left-6 md:right-auto md:w-[335px] top-[126px] rounded-2xl border border-border bg-card shadow-xl z-30 overflow-hidden"
            >
              <div className="p-4 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    value={manageSearch}
                    onChange={(e) =>
                      setManageSearchByTab((prev) => ({ ...prev, [activeTab]: e.target.value }))
                    }
                    type="text"
                    placeholder="Search"
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-background"
                  />
                </div>
              </div>

              <div className="p-4 space-y-4 max-h-[320px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {searchedColumns.map((col) => (
                  <button
                    key={col.key}
                    type="button"
                    onClick={() => toggleColumn(col.key)}
                    className="w-full flex items-center gap-3 text-left"
                  >
                    <span
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition flex-shrink-0 ${
                        col.visible
                          ? "bg-primary border-primary text-primary-foreground"
                          : "bg-background border-border text-transparent"
                      }`}
                    >
                      {col.visible && <Check className="w-4 h-4" />}
                    </span>
                    <span className="text-foreground">{col.label}</span>
                  </button>
                ))}
              </div>

              <div className="border-t border-border p-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={toggleAllColumns}
                  className="flex items-center gap-3 text-foreground"
                >
                  <span className="w-5 h-5 rounded-md bg-primary text-primary-foreground flex items-center justify-center border border-primary flex-shrink-0">
                    <Check className="w-4 h-4" />
                  </span>
                  <span>Show/Hide All</span>
                </button>
                <button
                  type="button"
                  onClick={resetColumns}
                  className="text-muted-foreground hover:text-foreground transition"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}