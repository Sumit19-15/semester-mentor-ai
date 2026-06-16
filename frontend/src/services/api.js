import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Make sure the backend port matches
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    // In a real app, you might store the token in Zustand or localStorage
    const state = useAuthStore.getState();
    const token = state.user?.token || localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle global errors (like 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access (e.g., force logout)
      useAuthStore.getState().logoutLocal();
      // Optionally redirect to login
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
