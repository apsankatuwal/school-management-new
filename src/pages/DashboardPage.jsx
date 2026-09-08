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
export default function DashboardPage() {
  const { user, logout } = useAuth(),
    go = useNavigate(),
    [active, setActive] = useState(
      user.role === "admin"
        ? "overview"
        : user.role === "teacher"
          ? "attendance"
          : "profile",
    ),
    [menu, setMenu] = useState(false),
    [data, setData] = useState({});
  const visible = Object.entries(resources).filter(([, x]) =>
      x.roles.includes(user.role),
    ),
    choose = (id) => {
      if (resources[id] && !resources[id].roles.includes(user.role)) return;
      setActive(id);
      setMenu(false);
    };
  useEffect(() => {
    if (active === "overview")
      dashboardService()
        .then(({ data }) => setData(data.dashboard))
        .catch((e) =>
          toast.error(e.response?.data?.message || "Could not load dashboard."),
        );
  }, [active]);
  const current = resources[active];
  return (
    <div className="shell">
      <aside className={menu ? "sidebar open" : "sidebar"}>
        <div className="side-brand">
          <GraduationCap /> CampusFlow{" "}
          <button onClick={() => setMenu(false)}>
            <X />
          </button>
        </div>
        <nav>
          {user.role === "admin" && (
            <button
              className={active === "overview" ? "active" : ""}
              onClick={() => choose("overview")}
            >
              <LayoutDashboard size={19} />
              Overview
            </button>
          )}
          {visible.map(([id, x]) => {
            const I = x.icon;
            return (
              <button
                key={id}
                className={active === id ? "active" : ""}
                onClick={() => choose(id)}
              >
                <I size={19} />
                {x.label}
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
          <button
            onClick={() => {
              logout();
              go("/login", { replace: true });
            }}
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>
      <main>
        <header>
          <button className="menu" onClick={() => setMenu(true)}>
            <Menu />
          </button>
          <div>
            <span className="eyebrow">SCHOOL MANAGEMENT</span>
            <h1>
              {active === "overview"
                ? `Welcome, ${user.firstName}`
                : current?.label || "Your profile"}
            </h1>
          </div>
        </header>
        {active === "overview" ? (
          <Overview data={data} choose={choose} />
        ) : current ? (
          <ResourcePage config={current} role={user.role} />
        ) : (
          <div className="content">
            <div className="panel">
              <h2>{userName(user)}</h2>
              <p>{user.email}</p>
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
