import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  id: string
  name: string
  price: number
  discount: number
  images: string
  quantity?: number
  brand?: { name: string }
}

interface CartStore {
  items: CartItem[]
  addItem: (product: CartItem) => void
  removeItem: (productId: string) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product) => set((state) => ({ items: [...state.items, product] })),
      removeItem: (productId) => set((state) => ({
        items: state.items.filter((i) => i.id !== productId)
      })),
      clearCart: () => set({ items: [] }),
    }),
    { name: 'cart-storage' }
  )
)
