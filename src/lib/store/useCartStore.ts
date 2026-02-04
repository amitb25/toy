import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  id: string
  name: string
  price: number
  discount: number
  images: string
  quantity: number
  brand?: { name: string }
}

interface CartStore {
  items: CartItem[]
  addItem: (product: Omit<CartItem, 'quantity'>) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  incrementQuantity: (productId: string) => void
  decrementQuantity: (productId: string) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => set((state) => {
        const existingItem = state.items.find((item) => item.id === product.id)

        if (existingItem) {
          // Product exists, increment quantity
          return {
            items: state.items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          }
        }

        // New product, add with quantity 1
        return {
          items: [...state.items, { ...product, quantity: 1 }],
        }
      }),

      removeItem: (productId) => set((state) => ({
        items: state.items.filter((item) => item.id !== productId),
      })),

      updateQuantity: (productId, quantity) => set((state) => {
        if (quantity <= 0) {
          return {
            items: state.items.filter((item) => item.id !== productId),
          }
        }
        return {
          items: state.items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        }
      }),

      incrementQuantity: (productId) => set((state) => ({
        items: state.items.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      })),

      decrementQuantity: (productId) => set((state) => {
        const item = state.items.find((i) => i.id === productId)

        if (item && item.quantity <= 1) {
          // Remove item if quantity becomes 0
          return {
            items: state.items.filter((i) => i.id !== productId),
          }
        }

        return {
          items: state.items.map((i) =>
            i.id === productId ? { ...i, quantity: i.quantity - 1 } : i
          ),
        }
      }),

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        const state = get()
        return state.items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        const state = get()
        return state.items.reduce(
          (total, item) => total + (item.price - item.discount) * item.quantity,
          0
        )
      },
    }),
    { name: 'cart-storage' }
  )
)
