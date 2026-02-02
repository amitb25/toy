'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Box, Tags, ShoppingBag, Users, Settings, LogOut, Shield, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: Box, label: 'Products', href: '/admin/products' },
    { icon: Tags, label: 'Categories', href: '/admin/categories' },
    { icon: Shield, label: 'Brands', href: '/admin/brands' },
    { icon: ShoppingBag, label: 'Orders', href: '/admin/orders' },
    { icon: Users, label: 'Customers', href: '/admin/customers' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
  ]

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname?.startsWith(href)
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/80 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#151515] border-r border-white/5 transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 md:h-20 items-center justify-between px-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-[#e23636] p-2">
              <Shield className="text-white" size={20} />
            </div>
            <span className="text-lg font-black tracking-tight uppercase text-white">Admin HQ</span>
          </div>
          <button className="lg:hidden text-gray-400" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="mt-6 px-3 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold transition-all ${
                isActive(item.href)
                  ? 'bg-[#e23636] text-white'
                  : 'text-gray-500 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-white/5">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold text-gray-500 hover:bg-white/5 hover:text-white transition-colors"
          >
            <LogOut size={18} />
            Back to Store
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-16 md:h-20 items-center justify-between bg-[#151515] border-b border-white/5 px-4 md:px-8">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 text-gray-400 hover:text-white" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-widest">
              <span className="hidden sm:inline">Avengers HQ /</span> <span className="text-white">Admin Panel</span>
            </div>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-white">Admin Hero</p>
              <p className="text-[10px] font-bold text-green-500 uppercase">System Online</p>
            </div>
            <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-[#e23636] flex items-center justify-center text-white font-black text-sm">A</div>
          </div>
        </header>

        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
