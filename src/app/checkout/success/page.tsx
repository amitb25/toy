'use client'

import Link from 'next/link'
import { CheckCircle, ShoppingBag, ArrowRight, Truck, Mail, MessageSquare, Shield } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function OrderSuccessPage() {
  const [mounted, setMounted] = useState(false)
  const [orderData, setOrderData] = useState({ orderId: '', totalAmount: 0, email: '' })

  useEffect(() => {
    window.scrollTo(0, 0)
    setMounted(true)
    try {
      const stored = sessionStorage.getItem('lastOrder')
      if (stored) {
        setOrderData(JSON.parse(stored))
        sessionStorage.removeItem('lastOrder')
      }
    } catch {}
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 md:p-12 text-center">
          {/* Success Icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-full bg-green-500/20 text-green-500">
            <CheckCircle size={48} />
          </div>

          <h1 className="text-2xl md:text-4xl font-black text-[var(--text-primary)] uppercase tracking-tight">Order Confirmed!</h1>
          <p className="mt-4 text-sm md:text-base text-[var(--text-secondary)]">
            Thank you for shopping at Avengers HQ. Your heroes are being assembled!
          </p>

          {/* Order Details Card */}
          <div className="mt-8 md:mt-10 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-light)] p-4 md:p-6 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[var(--border-color)] pb-4 mb-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-1">Order ID</p>
                <p className="text-lg md:text-xl font-black text-[var(--accent)]">{orderData.orderId || '---'}</p>
              </div>
              <div className="sm:text-right">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-1">Total Paid</p>
                <p className="text-lg md:text-xl font-black text-[var(--text-primary)]">
                  {orderData.totalAmount ? `₹${orderData.totalAmount.toLocaleString()}` : '---'}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {orderData.email && (
                <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                  <Mail size={18} className="text-[var(--accent)] flex-shrink-0" />
                  <span>Confirmation sent to <strong className="text-[var(--text-primary)]">{orderData.email}</strong></span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                <MessageSquare size={18} className="text-green-500 flex-shrink-0" />
                <span>Order updates via <strong className="text-[var(--text-primary)]">WhatsApp</strong></span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                <Truck size={18} className="text-blue-500 flex-shrink-0" />
                <span>Estimated delivery: <strong className="text-[var(--text-primary)]">3-5 Business Days</strong></span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-2 bg-[var(--accent)] text-[var(--text-primary)] py-4 rounded-lg font-black uppercase tracking-wider text-sm hover:bg-white hover:text-[var(--accent)] transition-all"
            >
              <ShoppingBag size={18} /> Continue Shopping
            </Link>
            <Link
              href="/track-order"
              className="flex-1 flex items-center justify-center gap-2 bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] py-4 rounded-lg font-bold uppercase tracking-wider text-sm hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
            >
              Track Order <ArrowRight size={18} />
            </Link>
          </div>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 mt-6 text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
            <Shield size={14} className="text-green-500" /> Secured by Stark Industries
          </div>
        </div>
      </div>
    </div>
  )
}
