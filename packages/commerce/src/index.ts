// Client exports
export * from './api/client'

// API exports
export * from './api/shopify'

// Hooks exports
export * from './hooks/useShopify'

// Store exports
export * from '../store/cart'

// Re-export types for convenience
export type { Product } from './api/shopify'
export type { CartItem } from '../store/cart'
