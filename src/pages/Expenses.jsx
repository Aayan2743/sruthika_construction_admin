// src/pages/Expenses.jsx
import { useMemo, useState, useEffect} from "react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  MoreHorizontal,
  DollarSign,
  Wallet,
  Landmark,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

const categoryDataMap = {
  labour: [
    {
      id: 1,
      date: "2025-04-10",
      name: "Ramesh",
      age: "32",
      gender: "Male",
      partyName: "Sharma Labour Group",
      amount: 1200,
    },
    {
      id: 2,
      date: "2025-04-11",
      name: "Sita",
      age: "28",
      gender: "Female",
      partyName: "Sharma Labour Group",
      amount: 950,
    },
    {
      id: 3,
      date: "2025-04-12",
      name: "Mahesh",
      age: "35",
      gender: "Male",
      partyName: "Verma Labour Team",
      amount: 1400,
    },
  ],
  vendor: [
    {
      id: 1,
      date: "2025-04-10",
      vendorName: "ABC Labour Contractors",
      vendorType: "Labour Vendor",
      contact: "9000000001",
      amount: 5000,
    },
    {
      id: 2,
      date: "2025-04-11",
      vendorName: "XYZ Equipment",
      vendorType: "Machinery Vendor",
      contact: "9000000002",
      amount: 7000,
    },
    {
      id: 3,
      date: "2025-04-12",
      vendorName: "BuildMart Supplies",
      vendorType: "Material Vendor",
      contact: "9000000003",
      amount: 4500,
    },
  ],
  machinery: [
    {
      id: 1,
      date: "2025-04-09",
      machineName: "Excavator",
      operator: "Ravi Kumar",
      hours: "8",
      amount: 8000,
    },
    {
      id: 2,
      date: "2025-04-10",
      machineName: "Concrete Mixer",
      operator: "Sanjay",
      hours: "6",
      amount: 3500,
    },
    {
      id: 3,
      date: "2025-04-11",
      machineName: "Crane",
      operator: "Amit",
      hours: "5",
      amount: 6000,
    },
  ],
  material: [
    {
      id: 1,
      date: "2025-04-08",
      materialName: "Cement",
      quantity: "120 bags",
      supplier: "BuildMart Supplies",
      amount: 18000,
    },
    {
      id: 2,
      date: "2025-04-09",
      materialName: "Sand",
      quantity: "3 loads",
      supplier: "Maa Traders",
      amount: 9000,
    },
    {
      id: 3,
      date: "2025-04-10",
      materialName: "Steel",
      quantity: "2 tons",
      supplier: "Ultra Steel",
      amount: 25000,
    },
  ],
  stock: [
    {
      id: 1,
      date: "2025-04-07",
      itemName: "Steel Rods",
      inQty: "120",
      outQty: "40",
      balance: "80",
      amount: 11000,
    },
    {
      id: 2,
      date: "2025-04-08",
      itemName: "Cement Bags",
      inQty: "200",
      outQty: "75",
      balance: "125",
      amount: 14000,
    },
    {
      id: 3,
      date: "2025-04-09",
      itemName: "Bricks",
      inQty: "1000",
      outQty: "300",
      balance: "700",
      amount: 9000,
    },
  ],
};

const categoryColumnsMap = {
  labour: [
    { key: "date", label: "Date" },
    { key: "name", label: "Name" },
    { key: "age", label: "Age" },
    { key: "gender", label: "Gender" },
    { key: "partyName", label: "Party Name" },
    { key: "amount", label: "Amount" },
  ],
  vendor: [
    { key: "date", label: "Date" },
    { key: "vendorName", label: "Vendor Name" },
    { key: "vendorType", label: "Vendor Type" },
    { key: "contact", label: "Contact" },
    { key: "amount", label: "Amount" },
  ],
  machinery: [
    { key: "date", label: "Date" },
    { key: "machineName", label: "Machine Name" },
    { key: "operator", label: "Operator" },
    { key: "hours", label: "Hours" },
    { key: "amount", label: "Amount" },
  ],
  material: [
    { key: "date", label: "Date" },
    { key: "materialName", label: "Material Name" },
    { key: "quantity", label: "Quantity" },
    { key: "supplier", label: "Supplier" },
    { key: "amount", label: "Amount" },
  ],
  stock: [
    { key: "date", label: "Date" },
    { key: "itemName", label: "Item Name" },
    { key: "inQty", label: "In" },
    { key: "outQty", label: "Out" },
    { key: "balance", label: "Balance" },
    { key: "amount", label: "Amount" },
  ],
};

