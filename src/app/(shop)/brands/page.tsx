'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Award, ArrowRight } from 'lucide-react'

interface Brand {
  id: string
  name: string
  logo: string | null
  type: 'OWN' | 'THIRD_PARTY'
  status: boolean
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsRes, productsRes] = await Promise.all([
          fetch('/api/brands'),
          fetch('/api/products')
        ])
        const brandsData = await brandsRes.json()
        const productsData = await productsRes.json()

        if (Array.isArray(brandsData)) {
          setBrands(brandsData.filter((b: Brand) => b.status))
        }
        if (Array.isArray(productsData)) {
          setProducts(productsData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const getProductCount = (brandId: string) => {
    return products.filter(p => p.brandId === brandId).length
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-3 border-[var(--sand)]/20 border-t-[var(--sand)] rounded-full animate-spin" />
          <p className="text-[var(--text-muted)] text-sm">Loading brands...</p>
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
              <Award size={14} className="text-[var(--sand)]" />
              <span className="text-[var(--sand)] text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em]">Premium Partners</span>
            </div>

            <h1 className="text-3xl md:text-6xl lg:text-7xl font-thin text-[var(--text-primary)] tracking-tight mb-4 md:mb-6">
              Our <span className="font-bold text-[var(--sand)]">Brands</span>
            </h1>

            <p className="text-[var(--text-muted)] text-sm md:text-lg max-w-xl mx-auto">
              Discover premium products from our exclusive brand partners
            </p>
          </div>
        </div>
      </section>

      {/* Brands Grid */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          {brands.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
              {brands.map((brand) => {
                const productCount = getProductCount(brand.id)
                return (
                  <Link
                    key={brand.id}
                    href={`/brand/${brand.id}`}
                    className="group relative overflow-hidden rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] hover:border-[var(--sand)]/50 transition-all duration-300 p-6 md:p-8"
                  >
                    {/* Type Badge */}
                    <div className={`absolute top-4 right-4 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      brand.type === 'OWN'
                        ? 'bg-[var(--sand)]/20 text-[var(--sand)]'
                        : 'bg-[var(--crimson)]/15 text-[var(--crimson)]'
                    }`}>
                      {brand.type === 'OWN' ? 'Exclusive' : 'Partner'}
                    </div>

                    {/* Logo */}
                    <div className="flex flex-col items-center text-center">
                      <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden bg-[var(--bg-secondary)] border-2 border-[var(--border-light)] group-hover:border-[var(--sand)] transition-colors mb-5 flex items-center justify-center">
                        {brand.logo ? (
                          <img
                            src={brand.logo}
                            alt={brand.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-4xl font-black text-[var(--sand)]">
                            {brand.name?.charAt(0)}
                          </span>
                        )}
                      </div>

                      {/* Brand Name */}
                      <h3 className="text-lg md:text-xl font-bold text-[var(--text-primary)] mb-2 group-hover:text-[var(--sand)] transition-colors">
                        {brand.name}
                      </h3>

                      {/* Product Count */}
                      <p className="text-sm text-[var(--text-muted)]">
                        {productCount} {productCount === 1 ? 'Product' : 'Products'}
                      </p>

                      {/* Explore Button */}
                      <div className="flex items-center gap-2 mt-4 text-[var(--sand)] text-sm font-medium">
                        <span>Explore</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-[var(--text-muted)] text-lg">No brands available yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
