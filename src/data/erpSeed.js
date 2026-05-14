/** Initial demo data — persisted to localStorage after first load */

export const seedProjectId = "p-seed-1";
export const seedManagerUserId = "u-seed-1";

export function getDefaultProjects() {
  return [
    {
      id: seedProjectId,
      name: "Project Alpha",
      location: "Hyderabad",
      startDate: "2026-01-15",
      managerId: seedManagerUserId,
      budget: "₹5L",
      status: "Active"
    }
  ];
}

export function getDefaultUsers() {
  return [
    {
      id: seedManagerUserId,
      name: "Site Manager",
      email: "manager@erp.local",
      phone: "",
      role: "manager",
      projectId: seedProjectId,
      status: "Active",
      username: "manager",
      password: "manager123"
    }
  ];
}

export function getDefaultVendors() {
  return [
    {
      id: "v-seed-labour",
      type: "labour",
      name: "ABC Labour Contractors",
      contact: "9000000001",
      notes: "",
      projectId: seedProjectId
    },
    {
      id: "v-seed-mach",
      type: "machinery",
      name: "XYZ Equipment",
      contact: "9000000002",
      notes: "",
      projectId: seedProjectId
    },
    {
      id: "v-seed-mat",
      type: "material",
      name: "BuildMart Supplies",
      contact: "9000000003",
      notes: "",
      projectId: seedProjectId
    }
  ];
}

export function emptyReports() {
  return {
    labour: [],
    machinery: [],
    materials: [],
    stock: [],
    details: [],
    accounts: []
  };
}
