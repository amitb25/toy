'use client'

import { Eye, Search, Download, Package, Truck, CheckCircle, XCircle, Clock, X, Plus, Minus, Trash2, Loader2 } from 'lucide-react'
import { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'

interface OrderItem {
  id: string
  quantity: number
  price: number
  productId?: string
  product: { name: string; images: string; price?: number }
}

interface Order {
  id: string
  orderId: string
  totalAmount: number
  status: string
  paymentMode: string
  shippingAddress: string
  createdAt: string
  user: { name: string; email: string; phone: string }
  items: OrderItem[]
}

interface Product {
  id: string
  name: string
  price: number
  discount: number
  images: string
  stock: number
}

const STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']

export default function OrdersAdmin() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterTab, setFilterTab] = useState('All')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // Product search for adding items
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [productSearch, setProductSearch] = useState('')
  const [showProductSearch, setShowProductSearch] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setOrders(data) })
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false))

    fetch('/api/products')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setAllProducts(data) })
      .catch(() => {})
  }, [])

  const updateStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error()
      const updated = await res.json()
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o))
      setSelectedOrder(updated)
      window.dispatchEvent(new Event('notifications-updated'))
      toast.success(`Status updated to ${status}`)
    } catch {
      toast.error('Failed to update status')
    }
  }

  const removeItem = async (orderItemId: string) => {
    if (!selectedOrder) return
    if (selectedOrder.items.length <= 1) {
      toast.error('Cannot remove the last item')
      return
    }
    setSaving(true)
    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ removeItems: [orderItemId] }),
      })
      if (!res.ok) throw new Error()
      const updated = await res.json()
      setOrders(prev => prev.map(o => o.id === updated.id ? updated : o))
      setSelectedOrder(updated)
      toast.success('Item removed')
    } catch {
      toast.error('Failed to remove item')
    } finally {
      setSaving(false)
    }
  }

  const updateItemQty = async (orderItemId: string, quantity: number, unitPrice: number) => {
    if (!selectedOrder || quantity < 1) return
    setSaving(true)
    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updateItems: [{ id: orderItemId, quantity, price: unitPrice * quantity }] }),
      })
      if (!res.ok) throw new Error()
      const updated = await res.json()
      setOrders(prev => prev.map(o => o.id === updated.id ? updated : o))
      setSelectedOrder(updated)
    } catch {
      toast.error('Failed to update quantity')
    } finally {
      setSaving(false)
    }
  }

  const addProduct = async (product: Product) => {
    if (!selectedOrder) return
    setSaving(true)
    const price = product.price - product.discount
    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addItems: [{ productId: product.id, quantity: 1, price }] }),
      })
      if (!res.ok) throw new Error()
      const updated = await res.json()
      setOrders(prev => prev.map(o => o.id === updated.id ? updated : o))
      setSelectedOrder(updated)
      setShowProductSearch(false)
      setProductSearch('')
      toast.success(`${product.name} added`)
    } catch {
      toast.error('Failed to add product')
    } finally {
      setSaving(false)
    }
  }

  const filteredProducts = productSearch.length >= 2
    ? allProducts.filter(p =>
        p.name.toLowerCase().includes(productSearch.toLowerCase()) &&
        !selectedOrder?.items.some(i => i.product.name === p.name)
      ).slice(0, 5)
    : []

  const filtered = orders.filter(o => {
    const matchesSearch = !search ||
      o.orderId.toLowerCase().includes(search.toLowerCase()) ||
      o.user.name.toLowerCase().includes(search.toLowerCase())
    const matchesFilter =
      filterTab === 'All' ||
      (filterTab === 'Pending' && o.status === 'PENDING') ||
      (filterTab === 'Paid' && o.paymentMode !== 'COD' && o.status !== 'CANCELLED') ||
      (filterTab === 'COD' && o.paymentMode === 'COD')
    return matchesSearch && matchesFilter
  })

  const formatDate = (d: string) => {
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'SHIPPED': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'PROCESSING': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'PENDING': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'CANCELLED': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED': return <CheckCircle size={12} />
      case 'SHIPPED': return <Truck size={12} />
      case 'PROCESSING': return <Package size={12} />
      case 'PENDING': return <Clock size={12} />
      case 'CANCELLED': return <XCircle size={12} />
      default: return null
    }
  }

  const getPaymentLabel = (mode: string) => {
    if (mode === 'COD') return 'COD'
    return `PAID (${mode})`
  }

  const parseAddress = (addr: string) => {
    try { return JSON.parse(addr) } catch { return { address: addr } }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-text-primary uppercase tracking-tight">Orders</h1>
          <p className="text-text-muted text-sm mt-1">Monitor sales, track shipments, and manage customer fulfillment.</p>
        </div>
        <button className="flex items-center justify-center gap-2 rounded-lg bg-bg-card border border-border px-4 py-2.5 text-sm font-bold text-text-muted hover:border-accent/50 hover:text-text-primary transition-all">
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-bg-card border border-border rounded-xl p-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input
            type="text"
            placeholder="Search Order ID, Customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-bg-primary border border-border rounded-lg py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-3 overflow-x-auto">
          <div className="flex rounded-lg border border-border p-1 bg-bg-primary">
            {['All', 'Pending', 'Paid', 'COD'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`px-3 md:px-4 py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap cursor-pointer ${
                  filterTab === tab ? 'bg-[#e23636] text-white' : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-20 text-text-muted">Loading orders...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Package size={48} className="mx-auto text-text-muted/30 mb-4" />
          <p className="text-text-muted">{orders.length === 0 ? 'No orders yet' : 'No orders match your filter'}</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-bg-card border border-border rounded-xl">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-bg-primary text-[10px] font-bold uppercase tracking-wider text-text-muted border-b border-border">
              <tr>
                <th className="px-4 md:px-6 py-4">Order ID</th>
                <th className="px-4 md:px-6 py-4">Customer</th>
                <th className="px-4 md:px-6 py-4">Status</th>
                <th className="px-4 md:px-6 py-4">Items</th>
                <th className="px-4 md:px-6 py-4">Total</th>
                <th className="px-4 md:px-6 py-4">Payment</th>
                <th className="px-4 md:px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-bg-primary/50 transition-colors">
                  <td className="px-4 md:px-6 py-4 font-bold text-text-primary">{order.orderId}</td>
                  <td className="px-4 md:px-6 py-4">
                    <p className="font-medium text-text-primary text-sm">{order.user.name}</p>
                    <p className="text-[10px] text-text-muted uppercase font-bold">{formatDate(order.createdAt)}</p>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase ${getStatusStyle(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-sm text-text-muted">{order.items.length} items</td>
                  <td className="px-4 md:px-6 py-4 font-bold text-text-primary">₹{order.totalAmount.toLocaleString()}</td>
                  <td className="px-4 md:px-6 py-4">
                    <span className={`text-[10px] font-black ${order.paymentMode !== 'COD' ? 'text-green-500' : 'text-orange-500'}`}>
                      {getPaymentLabel(order.paymentMode)}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-right">
                    <button
                      onClick={() => { setSelectedOrder(order); setShowProductSearch(false); setProductSearch('') }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#e23636] hover:text-text-primary transition-colors cursor-pointer"
                    >
                      <Eye size={14} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => { setSelectedOrder(null); setShowProductSearch(false) }}>
          <div className="bg-bg-secondary border border-border rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-lg font-black text-text-primary">{selectedOrder.orderId}</h2>
                <p className="text-xs text-text-muted mt-1">{formatDate(selectedOrder.createdAt)}</p>
              </div>
              <button onClick={() => { setSelectedOrder(null); setShowProductSearch(false) }} className="p-2 rounded-lg hover:bg-bg-primary text-text-muted hover:text-text-primary transition-all cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Update */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selectedOrder.id, s)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase border transition-all cursor-pointer ${
                        selectedOrder.status === s
                          ? getStatusStyle(s)
                          : 'border-border text-text-muted hover:border-accent/50 hover:text-text-primary'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3">Customer</p>
                <div className="bg-bg-primary rounded-xl p-4 space-y-1.5">
                  <p className="text-sm font-bold text-text-primary">{selectedOrder.user.name}</p>
                  <p className="text-xs text-text-muted">{selectedOrder.user.email}</p>
                  {selectedOrder.user.phone && <p className="text-xs text-text-muted">{selectedOrder.user.phone}</p>}
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3">Shipping Address</p>
                <div className="bg-bg-primary rounded-xl p-4">
                  {(() => {
                    const addr = parseAddress(selectedOrder.shippingAddress)
                    return (
                      <div className="text-sm text-text-secondary space-y-1">
                        <p className="font-semibold text-text-primary">{addr.name}</p>
                        <p>{addr.address}</p>
                        <p>{addr.city} - {addr.pincode}</p>
                        {addr.phone && <p>Phone: {addr.phone}</p>}
                      </div>
                    )
                  })()}
                </div>
              </div>

              {/* Order Items - Editable */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Items ({selectedOrder.items.length})</p>
                  <button
                    onClick={() => setShowProductSearch(!showProductSearch)}
                    className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-[#e23636] hover:text-text-primary transition-colors cursor-pointer"
                  >
                    <Plus size={14} /> Add Product
                  </button>
                </div>

                {/* Product Search */}
                {showProductSearch && (
                  <div className="mb-4 relative">
                    <div className="flex items-center gap-2 bg-bg-primary border border-border rounded-lg px-3 py-2">
                      <Search size={14} className="text-text-muted flex-shrink-0" />
                      <input
                        type="text"
                        placeholder="Search products to add..."
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
                        autoFocus
                      />
                    </div>
                    {filteredProducts.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-bg-card border border-border rounded-lg shadow-xl z-10 overflow-hidden">
                        {filteredProducts.map((p) => {
                          const images = p.images ? JSON.parse(p.images) : []
                          const finalPrice = p.price - p.discount
                          return (
                            <button
                              key={p.id}
                              onClick={() => addProduct(p)}
                              disabled={saving}
                              className="w-full flex items-center gap-3 p-3 hover:bg-bg-primary transition-colors text-left border-b border-border last:border-b-0 cursor-pointer disabled:opacity-50"
                            >
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-bg-secondary flex-shrink-0">
                                {images[0] && <img src={images[0]} alt={p.name} className="w-full h-full object-cover" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-text-primary truncate">{p.name}</p>
                                <p className="text-xs text-text-muted">Stock: {p.stock}</p>
                              </div>
                              <p className="text-sm font-bold text-text-primary">₹{finalPrice.toLocaleString()}</p>
                            </button>
                          )
                        })}
                      </div>
                    )}
                    {productSearch.length >= 2 && filteredProducts.length === 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-bg-card border border-border rounded-lg p-3 text-center">
                        <p className="text-xs text-text-muted">No products found</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  {selectedOrder.items.map((item) => {
                    const images = item.product.images ? JSON.parse(item.product.images) : []
                    const unitPrice = item.quantity > 0 ? item.price / item.quantity : item.product.price || 0
                    return (
                      <div key={item.id} className="flex items-center gap-3 bg-bg-primary rounded-xl p-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-bg-secondary flex-shrink-0">
                          {images[0] && <img src={images[0]} alt={item.product.name} className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-text-primary truncate">{item.product.name}</p>
                          <p className="text-xs text-text-muted">₹{unitPrice.toLocaleString()} each</p>
                        </div>
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateItemQty(item.id, item.quantity - 1, unitPrice)}
                            disabled={saving || item.quantity <= 1}
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-bg-secondary border border-border text-text-muted hover:text-text-primary hover:border-accent/50 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-text-primary">{item.quantity}</span>
                          <button
                            onClick={() => updateItemQty(item.id, item.quantity + 1, unitPrice)}
                            disabled={saving}
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-bg-secondary border border-border text-text-muted hover:text-text-primary hover:border-accent/50 transition-all cursor-pointer disabled:opacity-30"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <p className="text-sm font-bold text-text-primary w-20 text-right">₹{item.price.toLocaleString()}</p>
                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={saving || selectedOrder.items.length <= 1}
                          className="p-1.5 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-500/10 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <p className="text-sm font-bold text-text-muted uppercase">Total</p>
                <p className="text-xl font-black text-text-primary">₹{selectedOrder.totalAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
