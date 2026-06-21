import { create } from 'zustand';

const storedUserStr = localStorage.getItem('user');
let initialUser = null;
try {
  if (storedUserStr) {
    initialUser = JSON.parse(storedUserStr);
  }
} catch (e) {
  console.error("Error parsing stored user", e);
}

export const useAuthStore = create((set) => ({
  user: initialUser,
  isAuthenticated: !!initialUser,
  login: (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    if (userData.token) {
      localStorage.setItem('token', userData.token);
    }
    set({ user: userData, isAuthenticated: true });
  },
  logoutLocal: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, isAuthenticated: false });
  },
  logout: async () => {
    try {
      const api = (await import('../services/api')).default;
      await api.post('/users/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      set({ user: null, isAuthenticated: false });
    }
  },
}));
