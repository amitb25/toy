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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-[var(--bg-secondary)] rounded-full text-[var(--text-primary)] hover:bg-[var(--accent)] transition-colors"
        >
          <X size={20} />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Section */}
          <div className="bg-[var(--bg-card)] p-8 flex items-center justify-center">
            <div className="relative w-full aspect-square">
              {product.discount > 0 && (
                <div className="absolute top-4 left-4 bg-[var(--accent)] text-[var(--text-primary)] px-3 py-1 text-xs font-black uppercase rounded">
                  {Math.round((product.discount / product.price) * 100)}% OFF
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
          <div className="p-8 flex flex-col">
            {/* Brand & Category */}
            <div className="flex items-center gap-3 mb-2">
              {product.brand && (
                <span className="text-[var(--accent)] text-xs font-black uppercase tracking-wider">
                  {product.brand.name}
                </span>
              )}
              {product.category && (
                <span className="text-[var(--text-muted)] text-xs uppercase">
                  {product.category.name}
                </span>
              )}
            </div>

            {/* Title */}
            <h2 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tight mb-4">
              {product.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={14} className="text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <span className="text-[var(--text-muted)] text-sm">(128 reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-black text-[var(--text-primary)]">₹{finalPrice}</span>
              {product.discount > 0 && (
                <>
                  <span className="text-xl text-[var(--text-muted)] line-through">₹{product.price}</span>
                  <span className="bg-green-500/20 text-green-400 px-2 py-1 text-xs font-bold rounded">
                    Save ₹{product.discount}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Age Group */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-[var(--text-muted)] text-sm">Age:</span>
              <span className="bg-[var(--bg-secondary)] px-3 py-1 text-[var(--text-primary)] text-sm rounded">{product.ageGroup}</span>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`h-2 w-2 rounded-full ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`} />
              <span className="text-sm text-[var(--text-secondary)]">
                {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-[var(--text-muted)] text-sm">Quantity:</span>
              <div className="flex items-center border border-[var(--border-color)] rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 text-[var(--text-primary)] font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-2 text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-auto">
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-4 border rounded-lg transition-all ${
                  inWishlist
                    ? 'bg-[var(--accent)] border-[var(--accent)] text-[var(--text-primary)]'
                    : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
                }`}
              >
                <Heart size={20} fill={inWishlist ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-3 bg-[var(--accent)] text-[var(--text-primary)] py-4 rounded-lg font-black uppercase tracking-wider hover:bg-white hover:text-[var(--accent)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag size={20} />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
