'use client'

import Link from 'next/link'
import { User, Package, MapPin, Heart, LogOut, ChevronRight, Shield, ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function AccountPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return null

  const menuItems = [
    { icon: Package, label: 'My Orders', desc: 'Track, return or buy again', href: '/account/orders' },
    { icon: MapPin, label: 'Manage Addresses', desc: 'Edit your shipping locations', href: '/account/addresses' },
    { icon: Heart, label: 'My Wishlist', desc: 'Items you saved for later', href: '/wishlist' },
    { icon: User, label: 'Edit Profile', desc: 'Name, email and security', href: '/account/profile' },
  ]

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Link */}
          <Link href="/" className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-6">
            <ArrowLeft size={16} />
            <span className="text-sm">Back to Shop</span>
          </Link>

          {/* Profile Header */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4 md:p-8 mb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
              <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-[var(--accent)] flex items-center justify-center text-[var(--text-primary)] text-2xl md:text-3xl font-black flex-shrink-0">
                <Shield size={32} />
              </div>
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-xl md:text-3xl font-black text-[var(--text-primary)] uppercase tracking-tight">Hello, Hero!</h1>
                <p className="text-[var(--text-muted)] text-sm md:text-base mt-1">Welcome to your Avengers HQ dashboard</p>
              </div>
              <button className="flex items-center gap-2 bg-[var(--accent)]/10 border border-[var(--accent)]/30 px-4 py-2 rounded-lg text-sm font-bold text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--text-primary)] transition-all">
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group flex items-center justify-between bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4 md:p-6 hover:border-[var(--accent)] transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-[var(--text-primary)] transition-all">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--text-primary)] text-sm md:text-base group-hover:text-[var(--accent)] transition-colors">{item.label}</h3>
                    <p className="text-xs md:text-sm text-[var(--text-muted)]">{item.desc}</p>
                  </div>
                </div>
                <ChevronRight className="text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" size={20} />
              </Link>
            ))}
          </div>

          {/* Recent Orders */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-[var(--text-primary)] uppercase tracking-tight">Recent Order</h2>
              <Link href="/account/orders" className="text-xs font-bold text-[var(--accent)] hover:text-[var(--text-primary)] uppercase tracking-wider transition-colors">
                View All
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[var(--bg-primary)] border border-[var(--border-light)] rounded-xl p-4 md:p-6">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 md:h-16 md:w-16 rounded-xl bg-[var(--bg-card)] flex items-center justify-center">
                  <Package className="text-[var(--accent)]" size={24} />
                </div>
                <div>
                  <p className="font-bold text-[var(--text-primary)]">Order #AHQ-1001</p>
                  <p className="text-sm text-[var(--text-muted)]">Delivered on Oct 24, 2026</p>
                </div>
              </div>
              <button className="w-full sm:w-auto bg-[var(--accent)] text-[var(--text-primary)] px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-white hover:text-[var(--accent)] transition-all">
                Track Order
              </button>
            </div>

            {/* Empty state for no orders */}
            {/* <div className="text-center py-8">
              <Package size={48} className="mx-auto text-gray-700 mb-4" />
              <p className="text-[var(--text-muted)]">No orders yet</p>
              <Link href="/" className="text-[var(--accent)] text-sm font-bold hover:text-[var(--text-primary)] transition-colors">
                Start Shopping →
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}
