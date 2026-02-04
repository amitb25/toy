'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Grid, ArrowRight, Star } from 'lucide-react'

interface Category {
  id: string
  name: string
  image: string | null
  enabled: boolean
  _count?: {
    products: number
  }
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories')
        const data = await res.json()
        if (Array.isArray(data)) {
          setCategories(data.filter((c: Category) => c.enabled))
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-3 border-[var(--sand)]/20 border-t-[var(--sand)] rounded-full animate-spin" />
          <p className="text-[var(--text-muted)] text-sm">Loading categories...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Hero Section - Light mode compatible */}
      <section className="relative bg-[var(--bg-secondary)] py-10 md:py-24 border-b border-[var(--border-light)]">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--sand)] transition-colors mb-6 md:mb-8 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs md:text-sm font-medium">Back to Home</span>
          </Link>

          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 border border-[var(--sand)]/30 bg-[var(--sand)]/10 rounded-full px-4 md:px-5 py-1.5 md:py-2 mb-6 md:mb-8">
              <Grid size={12} className="text-[var(--sand)]" />
              <span className="text-[var(--sand)] text-[10px] md:text-xs font-semibold uppercase tracking-wider">All Categories</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-6xl lg:text-7xl font-thin text-[var(--text-primary)] tracking-tight mb-4 md:mb-6">
              Shop by{' '}
              <span className="font-bold text-[var(--sand)]">
                Category
              </span>
            </h1>

            <p className="text-[var(--text-muted)] text-sm md:text-lg max-w-xl mx-auto">
              Explore our curated collection across different categories
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 md:py-24 relative">
        <div className="container mx-auto px-4 md:px-6">
          {categories.length > 0 ? (
            <>
              {/* Featured Category (First One) */}
              {categories[0] && (
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <Star size={20} className="text-[var(--sand)] fill-[var(--sand)]" />
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">Featured Category</h2>
                  </div>
                  <Link
                    href={`/category/${categories[0].id}`}
                    className="group relative overflow-hidden rounded-2xl h-[280px] md:h-[380px] block bg-[var(--bg-card)] border border-[var(--border-light)] hover:border-[var(--sand)]/40 transition-all duration-300"
                  >
                    {/* Image */}
                    {categories[0].image ? (
                      <img
                        src={categories[0].image}
                        alt={categories[0].name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[var(--sand)]/20 to-[var(--crimson)]/10 flex items-center justify-center">
                        <span className="text-[120px] md:text-[180px] font-black text-[var(--sand)]/15">
                          {categories[0].name?.charAt(0)}
                        </span>
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--obsidian)]/80 via-[var(--obsidian)]/40 to-transparent" />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-10">
                      <div className="inline-flex items-center gap-2 bg-[var(--sand)]/20 backdrop-blur-sm px-4 py-2 rounded-full w-fit mb-4">
                        <Star size={14} className="text-[var(--sand)] fill-[var(--sand)]" />
                        <span className="text-[var(--sand)] text-xs font-bold uppercase tracking-wider">Featured</span>
                      </div>

                      <h3 className="text-3xl md:text-5xl font-black text-[var(--pearl)] mb-3 group-hover:text-[var(--sand)] transition-colors duration-300">
                        {categories[0].name}
                      </h3>

                      <p className="text-[var(--pearl)]/60 text-sm md:text-base max-w-md mb-6">
                        Discover our premium collection
                      </p>

                      <div className="flex items-center gap-2 text-[var(--sand)] font-semibold">
                        <span>Explore Collection</span>
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              {/* Other Categories */}
              {categories.length > 1 && (
                <>
                  <div className="flex items-center gap-3 mb-8">
                    <Grid size={20} className="text-[var(--crimson)]" />
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">All Categories</h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-[var(--border-light)] to-transparent ml-4" />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
                    {categories.slice(1).map((category) => (
                      <Link
                        key={category.id}
                        href={`/category/${category.id}`}
                        className="group relative overflow-hidden rounded-2xl aspect-[3/4] bg-[var(--bg-card)] border border-[var(--border-light)] hover:border-[var(--sand)]/40 transition-all duration-300"
                      >
                        {/* Image */}
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[var(--sand)]/20 to-[var(--crimson)]/10 flex items-center justify-center">
                            <span className="text-7xl md:text-8xl font-black text-[var(--sand)]/20">
                              {category.name?.charAt(0)}
                            </span>
                          </div>
                        )}

                        {/* Simple Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--obsidian)]/80 via-[var(--obsidian)]/20 to-transparent" />

                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-5">
                          <h3 className="text-lg md:text-xl font-bold text-[var(--pearl)] mb-2 group-hover:text-[var(--sand)] transition-colors duration-300">
                            {category.name}
                          </h3>

                          <div className="flex items-center gap-2 text-[var(--sand)] text-sm font-medium">
                            <span>Shop Now</span>
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="text-center py-32">
              <div className="w-24 h-24 rounded-full bg-[var(--bg-card)] border border-[var(--border-light)] flex items-center justify-center mx-auto mb-6">
                <Grid size={40} className="text-[var(--text-muted)]" />
              </div>
              <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3">No Categories Yet</h3>
              <p className="text-[var(--text-muted)] text-lg max-w-md mx-auto">
                Categories will appear here once they are added to the store.
              </p>
            </div>
          )}
        </div>
      </section>

    </div>
  )
}
