// Servicios por recurso de la API REST. Cada función devuelve una promesa con
// el JSON de la respuesta o lanza un ApiError.
import { http, toQuery } from './http';

export const authService = {
  register: (payload) => http.post('/api/auth/register', payload, { auth: false }),
  login: (payload) => http.post('/api/auth/login', payload, { auth: false }),
  me: () => http.get('/api/auth/me'),
};

export const userService = {
  summary: () => http.get('/api/users/me'),
};

export const profileService = {
  get: () => http.get('/api/profiles/me'),
  update: (payload) => http.put('/api/profiles/me', payload),
};

export const projectService = {
  list: (params) => http.get(`/api/projects${toQuery(params)}`),
  get: (id) => http.get(`/api/projects/${id}`),
  create: (payload) => http.post('/api/projects', payload),
  update: (id, payload) => http.patch(`/api/projects/${id}`, payload),
  remove: (id) => http.del(`/api/projects/${id}`),
};

export const taskService = {
  list: (params) => http.get(`/api/tasks${toQuery(params)}`),
  create: (payload) => http.post('/api/tasks', payload),
  update: (id, payload) => http.patch(`/api/tasks/${id}`, payload),
  remove: (id) => http.del(`/api/tasks/${id}`),
};

export const resumeService = {
  list: () => http.get('/api/resumes'),
  create: (formData) => http.post('/api/resumes', formData),
  update: (id, payload) => http.patch(`/api/resumes/${id}`, payload),
  remove: (id) => http.del(`/api/resumes/${id}`),
  download: (id) => http.raw('GET', `/api/resumes/${id}/file`),
};

export const healthService = {
  check: () => http.get('/api/health', { auth: false }),
};
