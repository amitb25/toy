'use client'

import Link from 'next/link'
import { ShoppingBag, User, Search, Menu, X, ChevronDown, Heart, Phone } from 'lucide-react'
import { useCartStore } from '@/lib/store/useCartStore'
import { useWishlistStore } from '@/lib/store/useWishlistStore'
import { useEffect, useState } from 'react'
import ThemeToggle from '@/components/ThemeToggle'

export default function Header() {
  const cartItems = useCartStore((state: any) => state.items)
  const wishlistItems = useWishlistStore((state) => state.items)
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  return (
    <header className="w-full font-sans">
      {/* Top Bar */}
      <div className="bg-[var(--accent)]">
        <div className="container mx-auto px-4 md:px-6 py-2 flex justify-between items-center">
          <div className="flex items-center gap-4 md:gap-6 text-white/90 text-[10px] font-bold tracking-wider">
            <a href="tel:+18001234567" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone size={11} />
              <span className="hidden sm:inline">+1 800 AVENGER</span>
            </a>
            <span className="hidden md:block">|</span>
            <span className="hidden md:block">Free Shipping on Rs.1999+</span>
          </div>
          <div className="flex items-center gap-4 text-white/90 text-[10px] font-bold tracking-wider">
            <Link href="/track-order" className="hover:text-white transition-colors hidden sm:block">Track Order</Link>
            <span className="hidden sm:block">|</span>
            <Link href="/contact" className="hover:text-white transition-colors">Help</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
        <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between gap-4 md:gap-8">

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Link href="/" className="shrink-0 group">
              <div className="flex items-baseline gap-0.5">
                <span className="text-xl md:text-2xl lg:text-3xl font-black text-[var(--text-primary)] italic tracking-tighter">
                  AVENGERS
                </span>
                <span className="text-xl md:text-2xl lg:text-3xl font-black text-[var(--accent)] italic tracking-tighter">
                  HQ
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link href="/" className="text-[var(--text-primary)] text-xs font-bold uppercase tracking-wider hover:text-[var(--accent)] transition-colors">
                Home
              </Link>
              <div className="group relative">
                <button className="flex items-center gap-1 text-[var(--text-secondary)] text-xs font-bold uppercase tracking-wider hover:text-[var(--text-primary)] transition-colors">
                  Shop <ChevronDown size={14} />
                </button>
                <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-4 min-w-[200px] shadow-2xl">
                    <Link href="/category/action-figures" className="block py-2 px-3 text-[var(--text-secondary)] text-xs font-bold uppercase tracking-wider hover:text-[var(--accent)] hover:bg-[var(--bg-secondary)] rounded transition-all">
                      Action Figures
                    </Link>
                    <Link href="/category/role-play" className="block py-2 px-3 text-[var(--text-secondary)] text-xs font-bold uppercase tracking-wider hover:text-[var(--accent)] hover:bg-[var(--bg-secondary)] rounded transition-all">
                      Role Play Gear
                    </Link>
                    <Link href="/category/collectibles" className="block py-2 px-3 text-[var(--text-secondary)] text-xs font-bold uppercase tracking-wider hover:text-[var(--accent)] hover:bg-[var(--bg-secondary)] rounded transition-all">
                      Collectibles
                    </Link>
                    <div className="border-t border-[var(--border-color)] mt-2 pt-2">
                      <Link href="/category/all" className="block py-2 px-3 text-[var(--accent)] text-xs font-bold uppercase tracking-wider hover:bg-[var(--bg-secondary)] rounded transition-all">
                        View All
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <Link href="/category/exclusives" className="text-[var(--accent)] text-xs font-bold uppercase tracking-wider hover:text-[var(--text-primary)] transition-colors">
                Exclusives
              </Link>
              <Link href="/deals" className="text-[var(--text-secondary)] text-xs font-bold uppercase tracking-wider hover:text-[var(--text-primary)] transition-colors">
                Deals
              </Link>
              <Link href="/new-arrivals" className="text-[var(--text-secondary)] text-xs font-bold uppercase tracking-wider hover:text-[var(--text-primary)] transition-colors">
                New Arrivals
              </Link>
            </nav>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md">
              <div className="w-full flex bg-[var(--bg-input)] border border-[var(--border-color)] rounded-lg overflow-hidden focus-within:border-[var(--accent)] transition-all">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="flex-1 py-2.5 px-4 outline-none bg-transparent text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)]"
                />
                <button className="px-4 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
                  <Search size={18} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 md:gap-3">
              {/* Mobile Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="md:hidden p-2 text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
              >
                <Search size={20} />
              </button>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Wishlist */}
              <Link href="/wishlist" className="hidden md:flex p-2 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors relative">
                <Heart size={20} />
                {mounted && wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[var(--accent)] text-white h-4 w-4 rounded-full flex items-center justify-center text-[9px] font-black">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Account */}
              <Link href="/login" className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
                <User size={20} />
              </Link>

              {/* Cart */}
              <Link href="/cart" className="flex items-center gap-2 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-lg px-3 py-2 hover:border-[var(--accent)] transition-all">
                <div className="relative">
                  <ShoppingBag size={18} className="text-[var(--text-primary)]" />
                  {mounted && cartItems.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-[var(--accent)] text-white h-4 w-4 rounded-full flex items-center justify-center text-[9px] font-black">
                      {cartItems.length}
                    </span>
                  )}
                </div>
                <span className="hidden sm:block text-[var(--text-primary)] text-xs font-bold">Cart</span>
              </Link>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {searchOpen && (
            <div className="md:hidden mt-4">
              <div className="flex bg-[var(--bg-input)] border border-[var(--border-color)] rounded-lg overflow-hidden">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="flex-1 py-3 px-4 outline-none bg-transparent text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)]"
                  autoFocus
                />
                <button className="px-4 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
                  <Search size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[var(--bg-primary)] border-b border-[var(--border-color)]">
          <div className="container mx-auto px-4 md:px-6 py-4">
            <nav className="flex flex-col gap-1">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="py-3 px-4 text-[var(--text-primary)] text-sm font-bold uppercase tracking-wider hover:bg-[var(--bg-secondary)] rounded-lg transition-all">
                Home
              </Link>
              <Link href="/category/action-figures" onClick={() => setMobileMenuOpen(false)} className="py-3 px-4 text-[var(--text-secondary)] text-sm font-bold uppercase tracking-wider hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] rounded-lg transition-all">
                Action Figures
              </Link>
              <Link href="/category/role-play" onClick={() => setMobileMenuOpen(false)} className="py-3 px-4 text-[var(--text-secondary)] text-sm font-bold uppercase tracking-wider hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] rounded-lg transition-all">
                Role Play Gear
              </Link>
              <Link href="/category/collectibles" onClick={() => setMobileMenuOpen(false)} className="py-3 px-4 text-[var(--text-secondary)] text-sm font-bold uppercase tracking-wider hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] rounded-lg transition-all">
                Collectibles
              </Link>
              <Link href="/category/exclusives" onClick={() => setMobileMenuOpen(false)} className="py-3 px-4 text-[var(--accent)] text-sm font-bold uppercase tracking-wider hover:bg-[var(--bg-secondary)] rounded-lg transition-all">
                Exclusives
              </Link>
              <div className="border-t border-[var(--border-color)] mt-2 pt-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="py-3 px-4 text-[var(--text-secondary)] text-sm font-bold uppercase tracking-wider hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] rounded-lg transition-all flex items-center gap-2">
                  <User size={16} /> My Account
                </Link>
                <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)} className="py-3 px-4 text-[var(--text-secondary)] text-sm font-bold uppercase tracking-wider hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] rounded-lg transition-all flex items-center gap-2">
                  <Heart size={16} /> Wishlist
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
