import api from "./axios";

export const studentPortalService = {
  profile: () => api.get("/students/me"),
  attendance: () => api.get("/attendance/me"),
  results: () => api.get("/results/me"),
  fees: () => api.get("/fees/me"),
};