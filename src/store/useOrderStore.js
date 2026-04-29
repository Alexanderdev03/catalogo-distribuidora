import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useOrderStore = create(
  persist(
    (set, get) => ({
      orders: [],
      
      saveOrder: (cart, total, savings) => {
        const newOrder = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          items: [...cart],
          total,
          savings,
          status: 'Enviado'
        };
        set(state => ({ orders: [newOrder, ...state.orders].slice(0, 20) })); // Guardar últimos 20
      },

      clearHistory: () => set({ orders: [] })
    }),
    {
      name: 'order-storage',
    }
  )
);
