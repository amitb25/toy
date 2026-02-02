'use client'

import { Star, ShieldCheck, Truck, RotateCcw, Heart, Plus, Minus, ArrowLeft } from 'lucide-react'
import { useCartStore } from '@/lib/store/useCartStore'
import { useWishlistStore } from '@/lib/store/useWishlistStore'
import { useState, useEffect, use } from 'react'
import Link from 'next/link'

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const addItem = useCartStore((state: any) => state.addItem)
  const { toggleWishlist, isInWishlist } = useWishlistStore()
  const [qty, setQty] = useState(1)
  const [product, setProduct] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetch(`/api/products`)
      .then(res => res.json())
      .then(data => {
        const found = data.find((p: any) => p.id === id)
        if (found) setProduct(found)
      })
  }, [id])

  if (!mounted) return null

  if (!product) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--text-muted)]">Loading...</p>
        </div>
      </div>
    )
  }

  const images = product.images ? JSON.parse(product.images) : []
  const finalPrice = product.price - product.discount
  const inWishlist = isInWishlist(product.id)

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addItem(product)
    }
    alert('Added to cart!')
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-12">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-6">
          <ArrowLeft size={16} />
          <span className="text-sm">Back to Shop</span>
        </Link>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          {/* Images */}
          <div className="w-full lg:w-1/2">
            <div className="aspect-square bg-[var(--bg-card)] rounded-xl overflow-hidden mb-4">
              <img
                src={images[0] || 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?q=80&w=500'}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="aspect-square bg-[var(--bg-card)] rounded-lg overflow-hidden border-2 border-transparent hover:border-[var(--accent)] cursor-pointer transition-colors">
                  <img
                    src={images[0] || 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?q=80&w=200'}
                    alt=""
                    className="w-full h-full object-contain opacity-60 hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="w-full lg:w-1/2">
            <div className="lg:sticky lg:top-24">
              {/* Brand & Category */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[var(--accent)] text-xs font-black uppercase tracking-wider">{product.brand?.name}</span>
                {product.category && (
                  <span className="text-[var(--text-muted)] text-xs uppercase">{product.category.name}</span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-4xl font-black text-[var(--text-primary)] uppercase tracking-tight mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={16} className="text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <span className="text-[var(--text-muted)] text-sm">(128 reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl md:text-4xl font-black text-[var(--text-primary)]">₹{finalPrice}</span>
                {product.discount > 0 && (
                  <>
                    <span className="text-xl text-[var(--text-muted)] line-through">₹{product.price}</span>
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 text-sm font-bold rounded">
                      {Math.round((product.discount / product.price) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-[var(--bg-card)] rounded-xl">
                <div>
                  <p className="text-[var(--text-muted)] text-xs uppercase tracking-wider mb-1">Age Group</p>
                  <p className="text-[var(--text-primary)] font-bold">{product.ageGroup}</p>
                </div>
                <div>
                  <p className="text-[var(--text-muted)] text-xs uppercase tracking-wider mb-1">Stock</p>
                  <p className={`font-bold ${product.stock > 10 ? 'text-green-500' : product.stock > 0 ? 'text-yellow-500' : 'text-red-500'}`}>
                    {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
                  </p>
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-[var(--text-muted)] text-sm">Quantity:</span>
                <div className="flex items-center border border-[var(--border-color)] rounded-lg">
                  <button
                    onClick={() => qty > 1 && setQty(qty - 1)}
                    className="p-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 text-[var(--text-primary)] font-bold">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="p-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-[var(--accent)] text-[var(--text-primary)] py-4 rounded-lg font-black uppercase tracking-wider text-sm hover:bg-white hover:text-[var(--accent)] transition-all"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-4 rounded-lg border transition-all ${
                    inWishlist
                      ? 'bg-[var(--accent)] border-[var(--accent)] text-[var(--text-primary)]'
                      : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
                  }`}
                >
                  <Heart size={20} fill={inWishlist ? 'currentColor' : 'none'} />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-[var(--bg-card)] rounded-xl">
                <div className="flex items-center gap-3 text-[var(--text-muted)] text-xs">
                  <Truck size={18} className="text-[var(--accent)]" />
                  <span>Free Shipping on ₹1999+</span>
                </div>
                <div className="flex items-center gap-3 text-[var(--text-muted)] text-xs">
                  <RotateCcw size={18} className="text-[var(--accent)]" />
                  <span>7 Days Easy Return</span>
                </div>
                <div className="flex items-center gap-3 text-[var(--text-muted)] text-xs">
                  <ShieldCheck size={18} className="text-[var(--accent)]" />
                  <span>100% Authentic</span>
                </div>
                <div className="flex items-center gap-3 text-[var(--text-muted)] text-xs">
                  <Star size={18} className="text-[var(--accent)]" />
                  <span>Top Rated Product</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
