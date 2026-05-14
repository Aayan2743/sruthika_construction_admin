import api from "./axios";
// GET PROJECTS
export const getProjects = (params) =>
  api.get("/admin/projects/list", { params });

// ADD PROJECT
export const addProject = (data) =>
  api.post("/admin/projects/add", data);

// DELETE PROJECT
export const deleteProjectApi = (id) =>
  api.delete(`/admin/projects/delete/${id}`);

// UPDATE PROJECT
export const updateProjectApi = (id, data) =>
  api.post(`/admin/projects/update/${id}`, data);

// GET SINGLE PROJECT
export const getProjectById = (id) =>
  api.get(`/admin/projects/show/${id}`);

// GET ALL USERS
// export const getUsers = () => {
//   return api.get("/admin/users/list-all-users");
// };

export const createUser = (data) => {
  return api.post("/admin/users/create", data);
};
export const deleteUserApi = (id) => {
  return api.delete(`/admin/users/delete/${id}`);
};
export const getUsers = (params) => {
  return api.get("/admin/users", { params });
};
export const updateUserApi = (id, data) => {
  return api.post(`/admin/users/update/${id}`, data);
};
// GET ALL (no pagination)
export const getVendors = () => {
  return api.get("/admin/vendors/list-all");
};

// GET PAGINATED
export const getVendorsList = (params) => {
  return api.get("/admin/vendors/list", { params });
};

// ADD
export const addVendorApi = (data) => {
  return api.post("/admin/vendors/add", data);
};

// SHOW SINGLE
export const getVendorById = (id) => {
  return api.get(`/admin/vendors/show/${id}`);
};

// UPDATE
export const updateVendorApi = (id, data) => {
  return api.post(`/admin/vendors/update/${id}`, data);
};

// DELETE
export const deleteVendorApi = (id) => {
  return api.delete(`/admin/vendors/delete/${id}`);
};