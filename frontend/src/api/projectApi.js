import axiosInstance from './axiosInstance';

export const createProject = (data) => axiosInstance.post('/projects', data);
export const getAllProjects = (params) => axiosInstance.get('/projects', { params });
export const getProjectById = (id) => axiosInstance.get(`/projects/${id}`);
export const updateProject = (id, data) => axiosInstance.put(`/projects/${id}`, data);
export const deleteProject = (id) => axiosInstance.delete(`/projects/${id}`);
export const addTeamMember = (projectId, userId) =>
  axiosInstance.post(`/projects/${projectId}/members`, { userId });
export const removeTeamMember = (projectId, userId) =>
  axiosInstance.delete(`/projects/${projectId}/members/${userId}`);