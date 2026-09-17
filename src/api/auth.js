import api from "./axios";

export const authService = {
  login: (credentials) => api.post("/auth/login", credentials),
  profile: () => api.get("/auth/profile"),
};