import api from "./axios";

export const getReports = () => {
  return api.get("/manager/labours/reports");
};

export const getLabourWorkReport = (params) =>
  api.get("/admin/operations/labour-work-report", { params });

export const getWorkEditHistory = (workGroupId) =>
  api.get(`/admin/operations/work-edit-history/${workGroupId}`);

export const getStockHistoryReport = (params) =>
  api.get("/admin/operations/stock-history-report", { params });

export const getMaterialEntryHistory = (params) =>
  api.get("/admin/operations/material-entry-history", { params });

export const getEquipmentEntryHistory = (params) =>
  api.get("/admin/operations/equipment-entry-history", { params });