import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (username, password) => {
        // Simulación sencilla: admin / admin123
        if (username === 'admin' && password === 'admin123') {
          set({ isAuthenticated: true, user: { username: 'admin', role: 'admin' } });
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false, user: null })
    }),
    {
      name: 'auth-storage',
    }
  )
);
