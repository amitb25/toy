'use client'

import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import ProductCard from '@/components/ProductCard'
import QuickView from '@/components/QuickView'
import CategorySlider from '@/components/CategorySlider'
import BrandSlider from '@/components/BrandSlider'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [brands, setBrands] = useState<any[]>([])
  const [banners, setBanners] = useState<any[]>([])
  const [bannerCTAs, setBannerCTAs] = useState<any[]>([])
  const [currentBanner, setCurrentBanner] = useState(0)
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
    fetch('/api/products').then(res => res.json()).then(data => Array.isArray(data) ? setProducts(data) : setProducts([])).catch(console.error)
    fetch('/api/categories').then(res => res.json()).then(data => Array.isArray(data) ? setCategories(data) : setCategories([])).catch(console.error)
    fetch('/api/brands').then(res => res.json()).then(data => Array.isArray(data) ? setBrands(data) : setBrands([])).catch(console.error)
    fetch('/api/banners').then(res => res.json()).then(data => Array.isArray(data) ? setBanners(data) : setBanners([])).catch(console.error)
    fetch('/api/banner-cta').then(res => res.json()).then(data => Array.isArray(data) ? setBannerCTAs(data) : setBannerCTAs([])).catch(console.error)
  }, [])

  // Auto-rotate banners
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [banners.length])

  if (!mounted) return null

  // Get own brand (type === 'OWN')
  const ownBrand = brands.find(b => b.type === 'OWN')
  const ownBrandProducts = products.filter(p => p.brand?.type === 'OWN')
  const newArrivals = [...products].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8)
  const activeCategories = categories.filter(c => c.enabled)

  // All products grouped by brand for "Shop by Brands" section
  const allBrands = brands.filter(b => b.status)
  const productsByBrand = allBrands.map(brand => ({
    brand,
    products: products.filter(p => p.brandId === brand.id)
  })).filter(item => item.products.length > 0)

  const nextBanner = () => setCurrentBanner((prev) => (prev + 1) % banners.length)
  const prevBanner = () => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)

  return (
    <div className="bg-[var(--bg-primary)] min-h-screen text-[var(--text-primary)]">

      {/* 1. HERO BANNER SLIDER */}
      <section className="relative h-[350px] md:h-[550px] lg:h-[700px] w-full overflow-hidden bg-[var(--obsidian)]">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_50%,var(--crimson)_0%,transparent_50%)] animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_50%,var(--sand)_0%,transparent_50%)] animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
        </div>

        {banners.length === 0 ? (
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?q=80&w=2000"
              className="w-full h-full object-cover scale-105 animate-[kenburns_20s_ease-in-out_infinite_alternate]"
              alt="Hero"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--obsidian)] via-[var(--obsidian)]/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--obsidian)]/50 via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-3 bg-[var(--sand)]/10 backdrop-blur-md border border-[var(--sand)]/30 rounded-full px-5 py-2.5 mb-6 animate-[fadeInUp_0.8s_ease-out]">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--sand)] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--sand)]"></span>
                    </span>
                    <span className="text-[var(--sand)] text-xs font-bold uppercase tracking-[0.3em]">Premium Collection</span>
                  </div>
                  <h1 className="text-4xl md:text-6xl lg:text-8xl font-extralight text-[var(--pearl)] tracking-tight mb-4 md:mb-6 leading-[1.1] animate-[fadeInUp_0.8s_ease-out_0.2s_both]">
                    Discover Our <br />
                    <span className="font-black bg-gradient-to-r from-[var(--sand)] via-[var(--crimson)] to-[var(--sand)] bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite]">Exclusive</span> Range
                  </h1>
                  <p className="text-[var(--pearl)]/60 text-base md:text-xl mb-8 md:mb-10 max-w-xl leading-relaxed animate-[fadeInUp_0.8s_ease-out_0.4s_both]">
                    Curated selection of premium products for the discerning collector
                  </p>
                  <div className="flex flex-wrap gap-4 animate-[fadeInUp_0.8s_ease-out_0.6s_both]">
                    <Link href="/category/all" className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-[var(--crimson)] to-[#9a001f] text-[var(--pearl)] px-8 py-4 md:px-10 md:py-5 font-bold uppercase text-xs md:text-sm tracking-wider overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_var(--crimson)] hover:scale-105">
                      <span className="absolute inset-0 bg-gradient-to-r from-[var(--sand)] to-[var(--crimson)] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                      <span className="relative">Shop Now</span>
                      <ArrowRight size={16} className="relative group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link href="/category/all" className="inline-flex items-center gap-3 border-2 border-[var(--pearl)]/30 text-[var(--pearl)] px-8 py-4 md:px-10 md:py-5 font-semibold uppercase text-xs md:text-sm tracking-wider hover:border-[var(--sand)] hover:text-[var(--sand)] transition-all duration-300 backdrop-blur-sm">
                      Explore More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-all duration-1000 ${index === currentBanner ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
              >
                <img
                  src={banner.image}
                  className={`w-full h-full object-cover transition-transform duration-[8000ms] ease-out ${index === currentBanner ? 'scale-110' : 'scale-100'}`}
                  alt={banner.title}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--obsidian)] via-[var(--obsidian)]/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--obsidian)]/60 via-transparent to-[var(--obsidian)]/20" />

                {/* Decorative Elements */}
                <div className="absolute top-1/4 right-10 w-32 h-32 border border-[var(--sand)]/20 rounded-full animate-[spin_20s_linear_infinite] hidden lg:block" />
                <div className="absolute bottom-1/4 right-20 w-20 h-20 border border-[var(--crimson)]/20 rounded-full animate-[spin_15s_linear_infinite_reverse] hidden lg:block" />

                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-4 md:px-6">
                    <div className={`max-w-3xl transition-all duration-700 ${index === currentBanner ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                      <div className="inline-flex items-center gap-3 bg-[var(--sand)]/10 backdrop-blur-md border border-[var(--sand)]/30 rounded-full px-5 py-2.5 mb-6">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--sand)] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--sand)]"></span>
                        </span>
                        <span className="text-[var(--sand)] text-xs font-bold uppercase tracking-[0.3em]">Featured</span>
                      </div>
                      <h1 className="text-4xl md:text-6xl lg:text-8xl font-extralight text-[var(--pearl)] tracking-tight mb-4 md:mb-6 leading-[1.1]">
                        {banner.title?.split(' ').map((word: string, i: number) => (
                          <span key={i} className={i === 1 ? 'font-black bg-gradient-to-r from-[var(--sand)] via-[var(--crimson)] to-[var(--sand)] bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite]' : ''}>
                            {word}{' '}
                          </span>
                        ))}
                      </h1>
                      <p className="text-[var(--pearl)]/60 text-base md:text-xl mb-8 md:mb-10 max-w-xl leading-relaxed">{banner.subtitle}</p>
                      <div className="flex flex-wrap gap-4">
                        <Link href={banner.link || '/category/all'} className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-[var(--crimson)] to-[#9a001f] text-[var(--pearl)] px-8 py-4 md:px-10 md:py-5 font-bold uppercase text-xs md:text-sm tracking-wider overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_var(--crimson)] hover:scale-105">
                          <span className="absolute inset-0 bg-gradient-to-r from-[var(--sand)] to-[var(--crimson)] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                          <span className="relative">Shop Now</span>
                          <ArrowRight size={16} className="relative group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {banners.length > 1 && (
              <>
                {/* Navigation Arrows */}
                <button onClick={prevBanner} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 group">
                  <div className="relative p-4 md:p-5 bg-[var(--pearl)]/5 backdrop-blur-md border border-[var(--pearl)]/10 text-[var(--pearl)] rounded-full overflow-hidden transition-all duration-300 hover:border-[var(--sand)]/50 hover:scale-110">
                    <span className="absolute inset-0 bg-gradient-to-r from-[var(--crimson)] to-[var(--sand)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <ChevronLeft size={20} className="relative" />
                  </div>
                </button>
                <button onClick={nextBanner} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 group">
                  <div className="relative p-4 md:p-5 bg-[var(--pearl)]/5 backdrop-blur-md border border-[var(--pearl)]/10 text-[var(--pearl)] rounded-full overflow-hidden transition-all duration-300 hover:border-[var(--sand)]/50 hover:scale-110">
                    <span className="absolute inset-0 bg-gradient-to-r from-[var(--sand)] to-[var(--crimson)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <ChevronRight size={20} className="relative" />
                  </div>
                </button>

                {/* Progress Indicators */}
                <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3">
                  {banners.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentBanner(index)}
                      className="group relative h-12 flex items-center"
                    >
                      <div className={`relative h-1 rounded-full overflow-hidden transition-all duration-500 ${index === currentBanner ? 'w-16 bg-[var(--pearl)]/20' : 'w-8 bg-[var(--pearl)]/10 hover:bg-[var(--pearl)]/20'}`}>
                        {index === currentBanner && (
                          <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[var(--sand)] to-[var(--crimson)] rounded-full animate-[progress_5s_linear]" style={{ width: '100%' }} />
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

        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--bg-primary)] to-transparent pointer-events-none" />
      </section>

      {/* 2. CATEGORIES SLIDER SECTION */}
      {activeCategories.length > 0 && (
        <CategorySlider categories={activeCategories} />
      )}

      {/* 3. OUR BRANDS SECTION - Always shows after categories */}
      <section className="py-20 md:py-32 bg-[var(--bg-secondary)] relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--sand)]/10 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[var(--crimson)]/8 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-[var(--sand)]/5 to-transparent rounded-full" />

        {/* Floating Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 border border-[var(--sand)]/20 rounded-full animate-[float_6s_ease-in-out_infinite] hidden lg:block" />
        <div className="absolute bottom-32 right-16 w-32 h-32 border border-[var(--crimson)]/15 rounded-full animate-[float_8s_ease-in-out_infinite_reverse] hidden lg:block" />
        <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-[var(--sand)]/40 rounded-full animate-[float_4s_ease-in-out_infinite] hidden lg:block" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          {/* Section Header - Premium Design */}
          <div className="text-center mb-16 md:mb-24">
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[var(--sand)]/20 to-[var(--crimson)]/20 backdrop-blur-sm border border-[var(--sand)]/30 rounded-full px-6 py-3 mb-8 animate-[fadeInUp_0.8s_ease-out]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--sand)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-r from-[var(--sand)] to-[var(--crimson)]"></span>
              </span>
              <span className="text-[var(--sand)] text-[11px] font-bold uppercase tracking-[0.3em]">Exclusive Collection</span>
            </div>

            {/* Main Heading with Animation */}
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-extralight text-[var(--text-primary)] tracking-tight mb-6 animate-[fadeInUp_0.8s_ease-out_0.2s_both]">
              Our <span className="font-black bg-gradient-to-r from-[var(--sand)] via-[var(--crimson)] to-[var(--sand)] bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite]">Premium</span> Collection
            </h2>

            {/* Subtitle */}
            <p className="text-[var(--text-muted)] text-base md:text-lg max-w-xl mx-auto leading-relaxed animate-[fadeInUp_0.8s_ease-out_0.4s_both]">
              Handpicked products crafted with passion, designed for excellence
            </p>

            {/* Brand Logo/Badge - Show if own brand exists */}
            {ownBrand && (
              <div className="mt-10 inline-flex items-center gap-5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl px-8 py-5 shadow-xl shadow-[var(--sand)]/10 hover:shadow-2xl hover:shadow-[var(--sand)]/20 transition-all duration-500 hover:-translate-y-1 animate-[fadeInUp_0.8s_ease-out_0.6s_both]">
                {ownBrand.logo ? (
                  <img src={ownBrand.logo} alt={ownBrand.name} className="w-14 h-14 rounded-xl object-cover ring-2 ring-[var(--sand)]/30" />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--sand)] to-[var(--crimson)] flex items-center justify-center shadow-lg">
                    <span className="text-white text-2xl font-black">{ownBrand.name?.charAt(0)}</span>
                  </div>
                )}
                <div className="text-left">
                  <p className="text-[var(--text-primary)] font-bold text-xl">{ownBrand.name}</p>
                  <p className="text-[var(--text-muted)] text-sm">{ownBrandProducts.length} Premium Products</p>
                </div>
              </div>
            )}
          </div>

          {/* Products Grid - Premium Layout */}
          {ownBrandProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
              {ownBrandProducts.slice(0, 8).map((product, index) => (
                <div key={product.id} className="animate-[fadeInUp_0.6s_ease-out_both]" style={{ animationDelay: `${index * 0.1}s` }}>
                  <ProductCard product={product} onQuickView={setQuickViewProduct} />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
              {products.filter(p => p.featured).slice(0, 8).map((product, index) => (
                <div key={product.id} className="animate-[fadeInUp_0.6s_ease-out_both]" style={{ animationDelay: `${index * 0.1}s` }}>
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
              href={ownBrand ? `/brand/${ownBrand.id}` : '/category/all'}
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

      {/* 4. CTA BANNER - FULL WIDTH IMAGE ONLY */}
      {bannerCTAs.length > 0 && (
        <section className="w-full px-4 md:px-6 py-8">
          {bannerCTAs.map((cta) => (
            <Link key={cta.id} href={cta.buttonLink || '#'} className="block relative w-full rounded-2xl overflow-hidden border border-[var(--sand)]/30">
              <img
                src={cta.image}
                alt={cta.title || 'Banner'}
                className="w-full h-auto object-cover"
                style={{ maxHeight: '500px', objectFit: 'cover', width: '100%' }}
              />
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
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--crimson)] opacity-75"></span>
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
