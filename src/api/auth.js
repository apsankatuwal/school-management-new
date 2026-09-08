import api from "./axios";

export const authService = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (details) => api.post("/auth/register", details),
  profile: () => api.get("/auth/profile"),
};
