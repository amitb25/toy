'use client'

import { ChevronDown, ArrowLeft, ShoppingBag, Filter, Search, X } from 'lucide-react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import QuickView from '@/components/QuickView'
import Loader from '@/components/Loader'

export default function ProductsPage() {
  return (
    <Suspense fallback={<Loader text="Loading products..." />}>
      <ProductsContent />
    </Suspense>
  )
}

function ProductsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const searchQuery = searchParams?.get('search') || ''

  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null)
  const [sortBy, setSortBy] = useState('newest')
  const [showSortDropdown, setShowSortDropdown] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/products')
        const data = await res.json()
        if (Array.isArray(data)) {
          let filtered = data

          // Filter by search query if present
          if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase()
            filtered = filtered.filter((p: any) =>
              p.name.toLowerCase().includes(lowerQuery) ||
              p.description?.toLowerCase().includes(lowerQuery) ||
              p.brand?.name?.toLowerCase().includes(lowerQuery) ||
              p.category?.name?.toLowerCase().includes(lowerQuery)
            )
          }

          setProducts(filtered)
        }
      } catch (error) {
        console.error("Failed to fetch products", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [searchQuery])

  const clearSearch = () => {
    router.push('/products')
  }

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return (a.price - a.discount) - (b.price - b.discount)
      case 'price-high': return (b.price - b.discount) - (a.price - a.discount)
      case 'newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      default: return 0
    }
  })

  if (loading) return <Loader text="Loading products..." />

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Hero Section - Dark banner */}
      <section className="relative overflow-hidden bg-[var(--brand-banner-bg)] py-10 md:py-24">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-[var(--pearl)]/60 hover:text-[var(--sand)] transition-colors mb-6 md:mb-8 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs md:text-sm font-medium">Back to Home</span>
          </Link>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 md:gap-3 border border-[var(--sand)]/30 bg-[var(--sand)]/20 rounded-full px-4 md:px-6 py-2 md:py-3 mb-6 md:mb-8">
              {searchQuery ? <Search size={14} className="text-[var(--sand)]" /> : <ShoppingBag size={14} className="text-[var(--sand)]" />}
              <span className="text-[var(--sand)] text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em]">
                {searchQuery ? 'Search Results' : 'Shop'}
              </span>
            </div>

            <h1 className="text-3xl md:text-6xl lg:text-7xl font-thin text-[var(--pearl)] tracking-tight mb-4 md:mb-6">
              {searchQuery ? (
                <>Search: <span className="font-bold text-[var(--sand)]">&quot;{searchQuery}&quot;</span></>
              ) : (
                <>All <span className="font-bold text-[var(--sand)]">Products</span></>
              )}
            </h1>

            <p className="text-[var(--pearl)]/60 text-sm md:text-lg max-w-xl mx-auto">
              {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'} {searchQuery ? 'found' : 'available'}
            </p>

            {searchQuery && (
              <button
                onClick={clearSearch}
                className="mt-4 inline-flex items-center gap-2 text-[var(--pearl)]/60 hover:text-[var(--sand)] transition-colors text-sm cursor-pointer"
              >
                <X size={14} />
                Clear search
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
            <p className="text-[var(--text-muted)] text-sm">
              Showing {sortedProducts.length} products
            </p>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border-color)] px-4 py-2.5 rounded-xl text-sm font-medium text-[var(--text-primary)] hover:border-[var(--sand)] transition-colors cursor-pointer"
              >
                <Filter size={16} />
                <span>Sort: {sortBy === 'newest' ? 'Newest' : sortBy === 'price-low' ? 'Price: Low to High' : 'Price: High to Low'}</span>
                <ChevronDown size={16} className={`transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showSortDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-xl z-30 overflow-hidden">
                  {[
                    { value: 'newest', label: 'Newest First' },
                    { value: 'price-low', label: 'Price: Low to High' },
                    { value: 'price-high', label: 'Price: High to Low' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value)
                        setShowSortDropdown(false)
                      }}
                      className={`w-full text-left px-4 py-3 text-sm transition-colors cursor-pointer ${
                        sortBy === option.value
                          ? 'bg-[var(--sand)]/10 text-[var(--sand)] font-semibold'
                          : 'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Products Grid */}
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
              {sortedProducts.map((product) => (
                <div key={product.id}>
                  <ProductCard product={product} onQuickView={setQuickViewProduct} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[var(--sand)]/10 flex items-center justify-center">
                {searchQuery ? <Search size={40} className="text-[var(--sand)]" /> : <ShoppingBag size={40} className="text-[var(--sand)]" />}
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                {searchQuery ? 'No Results Found' : 'No Products Found'}
              </h3>
              <p className="text-[var(--text-muted)] mb-6">
                {searchQuery
                  ? `No products match "${searchQuery}". Try a different search term.`
                  : 'No products available yet.'}
              </p>
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="inline-flex items-center gap-2 bg-[var(--sand)] text-white px-6 py-3 rounded-full font-semibold hover:bg-[var(--sand)]/90 transition-colors cursor-pointer"
                >
                  <X size={16} />
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
    </div>
  )
}
