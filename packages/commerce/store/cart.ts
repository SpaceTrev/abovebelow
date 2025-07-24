import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Enhanced cart item with full Shopify variant data
export type CartItem = {
  variantId: string
  productId: string
  productHandle: string
  title: string
  variantTitle: string
  quantity: number
  price: {
    amount: string
    currencyCode: string
  }
  compareAtPrice?: {
    amount: string
    currencyCode: string
  }
  image?: {
    url: string
    altText: string | null
    width: number
    height: number
  }
  selectedOptions: Array<{
    name: string
    value: string
  }>
  availableForSale: boolean
}

type CartState = {
  items: CartItem[]
  isOpen: boolean
  // Actions
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeFromCart: (variantId: string) => void
  updateQuantity: (variantId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  // Computed values
  totalItems: number
  totalPrice: string
  isEmpty: boolean
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addToCart: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.variantId === item.variantId)
          const quantityToAdd = item.quantity || 1
          
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.variantId === item.variantId 
                  ? { ...i, quantity: i.quantity + quantityToAdd } 
                  : i
              ),
              isOpen: true, // Auto-open cart when adding items
            }
          }
          
          return { 
            items: [...state.items, { ...item, quantity: quantityToAdd }],
            isOpen: true,
          }
        }),
      
      removeFromCart: (variantId) => 
        set((state) => ({
          items: state.items.filter((item) => item.variantId !== variantId)
        })),
      
      updateQuantity: (variantId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.variantId !== variantId)
            }
          }
          
          return {
            items: state.items.map((item) =>
              item.variantId === variantId ? { ...item, quantity } : item
            )
          }
        }),
      
      clearCart: () => set({ items: [], isOpen: false }),
      
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      
      openCart: () => set({ isOpen: true }),
      
      closeCart: () => set({ isOpen: false }),
      
      // Computed values
      get totalItems() {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
      
      get totalPrice() {
        const total = get().items.reduce((sum, item) => {
          return sum + (parseFloat(item.price.amount) * item.quantity)
        }, 0)
        
        const currencyCode = get().items[0]?.price.currencyCode || 'USD'
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currencyCode,
        }).format(total)
      },
      
      get isEmpty() {
        return get().items.length === 0
      },
    }),
    {
      name: 'abbl-cart-storage',
      // Only persist the items, not the UI state
      partialize: (state) => ({ items: state.items }),
    }
  )
)