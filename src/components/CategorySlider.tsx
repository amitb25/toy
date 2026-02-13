'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  image: string | null
  _count?: { products: number }
}

interface CategorySliderProps {
  categories: Category[]
}

export default function CategorySlider({ categories }: CategorySliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)

  const itemsPerView = 5
  const totalPages = Math.ceil(categories.length / itemsPerView)

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
  }, [categories])

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

  return (
    <section className="py-20 md:py-28 bg-[var(--bg-secondary)] relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-14 md:mb-20">
          <div className="inline-flex items-center gap-2 bg-[var(--crimson)]/10 border border-[var(--crimson)]/20 rounded-full px-4 py-2 mb-6">
            <Sparkles size={14} className="text-[var(--crimson)]" />
            <span className="text-[var(--crimson)] text-[11px] font-bold uppercase tracking-[0.2em]">Explore Collections</span>
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-light text-[var(--text-primary)] tracking-tight mb-4">
            Trending <span className="font-black text-[var(--sand)]">Categories</span>
          </h2>
          <p className="text-[var(--text-muted)] text-sm md:text-base max-w-md mx-auto">Discover what's hot right now</p>
        </div>

        {/* Slider Container */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className={`absolute -left-2 md:-left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-[var(--bg-card)] border border-[var(--border-color)] rounded-full shadow-lg text-[var(--text-primary)] transition-opacity ${
              !canScrollLeft ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
            disabled={!canScrollLeft}
          >
            <ChevronLeft size={24} strokeWidth={2} />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className={`absolute -right-2 md:-right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-[var(--bg-card)] border border-[var(--border-color)] rounded-full shadow-lg text-[var(--text-primary)] transition-opacity ${
              !canScrollRight ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
            disabled={!canScrollRight}
          >
            <ChevronRight size={24} strokeWidth={2} />
          </button>

          {/* Gradient Fade Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[var(--bg-secondary)] to-transparent z-10 pointer-events-none opacity-80" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[var(--bg-secondary)] to-transparent z-10 pointer-events-none opacity-80" />

          {/* Categories Slider */}
          <div
            ref={sliderRef}
            className="flex gap-5 md:gap-6 overflow-x-auto scroll-smooth px-4 md:px-8 py-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="flex-shrink-0 w-[180px] md:w-[220px] lg:w-[240px]"
              >
                {/* Card */}
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-md border border-[var(--border-light)] hover:border-[var(--sand)]/50 transition-colors duration-300">
                  {/* Background Image */}
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[var(--sand)]/20 to-[var(--crimson)]/10 flex items-center justify-center">
                      <span className="text-6xl font-black text-[var(--text-muted)]/20">{category.name.charAt(0)}</span>
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--obsidian)]/80 via-[var(--obsidian)]/20 to-transparent" />

                  {/* Product Count Badge */}
                  <div className="absolute top-4 right-4 bg-[var(--bg-card)] backdrop-blur-sm px-3 py-1.5 rounded-full border border-[var(--border-light)]">
                    <span className="text-[10px] font-bold text-[var(--text-primary)]">
                      {category._count?.products || 0} items
                    </span>
                  </div>

                  {/* Category Name */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-xl md:text-2xl font-bold text-[var(--pearl)]">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Pagination Dots */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-10">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToPage(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentPage === index
                    ? 'w-8 bg-[var(--sand)]'
                    : 'w-2 bg-[var(--text-muted)]/20'
                }`}
              />
            ))}
          </div>
        )}

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link
            href="/categories"
            className="inline-flex items-center gap-3 text-[var(--text-secondary)] hover:text-[var(--sand)] text-sm font-semibold uppercase tracking-wider transition-colors duration-300"
          >
            <span>View All Categories</span>
            <ChevronRight size={18} />
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
