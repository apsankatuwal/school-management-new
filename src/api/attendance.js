import api from "./axios";

export const attendanceService = {
  options: () => api.get("/attendance/options"),
  roster: (classId, subjectId, date) =>
    api.get("/attendance/roster", { params: { classId, subjectId, date } }),
  submitBulk: (payload) => api.post("/attendance/bulk", payload),
};