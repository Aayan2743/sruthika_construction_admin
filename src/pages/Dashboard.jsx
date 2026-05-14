import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FolderKanban,
  Shield,
  Users,
  Briefcase,
  Truck,
  Archive,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { getDashboard } from "../api/dashboardApi";

const statsConfig = [
  {
    title: "Projects",
    key: "projects",
    icon: FolderKanban,
    bgClass: "bg-[#EFF6FF] dark:bg-[#0B1727]",
    iconClass: "text-[#3B82F6]",
    delay: 0,
    path: "/dashboard/projects",
  },
  {
    title: "Accounts",
    key: "accounts",
    icon: Shield,
    bgClass: "bg-[#F5F3FF] dark:bg-[#131128]",
    iconClass: "text-[#A855F7]",
    delay: 0.1,
    path: "/dashboard/accounts",
  },
  {
    title: "Users",
    key: "users",
    icon: Users,
    bgClass: "bg-[#F0FDF4] dark:bg-[#0A1A17]",
    iconClass: "text-[#22C55E]",
    delay: 0.2,
    path: "/dashboard/users",
  },
  {
    title: "Labour rows",
    key: "labour_rows",
    icon: Briefcase,
    bgClass: "bg-[#FFFBEB] dark:bg-[#1E1410]",
    iconClass: "text-[#F59E0B]",
    delay: 0.3,
    path: "/dashboard/labour",
  },
  {
    title: "Vendors",
    key: "vendors",
    icon: Truck,
    bgClass: "bg-[#EFF6FF] dark:bg-[#0B1727]",
    iconClass: "text-[#3B82F6]",
    delay: 0.4,
    path: "/dashboard/vendors",
  },
  {
    title: "Stock rows",
    key: "stock_rows",
    icon: Archive,
    bgClass: "bg-[#F5F3FF] dark:bg-[#131128]",
    iconClass: "text-[#A855F7]",
    delay: 0.5,
    path: "/dashboard/stock",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();

  const [cards, setCards] = useState({
    projects: 0,
    accounts: 0,
    users: 0,
    labour_rows: 0,
    vendors: 0,
    stock_rows: 0,
  });

  const [reportingSnapshot, setReportingSnapshot] = useState({
    material_entries: 0,
    machinery_entries: 0,
    labour_entries: 0,
  });

  const [targetAchievement, setTargetAchievement] = useState({
    target: 0,
    achieved: 0,
    percentage: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getDashboard();
      if (data.success) {
        setCards(data.data.cards);
        setReportingSnapshot(data.data.reporting_snapshot);
        setTargetAchievement(data.data.target_vs_achievement);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <AdminLayout>
      <div className="w-full max-w-[1400px] mx-auto px-2 sm:px-0">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <p className="text-sm md:text-[15px] leading-6 text-gray-500 dark:text-gray-400">
              Track your business performance.
            </p>
          </div>

          {error && (
            <p className="text-sm font-medium text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {statsConfig.map((stat) => {
                  const Icon = stat.icon;

                  return (
                    <motion.div
                      key={stat.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: stat.delay }}
                      whileHover={{ y: -4, scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(stat.path)}
                      className={`rounded-xl p-4 sm:p-5 cursor-pointer transition shadow-sm border border-transparent dark:border-white/5 ${stat.bgClass}`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-full bg-white dark:bg-transparent flex items-center justify-center shadow-sm dark:shadow-none">
                          <Icon className={`w-5 h-5 ${stat.iconClass}`} />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xl sm:text-2xl font-heading font-bold text-gray-900 dark:text-white">
                          {cards[stat.key] ?? 0}
                        </p>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          {stat.title}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Reporting Snapshot & Target vs Achievement */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="rounded-xl p-6 bg-white dark:bg-[#0D121F] border border-gray-200 dark:border-white/5 shadow-sm"
                >
                  <h3 className="font-heading font-semibold mb-1 text-gray-900 dark:text-white">
                    Reporting snapshot
                  </h3>
                  <p className="text-sm mb-5 text-gray-500 dark:text-gray-400">
                    Counts for the selected project (daily report entries).
                  </p>

                  <div className="border-t pt-5 space-y-3 border-gray-100 dark:border-white/10">
                    <p className="text-base text-gray-700 dark:text-gray-300 font-medium">
                      Materials entries: {reportingSnapshot.material_entries}
                    </p>
                    <p className="text-base text-gray-700 dark:text-gray-300 font-medium">
                      Machinery entries: {reportingSnapshot.machinery_entries}
                    </p>
                    <p className="text-base text-gray-700 dark:text-gray-300 font-medium">
                      Labour entries: {reportingSnapshot.labour_entries}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="rounded-xl p-6 bg-white dark:bg-[#0D121F] border border-gray-200 dark:border-white/5 shadow-sm"
                >
                  <h3 className="font-heading font-semibold mb-4 text-gray-900 dark:text-white">
                    Target vs Achievement
                  </h3>

                  <div className="border-t pt-5 border-gray-100 dark:border-white/10">
                    <div className="text-6xl font-light leading-none mb-2 text-gray-900 dark:text-white">
                      {targetAchievement.achieved}
                    </div>
                    <p className="text-base mb-8 text-gray-500 dark:text-gray-400">
                      achieved out of {targetAchievement.target}
                    </p>

                    <div className="w-full h-2 rounded-full overflow-hidden bg-gray-100 dark:bg-[#1A2332]">
                      <div
                        className="h-full rounded-full bg-[#3B82F6] transition-all duration-500"
                        style={{ width: `${Math.min(targetAchievement.percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}