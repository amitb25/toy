'use client'

import { ChevronDown, ArrowLeft, Grid, Filter, Search, X } from 'lucide-react'
import Loader from '@/components/Loader'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import QuickView from '@/components/QuickView'

export default function CategoryPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const slug = params?.slug as string || 'all'
  const searchQuery = searchParams?.get('search') || ''

  const [category, setCategory] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null)
  const [sortBy, setSortBy] = useState('newest')
  const [showSortDropdown, setShowSortDropdown] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch categories to find the category by ID or name
        const catRes = await fetch('/api/categories')
        const catData = await catRes.json()

        const toSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        let foundCategory = null
        if (Array.isArray(catData) && slug !== 'all') {
          foundCategory = catData.find((c: any) =>
            c.slug === slug || toSlug(c.name) === slug || c.id === slug
          )
          setCategory(foundCategory)
        }

        // Fetch products
        const res = await fetch('/api/products')
        const data = await res.json()
        if (Array.isArray(data)) {
          let filtered = data

          // Filter by category if not 'all'
          if (slug !== 'all') {
            filtered = data.filter((p: any) => {
              if (foundCategory) {
                return p.categoryId === foundCategory.id || p.category?.name === foundCategory.name
              }
              return p.category?.name?.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase() ||
                     (slug === 'exclusives' && p.brand?.type === 'OWN')
            })
          }

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
  }, [slug, searchQuery])

  const clearSearch = () => {
    router.push(`/category/${slug}`)
  }

  const categoryName = category?.name || (slug === 'all' ? 'All Products' : slug.replace(/-/g, ' '))

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
      {/* Hero Section - Dark bg in light mode, lighter dark in dark mode */}
      <section className="relative overflow-hidden bg-[var(--brand-banner-bg)] py-10 md:py-24">
        {/* Category Image Background (if available) */}
        {category?.image && (
          <div className="absolute inset-0 opacity-10">
            <img src={category.image} alt="" className="w-full h-full object-cover" />
          </div>
        )}

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <Link href="/categories" className="inline-flex items-center gap-2 text-[var(--pearl)]/60 hover:text-[var(--sand)] transition-colors mb-6 md:mb-8 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs md:text-sm font-medium">All Categories</span>
          </Link>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 md:gap-3 border border-[var(--sand)]/30 bg-[var(--sand)]/20 rounded-full px-4 md:px-6 py-2 md:py-3 mb-6 md:mb-8">
              {searchQuery ? <Search size={14} className="text-[var(--sand)]" /> : <Grid size={14} className="text-[var(--sand)]" />}
              <span className="text-[var(--sand)] text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em]">
                {searchQuery ? 'Search Results' : 'Category'}
              </span>
            </div>

            <h1 className="text-3xl md:text-6xl lg:text-7xl font-thin text-[var(--pearl)] tracking-tight mb-4 md:mb-6 capitalize">
              {searchQuery ? (
                <>Search: <span className="font-bold text-[var(--sand)]">&quot;{searchQuery}&quot;</span></>
              ) : slug === 'all' ? (
                <>All <span className="font-bold text-[var(--sand)]">Products</span></>
              ) : (
                <span className="font-bold text-[var(--sand)]">{categoryName}</span>
              )}
            </h1>

            <p className="text-[var(--pearl)]/60 text-sm md:text-lg max-w-xl mx-auto">
              {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'} {searchQuery ? 'found' : 'available'}
            </p>

            {searchQuery && (
              <button
                onClick={clearSearch}
                className="mt-4 inline-flex items-center gap-2 text-[var(--pearl)]/60 hover:text-[var(--sand)] transition-colors text-sm"
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
                {searchQuery ? <Search size={40} className="text-[var(--sand)]" /> : <Grid size={40} className="text-[var(--sand)]" />}
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                {searchQuery ? 'No Results Found' : 'No Products Found'}
              </h3>
              <p className="text-[var(--text-muted)] mb-6">
                {searchQuery
                  ? `No products match "${searchQuery}". Try a different search term.`
                  : 'No products available in this category yet.'}
              </p>
              {searchQuery ? (
                <button
                  onClick={clearSearch}
                  className="inline-flex items-center gap-2 bg-[var(--sand)] text-white px-6 py-3 rounded-full font-semibold hover:bg-[var(--sand)]/90 transition-colors"
                >
                  <X size={16} />
                  Clear Search
                </button>
              ) : (
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-[var(--sand)] text-white px-6 py-3 rounded-full font-semibold hover:bg-[var(--sand)]/90 transition-colors"
                >
                  Browse All Products
                </Link>
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
