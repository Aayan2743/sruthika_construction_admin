import api from "./axios";

// GET allocations (with pagination)
export const getAllocations = (params) =>
  api.get("/admin/accounts/get-allocations", { params });

// ADD allocation
export const addAllocation = (data) =>
  api.post("/admin/accounts/allocate", data);

// UPDATE allocation
export const updateAllocation = (id, data) =>
  api.post(`/admin/accounts/update-allocations/${id}`, data);

// DELETE allocation
export const deleteAllocation = (id) =>
  api.delete(`/admin/accounts/delete-allocation/${id}`);

// GET manager expense details (paginated)
export const getManagerExpenseDetails = (id, params) =>
  api.get(`/admin/accounts/manager-expense-details/${id}`, { params });