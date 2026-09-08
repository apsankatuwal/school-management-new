import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ChevronRight, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { authService } from "../api/auth";
import { useAuth } from "../contexts/AuthContext";
import { human } from "../utils/formatters";
export default function AuthPage() {
  const [reg, setReg] = useState(false),
    [form, setForm] = useState({}),
    [busy, setBusy] = useState(false);
  const { login, authenticated, checking } = useAuth(),
    go = useNavigate(),
    set = (k, v) => setForm((x) => ({ ...x, [k]: v })),
    fields = reg
      ? ["firstName", "lastName", "email", "password", "role"]
      : ["email", "password"];
  if (checking) return <div className="page-loading">Checking your session…</div>;
  if (authenticated) return <Navigate to="/dashboard" replace />;
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { data } = reg
        ? await authService.register(form)
        : await authService.login(form);
      login(data);
      toast.success(data.message);
      go("/dashboard", { replace: true });
    } catch (err) {
      toast.error(
        err.response?.data?.errors?.[0]?.msg ||
          err.response?.data?.message ||
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
      <form className="login-card" onSubmit={submit}>
        <span className="brand-mobile">
          <GraduationCap /> CampusFlow
        </span>
        <h2>{reg ? "Create an account" : "Welcome back"}</h2>
        <p>
          {reg
            ? "Uses the backend’s public registration endpoint."
            : "Sign in to your school workspace."}
        </p>
        {fields.map((f) => (
          <label key={f}>
            {human(f)}
            {f === "role" ? (
              <select
                value={form.role || "student"}
                onChange={(e) => set(f, e.target.value)}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            ) : (
              <input
                required
                minLength={f === "password" ? 6 : undefined}
                type={
                  f === "password"
                    ? "password"
                    : f === "email"
                      ? "email"
                      : "text"
                }
                value={form[f] || ""}
                onChange={(e) => set(f, e.target.value)}
              />
            )}
          </label>
        ))}
        <button className="primary full" disabled={busy}>
          {busy ? "Please wait…" : reg ? "Register" : "Sign in"}
          <ChevronRight size={17} />
        </button>
        <button
          type="button"
          className="auth-switch"
          onClick={() => {
            setReg(!reg);
            setForm({});
          }}
        >
          {reg
            ? "Already have an account? Sign in"
            : "Need an account? Register"}
        </button>
      </form>
    </div>
  );
}
