import api from "./axios";

// GET admin profile
export const getProfile = () => api.get("/admin/profile");

// UPDATE admin profile
export const updateProfile = (data) =>
  api.post("/admin/profile/update-admin-profile", data);