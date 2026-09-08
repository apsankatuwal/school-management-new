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
    { label: "Students", value: data.totalStudents, icon: GraduationCap, id: "students", color: "indigo" },
    { label: "Teachers", value: data.totalTeachers, icon: GraduationCap, id: "teachers", color: "orange" },
    { label: "Classes", value: data.totalClasses, icon: LayoutDashboard, id: "classes", color: "cyan" },
    { label: "Subjects", value: data.totalSubjects, icon: BookOpen, id: "subjects", color: "pink" },
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
        {cards.map(({ label, value, icon: Icon, id, color }) => (
          <button className="stat" key={label} onClick={() => choose(id)}>
            <div className={`stat-icon ${color}`}>
              <Icon size={21} />
            </div>
            <span>{label}</span>
            <strong>{value ?? 0}</strong>
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