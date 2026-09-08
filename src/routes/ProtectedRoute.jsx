import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
export default function ProtectedRoute(){const{authenticated,checking}=useAuth();return checking?<div className="page-loading">Checking your session…</div>:authenticated?<Outlet/>:<Navigate to="/login" replace/>}
