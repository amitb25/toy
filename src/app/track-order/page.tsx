'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Search, Package, MapPin, Truck, CheckCircle, Clock, Loader2, XCircle } from 'lucide-react'

interface OrderData {
  orderId: string
  status: string
  totalAmount: number
  paymentMode: string
  shippingAddress: string
  createdAt: string
  user: { name: string; email: string; phone: string }
  items: { id: string; quantity: number; price: number; product: { name: string; images: string } }[]
}

const STEPS = [
  { key: 'PENDING', label: 'Order Placed', icon: CheckCircle },
  { key: 'PROCESSING', label: 'Processing', icon: Package },
  { key: 'SHIPPED', label: 'Shipped', icon: Truck },
  { key: 'DELIVERED', label: 'Delivered', icon: MapPin },
]

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('')
  const [order, setOrder] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderId.trim()) return

    setLoading(true)
    setError('')
    setOrder(null)
    setSearched(true)

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId.trim())}`)
      if (!res.ok) {
        setError(`No order found with ID ${orderId.trim()}`)
        return
      }
      const data = await res.json()
      setOrder(data)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getStepIndex = (status: string) => {
    if (status === 'CANCELLED') return -1
    const idx = STEPS.findIndex(s => s.key === status)
    return idx >= 0 ? idx : 0
  }

  const currentStep = order ? getStepIndex(order.status) : -1

  const formatDate = (d: string) => {
    return new Date(d).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    })
  }

  const parseAddress = (addr: string) => {
    try { return JSON.parse(addr) } catch { return { address: addr } }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[var(--brand-banner-bg)] py-10 md:py-24">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-[var(--pearl)]/60 hover:text-[var(--sand)] transition-colors mb-6 md:mb-8 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs md:text-sm font-medium">Back to Home</span>
          </Link>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 md:gap-3 border border-[var(--sand)]/30 bg-[var(--sand)]/20 rounded-full px-4 md:px-6 py-2 md:py-3 mb-6 md:mb-8">
              <Package size={14} className="text-[var(--sand)]" />
              <span className="text-[var(--sand)] text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em]">Order Status</span>
            </div>

            <h1 className="text-3xl md:text-6xl lg:text-7xl font-thin text-[var(--pearl)] tracking-tight mb-4 md:mb-6">
              Track Your <span className="font-bold text-[var(--sand)]">Order</span>
            </h1>

            <p className="text-[var(--pearl)]/60 text-sm md:text-lg max-w-xl mx-auto">
              Enter your order ID to check the current status of your delivery.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl">
          {/* Search Form */}
          <form onSubmit={handleSubmit} className="mb-10">
            <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Order ID</label>
            <div className="flex gap-3">
              <input
                type="text"
                required
                value={orderId}
                onChange={(e) => { setOrderId(e.target.value); setSearched(false); setOrder(null); setError('') }}
                className="flex-1 px-4 py-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-sm outline-none focus:border-[var(--sand)] transition-colors"
                placeholder="e.g. AHQ-1001"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-[var(--sand)] text-white hover:bg-[var(--accent-hover)] px-6 py-3 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all duration-300 cursor-pointer flex items-center gap-2 disabled:opacity-60"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
                Track
              </button>
            </div>
          </form>

          {/* Error State */}
          {error && searched && (
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 md:p-8">
              <p className="text-sm text-[var(--text-muted)] mb-6">
                {error}. Please double-check your order ID and try again.
              </p>

              {/* Empty timeline */}
              <div className="space-y-0">
                {STEPS.map((step, idx) => (
                  <div key={step.key} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-center">
                        <step.icon size={14} className="text-[var(--text-muted)]" />
                      </div>
                      {idx < STEPS.length - 1 && <div className="w-px h-8 bg-[var(--border-light)]" />}
                    </div>
                    <div className="pt-1">
                      <p className="text-sm text-[var(--text-muted)]">{step.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--border-color)] text-center">
                <p className="text-xs text-[var(--text-muted)]">
                  Need help? <Link href="/contact-us" className="text-[var(--sand)] hover:underline">Contact our support team</Link>
                </p>
              </div>
            </div>
          )}

          {/* Order Found */}
          {order && (
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 md:p-8 space-y-8">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[var(--border-color)]">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-1">Order ID</p>
                  <p className="text-xl font-black text-[var(--sand)]">{order.orderId}</p>
                </div>
                <div className="sm:text-right">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-1">Total</p>
                  <p className="text-xl font-black text-[var(--text-primary)]">₹{order.totalAmount.toLocaleString()}</p>
                </div>
              </div>

              {/* Cancelled */}
              {order.status === 'CANCELLED' ? (
                <div className="flex items-center gap-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                  <XCircle size={24} className="text-red-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-red-400">Order Cancelled</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1">This order has been cancelled. Contact support for refund info.</p>
                  </div>
                </div>
              ) : (
                /* Timeline - Horizontal on desktop, vertical on mobile */
                <>
                  {/* Desktop: Horizontal */}
                  <div className="hidden md:flex items-start justify-between">
                    {STEPS.map((step, idx) => {
                      const isCompleted = idx <= currentStep
                      const isCurrent = idx === currentStep
                      return (
                        <div key={step.key} className="flex-1 flex flex-col items-center relative">
                          {/* Connector line */}
                          {idx < STEPS.length - 1 && (
                            <div className={`absolute top-5 left-[calc(50%+24px)] right-[calc(-50%+24px)] h-0.5 ${idx < currentStep ? 'bg-green-500' : 'bg-[var(--border-light)]'}`} />
                          )}
                          <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            isCompleted
                              ? 'bg-green-500/20 border-2 border-green-500'
                              : 'bg-[var(--bg-secondary)] border border-[var(--border-color)]'
                          } ${isCurrent ? 'ring-4 ring-green-500/20' : ''}`}>
                            <step.icon size={16} className={isCompleted ? 'text-green-400' : 'text-[var(--text-muted)]'} />
                          </div>
                          <p className={`text-xs font-semibold mt-3 text-center ${isCompleted ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>
                            {step.label}
                          </p>
                          {isCurrent && (
                            <p className="text-[10px] text-green-400 mt-1 font-medium">Current</p>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Mobile: Vertical */}
                  <div className="md:hidden space-y-0">
                    {STEPS.map((step, idx) => {
                      const isCompleted = idx <= currentStep
                      const isCurrent = idx === currentStep
                      return (
                        <div key={step.key} className="flex items-start gap-4">
                          <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                              isCompleted
                                ? 'bg-green-500/20 border-2 border-green-500'
                                : 'bg-[var(--bg-secondary)] border border-[var(--border-color)]'
                            } ${isCurrent ? 'ring-4 ring-green-500/20' : ''}`}>
                              <step.icon size={16} className={isCompleted ? 'text-green-400' : 'text-[var(--text-muted)]'} />
                            </div>
                            {idx < STEPS.length - 1 && (
                              <div className={`w-0.5 h-10 ${idx < currentStep ? 'bg-green-500' : 'bg-[var(--border-light)]'}`} />
                            )}
                          </div>
                          <div className="pt-2">
                            <p className={`text-sm font-semibold ${isCompleted ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>
                              {step.label}
                            </p>
                            {isCurrent && (
                              <p className="text-xs text-green-400 mt-1 font-medium">Current status</p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </>
              )}

              {/* Order Items */}
              <div className="pt-6 border-t border-[var(--border-color)]">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4">Items ({order.items.length})</p>
                <div className="space-y-3">
                  {order.items.map((item) => {
                    const images = item.product.images ? JSON.parse(item.product.images) : []
                    return (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-[var(--bg-secondary)] flex-shrink-0">
                          {images[0] && <img src={images[0]} alt={item.product.name} className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{item.product.name}</p>
                          <p className="text-xs text-[var(--text-muted)]">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-bold text-[var(--text-primary)]">₹{item.price.toLocaleString()}</p>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Shipping */}
              <div className="pt-6 border-t border-[var(--border-color)]">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3">Shipping To</p>
                {(() => {
                  const addr = parseAddress(order.shippingAddress)
                  return (
                    <div className="text-sm text-[var(--text-secondary)] space-y-0.5">
                      <p className="font-semibold text-[var(--text-primary)]">{addr.name}</p>
                      <p>{addr.address}</p>
                      <p>{addr.city} - {addr.pincode}</p>
                    </div>
                  )
                })()}
              </div>

              {/* Order Info */}
              <div className="pt-6 border-t border-[var(--border-color)] flex flex-wrap gap-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-1">Placed On</p>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{formatDate(order.createdAt)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-1">Payment</p>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{order.paymentMode}</p>
                </div>
              </div>

              <div className="pt-6 border-t border-[var(--border-color)] text-center">
                <p className="text-xs text-[var(--text-muted)]">
                  Need help? <Link href="/contact-us" className="text-[var(--sand)] hover:underline">Contact our support team</Link>
                </p>
              </div>
            </div>
          )}

          {/* Info */}
          {!searched && (
            <div className="text-center">
              <p className="text-sm text-[var(--text-muted)] mb-2">You can find your order ID in the confirmation email sent after placing your order.</p>
              <p className="text-sm text-[var(--text-muted)]">
                Don&apos;t have your order ID? <Link href="/contact-us" className="text-[var(--sand)] hover:underline">Contact us</Link> and we&apos;ll help you out.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
