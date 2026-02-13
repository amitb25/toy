'use client'

import Link from 'next/link'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useCartStore } from '@/lib/store/useCartStore'
import { usePathname } from 'next/navigation'

export default function CartBottomBar() {
  const items = useCartStore((s) => s.items)
  const getTotalItems = useCartStore((s) => s.getTotalItems)
  const getTotalPrice = useCartStore((s) => s.getTotalPrice)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null
  if (pathname.startsWith('/cart') || pathname.startsWith('/checkout') || pathname.startsWith('/admin')) return null

  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()
  const visible = totalItems > 0

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transition-transform duration-300 ease-out ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <Link
        href="/cart"
        className="flex items-center justify-between gap-3 mx-3 mb-3 px-4 py-3.5 bg-[var(--text-primary)] rounded-2xl shadow-[0_-4px_30px_rgba(0,0,0,0.2)]"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShoppingBag size={20} className="text-[var(--bg-primary)]" />
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-[var(--accent)] text-white text-[10px] font-black rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          </div>
          <div>
            <p className="text-[var(--bg-primary)] text-xs font-bold">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} added
            </p>
            <p className="text-[var(--bg-primary)]/60 text-[10px] font-medium">
              ₹{totalPrice.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-[var(--accent)] text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider">
          Go to Cart
          <ArrowRight size={14} />
        </div>
      </Link>
    </div>
  )
}
