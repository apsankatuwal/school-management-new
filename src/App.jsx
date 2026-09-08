import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import "./App.css";
import "./dashboard.css";
export default function App(){return <BrowserRouter><AuthProvider><Routes><Route path="/login" element={<AuthPage/>}/><Route element={<ProtectedRoute/>}><Route path="/dashboard" element={<DashboardPage/>}/></Route><Route path="*" element={<Navigate to="/dashboard" replace/>}/></Routes><Toaster richColors position="top-right"/></AuthProvider></BrowserRouter>}
