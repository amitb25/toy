'use client'

import { X, Heart, ShoppingBag, Star, Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '@/lib/store/useCartStore'
import { useWishlistStore } from '@/lib/store/useWishlistStore'

interface Product {
  id: string
  name: string
  description: string
  price: number
  discount: number
  images: string
  ageGroup: string
  stock: number
  brand?: { name: string }
  category?: { name: string }
}

interface QuickViewProps {
  product: Product
  onClose: () => void
}

export default function QuickView({ product, onClose }: QuickViewProps) {
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((state: any) => state.addItem)
  const { toggleWishlist, isInWishlist } = useWishlistStore()

  const images = product.images ? JSON.parse(product.images) : []
  const finalPrice = product.price - product.discount
  const inWishlist = isInWishlist(product.id)

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product)
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[var(--obsidian)]/85 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-[var(--bg-primary)] border border-[var(--border-color)] max-w-4xl w-full max-h-[85vh] md:max-h-[90vh] overflow-y-auto shadow-2xl rounded-t-2xl md:rounded-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 md:top-4 md:right-4 z-10 p-2 text-[var(--text-secondary)] hover:text-[var(--crimson)] transition-colors bg-[var(--bg-card)] rounded-full shadow-sm"
        >
          <X size={18} strokeWidth={1.5} />
        </button>

        {/* Mobile Drag Handle */}
        <div className="md:hidden flex justify-center pt-3 pb-1">
          <div className="w-12 h-1 bg-[var(--border-color)] rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Section */}
          <div className="bg-[var(--bg-secondary)] p-4 md:p-8 flex items-center justify-center">
            <div className="relative w-full aspect-square max-h-[250px] md:max-h-none">
              {product.discount > 0 && (
                <div className="absolute top-4 left-4 bg-[var(--crimson)] text-[var(--pearl)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded shadow-md">
                  {Math.round((product.discount / product.price) * 100)}% Off
                </div>
              )}
              <img
                src={images[0] || 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?q=80&w=500'}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="p-4 md:p-8 flex flex-col">
            {/* Brand & Category */}
            <div className="flex items-center gap-3 mb-2 md:mb-3">
              {product.brand && (
                <span className="text-[var(--sand)] text-[10px] font-medium uppercase tracking-[0.15em]">
                  {product.brand.name}
                </span>
              )}
              {product.category && (
                <>
                  <span className="text-[var(--text-muted)] text-[10px]">|</span>
                  <span className="text-[var(--text-muted)] text-[10px] uppercase tracking-wider">
                    {product.category.name}
                  </span>
                </>
              )}
            </div>

            {/* Title */}
            <h2 className="text-lg md:text-2xl font-semibold text-[var(--text-primary)] tracking-tight mb-3 md:mb-4">
              {product.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={12} className="text-[var(--sand)] fill-[var(--sand)]" />
                ))}
              </div>
              <span className="text-[var(--text-muted)] text-xs">(128 reviews)</span>
            </div>

            {/* Price */}
            <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-4 md:mb-6">
              <span className="text-xl md:text-2xl font-bold text-[var(--text-primary)]">Rs.{finalPrice}</span>
              {product.discount > 0 && (
                <>
                  <span className="text-base md:text-lg text-[var(--text-muted)] line-through">Rs.{product.price}</span>
                  <span className="bg-[var(--crimson)]/10 text-[var(--crimson)] px-2 md:px-3 py-1 text-[10px] font-bold rounded">
                    Save Rs.{product.discount}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-[var(--text-secondary)] text-xs md:text-sm leading-relaxed mb-4 md:mb-6 line-clamp-3 md:line-clamp-none">
              {product.description}
            </p>

            {/* Age Group & Stock - Combined on mobile */}
            <div className="flex flex-wrap items-center gap-4 mb-4 md:mb-6">
              <div className="flex items-center gap-2">
                <span className="text-[var(--text-muted)] text-xs uppercase tracking-wider">Age:</span>
                <span className="border border-[var(--border-color)] px-2 md:px-3 py-1 text-[var(--text-primary)] text-xs rounded">{product.ageGroup}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`h-1.5 w-1.5 rounded-full ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-[var(--sand)]' : 'bg-[var(--accent)]'}`} />
                <span className="text-xs text-[var(--text-secondary)]">
                  {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <span className="text-[var(--text-muted)] text-xs uppercase tracking-wider">Qty:</span>
              <div className="flex items-center border border-[var(--border-color)] rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors rounded-l-lg"
                >
                  <Minus size={14} strokeWidth={1.5} />
                </button>
                <span className="px-4 text-[var(--text-primary)] font-medium text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-2.5 text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors rounded-r-lg"
                >
                  <Plus size={14} strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-auto pb-4 md:pb-0">
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-4 border rounded-lg transition-all duration-300 ${
                  inWishlist
                    ? 'bg-[var(--crimson)] border-[var(--crimson)] text-[var(--pearl)]'
                    : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--crimson)] hover:text-[var(--crimson)]'
                }`}
              >
                <Heart size={18} strokeWidth={1.5} fill={inWishlist ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-3 bg-[var(--btn-cart-bg)] border border-[var(--border-color)] text-[var(--btn-cart-text)] py-4 font-semibold uppercase text-xs tracking-[0.15em] hover:bg-[var(--btn-cart-hover-bg)] hover:border-[var(--btn-cart-hover-bg)] hover:text-[var(--btn-cart-hover-text)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm hover:shadow-md"
              >
                <ShoppingBag size={16} strokeWidth={1.5} />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
