'use client'

import { Search, Mail, Phone, MapPin, ShoppingBag, IndianRupee, ChevronDown, ChevronUp, Package } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Order {
  id: string
  orderId: string
  totalAmount: number
  status: string
  createdAt: string
}

interface Customer {
  id: string
  name: string | null
  email: string
  phone: string | null
  address: string | null
  city: string | null
  state: string | null
  pincode: string | null
  createdAt: string
  totalOrders: number
  totalSpent: number
  lastOrder: string | null
  orders: Order[]
}

export default function CustomersAdmin() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/customers')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setCustomers(data) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = customers.filter(c =>
    (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    (c.phone || '').includes(search)
  )

  const statusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'bg-green-500/15 text-green-500'
      case 'SHIPPED': return 'bg-blue-500/15 text-blue-500'
      case 'CONFIRMED': return 'bg-yellow-500/15 text-yellow-500'
      case 'CANCELLED': return 'bg-red-500/15 text-red-500'
      default: return 'bg-orange-500/15 text-orange-500'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-text-primary uppercase tracking-tight">Customers</h1>
          <p className="text-text-muted text-sm mt-1">Customers who have placed orders</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-bg-card border border-border rounded-2xl p-5">
          <p className="text-3xl font-black text-text-primary">{customers.length}</p>
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mt-1">Total Customers</p>
        </div>
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 rounded-2xl p-5">
          <p className="text-3xl font-black text-green-500">{customers.reduce((s, c) => s + c.totalOrders, 0)}</p>
          <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider mt-1">Total Orders</p>
        </div>
        <div className="bg-gradient-to-br from-[var(--sand)]/10 to-[var(--sand)]/5 border border-[var(--sand)]/20 rounded-2xl p-5">
          <p className="text-3xl font-black text-[var(--sand)]">₹{customers.reduce((s, c) => s + c.totalSpent, 0).toLocaleString()}</p>
          <p className="text-[10px] font-bold text-[var(--sand)] uppercase tracking-wider mt-1">Total Revenue</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
        <input
          type="text"
          placeholder="Search by name, email, phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-bg-input border border-border rounded-xl py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
        />
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block w-10 h-10 border-3 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-text-muted">Loading customers...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center bg-bg-card border border-border rounded-2xl">
          <ShoppingBag size={56} className="mx-auto text-text-muted/50 mb-4" />
          <p className="text-text-muted">{search ? 'No customers found' : 'No customers yet. Orders will appear here.'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((customer) => (
            <div key={customer.id} className="bg-bg-card border border-border rounded-2xl overflow-hidden hover:border-accent/30 transition-all">
              {/* Customer Row */}
              <div
                className="flex flex-col md:flex-row md:items-center gap-4 p-4 md:p-5 cursor-pointer"
                onClick={() => setExpandedId(expandedId === customer.id ? null : customer.id)}
              >
                {/* Avatar + Name */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="h-11 w-11 rounded-full bg-accent/10 flex items-center justify-center text-accent font-black text-lg flex-shrink-0">
                    {(customer.name || 'G').charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-text-primary text-sm truncate">{customer.name || 'Guest'}</p>
                    <div className="flex items-center gap-1.5 text-text-muted text-xs mt-0.5">
                      <Mail size={11} />
                      <span className="truncate">{customer.email}</span>
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-1.5 text-text-secondary text-xs md:w-36">
                  <Phone size={12} className="text-text-muted flex-shrink-0" />
                  <span>{customer.phone || '—'}</span>
                </div>

                {/* Orders Count */}
                <div className="flex items-center gap-1.5 md:w-24">
                  <ShoppingBag size={12} className="text-accent" />
                  <span className="text-sm font-bold text-text-primary">{customer.totalOrders}</span>
                  <span className="text-[10px] text-text-muted">orders</span>
                </div>

                {/* Total Spent */}
                <div className="flex items-center gap-1.5 md:w-32">
                  <IndianRupee size={12} className="text-green-500" />
                  <span className="text-sm font-bold text-text-primary">₹{customer.totalSpent.toLocaleString()}</span>
                </div>

                {/* Joined */}
                <div className="text-xs text-text-muted md:w-28">
                  Joined {new Date(customer.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                </div>

                {/* Expand */}
                <div className="text-text-muted">
                  {expandedId === customer.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </div>

              {/* Expanded: Address + Orders */}
              {expandedId === customer.id && (
                <div className="border-t border-border px-4 md:px-5 py-4 space-y-4">
                  {/* Address */}
                  {customer.address && (
                    <div className="flex items-start gap-2 text-xs text-text-secondary">
                      <MapPin size={14} className="text-text-muted mt-0.5 flex-shrink-0" />
                      <span>
                        {customer.address}
                        {customer.city && `, ${customer.city}`}
                        {customer.state && `, ${customer.state}`}
                        {customer.pincode && ` - ${customer.pincode}`}
                      </span>
                    </div>
                  )}

                  {/* Order History */}
                  <div>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-3">Order History</p>
                    <div className="space-y-2">
                      {customer.orders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between gap-3 bg-bg-secondary rounded-xl px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Package size={14} className="text-accent" />
                            <span className="text-sm font-bold text-text-primary">{order.orderId}</span>
                          </div>
                          <span className="text-sm font-bold text-text-primary">₹{order.totalAmount.toLocaleString()}</span>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${statusColor(order.status)}`}>
                            {order.status}
                          </span>
                          <span className="text-xs text-text-muted hidden sm:block">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
