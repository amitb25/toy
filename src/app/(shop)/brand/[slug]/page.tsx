'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Package, Star, Award, Filter, ChevronDown } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import QuickView from '@/components/QuickView'

interface Brand {
  id: string
  name: string
  logo: string | null
  type: 'OWN' | 'THIRD_PARTY'
  status: boolean
}

interface Product {
  id: string
  name: string
  description: string
  price: number
  discount: number
  images: string
  ageGroup: string
  stock: number
  soldCount?: number
  featured?: boolean
  brand?: { name: string; type?: string }
  category?: { name: string }
  createdAt?: string
  brandId?: string
}

export default function BrandPage() {
  const params = useParams()
  const slug = params?.slug as string

  const [brand, setBrand] = useState<Brand | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [sortBy, setSortBy] = useState('featured')
  const [showSortDropdown, setShowSortDropdown] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch brand details
        const brandsRes = await fetch('/api/brands')
        const brandsData = await brandsRes.json()

        // Find brand by ID or by slug (name)
        const foundBrand = Array.isArray(brandsData)
          ? brandsData.find((b: Brand) => b.id === slug || b.name.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase())
          : null
        setBrand(foundBrand)

        // Fetch products
        const productsRes = await fetch('/api/products')
        const productsData = await productsRes.json()

        // Filter products by brand
        const brandProducts = Array.isArray(productsData)
          ? productsData.filter((p: Product) => {
              if (foundBrand) {
                return p.brandId === foundBrand.id || p.brand?.name === foundBrand.name
              }
              // Fallback to slug matching
              return p.brand?.name.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase()
            })
          : []
        setProducts(brandProducts)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [slug])

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a.price - a.discount) - (b.price - b.discount)
      case 'price-high':
        return (b.price - b.discount) - (a.price - a.discount)
      case 'newest':
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      case 'featured':
      default:
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
    }
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[var(--sand)]/30 border-t-[var(--sand)] rounded-full animate-spin" />
          <p className="text-[var(--text-muted)] text-sm">Loading brand...</p>
        </div>
      </div>
    )
  }

  if (!brand) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[var(--sand)]/10 flex items-center justify-center">
            <Package size={40} className="text-[var(--sand)]" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Brand Not Found</h1>
          <p className="text-[var(--text-muted)] mb-6">The brand you're looking for doesn't exist.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[var(--sand)] text-white px-6 py-3 rounded-full font-semibold hover:bg-[var(--sand)]/90 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--obsidian)] via-[var(--obsidian)] to-[var(--crimson)]/30">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--sand)]/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[var(--crimson)]/15 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[var(--sand)]/5 rounded-full blur-[100px]" />
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 border border-[var(--sand)]/20 rounded-full animate-[float_6s_ease-in-out_infinite] hidden lg:block" />
        <div className="absolute bottom-20 right-20 w-32 h-32 border border-[var(--crimson)]/15 rounded-full animate-[float_8s_ease-in-out_infinite_reverse] hidden lg:block" />

        <div className="container mx-auto px-4 md:px-6 py-16 md:py-24 relative z-10">
          {/* Back Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[var(--pearl)]/60 hover:text-[var(--sand)] transition-colors mb-8 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>

          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Brand Logo */}
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden bg-[var(--pearl)]/10 backdrop-blur-sm border-2 border-[var(--sand)]/30 shadow-2xl flex items-center justify-center">
                {brand.logo ? (
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-6xl font-black bg-gradient-to-br from-[var(--sand)] to-[var(--crimson)] bg-clip-text text-transparent">
                    {brand.name?.charAt(0)}
                  </span>
                )}
              </div>

              {/* Type Badge */}
              <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg ${
                brand.type === 'OWN'
                  ? 'bg-gradient-to-r from-[var(--sand)] to-[#9a7a5c] text-white'
                  : 'bg-gradient-to-r from-[var(--crimson)] to-[#9a001f] text-white'
              }`}>
                {brand.type === 'OWN' ? 'Exclusive Brand' : 'Partner Brand'}
              </div>
            </div>

            {/* Brand Info */}
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-[var(--sand)]/20 border border-[var(--sand)]/30 rounded-full px-4 py-2 mb-4">
                <Award size={14} className="text-[var(--sand)]" />
                <span className="text-[var(--sand)] text-[11px] font-bold uppercase tracking-[0.2em]">Premium Collection</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[var(--pearl)] mb-4">
                {brand.name}
              </h1>

              <p className="text-[var(--pearl)]/60 text-base md:text-lg max-w-xl mb-6">
                Discover our exclusive collection of premium products from {brand.name}. Quality craftsmanship meets exceptional design.
              </p>

              {/* Stats */}
              <div className="flex items-center justify-center md:justify-start gap-6">
                <div className="text-center">
                  <p className="text-3xl font-black text-[var(--sand)]">{products.length}</p>
                  <p className="text-[var(--pearl)]/50 text-xs uppercase tracking-wider">Products</p>
                </div>
                <div className="w-px h-12 bg-[var(--pearl)]/20" />
                <div className="text-center">
                  <div className="flex items-center gap-1 justify-center">
                    <Star size={20} className="text-amber-400 fill-amber-400" />
                    <span className="text-3xl font-black text-[var(--pearl)]">4.8</span>
                  </div>
                  <p className="text-[var(--pearl)]/50 text-xs uppercase tracking-wider">Rating</p>
                </div>
                <div className="w-px h-12 bg-[var(--pearl)]/20" />
                <div className="text-center">
                  <p className="text-3xl font-black text-[var(--pearl)]">100%</p>
                  <p className="text-[var(--pearl)]/50 text-xs uppercase tracking-wider">Authentic</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--bg-primary)] to-transparent" />
      </section>

      {/* Products Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
                All Products
              </h2>
              <p className="text-[var(--text-muted)] text-sm mt-1">
                Showing {sortedProducts.length} products from {brand.name}
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border-color)] px-4 py-2.5 rounded-xl text-sm font-medium text-[var(--text-primary)] hover:border-[var(--sand)] transition-colors cursor-pointer"
              >
                <Filter size={16} />
                <span>Sort by: {sortBy === 'featured' ? 'Featured' : sortBy === 'price-low' ? 'Price: Low to High' : sortBy === 'price-high' ? 'Price: High to Low' : 'Newest'}</span>
                <ChevronDown size={16} className={`transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showSortDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-xl z-30 overflow-hidden">
                  {[
                    { value: 'featured', label: 'Featured' },
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
              {sortedProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-[fadeInUp_0.6s_ease-out_both]"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <ProductCard product={product} onQuickView={setQuickViewProduct} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[var(--sand)]/10 flex items-center justify-center">
                <Package size={40} className="text-[var(--sand)]" />
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No Products Yet</h3>
              <p className="text-[var(--text-muted)] mb-6">This brand doesn't have any products available at the moment.</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-[var(--sand)] text-white px-6 py-3 rounded-full font-semibold hover:bg-[var(--sand)]/90 transition-colors"
              >
                <ArrowLeft size={18} />
                Browse Other Products
              </Link>
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
