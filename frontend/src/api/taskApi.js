import axiosInstance from './axiosInstance';

export const createTask = (data) => axiosInstance.post('/tasks', data);
export const getAllTasks = (params) => axiosInstance.get('/tasks', { params });
export const getTaskById = (id) => axiosInstance.get(`/tasks/${id}`);
export const updateTask = (id, data) => axiosInstance.put(`/tasks/${id}`, data);
export const updateTaskStatus = (id, status) =>
  axiosInstance.patch(`/tasks/${id}/status`, { status });
export const deleteTask = (id) => axiosInstance.delete(`/tasks/${id}`);

// Task Discussions
export const getTaskDiscussions = (taskId) =>
  axiosInstance.get(`/tasks/${taskId}/discussions`);
export const addDiscussionMessage = (taskId, message) =>
  axiosInstance.post(`/tasks/${taskId}/discussions`, { message });