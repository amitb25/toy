'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Award, Star } from 'lucide-react'

interface Brand {
  id: string
  name: string
  logo: string | null
  type: 'OWN' | 'THIRD_PARTY'
  status: boolean
}

interface BrandSliderProps {
  brands: Brand[]
  products: any[]
}

export default function BrandSlider({ brands, products }: BrandSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)

  const itemsPerView = 5
  const totalPages = Math.ceil(brands.length / itemsPerView)

  const checkScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current
      setCanScrollLeft(scrollLeft > 10)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)

      const pageWidth = clientWidth
      const newPage = Math.round(scrollLeft / pageWidth)
      setCurrentPage(Math.min(newPage, totalPages - 1))
    }
  }

  useEffect(() => {
    checkScroll()
    const slider = sliderRef.current
    if (slider) {
      slider.addEventListener('scroll', checkScroll)
      return () => slider.removeEventListener('scroll', checkScroll)
    }
  }, [brands])

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.clientWidth * 0.8
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const goToPage = (page: number) => {
    if (sliderRef.current) {
      const pageWidth = sliderRef.current.clientWidth
      sliderRef.current.scrollTo({
        left: pageWidth * page,
        behavior: 'smooth'
      })
    }
  }

  const getProductCount = (brandId: string) => {
    return products.filter(p => p.brandId === brandId).length
  }

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-[var(--bg-secondary)] via-[var(--bg-primary)] to-[var(--bg-secondary)] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[var(--sand)]/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[var(--crimson)]/5 rounded-full blur-[120px]" />

      {/* Animated dots pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-10 left-[5%] w-3 h-3 bg-[var(--sand)]/40 rounded-full animate-pulse" />
        <div className="absolute top-32 right-[10%] w-2 h-2 bg-[var(--crimson)]/30 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-20 left-[15%] w-2 h-2 bg-[var(--sand)]/35 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-40 right-[20%] w-3 h-3 bg-[var(--crimson)]/25 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-14 md:mb-20">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--crimson)]/10 to-[var(--sand)]/10 border border-[var(--sand)]/20 rounded-full px-5 py-2.5 mb-6">
            <Star size={14} className="text-[var(--sand)]" />
            <span className="text-[var(--sand)] text-[11px] font-bold uppercase tracking-[0.25em]">Premium Partners</span>
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-light text-[var(--text-primary)] tracking-tight mb-4">
            Shop by <span className="font-black bg-gradient-to-r from-[var(--sand)] via-[var(--crimson)] to-[var(--sand)] bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite]">Brands</span>
          </h2>
          <p className="text-[var(--text-muted)] text-sm md:text-base max-w-lg mx-auto">Discover our curated collection of premium brands</p>
        </div>

        {/* Slider Container */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className={`absolute -left-2 md:-left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-[var(--bg-card)] border border-[var(--border-color)] rounded-full shadow-lg hover:shadow-xl hover:bg-[var(--sand)] hover:border-[var(--sand)] hover:text-white text-[var(--text-primary)] transition-all duration-300 ${
              !canScrollLeft ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
            disabled={!canScrollLeft}
          >
            <ChevronLeft size={24} strokeWidth={2} />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className={`absolute -right-2 md:-right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-[var(--bg-card)] border border-[var(--border-color)] rounded-full shadow-lg hover:shadow-xl hover:bg-[var(--sand)] hover:border-[var(--sand)] hover:text-white text-[var(--text-primary)] transition-all duration-300 ${
              !canScrollRight ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
            disabled={!canScrollRight}
          >
            <ChevronRight size={24} strokeWidth={2} />
          </button>

          {/* Gradient Fade Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[var(--bg-primary)] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[var(--bg-primary)] to-transparent z-10 pointer-events-none" />

          {/* Brands Slider */}
          <div
            ref={sliderRef}
            className="flex gap-5 md:gap-6 overflow-x-auto scroll-smooth px-4 md:px-8 py-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {brands.map((brand) => {
              const productCount = getProductCount(brand.id)
              return (
                <Link
                  key={brand.id}
                  href={`/brand/${brand.id}`}
                  className="flex-shrink-0 w-[200px] md:w-[240px] lg:w-[260px]"
                >
                  {/* Card */}
                  <div className="relative bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--sand)]/50 rounded-3xl p-6 md:p-8 overflow-hidden shadow-lg transition-colors duration-300">
                    {/* Type Badge */}
                    <div className={`absolute top-4 right-4 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      brand.type === 'OWN'
                        ? 'bg-[var(--sand)]/20 text-[var(--sand)]'
                        : 'bg-[var(--crimson)]/15 text-[var(--crimson)]'
                    }`}>
                      {brand.type === 'OWN' ? 'Exclusive' : 'Partner'}
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center text-center pt-4">
                      {/* Brand Logo */}
                      <div className="relative mb-5">
                        <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden bg-[var(--bg-secondary)] border-2 border-[var(--border-light)] shadow-lg flex items-center justify-center">
                          {brand.logo ? (
                            <img
                              src={brand.logo}
                              alt={brand.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[var(--sand)]/20 to-[var(--crimson)]/20 flex items-center justify-center">
                              <span className="text-4xl font-black bg-gradient-to-br from-[var(--sand)] to-[var(--crimson)] bg-clip-text text-transparent">
                                {brand.name?.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Product Count Badge */}
                        <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-[var(--crimson)] to-[var(--sand)] text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg">
                          {productCount} items
                        </div>
                      </div>

                      {/* Brand Name */}
                      <h3 className="text-lg md:text-xl font-bold mb-2 text-[var(--text-primary)]">
                        {brand.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Pagination Dots */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-10">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToPage(index)}
                className={`h-2 rounded-full transition-all duration-500 ${
                  currentPage === index
                    ? 'w-8 bg-gradient-to-r from-[var(--sand)] to-[var(--crimson)]'
                    : 'w-2 bg-[var(--text-muted)]/20 hover:bg-[var(--text-muted)]/40'
                }`}
              />
            ))}
          </div>
        )}

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link
            href="/brands"
            className="inline-flex items-center gap-3 text-[var(--text-secondary)] hover:text-[var(--sand)] text-sm font-semibold uppercase tracking-wider transition-colors duration-300 group"
          >
            <span>View All Brands</span>
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>

      {/* Hide scrollbar CSS */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}
