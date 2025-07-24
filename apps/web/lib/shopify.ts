// This file now re-exports from the @abovebelow/commerce package
// All Shopify logic has been moved to the commerce package for better organization

export {
  shopifyClient,
  createShopifyClient,
  fetchProducts,
  fetchProduct,
  fetchCollectionProducts,
  getProductFirstImage,
  getProductMinPrice,
  getProductMaxPrice,
  isProductOnSale,
  formatPrice,
  type Product,
} from '@abovebelow/commerce'

// Legacy exports for backward compatibility
export const getProductsQuery = `{
  products(first: 10) {
    edges {
      node {
        id
        title
        handle
      }
    }
  }
}`

type ProductsResponse = {
  products: {
    edges: Array<{
      node: {
        id: string
        title: string
        handle: string
      }
    }>
  }
}

// Deprecated: Use fetchProducts from @abovebelow/commerce instead
export const fetchProductsLegacy = async () => {
  const data = await fetchProducts(10)
  return data.products.map(product => ({
    id: product.id,
    title: product.title,
    handle: product.handle,
  }))
}