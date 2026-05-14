import { createHashRouter, Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Projects from "../pages/Projects";
import Users from "../pages/Users";
import Accounts from "../pages/Accounts";
import AccountsAllocationView from "../pages/AccountsAllocationView";
import Expenses from "../pages/Expenses";
import Labour from "../pages/Labour";
import LabourDetails from "../pages/LabourDetails";
import Vendor from "../pages/Vendor";
import Items from "../pages/Items";
import Stock from "../pages/Stock";
import StockDetails from "../pages/StockDetails";
import Materials from "../pages/Materials";
import MaterialDetails from "../pages/MaterialDetails";
import Machinery from "../pages/Machinery";
import MachineryDetails from "../pages/MachineryDetails";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import Reports from "../pages/Reports";
import DailyReport from "../pages/DailyReport";
import Register from "../pages/Register";

export const router = createHashRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/register",
    element: (
      <GuestRoute>
        <Register />
      </GuestRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <GuestRoute>
        <Login />
      </GuestRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "projects", element: <Projects /> },
      { path: "users", element: <Users /> },
      { path: "accounts", element: <Accounts /> },
      { path: "accounts-allocation-view", element: <AccountsAllocationView /> },
      { path: "expenses", element: <Expenses /> },
      { path: "labour", element: <Labour /> },
      { path: "labour-details", element: <LabourDetails /> },
      { path: "vendors", element: <Vendor /> },
      { path: "items", element: <Items /> },
      { path: "stock", element: <Stock /> },
      { path: "stock-details", element: <StockDetails /> },
      { path: "materials", element: <Materials /> },
      { path: "material-details", element: <MaterialDetails /> },
      { path: "machinery", element: <Machinery /> },
      { path: "machinery-details", element: <MachineryDetails /> },
      { path: "reports", element: <Reports /> },
      { path: "daily-report", element: <DailyReport /> },
      { path: "profile", element: <Profile /> },
      { path: "settings", element: <Settings /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);