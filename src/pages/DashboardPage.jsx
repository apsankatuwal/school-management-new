import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { dashboardService } from "../api/resources";
import { resources } from "../config/resources";
import { userName } from "../utils/formatters";
import Overview from "../components/dashboard/Overview";
import ResourcePage from "../components/dashboard/ResourcePage";

const defaultSectionFor = (role) => {
  if (role === "admin") return "overview";
  if (role === "teacher") return "attendance";
  return "profile";
};

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [active, setActive] = useState(() => defaultSectionFor(user.role));
  const [menuOpen, setMenuOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState({});

  const visibleResources = Object.entries(resources).filter(([, resource]) =>
    resource.roles.includes(user.role),
  );

  const selectSection = (id) => {
    if (resources[id] && !resources[id].roles.includes(user.role)) return;
    setActive(id);
    setMenuOpen(false);
  };

  useEffect(() => {
    if (active !== "overview") return;

    dashboardService()
      .then(({ data }) => setDashboardData(data.dashboard))
      .catch((error) =>
        toast.error(error.response?.data?.message || "Could not load dashboard."),
      );
  }, [active]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const currentResource = resources[active];

  return (
    <div className="shell">
      <aside className={menuOpen ? "sidebar open" : "sidebar"}>
        <div className="side-brand">
          <GraduationCap /> CampusFlow{" "}
          <button onClick={() => setMenuOpen(false)}>
            <X />
          </button>
        </div>

        <nav>
          {user.role === "admin" && (
            <button
              className={active === "overview" ? "active" : ""}
              onClick={() => selectSection("overview")}
            >
              <LayoutDashboard size={19} />
              Overview
            </button>
          )}

          {visibleResources.map(([id, resource]) => {
            const Icon = resource.icon;
            return (
              <button
                key={id}
                className={active === id ? "active" : ""}
                onClick={() => selectSection(id)}
              >
                <Icon size={19} />
                {resource.label}
              </button>
            );
          })}
        </nav>

        <div className="account">
          <div className="avatar">{user.firstName?.[0] || "U"}</div>
          <div>
            <b>{userName(user)}</b>
            <small>{user.role}</small>
          </div>
          <button onClick={handleLogout}>
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      <main>
        <header>
          <button className="menu" onClick={() => setMenuOpen(true)}>
            <Menu />
          </button>
          <div>
            <span className="eyebrow">SCHOOL MANAGEMENT</span>
            <h1>
              {active === "overview"
                ? `Welcome, ${user.firstName}`
                : currentResource?.label || "Your profile"}
            </h1>
          </div>
        </header>

        {active === "overview" ? (
          <Overview data={dashboardData} choose={selectSection} />
        ) : currentResource ? (
          <ResourcePage config={currentResource} role={user.role} />
        ) : (
          <div className="content">
            <div className="panel">
              <h2>{userName(user)}</h2>
              <p>{user.email}</p>
              <p className="profile-id">
                <span>MongoDB user ID</span>
                <code>{user.id || user._id || "Unavailable"}</code>
              </p>
              <p>
                The backend currently provides no student portal resource
                endpoints.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}