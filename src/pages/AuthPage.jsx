import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ChevronRight, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { authService } from "../api/auth";
import { useAuth } from "../contexts/AuthContext";

export default function AuthPage() {
  const [form, setForm] = useState({});
  const [busy, setBusy] = useState(false);

  const { login, authenticated, checking } = useAuth();
  const navigate = useNavigate();

  const updateField = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));

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
      const { data } = await authService.login(form);
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

        <h2>Welcome back</h2>
        <p>Sign in to your school workspace.</p>

        <label>
          Email
          <input
            required
            type="email"
            value={form.email || ""}
            onChange={(event) => updateField("email", event.target.value)}
          />
        </label>

        <label>
          Password
          <input
            required
            type="password"
            minLength={6}
            value={form.password || ""}
            onChange={(event) => updateField("password", event.target.value)}
          />
        </label>

        <button className="primary full" disabled={busy}>
          {busy ? "Please wait…" : "Sign in"}
          <ChevronRight size={17} />
        </button>

        <p className="auth-note">
          Don&apos;t have an account? Ask school administration to create one for you.
        </p>
      </form>
    </div>
  );
}