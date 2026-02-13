'use client'

import { ShieldCheck, CreditCard, Truck, Wallet, ArrowLeft, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store/useCartStore'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const router = useRouter()
  const clearCart = useCartStore((state: any) => state.clearCart)
  const items = useCartStore((state: any) => state.items)
  const [mounted, setMounted] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState('cod')
  const [placing, setPlacing] = useState(false)

  // Form state
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
  })

  useEffect(() => { setMounted(true) }, [])

  const subtotal = items.reduce((acc: number, item: any) => acc + ((item.price - (item.discount || 0)) * (item.quantity || 1)), 0)
  const shipping = subtotal > 1999 ? 0 : 99
  const total = subtotal + shipping

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      toast.error('Your cart is empty!')
      return
    }

    if (!form.name || !form.phone || !form.address || !form.city || !form.pincode) {
      toast.error('Please fill all shipping details')
      return
    }

    setPlacing(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          paymentMode: selectedPayment,
          items: items.map((item: any) => ({
            id: item.id,
            price: item.price,
            discount: item.discount || 0,
            quantity: item.quantity || 1,
          })),
        }),
      })

      const order = await res.json()

      if (!res.ok) {
        throw new Error(order.error || 'Failed to place order')
      }

      // Store order info for success page
      sessionStorage.setItem('lastOrder', JSON.stringify({
        orderId: order.orderId,
        totalAmount: order.totalAmount,
        email: form.email,
      }))

      clearCart()
      router.push('/checkout/success')
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong')
    } finally {
      setPlacing(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-8">
          <Link href="/cart" className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-4">
            <ArrowLeft size={16} />
            <span className="text-sm">Back to Cart</span>
          </Link>
          <h1 className="text-2xl md:text-4xl font-black text-[var(--text-primary)] uppercase tracking-tight">
            Checkout
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Forms */}
          <div className="flex-1 space-y-6">
            {/* Shipping Address */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4 md:p-6">
              <h2 className="text-lg font-black text-[var(--text-primary)] uppercase tracking-tight mb-6 flex items-center gap-3">
                <Truck className="text-[var(--accent)]" size={20} /> Shipping Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={form.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg p-3 md:p-4 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none transition-colors text-sm"
                />
                <input
                  type="email"
                  placeholder="Email (optional)"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg p-3 md:p-4 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none transition-colors text-sm"
                />
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  value={form.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg p-3 md:p-4 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none transition-colors text-sm sm:col-span-1"
                />
                <div className="sm:col-span-2">
                  <textarea
                    placeholder="Complete Address *"
                    rows={3}
                    value={form.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg p-3 md:p-4 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none transition-colors text-sm resize-none"
                  />
                </div>
                <input
                  type="text"
                  placeholder="City *"
                  value={form.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg p-3 md:p-4 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none transition-colors text-sm"
                />
                <input
                  type="text"
                  placeholder="PIN Code *"
                  value={form.pincode}
                  onChange={(e) => updateField('pincode', e.target.value)}
                  className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg p-3 md:p-4 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none transition-colors text-sm"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4 md:p-6">
              <h2 className="text-lg font-black text-[var(--text-primary)] uppercase tracking-tight mb-6 flex items-center gap-3">
                <CreditCard className="text-[var(--accent)]" size={20} /> Payment Method
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'upi', label: 'UPI', icon: Wallet },
                  { id: 'card', label: 'Card', icon: CreditCard },
                  { id: 'cod', label: 'Cash on Delivery', icon: Truck },
                ].map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedPayment === method.id
                        ? 'border-[var(--accent)] bg-[var(--accent)]/10'
                        : 'border-[var(--border-color)] bg-[var(--bg-primary)] hover:border-[var(--border-color)]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={selectedPayment === method.id}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      className="hidden"
                    />
                    <method.icon size={18} className={selectedPayment === method.id ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'} />
                    <span className={`text-sm font-bold ${selectedPayment === method.id ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                      {method.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Order Items - Mobile */}
            <div className="lg:hidden bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4">
              <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-4">Order Items ({items.length})</h3>
              <div className="space-y-3">
                {items.map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[var(--bg-primary)] rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.images ? JSON.parse(item.images)[0] : ''}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--text-primary)] truncate">{item.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">Qty: {item.quantity || 1}</p>
                    </div>
                    <span className="text-sm font-bold text-[var(--text-primary)]">₹{(item.price - (item.discount || 0)) * (item.quantity || 1)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-96">
            <div className="bg-[var(--accent)] rounded-xl p-6 lg:sticky lg:top-24">
              <h2 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-tight mb-6 pb-4 border-b border-white/20">
                Order Summary
              </h2>

              {/* Desktop Order Items */}
              <div className="hidden lg:block space-y-3 mb-6 pb-6 border-b border-white/20">
                {items.slice(0, 3).map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={item.images ? JSON.parse(item.images)[0] : ''}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[var(--text-primary)] truncate">{item.name}</p>
                    </div>
                    <span className="text-xs font-bold text-[var(--text-primary)]">₹{(item.price - (item.discount || 0)) * (item.quantity || 1)}</span>
                  </div>
                ))}
                {items.length > 3 && (
                  <p className="text-xs text-[var(--text-primary)]/60">+{items.length - 3} more items</p>
                )}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-[var(--text-primary)]/80">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-[var(--text-primary)]/80">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-4 border-t border-white/20 mb-6">
                <span className="text-[var(--text-primary)] font-bold">Total</span>
                <span className="text-3xl font-black text-[var(--text-primary)]">₹{total.toLocaleString()}</span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={placing}
                className="w-full bg-white text-[var(--accent)] py-4 rounded-lg font-black uppercase tracking-wider text-sm hover:bg-black hover:text-[var(--text-primary)] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {placing ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  'Place Order'
                )}
              </button>

              <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-[var(--text-primary)]/60 uppercase tracking-wider">
                <ShieldCheck size={14} /> Secure & Encrypted
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