// 👇 NAYA SUMMARY CARD COMPONENT (Dashboard ke design jaisa)
function SummaryCard({ title, value, icon, delay = 0, bgClass, iconClass }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -4, scale: 1.01 }}
      className={`rounded-xl p-5 shadow-sm border border-transparent dark:border-white/5 h-full ${bgClass}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-full bg-white dark:bg-transparent flex items-center justify-center shadow-sm dark:shadow-none">
          <div className={iconClass}>{icon}</div>
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
          ₹{value.toLocaleString()}
        </h3>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </p>
      </div>
    </motion.div>
  );
}

export default function Expenses() {
  const location = useLocation();
  const person = location.state?.person;

  const [category, setCategory] = useState("labour");
  const [date, setDate] = useState("");

  const allRows = categoryDataMap[category] || [];
  const columns = categoryColumnsMap[category] || [];

  const filteredRows = useMemo(() => {
    return allRows.filter((row) => {
      const dateMatch = date ? row.date === date : true;
      return dateMatch;
    });
  }, [allRows, date]);

  const allocatedAmount = Number(person?.amountAllocated || 0);

  const spentAmount = useMemo(() => {
    return filteredRows.reduce((sum, row) => sum + Number(row.amount || 0), 0);
  }, [filteredRows]);

  const balanceAmount = allocatedAmount - spentAmount;

  if (!person) {
    return (
      <AdminLayout
        title="Expenses"
        subtitle="View account expense details."
      >
        <div className="p-6 max-w-[1600px] mx-auto">
          <div className="bg-card rounded-xl border border-border p-6">
            <p className="text-foreground text-lg font-medium">
              No person selected.
            </p>
            <p className="text-muted-foreground mt-2">
              Please go back to Accounts and click View on a row.
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Expenses"
      subtitle={`Expense details for ${person.name}`}
    >
      <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* 👇 CARDS WITH DASHBOARD COLORS */}
          <SummaryCard
            title="Allocated Amount"
            value={allocatedAmount}
            icon={<Landmark className="w-5 h-5" />}
            bgClass="bg-[#EFF6FF] dark:bg-[#0B1727]" 
            iconClass="text-[#3B82F6]"
            delay={0.1}
          />
          <SummaryCard
            title="Spent Amount"
            value={spentAmount}
            icon={<DollarSign className="w-5 h-5" />}
            bgClass="bg-[#F5F3FF] dark:bg-[#131128]" 
            iconClass="text-[#A855F7]"
            delay={0.2}
          />
          <SummaryCard
            title="Balance Amount"
            value={balanceAmount}
            icon={<Wallet className="w-5 h-5" />}
            bgClass="bg-[#F0FDF4] dark:bg-[#0A1A17]" 
            iconClass="text-[#22C55E]"
            delay={0.3}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="xl:col-span-4 bg-card rounded-xl border border-border p-6"
          >
            <h3 className="font-heading font-semibold text-foreground mb-4">
              Account Details
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="text-sm font-medium text-foreground mt-1">
                  {person.name}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Designation</p>
                <p className="text-sm font-medium text-foreground mt-1">
                  {person.designation}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium text-foreground mt-1 break-all">
                  {person.mailId}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="xl:col-span-8 bg-card rounded-xl border border-border p-6"
          >
            <h3 className="font-heading font-semibold text-foreground mb-4">
              Filters
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-xs text-muted-foreground mb-2">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-11 px-4 pr-10 rounded-lg bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none transition"
                  >
                    <option value="labour">labour</option>
                    <option value="vendor">vendor</option>
                    <option value="machinery">machinery</option>
                    <option value="material">material</option>
                    <option value="stock">stock</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <div className="relative">
                <label className="block text-xs text-muted-foreground mb-2">
                  Date
                </label>
                <div className="relative">
                  {/* 👇 EXTRA CALENDAR ICON HATA DIYA HAI */}
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full h-11 px-4 rounded-lg bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition dark:[color-scheme:dark]"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-card rounded-xl border border-border overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-border">
            <h3 className="font-heading font-semibold text-foreground">
              Expense Records
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Showing {filteredRows.length} record
              {filteredRows.length !== 1 ? "s" : ""} for {category}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/40">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className="text-left py-3.5 px-4 font-medium text-muted-foreground whitespace-nowrap"
                    >
                      {col.label}
                    </th>
                  ))}
                  
                </tr>
              </thead>

              <tbody>
                {filteredRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length }
                      className="h-[220px] text-center align-middle text-muted-foreground"
                    >
                      No expense rows
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((row, i) => (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-border last:border-0 hover:bg-secondary/50 transition"
                    >
                      {columns.map((col, index) => (
                        <td
                          key={col.key}
                          className={`py-4 px-4 whitespace-nowrap ${
                            col.key === "amount"
                              ? "text-foreground font-semibold"
                              : index === 1
                              ? "font-medium text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {col.key === "amount"
                            ? `₹${Number(row[col.key] || 0).toLocaleString()}`
                            : row[col.key]}
                        </td>
                      ))}

                      
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}