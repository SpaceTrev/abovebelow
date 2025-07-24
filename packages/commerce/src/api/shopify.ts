import { shopifyClient } from './client'

// Enhanced product type with full Shopify data
export type Product = {
  id: string
  title: string
  handle: string
  description: string
  availableForSale: boolean
  tags: string[]
  vendor: string
  productType: string
  images: {
    edges: Array<{
      node: {
        id: string
        altText: string | null
        url: string
        width: number
        height: number
      }
    }>
  }
  variants: {
    edges: Array<{
      node: {
        id: string
        title: string
        availableForSale: boolean
        price: {
          amount: string
          currencyCode: string
        }
        compareAtPrice: {
          amount: string
          currencyCode: string
        } | null
        selectedOptions: Array<{
          name: string
          value: string
        }>
      }
    }>
  }
  priceRange: {
    minVariantPrice: {
      amount: string
      currencyCode: string
    }
    maxVariantPrice: {
      amount: string
      currencyCode: string
    }
  }
}

// GraphQL fragments for reusability
const PRODUCT_FRAGMENT = `
  fragment ProductFragment on Product {
    id
    title
    handle
    description
    availableForSale
    tags
    vendor
    productType
    images(first: 10) {
      edges {
        node {
          id
          altText
          url
          width
          height
        }
      }
    }
    variants(first: 250) {
      edges {
        node {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
        }
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
  }
`

// Enhanced products query
export const GET_PRODUCTS_QUERY = `
  ${PRODUCT_FRAGMENT}
  query GetProducts($first: Int!, $after: String, $query: String) {
    products(first: $first, after: $after, query: $query) {
      edges {
        node {
          ...ProductFragment
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`

// Single product query
export const GET_PRODUCT_QUERY = `
  ${PRODUCT_FRAGMENT}
  query GetProduct($handle: String!) {
    productByHandle(handle: $handle) {
      ...ProductFragment
    }
  }
`

// Collection products query
export const GET_COLLECTION_PRODUCTS_QUERY = `
  ${PRODUCT_FRAGMENT}
  query GetCollectionProducts($handle: String!, $first: Int!, $after: String) {
    collectionByHandle(handle: $handle) {
      id
      title
      description
      products(first: $first, after: $after) {
        edges {
          node {
            ...ProductFragment
          }
          cursor
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
`

// Response types
type ProductsResponse = {
  products: {
    edges: Array<{
      node: Product
      cursor: string
    }>
    pageInfo: {
      hasNextPage: boolean
      hasPreviousPage: boolean
      startCursor: string
      endCursor: string
    }
  }
}

type ProductResponse = {
  productByHandle: Product | null
}

type CollectionProductsResponse = {
  collectionByHandle: {
    id: string
    title: string
    description: string
    products: {
      edges: Array<{
        node: Product
        cursor: string
      }>
      pageInfo: {
        hasNextPage: boolean
        hasPreviousPage: boolean
        startCursor: string
        endCursor: string
      }
    }
  } | null
}

// API functions
export const fetchProducts = async (
  first: number = 20,
  after?: string,
  query?: string
) => {
  const data = await shopifyClient.request<ProductsResponse>(GET_PRODUCTS_QUERY, {
    first,
    after,
    query,
  })
  
  return {
    products: data.products.edges.map((edge) => edge.node),
    pageInfo: data.products.pageInfo,
  }
}

export const fetchProduct = async (handle: string) => {
  const data = await shopifyClient.request<ProductResponse>(GET_PRODUCT_QUERY, {
    handle,
  })
  
  return data.productByHandle
}

export const fetchCollectionProducts = async (
  handle: string,
  first: number = 20,
  after?: string
) => {
  const data = await shopifyClient.request<CollectionProductsResponse>(
    GET_COLLECTION_PRODUCTS_QUERY,
    {
      handle,
      first,
      after,
    }
  )
  
  if (!data.collectionByHandle) {
    return null
  }
  
  return {
    collection: {
      id: data.collectionByHandle.id,
      title: data.collectionByHandle.title,
      description: data.collectionByHandle.description,
    },
    products: data.collectionByHandle.products.edges.map((edge) => edge.node),
    pageInfo: data.collectionByHandle.products.pageInfo,
  }
}

// Helper functions
export const getProductFirstImage = (product: Product) => {
  return product.images.edges[0]?.node || null
}

export const getProductMinPrice = (product: Product) => {
  return product.priceRange.minVariantPrice
}

export const getProductMaxPrice = (product: Product) => {
  return product.priceRange.maxVariantPrice
}

export const isProductOnSale = (product: Product) => {
  return product.variants.edges.some(
    (variant) => variant.node.compareAtPrice !== null
  )
}

export const formatPrice = (price: { amount: string; currencyCode: string }) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currencyCode,
  }).format(parseFloat(price.amount))
}
