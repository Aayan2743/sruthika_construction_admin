import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AppContext } from "./context";
import {
  emptyReports,
  getDefaultProjects,
  getDefaultUsers,
  getDefaultVendors
} from "../data/erpSeed";

const LS_KEY = "erp_app_state";

function loadPersisted() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (data?.projects && data?.users && data?.vendors && data?.reports) {
        return data;
      }
    }
  } catch {
    /* ignore */
  }
  return null;
}

function getInitialState() {
  const saved = loadPersisted();
  if (saved) {
    return {
      projects: saved.projects,
      users: saved.users,
      vendors: saved.vendors,
      reports: {
        ...emptyReports(),
        ...saved.reports,
        labour: saved.reports.labour || [],
        machinery: saved.reports.machinery || [],
        materials: saved.reports.materials || [],
        stock: saved.reports.stock || [],
        details: saved.reports.details || [],
        accounts: saved.reports.accounts || []
      }
    };
  }
  return {
    projects: getDefaultProjects(),
    users: getDefaultUsers(),
    vendors: getDefaultVendors(),
    reports: emptyReports()
  };
}

export const AppProvider = ({ children }) => {
  const initialRef = useRef(null);
  if (!initialRef.current) {
    initialRef.current = getInitialState();
  }
  const [projects, setProjects] = useState(initialRef.current.projects);
  const [users, setUsers] = useState(initialRef.current.users);
  const [vendors, setVendors] = useState(initialRef.current.vendors);
  const [reports, setReports] = useState(initialRef.current.reports);

  // Legacy arrays used by CrudTable pages — mirror machinery slice for backward compatibility
  const machineryRows = reports.machinery;
  const setMachineryRows = useCallback((updater) => {
    setReports((prev) => {
      const next =
        typeof updater === "function"
          ? updater(prev.machinery)
          : updater;
      return { ...prev, machinery: next };
    });
  }, []);

  const labourRows = reports.labour;
  const setLabourRows = useCallback((updater) => {
    setReports((prev) => {
      const next =
        typeof updater === "function" ? updater(prev.labour) : updater;
      return { ...prev, labour: next };
    });
  }, []);

  const materialsRows = reports.materials;
  const setMaterialsRows = useCallback((updater) => {
    setReports((prev) => {
      const next =
        typeof updater === "function"
          ? updater(prev.materials)
          : updater;
      return { ...prev, materials: next };
    });
  }, []);

  useEffect(() => {
    localStorage.setItem(
      LS_KEY,
      JSON.stringify({ projects, users, vendors, reports })
    );
  }, [projects, users, vendors, reports]);

  const updateReportSection = useCallback((section, updater) => {
    setReports((prev) => ({
      ...prev,
      [section]:
        typeof updater === "function" ? updater(prev[section]) : updater
    }));
  }, []);

  const value = useMemo(
    () => ({
      projects,
      setProjects,
      users,
      setUsers,
      vendors,
      setVendors,
      reports,
      setReports,
      updateReportSection,
      labour: labourRows,
      setLabour: setLabourRows,
      materials: materialsRows,
      setMaterials: setMaterialsRows,
      machinery: machineryRows,
      setMachinery: setMachineryRows
    }),
    [
      projects,
      users,
      vendors,
      reports,
      updateReportSection,
      labourRows,
      setLabourRows,
      materialsRows,
      setMaterialsRows,
      machineryRows,
      setMachineryRows
    ]
  );

  return (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  );
};
