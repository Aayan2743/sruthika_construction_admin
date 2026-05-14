import api from "./axios";

/** GET list — tries `/manager/items`, then `/manager/get-items` on 404. */
export const getManagerItems = () =>
  api.get("/manager/items").catch((err) => {
    if (err.response?.status === 404) {
      return api.get("/manager/get-items");
    }
    throw err;
  });

export const addManagerItem = (payload) =>
  api.post("/manager/add-items", payload);

export const updateManagerItem = (id, payload) =>
  api.post(`/manager/update-items/${id}`, payload);

export const deleteManagerItem = (id) =>
  api.delete(`/manager/items/${id}`);
