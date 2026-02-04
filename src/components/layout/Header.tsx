'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, User, Search, Menu, X, Heart, Phone } from 'lucide-react'
import { useCartStore } from '@/lib/store/useCartStore'
import { useWishlistStore } from '@/lib/store/useWishlistStore'
import { useEffect, useState } from 'react'
import ThemeToggle from '@/components/ThemeToggle'

export default function Header() {
  const pathname = usePathname()
  const cartItems = useCartStore((state: any) => state.items)
  const wishlistItems = useWishlistStore((state) => state.items)
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  // Hide header on admin pages
  if (pathname?.startsWith('/admin')) {
    return null
  }

  return (
    <header className="w-full font-sans">
      {/* Top Bar - Minimalist */}
      <div className="bg-[var(--obsidian)]">
        <div className="container mx-auto px-4 md:px-6 py-2.5 flex justify-between items-center">
          <div className="flex items-center gap-4 md:gap-6 text-[var(--pearl)]/70 text-[10px] font-semibold tracking-wider">
            <a href="tel:+18001234567" className="flex items-center gap-1.5 hover:text-[var(--sand)] transition-colors">
              <Phone size={11} />
              <span className="hidden sm:inline">+1 800 AVENGER</span>
            </a>
            <span className="hidden md:block text-[var(--pearl)]/30">|</span>
            <span className="hidden md:block">Free Shipping on Rs.1999+</span>
          </div>
          <div className="flex items-center gap-4 text-[var(--pearl)]/70 text-[10px] font-semibold tracking-wider">
            <Link href="/track-order" className="hover:text-[var(--sand)] transition-colors hidden sm:block">Track Order</Link>
            <span className="hidden sm:block text-[var(--pearl)]/30">|</span>
            <Link href="/contact" className="hover:text-[var(--sand)] transition-colors">Help</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-[var(--bg-primary)] border-b border-[var(--border-color)]">
        <div className="container mx-auto px-4 md:px-6 py-4 md:py-5">
          <div className="flex items-center justify-between gap-4 md:gap-8">

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo - Elegant */}
            <Link href="/" className="shrink-0 group">
              <div className="flex items-baseline">
                <span className="text-xl md:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
                  AVENGERS
                </span>
                <span className="text-xl md:text-2xl font-bold text-[var(--crimson)] tracking-tight">
                  HQ
                </span>
              </div>
            </Link>

            {/* Desktop Navigation - Minimalist */}
            <nav className="hidden lg:flex items-center gap-10">
              <Link href="/" className="text-[var(--text-primary)] text-xs font-semibold uppercase tracking-[0.15em] hover:text-[var(--accent)] transition-colors">
                Home
              </Link>
              <Link href="/category/all" className="text-[var(--text-secondary)] text-xs font-semibold uppercase tracking-[0.15em] hover:text-[var(--accent)] transition-colors">
                Shop
              </Link>
              <Link href="/categories" className="text-[var(--text-secondary)] text-xs font-semibold uppercase tracking-[0.15em] hover:text-[var(--accent)] transition-colors">
                Categories
              </Link>
              <Link href="/brands" className="text-[var(--text-secondary)] text-xs font-semibold uppercase tracking-[0.15em] hover:text-[var(--accent)] transition-colors">
                Brands
              </Link>
              <Link href="/new-arrivals" className="text-[var(--crimson)] text-xs font-bold uppercase tracking-[0.15em] hover:text-[var(--sand)] transition-colors">
                New
              </Link>
            </nav>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-sm">
              <div className="w-full flex bg-transparent border-b border-[var(--border-color)] focus-within:border-[var(--accent)] transition-all">
                <input
                  type="text"
                  placeholder="Search..."
                  className="flex-1 py-2 px-0 outline-none bg-transparent text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)]"
                />
                <button className="px-2 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
                  <Search size={16} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Mobile Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="md:hidden p-2 text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
              >
                <Search size={18} />
              </button>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Wishlist */}
              <Link href="/wishlist" className="hidden md:flex p-2 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors relative">
                <Heart size={18} strokeWidth={1.5} />
                {mounted && wishlistItems.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[var(--accent)] text-white h-4 w-4 rounded-full flex items-center justify-center text-[9px] font-medium">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Account */}
              <Link href="/login" className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
                <User size={18} strokeWidth={1.5} />
              </Link>

              {/* Cart */}
              <Link href="/cart" className="flex items-center gap-1.5 md:gap-2 bg-[var(--btn-cart-bg)] border border-[var(--border-color)] px-2.5 md:px-4 py-2 hover:border-[var(--btn-cart-hover-bg)] hover:bg-[var(--btn-cart-hover-bg)] transition-all duration-300 group shadow-sm hover:shadow-md rounded-lg">
                <div className="relative">
                  <ShoppingBag size={16} strokeWidth={1.5} className="text-[var(--btn-cart-text)] group-hover:text-[var(--btn-cart-hover-text)]" />
                  {mounted && cartItems.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-[var(--crimson)] text-[var(--pearl)] h-4 w-4 rounded-full flex items-center justify-center text-[9px] font-semibold transition-colors">
                      {cartItems.length}
                    </span>
                  )}
                </div>
                <span className="hidden sm:block text-[var(--btn-cart-text)] group-hover:text-[var(--btn-cart-hover-text)] text-xs font-semibold uppercase tracking-wider transition-colors">Cart</span>
              </Link>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {searchOpen && (
            <div className="md:hidden mt-4">
              <div className="flex border-b border-[var(--border-color)] focus-within:border-[var(--accent)]">
                <input
                  type="text"
                  placeholder="Search..."
                  className="flex-1 py-3 px-0 outline-none bg-transparent text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)]"
                  autoFocus
                />
                <button className="px-2 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
                  <Search size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[var(--bg-primary)] border-b border-[var(--border-color)]">
          <div className="container mx-auto px-4 md:px-6 py-6">
            <nav className="flex flex-col gap-1">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="py-3 px-0 text-[var(--text-primary)] text-sm font-medium uppercase tracking-[0.15em] border-b border-[var(--border-light)] hover:text-[var(--accent)] transition-colors">
                Home
              </Link>
              <Link href="/category/all" onClick={() => setMobileMenuOpen(false)} className="py-3 px-0 text-[var(--text-secondary)] text-sm font-medium uppercase tracking-[0.15em] border-b border-[var(--border-light)] hover:text-[var(--text-primary)] transition-colors">
                Shop All
              </Link>
              <Link href="/categories" onClick={() => setMobileMenuOpen(false)} className="py-3 px-0 text-[var(--text-secondary)] text-sm font-medium uppercase tracking-[0.15em] border-b border-[var(--border-light)] hover:text-[var(--text-primary)] transition-colors">
                Categories
              </Link>
              <Link href="/brands" onClick={() => setMobileMenuOpen(false)} className="py-3 px-0 text-[var(--text-secondary)] text-sm font-medium uppercase tracking-[0.15em] border-b border-[var(--border-light)] hover:text-[var(--text-primary)] transition-colors">
                Brands
              </Link>
              <Link href="/new-arrivals" onClick={() => setMobileMenuOpen(false)} className="py-3 px-0 text-[var(--accent)] text-sm font-medium uppercase tracking-[0.15em] border-b border-[var(--border-light)] hover:text-[var(--text-primary)] transition-colors">
                New Arrivals
              </Link>
              <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="py-3 px-0 text-[var(--text-secondary)] text-sm font-medium uppercase tracking-[0.15em] hover:text-[var(--text-primary)] transition-colors flex items-center gap-3">
                  <User size={16} strokeWidth={1.5} /> My Account
                </Link>
                <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)} className="py-3 px-0 text-[var(--text-secondary)] text-sm font-medium uppercase tracking-[0.15em] hover:text-[var(--text-primary)] transition-colors flex items-center gap-3">
                  <Heart size={16} strokeWidth={1.5} /> Wishlist
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
