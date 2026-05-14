import api from "./axios";

// GET admin dashboard
export const getDashboard = () => api.get("/admin/dashboard");