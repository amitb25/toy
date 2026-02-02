'use client'

import Link from 'next/link'
import { Heart, ShoppingBag, Trash2, ArrowLeft } from 'lucide-react'
import { useWishlistStore } from '@/lib/store/useWishlistStore'
import { useCartStore } from '@/lib/store/useCartStore'
import { useEffect, useState } from 'react'

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false)
  const { items, removeItem, clearWishlist } = useWishlistStore()
  const addToCart = useCartStore((state: any) => state.addItem)

  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return null

  const handleMoveToCart = (item: any) => {
    addToCart(item)
    removeItem(item.id)
  }

  return (
    <div className="bg-[var(--bg-primary)] min-h-screen text-[var(--text-primary)]">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <Link href="/" className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-4">
              <ArrowLeft size={16} />
              <span className="text-sm">Back to Shop</span>
            </Link>
            <h1 className="text-4xl font-black uppercase tracking-tight flex items-center gap-3">
              <Heart className="text-[var(--accent)]" size={32} />
              My Wishlist
            </h1>
            <p className="text-[var(--text-muted)] mt-2">{items.length} items saved</p>
          </div>
          {items.length > 0 && (
            <button
              onClick={clearWishlist}
              className="text-[var(--text-muted)] hover:text-[var(--accent)] text-sm font-bold uppercase tracking-wider transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Wishlist Items */}
        {items.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={64} className="mx-auto text-[var(--text-muted)] mb-6" />
            <h2 className="text-2xl font-black uppercase text-[var(--text-muted)] mb-4">Your wishlist is empty</h2>
            <p className="text-[var(--text-muted)] mb-8">Start adding items you love!</p>
            <Link
              href="/"
              className="inline-block bg-[var(--accent)] text-[var(--text-primary)] px-8 py-4 font-black uppercase text-sm tracking-wider hover:bg-white hover:text-[var(--accent)] transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => {
              const images = item.images ? JSON.parse(item.images) : []
              const finalPrice = item.price - item.discount

              return (
                <div key={item.id} className="bg-[var(--bg-card)] border border-[var(--border-light)] rounded-xl overflow-hidden group">
                  {/* Image */}
                  <div className="aspect-square bg-[var(--bg-primary)] relative">
                    <img
                      src={images[0] || 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?q=80&w=500'}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                    {item.discount > 0 && (
                      <div className="absolute top-3 left-3 bg-[var(--accent)] text-[var(--text-primary)] px-2 py-1 text-[10px] font-black uppercase rounded">
                        {Math.round((item.discount / item.price) * 100)}% OFF
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <p className="text-[10px] font-black uppercase text-[var(--accent)] tracking-wider mb-1">
                      {item.brand?.name || 'Avengers HQ'}
                    </p>
                    <h3 className="font-bold text-[var(--text-primary)] mb-3 line-clamp-2">{item.name}</h3>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl font-black text-[var(--text-primary)]">₹{finalPrice}</span>
                      {item.discount > 0 && (
                        <span className="text-sm text-[var(--text-muted)] line-through">₹{item.price}</span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleMoveToCart(item)}
                        className="flex-1 flex items-center justify-center gap-2 bg-[var(--accent)] text-[var(--text-primary)] py-3 rounded-lg font-bold text-sm uppercase hover:bg-white hover:text-[var(--accent)] transition-all"
                      >
                        <ShoppingBag size={16} />
                        Add to Cart
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-3 border border-[var(--border-color)] rounded-lg text-[var(--text-muted)] hover:border-[#e23636] hover:text-[var(--accent)] transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
