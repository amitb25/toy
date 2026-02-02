'use client'

import { Heart, ShoppingCart, Eye } from 'lucide-react'
import { useCartStore } from '@/lib/store/useCartStore'
import { useWishlistStore } from '@/lib/store/useWishlistStore'
import Link from 'next/link'

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
}

interface ProductCardProps {
  product: Product
  onQuickView?: (product: Product) => void
  variant?: 'default' | 'featured' | 'deal'
}

export default function ProductCard({ product, onQuickView, variant = 'default' }: ProductCardProps) {
  const addItem = useCartStore((state: any) => state.addItem)
  const { toggleWishlist, isInWishlist } = useWishlistStore()

  const images = product.images ? JSON.parse(product.images) : []
  const finalPrice = product.price - product.discount
  const inWishlist = isInWishlist(product.id)
  const discountPercent = product.discount > 0 ? Math.round((product.discount / product.price) * 100) : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product)
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onQuickView) onQuickView(product)
  }

  return (
    <div className="group relative bg-[var(--bg-card)] rounded-xl overflow-hidden border border-[var(--border-light)] hover:border-[var(--accent)] transition-all duration-300 shadow-sm hover:shadow-lg">
      {/* Discount Badge */}
      {product.discount > 0 && (
        <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-[var(--accent)] text-white px-2 py-1 text-[10px] font-black uppercase rounded z-10">
          {discountPercent}% OFF
        </div>
      )}

      {/* Featured Badge */}
      {product.featured && !product.discount && (
        <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-yellow-500 text-black px-2 py-1 text-[10px] font-black uppercase rounded z-10">
          Featured
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={handleWishlist}
        className={`absolute top-2 right-2 md:top-3 md:right-3 w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full z-10 transition-all ${
          inWishlist
            ? 'bg-[var(--accent)] text-white'
            : 'bg-[var(--bg-primary)]/80 text-[var(--text-secondary)] hover:bg-[var(--accent)] hover:text-white'
        }`}
      >
        <Heart size={14} fill={inWishlist ? 'currentColor' : 'none'} />
      </button>

      {/* Quick View Button - Desktop only */}
      <button
        onClick={handleQuickView}
        className="absolute top-2 right-12 md:top-3 md:right-14 w-8 h-8 md:w-9 md:h-9 hidden md:flex items-center justify-center rounded-full bg-[var(--bg-primary)]/80 text-[var(--text-secondary)] hover:bg-[var(--accent)] hover:text-white z-10 opacity-0 group-hover:opacity-100 transition-all"
      >
        <Eye size={14} />
      </button>

      {/* Image */}
      <Link href={`/product/${product.id}`}>
        <div className="aspect-square overflow-hidden bg-[var(--bg-secondary)] cursor-pointer">
          <img
            src={images[0] || 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?q=80&w=500'}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </Link>

      {/* Content */}
      <div className="p-3 md:p-4">
        {/* Brand */}
        <p className="text-[10px] md:text-[11px] font-black uppercase text-[var(--accent)] tracking-wider mb-1">
          {product.brand?.name || 'Avengers HQ'}
        </p>

        {/* Product Name */}
        <Link href={`/product/${product.id}`}>
          <h4 className="text-sm md:text-base font-bold text-[var(--text-primary)] truncate mb-2 md:mb-3 hover:text-[var(--accent)] transition-colors cursor-pointer">
            {product.name}
          </h4>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg md:text-xl font-black text-[var(--text-primary)]">₹{finalPrice}</span>
          {product.discount > 0 && (
            <span className="text-xs md:text-sm text-[var(--text-muted)] line-through">₹{product.price}</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-[var(--accent)] text-white py-2.5 md:py-3 text-xs md:text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-[var(--accent-hover)] transition-all flex items-center justify-center gap-2"
        >
          <ShoppingCart size={14} className="md:hidden" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  )
}
