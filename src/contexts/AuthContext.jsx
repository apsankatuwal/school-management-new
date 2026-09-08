/* eslint-disable react-refresh/only-export-components, react-hooks/set-state-in-effect */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { authService } from "../api/auth";

const AuthContext = createContext(null);
const TOKEN_KEY = "school_management_token";
const USER_KEY = "school_management_user";

const storedUser = () => {
  try { return JSON.parse(localStorage.getItem(USER_KEY) || "null"); } catch { return null; }
};
const hasExpired = (token) => {
  try { return !jwtDecode(token).exp || jwtDecode(token).exp * 1000 <= Date.now(); } catch { return true; }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(storedUser);
  const [checking, setChecking] = useState(true);
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null); setUser(null);
  }, []);
  const saveSession = useCallback((data) => {
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setToken(data.token); setUser(data.user);
  }, []);

  useEffect(() => {
    let alive = true;
    if (!token || hasExpired(token)) { logout(); if (alive) setChecking(false); return undefined; }
    authService.profile().then(({ data }) => {
      if (!alive) return;
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      setUser(data.user);
    }).catch(logout).finally(() => alive && setChecking(false));
    return () => { alive = false; };
  }, [token, logout]);

  useEffect(() => {
    window.addEventListener("school-management:unauthorized", logout);
    return () => window.removeEventListener("school-management:unauthorized", logout);
  }, [logout]);

  const value = useMemo(() => ({ token, user, checking, authenticated: Boolean(token && user), login: saveSession, logout }), [token, user, checking, saveSession, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within AuthProvider");
  return value;
};
