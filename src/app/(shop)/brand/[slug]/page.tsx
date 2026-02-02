'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Sparkles, ArrowLeft } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import QuickView from '@/components/QuickView'

export default function BrandPage() {
  const params = useParams()
  const slug = params?.slug as string || 'own'

  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
    async function fetchBrandProducts() {
      try {
        const res = await fetch('/api/products')
        const data = await res.json()

        const filtered = slug === 'own'
          ? data.filter((p: any) => p.brand?.type === 'OWN')
          : data.filter((p: any) => p.brand?.name.toLowerCase().includes(slug.toLowerCase()))

        setProducts(filtered)
      } catch (error) {
        console.error("Failed to fetch brand products", error)
      } finally {
        setLoading(false)
      }
    }
    fetchBrandProducts()
  }, [slug])

  if (!mounted) return null

  const brandName = slug === 'own' ? 'Avengers Exclusive' : slug.toUpperCase().replace('-', ' ')

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-[var(--accent)] to-[#8b0000] py-12 md:py-20">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6">
            <ArrowLeft size={16} />
            <span className="text-sm">Back to Home</span>
          </Link>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 md:px-6 py-2 text-xs font-black uppercase tracking-widest backdrop-blur-md mb-4 md:mb-6">
              <Sparkles size={14} className="text-yellow-300" />
              {slug === 'own' ? 'Exclusive Collection' : 'Brand Collection'}
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-black text-white uppercase tracking-tight">
              {brandName}
            </h1>
            <p className="text-white/60 mt-4">{products.length} products available</p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-16">
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-[var(--text-muted)]">Loading products...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {products.map((product: any) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-[var(--text-muted)] text-lg">No products found for this brand</p>
            <Link href="/" className="inline-block mt-4 text-[var(--accent)] font-bold hover:text-white transition-colors">
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
