import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor — har request ke saath automatically token attach karo
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('taskforge_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor — agar token expire/invalid ho, user ko login pe bhejo
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('taskforge_token');
      localStorage.removeItem('taskforge_user');
      // Agar already login page pe nahi hain, tabhi redirect karo
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;