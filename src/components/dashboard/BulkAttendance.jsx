import { useEffect, useState } from "react";
import { CalendarCheck, Check } from "lucide-react";
import { toast } from "sonner";
import { attendanceService } from "../../api/attendance";

const today = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
};

export default function BulkAttendance() {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [date, setDate] = useState(today());
  const [roster, setRoster] = useState([]);
  const [loadingRoster, setLoadingRoster] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    attendanceService
      .options()
      .then(({ data }) => {
        setClasses(data.classes || []);
        setSubjects(data.subjects || []);
      })
      .catch((error) =>
        toast.error(error.response?.data?.message || "Could not load classes/subjects."),
      );
  }, []);

  const subjectsForClass = subjects.filter(
    (s) => !classId || String(s.class?._id || s.class) === String(classId),
  );

  const loadRoster = async () => {
    if (!classId || !subjectId || !date) {
      toast.error("Pick a class, subject, and date first.");
      return;
    }

    setLoadingRoster(true);
    try {
      const { data } = await attendanceService.roster(classId, subjectId, date);
      setRoster(data.roster);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load the class roster.");
      setRoster([]);
    } finally {
      setLoadingRoster(false);
    }
  };

  const setStatus = (studentId, status) => {
    setRoster((current) =>
      current.map((row) => (row.studentId === studentId ? { ...row, status } : row)),
    );
  };

  const markAllPresent = () => {
    setRoster((current) => current.map((row) => ({ ...row, status: "Present" })));
  };

  const save = async () => {
    if (!roster.length) return;

    setSaving(true);
    try {
      const { data } = await attendanceService.submitBulk({
        class: classId,
        subject: subjectId,
        date,
        records: roster.map((row) => ({ student: row.studentId, status: row.status })),
      });
      toast.success(data.message || "Attendance saved.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save attendance.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="content">
      <div className="panel">
        <div className="panel-title">
          <div>
            <span className="eyebrow">ATTENDANCE</span>
            <h3>Take attendance</h3>
          </div>
        </div>

        <div className="form-grid">
          <label>
            Class
            <select
              value={classId}
              onChange={(e) => {
                setClassId(e.target.value);
                setSubjectId("");
                setRoster([]);
              }}
            >
              <option value="">Select class</option>
              {classes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.className} · {c.section}
                </option>
              ))}
            </select>
          </label>

          <label>
            Subject
            <select
              value={subjectId}
              onChange={(e) => {
                setSubjectId(e.target.value);
                setRoster([]);
              }}
              disabled={!classId}
            >
              <option value="">Select subject</option>
              {subjectsForClass.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.subjectName}
                </option>
              ))}
            </select>
          </label>

          <label>
            Date
            <input
              type="date"
              max={today()}
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setRoster([]);
              }}
            />
          </label>
        </div>

        <div className="modal-actions" style={{ justifyContent: "flex-start", marginTop: 12 }}>
          <button type="button" className="primary" onClick={loadRoster} disabled={loadingRoster}>
            <CalendarCheck size={16} /> {loadingRoster ? "Loading…" : "Load class list"}
          </button>
        </div>
      </div>

      {roster.length > 0 && (
        <div className="table-card">
          <div className="table-head">
            <h2>
              {roster.length} student{roster.length === 1 ? "" : "s"}
            </h2>
            <button type="button" className="secondary" onClick={markAllPresent}>
              <Check size={15} /> Mark all present
            </button>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Roll</th>
                  <th>Student</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {roster.map((row) => (
                  <tr key={row.studentId}>
                    <td>{row.rollNumber ?? "—"}</td>
                    <td>
                      {row.name} ({row.admissionNumber})
                    </td>
                    <td>
                      <select value={row.status} onChange={(e) => setStatus(row.studentId, e.target.value)}>
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Late">Late</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="modal-actions" style={{ marginTop: 12 }}>
            <button type="button" className="primary" onClick={save} disabled={saving}>
              {saving ? "Saving…" : "Save attendance"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}