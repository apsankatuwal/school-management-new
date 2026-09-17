import { useEffect, useState } from "react";
import {
  CalendarCheck,
  ClipboardCheck,
  CreditCard,
  GraduationCap,
} from "lucide-react";
import { toast } from "sonner";
import { studentPortalService } from "../../api/studentPortal";
import { date, itemLabel } from "../../utils/formatters";

export default function StudentPortal() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [attendance, setAttendance] = useState({ attendance: [], summary: null });
  const [results, setResults] = useState([]);
  const [fees, setFees] = useState({ fees: [], summary: null });

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const [profileRes, attendanceRes, resultsRes, feesRes] = await Promise.all([
          studentPortalService.profile(),
          studentPortalService.attendance(),
          studentPortalService.results(),
          studentPortalService.fees(),
        ]);

        if (!mounted) return;

        setProfile(profileRes.data.student);
        setAttendance({
          attendance: attendanceRes.data.attendance,
          summary: attendanceRes.data.summary,
        });
        setResults(resultsRes.data.results);
        setFees({ fees: feesRes.data.fees, summary: feesRes.data.summary });
      } catch (error) {
        toast.error(error.response?.data?.message || "Could not load your portal.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <div className="content">Loading your portal…</div>;
  }

  if (!profile) {
    return (
      <div className="content">
        <div className="panel">
          <h2>No student profile found</h2>
          <p>Ask your admin to link your account to a student record.</p>
        </div>
      </div>
    );
  }

  const summary = attendance.summary || {
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    percentage: 0,
  };
  const feeSummary = fees.summary || { totalPaid: 0, totalPending: 0 };

  return (
    <div className="content">
      <div className="panel">
        <div className="panel-title">
          <div>
            <span className="eyebrow">PROFILE</span>
            <h3>
              {profile.user?.firstName} {profile.user?.lastName}
            </h3>
          </div>
        </div>
        <div className="fee-row">
          <div>
            <span>Admission number</span>
            <b>{profile.admissionNumber}</b>
          </div>
          <div>
            <span>Class</span>
            <b>{profile.className} · {profile.section}</b>
          </div>
          <div>
            <span>Roll number</span>
            <b>{profile.rollNumber}</b>
          </div>
          <div>
            <span>Guardian</span>
            <b>{profile.guardianName}</b>
          </div>
        </div>
      </div>

      <div className="stats">
        <div className="stat">
          <div className="stat-icon indigo">
            <CalendarCheck size={21} />
          </div>
          <span>Attendance</span>
          <strong>{summary.percentage}%</strong>
          <em>
            {summary.present} present / {summary.total} classes
          </em>
        </div>

        <div className="stat">
          <div className="stat-icon orange">
            <ClipboardCheck size={21} />
          </div>
          <span>Results recorded</span>
          <strong>{results.length}</strong>
        </div>

        <div className="stat">
          <div className="stat-icon cyan">
            <CreditCard size={21} />
          </div>
          <span>Fees paid</span>
          <strong>Rs. {Number(feeSummary.totalPaid).toLocaleString()}</strong>
        </div>

        <div className="stat">
          <div className="stat-icon pink">
            <GraduationCap size={21} />
          </div>
          <span>Fees pending</span>
          <strong>Rs. {Number(feeSummary.totalPending).toLocaleString()}</strong>
        </div>
      </div>

      <div className="table-card">
        <div className="table-head">
          <h2>My results</h2>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Exam</th>
                <th>Subject</th>
                <th>Marks</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {results.length ? (
                results.map((r) => (
                  <tr key={r._id}>
                    <td>{itemLabel(r.exam)}</td>
                    <td>{itemLabel(r.subject)}</td>
                    <td>
                      {r.obtainedMarks} / {r.exam?.totalMarks ?? "—"}
                    </td>
                    <td>{r.grade || "—"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="empty" colSpan="4">
                    No results yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="table-card">
        <div className="table-head">
          <h2>My attendance</h2>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Subject</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.attendance.length ? (
                attendance.attendance.map((a) => (
                  <tr key={a._id}>
                    <td>{date(a.date)}</td>
                    <td>{itemLabel(a.subject)}</td>
                    <td>{a.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="empty" colSpan="3">
                    No attendance recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="table-card">
        <div className="table-head">
          <h2>My fees</h2>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Amount</th>
                <th>Due date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {fees.fees.length ? (
                fees.fees.map((f) => (
                  <tr key={f._id}>
                    <td>Rs. {Number(f.amount).toLocaleString()}</td>
                    <td>{date(f.dueDate)}</td>
                    <td>{f.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="empty" colSpan="3">
                    No fee records yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}