'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Box, Tags, ShoppingBag, Users, Settings, LogOut, Shield, Menu, X, Sun, Moon, Image, Megaphone } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const theme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldBeDark = theme === 'dark' || (!theme && prefersDark)
    setIsDark(shouldBeDark)
    document.documentElement.setAttribute('data-theme', shouldBeDark ? 'dark' : 'light')
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light')
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
  }

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: Image, label: 'Banners', href: '/admin/banners' },
    { icon: Megaphone, label: 'Banner CTA', href: '/admin/banner-cta' },
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
    <div className="flex min-h-screen bg-bg-primary">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '600',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-bg-secondary border-r border-border transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 md:h-20 items-center justify-between px-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-[#e23636] to-[#ff6b6b] p-2.5 shadow-lg shadow-[#e23636]/20">
              <Shield className="text-white" size={20} />
            </div>
            <span className="text-lg font-black tracking-tight uppercase text-text-primary">Admin HQ</span>
          </div>
          <button className="lg:hidden text-text-muted hover:text-text-primary" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="mt-6 px-3 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                isActive(item.href)
                  ? 'bg-gradient-to-r from-[#e23636] to-[#ff6b6b] text-white shadow-lg shadow-[#e23636]/30'
                  : 'text-text-muted hover:bg-accent/10 hover:text-accent'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-border">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-text-muted hover:bg-accent/10 hover:text-accent transition-colors"
          >
            <LogOut size={18} />
            Back to Store
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-16 md:h-20 items-center justify-between bg-bg-secondary/80 backdrop-blur-xl border-b border-border px-4 md:px-8">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 text-text-muted hover:text-text-primary rounded-lg hover:bg-accent/10" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="text-xs md:text-sm font-bold text-text-muted uppercase tracking-widest">
              <span className="hidden sm:inline">Avengers HQ /</span> <span className="text-text-primary">Admin Panel</span>
            </div>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-bg-card border border-border hover:border-accent/50 hover:bg-accent/10 transition-all"
            >
              {isDark ? <Sun size={18} className="text-yellow-500" /> : <Moon size={18} className="text-text-muted" />}
            </button>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-text-primary">Admin Hero</p>
              <p className="text-[10px] font-bold text-green-500 uppercase">System Online</p>
            </div>
            <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-gradient-to-br from-[#e23636] to-[#ff6b6b] flex items-center justify-center text-white font-black text-sm shadow-lg shadow-[#e23636]/30">A</div>
          </div>
        </header>

        <main className="p-4 md:p-8 bg-bg-primary min-h-[calc(100vh-5rem)]">
          {children}
        </main>
      </div>
    </div>
  )
}
