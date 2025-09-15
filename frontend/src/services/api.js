// src/services/api.js
import axios from 'axios';

// Use VITE_API_URL from .env
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Example axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});


// Projects API
export const projectsAPI = {
  getAll: () => api.get('/projects'),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  addPhase: (id, data) => api.post(`/projects/${id}/phases`, data),
  updatePhase: (projectId, phaseId, data) => api.put(`/projects/${projectId}/phases/${phaseId}`, data),
  assignEngineer: (projectId, phaseId, data) => api.post(`/projects/${projectId}/phases/${phaseId}/assign-engineer`, data),
};

// Engineers API
export const engineersAPI = {
  getAll: () => api.get('/engineers'),
  getById: (id) => api.get(`/engineers/${id}`),
  create: (data) => api.post('/engineers', data),
  update: (id, data) => api.put(`/engineers/${id}`, data),
  delete: (id) => api.delete(`/engineers/${id}`),
};

// Reports API
export const reportsAPI = {
  getByProject: (projectId) => api.get(`/reports/project/${projectId}`),
  getById: (id) => api.get(`/reports/${id}`),
  create: (data) => api.post('/reports', data),
  update: (id, data) => api.put(`/reports/${id}`, data),
};

export default api;