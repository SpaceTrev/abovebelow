import { useState, useEffect } from 'react'
import { 
  fetchProducts, 
  fetchProduct, 
  fetchCollectionProducts,
  Product 
} from '../api/shopify'

// Hook for fetching multiple products
export const useProducts = (
  first: number = 20,
  query?: string
) => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasNextPage, setHasNextPage] = useState(false)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchProducts(first, undefined, query)
        setProducts(data.products)
        setHasNextPage(data.pageInfo.hasNextPage)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [first, query])

  const loadMore = async () => {
    if (!hasNextPage || loading) return

    try {
      setLoading(true)
      const lastCursor = products.length > 0 ? `cursor_${products.length}` : undefined
      const data = await fetchProducts(first, lastCursor, query)
      setProducts(prev => [...prev, ...data.products])
      setHasNextPage(data.pageInfo.hasNextPage)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more products')
    } finally {
      setLoading(false)
    }
  }

  return {
    products,
    loading,
    error,
    hasNextPage,
    loadMore,
  }
}

// Hook for fetching a single product by handle
export const useProduct = (handle: string) => {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!handle) {
      setProduct(null)
      setLoading(false)
      return
    }

    const loadProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchProduct(handle)
        setProduct(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product')
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [handle])

  return {
    product,
    loading,
    error,
  }
}

// Hook for fetching products from a collection
export const useCollectionProducts = (
  collectionHandle: string,
  first: number = 20
) => {
  const [collection, setCollection] = useState<{
    id: string
    title: string
    description: string
  } | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasNextPage, setHasNextPage] = useState(false)

  useEffect(() => {
    if (!collectionHandle) {
      setCollection(null)
      setProducts([])
      setLoading(false)
      return
    }

    const loadCollectionProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchCollectionProducts(collectionHandle, first)
        
        if (data) {
          setCollection(data.collection)
          setProducts(data.products)
          setHasNextPage(data.pageInfo.hasNextPage)
        } else {
          setError('Collection not found')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch collection products')
      } finally {
        setLoading(false)
      }
    }

    loadCollectionProducts()
  }, [collectionHandle, first])

  const loadMore = async () => {
    if (!hasNextPage || loading || !collection) return

    try {
      setLoading(true)
      const lastCursor = products.length > 0 ? `cursor_${products.length}` : undefined
      const data = await fetchCollectionProducts(collectionHandle, first, lastCursor)
      
      if (data) {
        setProducts(prev => [...prev, ...data.products])
        setHasNextPage(data.pageInfo.hasNextPage)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more products')
    } finally {
      setLoading(false)
    }
  }

  return {
    collection,
    products,
    loading,
    error,
    hasNextPage,
    loadMore,
  }
}
