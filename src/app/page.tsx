'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useEffect, useState, useRef, useCallback } from 'react'
import ProductCard from '@/components/ProductCard'
import QuickView from '@/components/QuickView'
import CategorySlider from '@/components/CategorySlider'
import BrandSlider from '@/components/BrandSlider'

export default function Home() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [brands, setBrands] = useState<any[]>([])
  const [banners, setBanners] = useState<any[]>([])
  const [bannersLoaded, setBannersLoaded] = useState(false)
  const [bannerCTAs, setBannerCTAs] = useState<any[]>([])
  const [currentBanner, setCurrentBanner] = useState(0)
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null)
  const [swipeOffset, setSwipeOffset] = useState(0)
  const [isSwiping, setIsSwiping] = useState(false)
  const touchStartX = useRef(0)
  const touchCurrentX = useRef(0)
  const bannerRef = useRef<HTMLDivElement>(null)

  const goToBanner = useCallback((index: number) => {
    setCurrentBanner(index)
    setSwipeOffset(0)
  }, [])

  useEffect(() => {
    fetch('/api/products').then(res => res.json()).then(data => Array.isArray(data) ? setProducts(data) : setProducts([])).catch(console.error)
    fetch('/api/categories').then(res => res.json()).then(data => Array.isArray(data) ? setCategories(data) : setCategories([])).catch(console.error)
    fetch('/api/brands').then(res => res.json()).then(data => Array.isArray(data) ? setBrands(data) : setBrands([])).catch(console.error)
    fetch('/api/banners').then(res => res.json()).then(data => { Array.isArray(data) ? setBanners(data) : setBanners([]); setBannersLoaded(true) }).catch(() => setBannersLoaded(true))
    fetch('/api/banner-cta').then(res => res.json()).then(data => Array.isArray(data) ? setBannerCTAs(data) : setBannerCTAs([])).catch(console.error)
  }, [])

  // Auto-rotate banners
  useEffect(() => {
    if (banners.length > 1 && !isSwiping) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [banners.length, isSwiping])

  // Get own brand (type === 'OWN')
  const ownBrand = brands.find(b => b.type === 'OWN')
  const ownBrandProducts = products.filter(p => p.brand?.type === 'OWN')
  const newArrivals = [...products].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8)
  const activeCategories = categories.filter(c => c.enabled)

  const allBrands = brands.filter(b => b.status)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchCurrentX.current = e.touches[0].clientX
    setIsSwiping(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return
    touchCurrentX.current = e.touches[0].clientX
    const diff = touchCurrentX.current - touchStartX.current
    setSwipeOffset(diff)
  }

  const handleTouchEnd = () => {
    if (!isSwiping) return
    const diff = touchCurrentX.current - touchStartX.current
    const threshold = 50
    if (diff < -threshold) {
      goToBanner((currentBanner + 1) % banners.length)
    } else if (diff > threshold) {
      goToBanner((currentBanner - 1 + banners.length) % banners.length)
    } else {
      setSwipeOffset(0)
    }
    setIsSwiping(false)
  }

  return (
    <div className="bg-[var(--bg-primary)] min-h-screen text-[var(--text-primary)]">

      {/* 1. HERO BANNER SLIDER */}
      <section className="relative h-[500px] md:h-[650px] lg:h-[85vh] w-full overflow-hidden bg-[var(--obsidian)]">
        {!bannersLoaded ? (
          <div className="absolute inset-0 bg-[var(--obsidian)]" />
        ) : banners.length === 0 ? (
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?q=80&w=2000"
              className="w-full h-full object-cover scale-105"
              alt="Hero"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--obsidian)] via-[var(--obsidian)]/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--obsidian)]/50 via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-3 bg-[var(--sand)]/10 backdrop-blur-md border border-[var(--sand)]/30 rounded-full px-5 py-2.5 mb-6">
                    <span className="relative flex h-2 w-2">
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--sand)]"></span>
                    </span>
                    <span className="text-[var(--sand)] text-xs font-bold uppercase tracking-[0.3em]">Premium Collection</span>
                  </div>
                  <h1 className="text-4xl md:text-6xl lg:text-8xl font-extralight text-[var(--pearl)] tracking-tight mb-4 md:mb-6 leading-[1.1]">
                    Discover Our <br />
                    <span className="font-black text-[var(--sand)]">Exclusive</span> Range
                  </h1>
                  <p className="text-[var(--pearl)]/60 text-base md:text-xl mb-8 md:mb-10 max-w-xl leading-relaxed">
                    Curated selection of premium products for the discerning collector
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link href="/products" className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-[var(--crimson)] to-[#9a001f] text-[var(--pearl)] px-8 py-4 md:px-10 md:py-5 font-bold uppercase text-xs md:text-sm tracking-wider overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_var(--crimson)] hover:scale-105">
                      <span className="absolute inset-0 bg-gradient-to-r from-[var(--sand)] to-[var(--crimson)] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                      <span className="relative">Shop Now</span>
                      <ArrowRight size={16} className="relative group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link href="/products" className="inline-flex items-center gap-3 border-2 border-[var(--pearl)]/30 text-[var(--pearl)] px-8 py-4 md:px-10 md:py-5 font-semibold uppercase text-xs md:text-sm tracking-wider hover:border-[var(--sand)] hover:text-[var(--sand)] transition-all duration-300 backdrop-blur-sm">
                      Explore More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div
              ref={bannerRef}
              className="flex h-full"
              style={{
                transform: `translateX(calc(-${currentBanner * (100 / banners.length)}% + ${isSwiping ? swipeOffset : 0}px))`,
                transition: isSwiping ? 'none' : 'transform 0.7s cubic-bezier(0.22, 0.68, 0, 1)',
                width: `${banners.length * 100}%`,
              }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {banners.map((banner, index) => (
                <div
                  key={banner.id}
                  className="relative h-full flex-shrink-0"
                  style={{ width: `${100 / banners.length}%` }}
                >
                  <img
                    src={banner.image}
                    className="w-full h-full object-cover"
                    alt={banner.title}
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--obsidian)]/90 via-[var(--obsidian)]/50 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--obsidian)]/50 via-transparent to-transparent" />

                  <div className="absolute inset-0 flex items-end md:items-center pb-16 md:pb-0">
                    <div className="container mx-auto px-4 md:px-6">
                      <div className={`max-w-3xl transition-all duration-700 ${index === currentBanner ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        <div className="inline-flex items-center gap-2 md:gap-3 bg-[var(--sand)]/10 backdrop-blur-md border border-[var(--sand)]/30 rounded-full px-3 py-1.5 md:px-5 md:py-2.5 mb-3 md:mb-6">
                          <span className="relative flex h-1.5 w-1.5 md:h-2 md:w-2">
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-[var(--sand)]"></span>
                          </span>
                          <span className="text-[var(--sand)] text-[8px] md:text-xs font-bold uppercase tracking-[0.2em] md:tracking-[0.3em]">Featured</span>
                        </div>
                        <h1 className="text-2xl md:text-6xl lg:text-8xl font-extralight text-[var(--pearl)] tracking-tight mb-2 md:mb-6 leading-[1.1]">
                          {banner.title?.split(' ').map((word: string, i: number) => (
                            <span key={i} className={i === 1 ? 'font-black text-[var(--sand)]' : ''}>
                              {word}{' '}
                            </span>
                          ))}
                        </h1>
                        <p className="text-[var(--pearl)]/60 text-xs md:text-xl mb-4 md:mb-10 max-w-xl leading-relaxed">{banner.subtitle}</p>
                        <div className="flex flex-wrap gap-4">
                          <Link href={banner.link || '/products'} className="group relative inline-flex items-center gap-2 md:gap-3 bg-gradient-to-r from-[var(--crimson)] to-[#9a001f] text-[var(--pearl)] px-5 py-2.5 md:px-10 md:py-5 font-bold uppercase text-[10px] md:text-sm tracking-wider overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_var(--crimson)] hover:scale-105">
                            <span className="absolute inset-0 bg-gradient-to-r from-[var(--sand)] to-[var(--crimson)] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                            <span className="relative">Shop Now</span>
                            <ArrowRight size={14} className="relative group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {banners.length > 1 && (
              <>
                {/* Progress Indicators */}
                <div className="absolute bottom-2 md:bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3">
                  {banners.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentBanner(index)}
                      className="group relative h-12 flex items-center"
                    >
                      <div className={`relative h-1 rounded-full overflow-hidden transition-all duration-500 ${index === currentBanner ? 'w-16 bg-[var(--pearl)]/20' : 'w-8 bg-[var(--pearl)]/10 hover:bg-[var(--pearl)]/20'}`}>
                        {index === currentBanner && (
                          <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[var(--sand)] to-[var(--crimson)] rounded-full" style={{ width: '100%' }} />
                        )}
                      </div>
                      <span className={`absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold transition-all duration-300 ${index === currentBanner ? 'text-[var(--sand)] opacity-100' : 'text-[var(--pearl)]/40 opacity-0 group-hover:opacity-100'}`}>
                        0{index + 1}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Slide Counter */}
                <div className="absolute bottom-8 md:bottom-12 right-4 md:right-8 hidden md:flex items-center gap-2 text-[var(--pearl)]/40 text-sm font-mono">
                  <span className="text-2xl font-bold text-[var(--sand)]">0{currentBanner + 1}</span>
                  <span className="text-lg">/</span>
                  <span>0{banners.length}</span>
                </div>
              </>
            )}
          </>
        )}

      </section>

      {/* 2. CATEGORIES SLIDER SECTION */}
      {activeCategories.length > 0 && (
        <CategorySlider categories={activeCategories} />
      )}

      {/* 3. OUR BRANDS SECTION - Always shows after categories */}
      <section className="py-20 md:py-32 bg-[var(--bg-primary)] relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          {/* Section Header - Premium Design */}
          <div className="text-center mb-10 md:mb-14">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[var(--sand)]/20 to-[var(--crimson)]/20 backdrop-blur-sm border border-[var(--sand)]/30 rounded-full px-6 py-3 mb-5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-r from-[var(--sand)] to-[var(--crimson)]"></span>
              </span>
              <span className="text-[var(--sand)] text-[11px] font-bold uppercase tracking-[0.3em]">Exclusive Collection</span>
            </div>

            <h2 className="text-4xl md:text-6xl lg:text-7xl font-extralight text-[var(--text-primary)] tracking-tight mb-3">
              Our <span className="font-black text-[var(--sand)]">Premium</span> Collection
            </h2>

            <p className="text-[var(--text-muted)] text-base md:text-lg max-w-xl mx-auto leading-relaxed">
              Handpicked products crafted with passion, designed for excellence
            </p>

          </div>

          {/* Products Grid - Premium Layout */}
          {ownBrandProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
              {ownBrandProducts.slice(0, 8).map((product) => (
                <div key={product.id}>
                  <ProductCard product={product} onQuickView={setQuickViewProduct} />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
              {products.filter(p => p.featured).slice(0, 8).map((product) => (
                <div key={product.id}>
                  <ProductCard product={product} onQuickView={setQuickViewProduct} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--sand)]/10 flex items-center justify-center">
                <span className="text-3xl">🛍️</span>
              </div>
              <p className="text-[var(--text-muted)] text-lg">No products available yet</p>
            </div>
          )}

          {/* View All Button */}
          <div className="text-center mt-16">
            <Link
              href={ownBrand ? `/brand/${ownBrand.slug || ownBrand.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}` : '/products'}
              className="group inline-flex items-center gap-4"
            >
              <span className="relative overflow-hidden border-2 border-[var(--sand)] text-[var(--text-primary)] px-10 py-5 text-sm font-bold uppercase tracking-[0.2em] transition-all duration-500 hover:bg-[var(--sand)] hover:text-white hover:border-[var(--sand)]">
                <span className="relative z-10 flex items-center gap-3">
                  View All Products
                  <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-300" />
                </span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. CTA BANNER - FULL WIDTH IMAGE WITH TITLE */}
      {bannerCTAs.length > 0 && (
        <section className="w-full px-4 md:px-6 py-8">
          {bannerCTAs.map((cta) => (
            <Link key={cta.id} href={cta.buttonLink || '#'} className="group block relative w-full rounded-2xl overflow-hidden mb-4 last:mb-0">
              <div className="relative h-[200px] md:h-[420px] lg:h-[500px]">
                <img
                  src={cta.image}
                  alt={cta.title || 'Banner'}
                  className="w-full h-full object-cover"
                />
                {/* Multi-layer gradient for premium depth */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-center pl-6 pr-4 md:pl-20 lg:pl-28 md:pr-16">
                  {cta.title && cta.showTitle !== false && (
                    <>
                      <div className="w-8 md:w-16 h-[2px] bg-[var(--sand)] mb-3 md:mb-7" />
                      <h2 className="text-2xl md:text-5xl lg:text-7xl uppercase tracking-tight max-w-xl leading-[1.2] md:leading-[1.15]" style={{ fontFamily: 'var(--font-heading)' }}>
                        {cta.title.split(' ').map((word: string, i: number) => (
                          <span key={i} className="block">
                            {i === 0 ? <span className="font-black text-[var(--sand)]">{word}</span> : <span className="font-thin text-white">{word}</span>}
                          </span>
                        ))}
                      </h2>
                      {cta.subtitle && (
                        <p className="text-white/50 text-[10px] md:text-base mt-2 md:mt-5 max-w-md tracking-wide font-light">{cta.subtitle}</p>
                      )}
                    </>
                  )}
                  {cta.showButton !== false && (
                    <div className={cta.showTitle !== false && cta.title ? 'mt-3 md:mt-10' : ''}>
                      <span className="inline-flex items-center gap-1.5 md:gap-2 bg-[var(--sand)] text-[var(--obsidian)] px-4 md:px-10 py-2 md:py-4 text-[8px] md:text-xs font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] rounded-sm group-hover:bg-white transition-all duration-300">
                        {cta.buttonText || 'Shop Now'}
                        <svg className="w-2.5 h-2.5 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </section>
      )}

      {/* 5. NEW ARRIVALS - Romantic Minimal Design */}
      {newArrivals.length > 0 && (
        <section className="py-24 md:py-36 relative overflow-hidden bg-[var(--bg-secondary)]">
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            {/* Section Header */}
            <div className="text-center mb-16 md:mb-24">
              {/* Badge */}
              <div className="inline-flex items-center gap-3 border border-[var(--sand)]/30 bg-[var(--sand)]/10 rounded-full px-6 py-3 mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--crimson)]"></span>
                </span>
                <span className="text-[var(--sand)] text-[11px] font-bold uppercase tracking-[0.3em]">Just Arrived</span>
              </div>

              {/* Main Heading */}
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-thin text-[var(--text-primary)] tracking-tight mb-6">
                New <span className="font-bold text-[var(--sand)]">Arrivals</span>
              </h2>

              {/* Subtitle */}
              <p className="text-[var(--text-muted)] text-base md:text-lg max-w-md mx-auto">
                Fresh additions crafted with precision and elegance
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
              {newArrivals.slice(0, 8).map((product) => (
                <div key={product.id}>
                  <ProductCard product={product} onQuickView={setQuickViewProduct} />
                </div>
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center mt-16">
              <Link
                href="/new-arrivals"
                className="inline-flex items-center gap-3 border-2 border-[var(--sand)] text-[var(--text-primary)] px-8 py-4 text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:bg-[var(--sand)] hover:text-white"
              >
                View All New Arrivals
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 6. SHOP BY BRANDS - SLIDER */}
      {allBrands.length > 0 && (
        <BrandSlider brands={allBrands} products={products} />
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
    </div>
  )
}
