import { GraphQLClient } from 'graphql-request'

// Client configuration that works in both Node.js and browser environments
export const createShopifyClient = (config?: {
  endpoint?: string
  token?: string
}) => {
  let endpoint = config?.endpoint
  let token = config?.token

  // Try to get from environment if not provided
  if (!endpoint || !token) {
    // For browser environment (Next.js client-side)
    if (typeof window !== 'undefined') {
      endpoint = endpoint || process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_URL || ''
      token = token || process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || ''
    }
    // For server environment (Next.js server-side)
    else {
      endpoint = endpoint || process.env.SHOPIFY_STOREFRONT_URL || process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_URL || ''
      token = token || process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || ''
    }
  }

  if (!endpoint || !token) {
    throw new Error(
      'Shopify configuration missing. Please provide SHOPIFY_STOREFRONT_URL and SHOPIFY_STOREFRONT_ACCESS_TOKEN environment variables.'
    )
  }

  return new GraphQLClient(endpoint, {
    headers: {
      'X-Shopify-Storefront-Access-Token': token,
      'Content-Type': 'application/json',
    },
  })
}

// Default client instance
export const shopifyClient = createShopifyClient()
