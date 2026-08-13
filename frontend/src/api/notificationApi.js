import axiosInstance from './axiosInstance';

export const getMyNotifications = (params) => axiosInstance.get('/notifications', { params });
export const markAsRead = (id) => axiosInstance.patch(`/notifications/${id}/read`);
export const markAllAsRead = () => axiosInstance.patch('/notifications/read-all');
export const deleteNotification = (id) => axiosInstance.delete(`/notifications/${id}`);