import {
  BookOpen,
  CalendarCheck,
  ChevronRight,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
} from "lucide-react";
import { date as formatDate } from "../../utils/formatters";

export default function Overview({ data, choose }) {
  const cards = [
    { label: "Students", value: data.totalStudents, icon: GraduationCap, id: "students", color: "indigo" },
    { label: "Teachers", value: data.totalTeachers, icon: GraduationCap, id: "teachers", color: "orange" },
    { label: "Classes", value: data.totalClasses, icon: LayoutDashboard, id: "classes", color: "cyan" },
    { label: "Subjects", value: data.totalSubjects, icon: BookOpen, id: "subjects", color: "pink" },
  ];

  const attendancePct = data.attendanceThisMonth ?? 0;
  const atRisk = data.studentsAtRisk || [];
  const upcoming = data.upcoming || [];

  return (
    <div className="content">
      <section className="hero-banner">
        <div>
          <span>SCHOOL MANAGEMENT</span>
          <h2>Your school, at a glance.</h2>
          <p>Keep track of people, learning, and operations from one calm workspace.</p>
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

      <section className="overview-grid">
        <div className="panel">
          <div className="panel-title">
            <div>
              <span className="eyebrow">ATTENDANCE</span>
              <h3>This month</h3>
            </div>
            <button onClick={() => choose("attendance")}>
              View attendance <ChevronRight size={15} />
            </button>
          </div>
          <div
            style={{
              background: "#e6e6e6",
              borderRadius: 999,
              height: 10,
              overflow: "hidden",
              margin: "12px 0 8px",
            }}
          >
            <div
              style={{
                width: `${attendancePct}%`,
                background: attendancePct >= 90 ? "#22c55e" : attendancePct >= 75 ? "#f59e0b" : "#ef4444",
                height: "100%",
                borderRadius: 999,
                transition: "width 0.3s ease",
              }}
            />
          </div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 20 }}>{attendancePct}% present</p>
        </div>

        <div className="panel">
          <div className="panel-title">
            <div>
              <span className="eyebrow">AT RISK</span>
              <h3>Below 75% attendance</h3>
            </div>
            <button onClick={() => choose("students")}>
              View students <ChevronRight size={15} />
            </button>
          </div>
          {atRisk.length ? (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Class</th>
                    <th>Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {atRisk.slice(0, 6).map((s) => (
                    <tr key={s.studentId}>
                      <td>{s.name} ({s.admissionNumber})</td>
                      <td>{s.className} · {s.section}</td>
                      <td>{s.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No students currently below 75% attendance.</p>
          )}
        </div>
      </section>

      <section className="table-card">
        <div className="table-head">
          <h2>Upcoming</h2>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Event</th>
                <th>Date</th>
                <th>When</th>
              </tr>
            </thead>
            <tbody>
              {upcoming.length ? (
                upcoming.map((item, i) => (
                  <tr key={i}>
                    <td>{item.type === "exam" ? "📅 Exam" : "📝 Assignment"}</td>
                    <td>{item.label}</td>
                    <td>{formatDate(item.date)}</td>
                    <td>{item.daysAway}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="empty" colSpan="4">Nothing coming up in the next 30 days.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}