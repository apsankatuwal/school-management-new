import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ChevronRight, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { authService } from "../api/auth";
import { useAuth } from "../contexts/AuthContext";
import { human } from "../utils/formatters";

const LOGIN_FIELDS = ["email", "password"];
const REGISTER_FIELDS = ["firstName", "lastName", "email", "password", "role"];

export default function AuthPage() {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [form, setForm] = useState({});
  const [busy, setBusy] = useState(false);

  const { login, authenticated, checking } = useAuth();
  const navigate = useNavigate();

  const fields = isRegisterMode ? REGISTER_FIELDS : LOGIN_FIELDS;

  const updateField = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));

  const toggleMode = () => {
    setIsRegisterMode((current) => !current);
    setForm({});
  };

  if (checking) {
    return <div className="page-loading">Checking your session…</div>;
  }

  if (authenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);

    try {
      const { data } = isRegisterMode
        ? await authService.register(form)
        : await authService.login(form);

      login(data);
      toast.success(data.message);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(
        error.response?.data?.errors?.[0]?.msg ||
          error.response?.data?.message ||
          "Unable to continue.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-art">
        <div>
          <span className="brand-mark">
            <GraduationCap /> CampusFlow
          </span>
          <h1>Everything your school needs, in one place.</h1>
          <p>Manage academic life with clarity, confidence, and care.</p>
        </div>
      </div>

      <form className="login-card" onSubmit={handleSubmit}>
        <span className="brand-mobile">
          <GraduationCap /> CampusFlow
        </span>

        <h2>{isRegisterMode ? "Create an account" : "Welcome back"}</h2>
        <p>
          {isRegisterMode
            ? "Uses the backend’s public registration endpoint."
            : "Sign in to your school workspace."}
        </p>

        {fields.map((field) => (
          <label key={field}>
            {human(field)}
            {field === "role" ? (
              <select
                value={form.role || "student"}
                onChange={(event) => updateField(field, event.target.value)}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            ) : (
              <input
                required
                minLength={field === "password" ? 6 : undefined}
                type={
                  field === "password"
                    ? "password"
                    : field === "email"
                      ? "email"
                      : "text"
                }
                value={form[field] || ""}
                onChange={(event) => updateField(field, event.target.value)}
              />
            )}
          </label>
        ))}

        <button className="primary full" disabled={busy}>
          {busy ? "Please wait…" : isRegisterMode ? "Register" : "Sign in"}
          <ChevronRight size={17} />
        </button>

        <button type="button" className="auth-switch" onClick={toggleMode}>
          {isRegisterMode
            ? "Already have an account? Sign in"
            : "Need an account? Register"}
        </button>
      </form>
    </div>
  );
}