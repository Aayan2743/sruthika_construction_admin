import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function GuestRoute({ children }) {
  const { user, ready } = useAuth();

  if (!ready) return null;

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}