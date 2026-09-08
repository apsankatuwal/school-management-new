/* eslint-disable react-refresh/only-export-components, react-hooks/set-state-in-effect */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { jwtDecode } from "jwt-decode";
import { authService } from "../api/auth";

const AuthContext = createContext(null);
const TOKEN_KEY = "school_management_token";
const USER_KEY = "school_management_user";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
};

const isTokenExpired = (token) => {
  try {
    const { exp } = jwtDecode(token);
    return !exp || exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(getStoredUser);
  const [checking, setChecking] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const saveSession = useCallback((data) => {
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  }, []);

  // Check the stored token against the backend whenever it changes
  useEffect(() => {
    let isMounted = true;

    if (!token || isTokenExpired(token)) {
      logout();
      if (isMounted) setChecking(false);
      return undefined;
    }

    authService
      .profile()
      .then(({ data }) => {
        if (!isMounted) return;
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        setUser(data.user);
      })
      .catch(logout)
      .finally(() => isMounted && setChecking(false));

    return () => {
      isMounted = false;
    };
  }, [token, logout]);

  // api/axios.js fires this event whenever a request comes back 401
  useEffect(() => {
    window.addEventListener("school-management:unauthorized", logout);
    return () =>
      window.removeEventListener("school-management:unauthorized", logout);
  }, [logout]);

  const value = useMemo(
    () => ({
      token,
      user,
      checking,
      authenticated: Boolean(token && user),
      login: saveSession,
      logout,
    }),
    [token, user, checking, saveSession, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};