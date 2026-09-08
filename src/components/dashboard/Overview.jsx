import {
  BookOpen,
  CalendarCheck,
  ChevronRight,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
} from "lucide-react";
export default function Overview({ data, choose }) {
  const cards = [
    ["Students", data.totalStudents, GraduationCap, "students", "indigo"],
    ["Teachers", data.totalTeachers, GraduationCap, "teachers", "orange"],
    ["Classes", data.totalClasses, LayoutDashboard, "classes", "cyan"],
    ["Subjects", data.totalSubjects, BookOpen, "subjects", "pink"],
  ];
  return (
    <div className="content">
      <section className="hero-banner">
        <div>
          <span>SCHOOL MANAGEMENT</span>
          <h2>Your school, at a glance.</h2>
          <p>
            Keep track of people, learning, and operations from one calm
            workspace.
          </p>
        </div>
        <CalendarCheck size={120} />
      </section>
      <div className="stats">
        {cards.map(([l, v, I, id, color]) => (
          <button className="stat" key={l} onClick={() => choose(id)}>
            <div className={`stat-icon ${color}`}>
              <I size={21} />
            </div>
            <span>{l}</span>
            <strong>{v ?? 0}</strong>
            <em>
              Manage <ChevronRight size={15} />
            </em>
          </button>
        ))}
      </div>
      <section className="overview-grid">
        <div className="panel">
          <div className="panel-title">
            <div>
              <span className="eyebrow">FINANCE</span>
              <h3>Fee collection</h3>
            </div>
            <button onClick={() => choose("fees")}>
              View fees <ChevronRight size={15} />
            </button>
          </div>
          <div className="fee-row">
            <div>
              <span>Paid fees</span>
              <b>Rs. {Number(data.fees?.paid || 0).toLocaleString()}</b>
            </div>
            <div>
              <span>Pending fees</span>
              <b>Rs. {Number(data.fees?.pending || 0).toLocaleString()}</b>
            </div>
          </div>
        </div>
        <div className="panel quick">
          <span className="eyebrow">QUICK ACTIONS</span>
          <h3>Keep things moving</h3>
          <button onClick={() => choose("attendance")}>
            <CalendarCheck />
            Mark attendance
          </button>
          <button onClick={() => choose("results")}>
            <ClipboardCheck />
            Record results
          </button>
        </div>
      </section>
    </div>
  );
}
