'use client'

import { Heart, ShoppingCart, Eye, Star, Zap, Sparkles } from 'lucide-react'
import { useCartStore } from '@/lib/store/useCartStore'
import { useWishlistStore } from '@/lib/store/useWishlistStore'
import Link from 'next/link'
import { useState, useEffect, useMemo } from 'react'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  slug?: string
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
}

interface ProductCardProps {
  product: Product
  onQuickView?: (product: Product) => void
  variant?: 'default' | 'featured' | 'deal'
}

export default function ProductCard({ product, onQuickView, variant = 'default' }: ProductCardProps) {
  const addItem = useCartStore((state: any) => state.addItem)
  const { toggleWishlist, isInWishlist } = useWishlistStore()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const images = product.images ? JSON.parse(product.images) : []
  const finalPrice = product.price - product.discount
  const inWishlist = mounted && isInWishlist(product.id)
  const discountPercent = product.discount > 0 ? Math.round((product.discount / product.price) * 100) : 0

  // Check if product is new (within last 7 days) - computed after mount to avoid server/client mismatch
  const [isNew, setIsNew] = useState(false)
  useEffect(() => {
    if (product.createdAt) {
      setIsNew((Date.now() - new Date(product.createdAt).getTime()) < 7 * 24 * 60 * 60 * 1000)
    }
  }, [product.createdAt])

  // Deterministic review count derived from product ID
  const rating = 4.5
  const reviewCount = useMemo(() => {
    let hash = 0
    for (let i = 0; i < product.id.length; i++) {
      hash = ((hash << 5) - hash) + product.id.charCodeAt(i)
      hash |= 0
    }
    return Math.abs(hash % 91) + 10
  }, [product.id])

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)

    toast.success(
      (t) => (
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg overflow-hidden bg-[var(--bg-secondary)] flex-shrink-0 border border-[var(--sand)]/30">
            <img
              src={images[0] || 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?q=80&w=100'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="font-bold text-sm text-[var(--text-primary)]">Added to Cart!</p>
            <p className="text-[11px] text-[var(--text-muted)] line-clamp-1">{product.name}</p>
          </div>
        </div>
      ),
      {
        duration: 2000,
        position: 'bottom-right',
        style: {
          background: 'var(--bg-card)',
          color: 'var(--text-primary)',
          padding: '10px 14px',
          borderRadius: '14px',
          border: '2px solid var(--sand)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
        },
      }
    )
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product)

    if (!inWishlist) {
      toast.success('Added to Wishlist', {
        duration: 2000,
        position: 'bottom-right',
        icon: '❤️',
        style: {
          background: 'var(--bg-card)',
          color: 'var(--text-primary)',
          borderRadius: '16px',
          border: '2px solid var(--crimson)',
        },
      })
    }
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onQuickView) onQuickView(product)
  }

  return (
    <div
      className="group relative bg-[var(--bg-card)] overflow-hidden rounded-2xl border border-[var(--border-light)] hover:border-[var(--sand)]/40 transition-colors duration-300 shadow-sm mb-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >

      {/* Badges Container */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="bg-[var(--crimson)] text-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center gap-1">
            <Zap size={10} />
            <span>{discountPercent}% Off</span>
          </div>
        )}

        {/* New Badge */}
        {isNew && !product.discount && (
          <div className="bg-[var(--sand)] text-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center gap-1">
            <Sparkles size={10} />
            <span>New</span>
          </div>
        )}

        {/* Featured Badge */}
        {product.featured && !product.discount && !isNew && (
          <div className="bg-[var(--sand)] text-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg">
            Featured
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-300 cursor-pointer ${
            inWishlist
              ? 'bg-[var(--crimson)] text-white'
              : 'bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-light)] opacity-0 group-hover:opacity-100 hover:bg-[var(--crimson)] hover:text-white hover:border-[var(--crimson)]'
          }`}
        >
          <Heart size={14} strokeWidth={2.5} fill={inWishlist ? 'currentColor' : 'none'} />
        </button>

        {/* Quick View Button */}
        <button
          onClick={handleQuickView}
          className="w-9 h-9 hidden md:flex items-center justify-center bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-light)] hover:bg-[var(--sand)] hover:text-white hover:border-[var(--sand)] rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
        >
          <Eye size={14} strokeWidth={2.5} />
        </button>
      </div>

      {/* Image Container */}
      <Link href={`/product/${product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`}>
        <div className="relative aspect-square overflow-hidden bg-[var(--bg-secondary)] cursor-pointer">
          {/* Shimmer Loading */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--bg-card)] to-transparent animate-pulse" />
          )}

          {/* Product Image */}
          <img
            src={images[0] || 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?q=80&w=500'}
            alt={product.name}
            className="w-full h-full object-cover"
            onLoad={() => setImageLoaded(true)}
          />
        </div>
      </Link>

      {/* Content */}
      <div className="p-3 md:p-4 space-y-2">
        {/* Brand */}
        <div className="flex items-center justify-between gap-1">
          <p className="text-[9px] md:text-[10px] font-bold uppercase text-[var(--price-color)] tracking-wider truncate">
            {product.brand?.name || 'Avengers HQ'}
          </p>
          {product.category && (
            <span className="text-[8px] md:text-[9px] font-medium text-[var(--text-muted)] bg-[var(--bg-secondary)] px-1.5 md:px-2 py-0.5 rounded-full whitespace-nowrap">
              {product.category.name}
            </span>
          )}
        </div>

        {/* Product Name */}
        <Link href={`/product/${product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`}>
          <h4 className="text-xs md:text-sm font-semibold text-[var(--text-primary)] line-clamp-2 hover:text-[var(--sand)] transition-colors cursor-pointer leading-snug min-h-[2rem] md:min-h-[2.5rem]">
            {product.name}
          </h4>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={11}
                className={i < Math.floor(rating) ? 'text-[var(--price-color)] fill-[var(--price-color)]' : 'text-[var(--border-color)]'}
              />
            ))}
          </div>
          <span className="text-[10px] text-[var(--text-muted)]">({reviewCount})</span>
        </div>

        {/* Price Section */}
        <div className="flex items-baseline gap-1.5 md:gap-2">
          <span className="text-base md:text-xl font-bold text-[var(--price-color)]">
            ₹{finalPrice.toLocaleString()}
          </span>
          {product.discount > 0 && (
            <span className="text-[10px] md:text-xs text-[var(--text-muted)] line-through">
              ₹{product.price.toLocaleString()}
            </span>
          )}
        </div>

        {/* Stock Indicator */}
        <div className="flex items-center gap-2 py-1">
          {product.stock > 0 ? (
            <>
              <div className="flex-1 h-1 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--price-color)] rounded-full"
                  style={{ width: `${Math.min((product.stock / 50) * 100, 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-[var(--price-color)] font-semibold">
                {product.stock <= 5 ? `Only ${product.stock} left` : 'In Stock'}
              </span>
            </>
          ) : (
            <>
              <div className="flex-1 h-1 bg-red-100 rounded-full" />
              <span className="text-[10px] text-red-500 font-semibold">Out of Stock</span>
            </>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full py-2.5 md:py-3 text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 md:gap-2 cursor-pointer ${
            product.stock === 0
              ? 'bg-[var(--bg-secondary)] text-[var(--text-muted)] cursor-not-allowed'
              : 'bg-[var(--text-primary)] text-[var(--bg-primary)] hover:bg-[var(--sand)] active:scale-[0.98]'
          }`}
        >
          <ShoppingCart size={12} className="md:w-[14px] md:h-[14px]" strokeWidth={2.5} />
          <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
        </button>
      </div>
    </div>
  )
}
