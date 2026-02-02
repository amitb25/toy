import { create } from 'zustand'

export const useCartStore = create((set) => ({
  items: [],
  addItem: (product) => set((state) => ({ items: [...state.items, product] })),
  removeItem: (productId) => set((state) => ({
    items: state.items.filter((i) => i.id !== productId)
  })),
  clearCart: () => set({ items: [] }),
}))
