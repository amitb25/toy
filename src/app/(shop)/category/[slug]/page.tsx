'use client'

import { ChevronDown, ArrowLeft, SlidersHorizontal } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import QuickView from '@/components/QuickView'

export default function CategoryPage() {
  const params = useParams()
  const slug = params?.slug as string || 'all'
  const categoryName = slug.toUpperCase().replace('-', ' ')

  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null)
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products')
        const data = await res.json()
        if (Array.isArray(data)) {
          // Filter by category if not 'all'
          let filtered = data
          if (slug !== 'all') {
            filtered = data.filter((p: any) =>
              p.category?.slug === slug ||
              (slug === 'exclusives' && p.brand?.type === 'OWN')
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
    fetchProducts()
  }, [slug])

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return (a.price - a.discount) - (b.price - b.discount)
      case 'price-high': return (b.price - b.discount) - (a.price - a.discount)
      case 'newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      default: return 0
    }
  })

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-6">
          <ArrowLeft size={16} />
          <span className="text-sm">Back to Home</span>
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent)]">Collection</span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-[var(--text-primary)] uppercase tracking-tight mt-2">
              {categoryName}
            </h1>
            <p className="text-[var(--text-muted)] mt-2">{sortedProducts.length} products</p>
          </div>

          {/* Sort & Filter */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg px-4 py-3 pr-10 text-[var(--text-primary)] text-sm focus:border-[var(--accent)] focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
            </div>
            <button className="p-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-color)] transition-colors md:hidden">
              <SlidersHorizontal size={18} />
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-[var(--text-muted)]">Loading products...</p>
          </div>
        ) : sortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-[var(--text-muted)] text-lg">No products found in this category</p>
            <Link href="/" className="inline-block mt-4 text-[var(--accent)] font-bold hover:text-[var(--text-primary)] transition-colors">
              Browse all products →
            </Link>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
    </div>
  )
}
