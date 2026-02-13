'use client'

import { TrendingUp, ShoppingCart, AlertTriangle, IndianRupee, Package, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface DashboardData {
  totalRevenue: number
  ordersToday: number
  pendingOrders: number
  lowStockCount: number
  recentOrders: { id: string; itemCount: number; amount: number; status: string; customer: string }[]
  lowStockAlerts: { id: string; name: string; stock: number }[]
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then(res => res.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 size={32} className="animate-spin text-accent" />
      </div>
    )
  }

  const stats = [
    { label: 'Total Revenue', value: `₹${(data?.totalRevenue || 0).toLocaleString('en-IN')}`, icon: IndianRupee },
    { label: 'Orders Today', value: String(data?.ordersToday || 0), icon: ShoppingCart },
    { label: 'Pending Orders', value: String(data?.pendingOrders || 0), icon: TrendingUp },
    { label: 'Low Stock', value: String(data?.lowStockCount || 0), icon: AlertTriangle },
  ]

  const statusStyle = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500/20 text-yellow-600'
      case 'PROCESSING': return 'bg-blue-500/20 text-blue-600'
      case 'SHIPPED': return 'bg-purple-500/20 text-purple-600'
      case 'DELIVERED': return 'bg-green-500/20 text-green-600'
      case 'CANCELLED': return 'bg-red-500/20 text-red-600'
      default: return 'bg-gray-500/20 text-gray-600'
    }
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-xl md:text-2xl font-black text-text-primary uppercase tracking-tight">Dashboard Overview</h1>
        <p className="text-text-muted text-sm mt-1">Welcome back! Here&apos;s what&apos;s happening with your store today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-bg-card border border-border rounded-xl p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                <stat.icon size={20} />
              </div>
            </div>
            <p className="text-[10px] md:text-xs font-bold text-text-muted uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-lg md:text-2xl font-black text-text-primary mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="bg-bg-card border border-border rounded-xl p-4 md:p-6">
          <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
            <h2 className="font-black text-text-primary uppercase tracking-tight">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs font-bold text-accent hover:text-accent-hover transition-colors">View All</Link>
          </div>
          {data?.recentOrders.length === 0 ? (
            <div className="py-8 text-center">
              <Package size={32} className="mx-auto text-text-muted/50 mb-2" />
              <p className="text-sm text-text-muted">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {data?.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Package size={18} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-text-primary">Order #{order.id}</p>
                      <p className="text-xs text-text-muted">{order.itemCount} Items &bull; ₹{order.amount.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${statusStyle(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Inventory Alerts */}
        <div className="bg-bg-card border border-border rounded-xl p-4 md:p-6">
          <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
            <h2 className="font-black text-text-primary uppercase tracking-tight">Inventory Alerts</h2>
            <Link href="/admin/products" className="text-xs font-bold text-accent hover:text-accent-hover transition-colors">View All</Link>
          </div>
          {data?.lowStockAlerts.length === 0 ? (
            <div className="py-8 text-center">
              <AlertTriangle size={32} className="mx-auto text-text-muted/50 mb-2" />
              <p className="text-sm text-text-muted">No low stock alerts</p>
            </div>
          ) : (
            <div className="space-y-1">
              {data?.lowStockAlerts.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                      <AlertTriangle size={18} className="text-red-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-text-primary">{item.name}</p>
                      <p className="text-xs text-red-500 font-medium">
                        {item.stock === 0 ? 'Out of stock!' : `Only ${item.stock} left in stock`}
                      </p>
                    </div>
                  </div>
                  <Link href="/admin/products" className="text-xs font-bold text-accent hover:text-accent-hover transition-colors">
                    Add Stock
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
