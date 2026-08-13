import axiosInstance from './axiosInstance';

export const createUser = (data) => axiosInstance.post('/users', data);
export const getAllUsers = (params) => axiosInstance.get('/users', { params });
export const getUserById = (id) => axiosInstance.get(`/users/${id}`);
export const updateUser = (id, data) => axiosInstance.put(`/users/${id}`, data);
export const toggleUserStatus = (id) => axiosInstance.patch(`/users/${id}/status`);
export const deleteUser = (id) => axiosInstance.delete(`/users/${id}`);