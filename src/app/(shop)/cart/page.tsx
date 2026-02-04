'use client'

import Link from 'next/link'
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft } from 'lucide-react'
import { useCartStore } from '@/lib/store/useCartStore'
import { useEffect, useState } from 'react'

export default function CartPage() {
  const [mounted, setMounted] = useState(false)
  const items = useCartStore((state: any) => state.items)
  const removeItem = useCartStore((state: any) => state.removeItem)
  const clearCart = useCartStore((state: any) => state.clearCart)
  const incrementQuantity = useCartStore((state: any) => state.incrementQuantity)
  const decrementQuantity = useCartStore((state: any) => state.decrementQuantity)

  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return null

  const totalItems = items.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0)
  const subtotal = items.reduce((acc: number, item: any) => acc + ((item.price - (item.discount || 0)) * (item.quantity || 1)), 0)
  const shipping = subtotal > 1999 ? 0 : 99
  const total = subtotal + shipping

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-24 h-24 md:w-32 md:h-32 mx-auto bg-[var(--bg-card)] rounded-full flex items-center justify-center mb-8">
            <ShoppingBag size={48} className="text-[var(--text-muted)]" />
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-[var(--text-primary)] uppercase tracking-tight mb-4">Your Cart is Empty</h1>
          <p className="text-[var(--text-muted)] mb-8">Time to assemble some heroes!</p>
          <Link href="/" className="inline-block bg-[var(--accent)] text-[var(--text-primary)] px-8 py-4 font-black uppercase text-sm tracking-wider hover:bg-white hover:text-[var(--accent)] transition-all rounded-lg">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-4">
            <ArrowLeft size={16} />
            <span className="text-sm">Continue Shopping</span>
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-black text-[var(--text-primary)] uppercase tracking-tight flex items-center gap-3">
                <ShoppingBag className="text-[var(--accent)]" size={28} /> Your Cart
              </h1>
              <p className="text-[var(--text-muted)] text-sm mt-1">{totalItems} {totalItems === 1 ? 'item' : 'items'}</p>
            </div>
            <button onClick={clearCart} className="text-xs font-bold text-[var(--text-muted)] hover:text-[var(--accent)] uppercase tracking-wider transition-colors">
              Clear Cart
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1 space-y-4">
            {items.map((item: any) => {
              const images = item.images ? JSON.parse(item.images) : []
              const finalPrice = item.price - (item.discount || 0)

              return (
                <div key={item.id} className="bg-[var(--bg-card)] border border-[var(--border-light)] rounded-xl p-4 md:p-6">
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="w-20 h-20 md:w-28 md:h-28 flex-shrink-0 bg-[var(--bg-primary)] rounded-lg overflow-hidden">
                      <img
                        src={images[0] || 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?q=80&w=500'}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-wider">{item.brand?.name || 'Avengers HQ'}</p>
                      <h3 className="text-sm md:text-lg font-bold text-[var(--text-primary)] truncate">{item.name}</h3>

                      {/* Mobile Price */}
                      <div className="flex items-center gap-2 mt-2 md:hidden">
                        <span className="text-lg font-black text-[var(--text-primary)]">₹{finalPrice}</span>
                        {item.discount > 0 && (
                          <span className="text-sm text-[var(--text-muted)] line-through">₹{item.price}</span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center bg-[var(--bg-primary)] rounded-lg border border-[var(--border-color)]">
                          <button
                            onClick={() => decrementQuantity(item.id)}
                            className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-3 text-[var(--text-primary)] font-bold text-sm">{item.quantity || 1}</span>
                          <button
                            onClick={() => incrementQuantity(item.id)}
                            className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Desktop Price */}
                    <div className="hidden md:block text-right">
                      <span className="text-2xl font-black text-[var(--text-primary)]">₹{finalPrice}</span>
                      {item.discount > 0 && (
                        <p className="text-sm text-[var(--text-muted)] line-through">₹{item.price}</p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-96">
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 lg:sticky lg:top-24">
              <h2 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-tight mb-6">Order Summary</h2>

              <div className="space-y-4 border-b border-[var(--border-color)] pb-6 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-muted)]">Subtotal</span>
                  <span className="text-[var(--text-primary)] font-bold">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-muted)]">Shipping</span>
                  <span className={`font-bold ${shipping === 0 ? 'text-green-500' : 'text-[var(--text-primary)]'}`}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-[var(--text-muted)]">Free shipping on orders above ₹1999</p>
                )}
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-[var(--text-muted)] font-bold uppercase tracking-wider">Total</span>
                <span className="text-3xl font-black text-[var(--accent)]">₹{total}</span>
              </div>

              <Link
                href="/checkout"
                className="w-full flex items-center justify-center gap-2 bg-[var(--accent)] text-[var(--text-primary)] py-4 rounded-lg font-black uppercase tracking-wider text-sm hover:bg-white hover:text-[var(--accent)] transition-all"
              >
                Checkout <ArrowRight size={18} />
              </Link>

              <p className="text-center text-[10px] text-[var(--text-muted)] uppercase tracking-wider mt-4">
                Secure checkout powered by Stark Industries
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
