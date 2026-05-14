import api from "./axios";

// REGISTER API
export const registerAdmin = (data) => {
  return api.post("/auth/admin-register", data);
};

// LOGIN API (for next step)
export const loginAdmin = (data) => {
  return api.post("/auth/admin-login", data);
};


