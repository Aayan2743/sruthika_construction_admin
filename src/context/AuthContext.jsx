import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useContext,
} from "react";
import { registerAdmin, loginAdmin } from "../api/authApi";

export const AuthContext = createContext(null);

const STORAGE_KEY = "erp_auth";
const TOKEN_KEY = "token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // ✅ Load user from localStorage
  useEffect(() => {
    try {
      const rawUser = localStorage.getItem(STORAGE_KEY);
      if (rawUser) {
        setUser(JSON.parse(rawUser));
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    } finally {
      setReady(true);
    }
  }, []);

  // ✅ REGISTER
  const register = useCallback(async (data) => {
    console.log("REGISTER API CALL 🚀");

    try {
      const res = await registerAdmin(data);

      console.log("REGISTER RESPONSE ✅", res.data);

      const { user, token } = res.data;

      setUser(user);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      localStorage.setItem(TOKEN_KEY, token);

      return true;
    } catch (error) {
      console.error("REGISTER ERROR ❌", error.response?.data);
      return false;
    }
  }, []);

  // ✅ LOGIN (IMPROVED DEBUG)
  const login = useCallback(async (data) => {
    console.log("LOGIN API CALL 🚀", data);

    try {
      const res = await loginAdmin(data);

      console.log("LOGIN RESPONSE ✅", res.data);

      const { user, token } = res.data;

      setUser(user);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      localStorage.setItem(TOKEN_KEY, token);

      return true;
    } catch (error) {
      console.error("LOGIN ERROR ❌", error.response?.data);
      return false;
    }
  }, []);

  // ✅ LOGOUT
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }, []);

  const value = useMemo(() => {
    return {
      user,
      login,
      register,
      logout,
      ready,
      isAuthenticated: !!user,
    };
  }, [user, login, register, logout, ready]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ✅ CUSTOM HOOK
export const useAuth = () => useContext(AuthContext);