'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Sparkles, Filter, ChevronDown } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import QuickView from '@/components/QuickView'

export default function NewArrivalsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null)
  const [sortBy, setSortBy] = useState('newest')
  const [showSortDropdown, setShowSortDropdown] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products')
        const data = await res.json()
        if (Array.isArray(data)) {
          const sorted = data.sort((a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          setProducts(sorted)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a.price - a.discount) - (b.price - b.discount)
      case 'price-high':
        return (b.price - b.discount) - (a.price - a.discount)
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-3 border-[var(--sand)]/20 border-t-[var(--sand)] rounded-full animate-spin" />
          <p className="text-[var(--text-muted)] text-sm">Loading new arrivals...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Hero Section */}
      <section className="relative bg-[var(--bg-secondary)] py-10 md:py-24 border-b border-[var(--border-light)]">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--sand)] transition-colors mb-6 md:mb-8 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs md:text-sm font-medium">Back to Home</span>
          </Link>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 md:gap-3 border border-[var(--sand)]/30 bg-[var(--sand)]/10 rounded-full px-4 md:px-6 py-2 md:py-3 mb-6 md:mb-8">
              <Sparkles size={14} className="text-[var(--sand)]" />
              <span className="text-[var(--sand)] text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em]">Fresh Drops</span>
            </div>

            <h1 className="text-3xl md:text-6xl lg:text-7xl font-thin text-[var(--text-primary)] tracking-tight mb-4 md:mb-6">
              New <span className="font-bold text-[var(--sand)]">Arrivals</span>
            </h1>

            <p className="text-[var(--text-muted)] text-sm md:text-lg max-w-xl mx-auto">
              Be the first to discover our latest collection of premium products
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
            <p className="text-[var(--text-muted)] text-sm">
              Showing {sortedProducts.length} new products
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
              <p className="text-[var(--text-muted)] text-lg">No new arrivals yet. Check back soon!</p>
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
