import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute() {
  const { authenticated, checking } = useAuth();

  if (checking) {
    return <div className="page-loading">Checking your session…</div>;
  }

  return authenticated ? <Outlet /> : <Navigate to="/login" replace />;
}