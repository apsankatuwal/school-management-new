import api from "./axios";

export const dashboardService = () => api.get("/dashboard/admin");

export const resourceService = (path) => ({
  list: (params) => api.get(path, { params }),
  create: (payload) => api.post(path, payload),
  update: (id, payload) => api.put(`${path}/${id}`, payload),
  remove: (id) => api.delete(`${path}/${id}`),
});
