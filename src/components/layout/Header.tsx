'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ShoppingCart, User, Search, Menu, X, Heart, Phone, Loader2 } from 'lucide-react'
import { useCartStore } from '@/lib/store/useCartStore'
import { useWishlistStore } from '@/lib/store/useWishlistStore'
import { useEffect, useState, useRef, useCallback } from 'react'
import ThemeToggle from '@/components/ThemeToggle'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  price: number
  discount: number
  images: string
  brand?: { name: string }
  category?: { name: string }
}

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const cartItems = useCartStore((state: any) => state.items)
  const wishlistItems = useWishlistStore((state) => state.items)
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const mobileSearchRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

  // Fetch all products on mount
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAllProducts(data)
        }
      })
      .catch(console.error)
  }, [])

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    if (query.trim().length < 2) {
      setSearchResults([])
      setShowResults(false)
      return
    }

    setIsSearching(true)
    const lowerQuery = query.toLowerCase()
    const filtered = allProducts.filter(product =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.brand?.name.toLowerCase().includes(lowerQuery) ||
      product.category?.name.toLowerCase().includes(lowerQuery)
    ).slice(0, 5) // Limit to 5 results

    setSearchResults(filtered)
    setShowResults(true)
    setIsSearching(false)
  }, [allProducts])

  // Handle clicking on a search result
  const handleResultClick = (product: Product) => {
    setShowResults(false)
    setSearchQuery('')
    setSearchOpen(false)
    const slug = (product as any).slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    router.push(`/product/${slug}`)
  }

  // Handle search form submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setShowResults(false)
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setSearchOpen(false)
    }
  }

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const insideDesktop = searchRef.current?.contains(target)
      const insideMobile = mobileSearchRef.current?.contains(target)
      if (!insideDesktop && !insideMobile) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Hide header on admin pages
  if (pathname?.startsWith('/admin')) {
    return null
  }

  return (
    <header className="w-full font-sans">
      {/* Top Bar - Minimalist */}
      <div className="bg-[var(--topbar-bg)]">
        <div className="container mx-auto px-4 md:px-6 py-1 md:py-2.5 flex justify-between items-center">
          <div className="flex items-center gap-4 md:gap-6 text-[var(--topbar-text)] text-[10px] font-semibold tracking-wider">
            <a href="tel:+18001234567" className="flex items-center gap-1.5 hover:text-[var(--sand)] transition-colors">
              <Phone size={11} />
              <span className="hidden sm:inline">+1 800 AVENGER</span>
            </a>
            <span className="hidden md:block opacity-30">|</span>
            <span className="hidden md:block">Free Shipping on Rs.1999+</span>
          </div>
          <div className="flex items-center gap-4 text-[var(--topbar-text)] text-[10px] font-semibold tracking-wider">
            <span className="hidden sm:block">Track Order</span>
            <span className="hidden sm:block opacity-30">|</span>
            <span>Help</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-[var(--nav-bg)] border-b border-[var(--border-color)]">
        <div className="container mx-auto px-4 md:px-6 py-2 md:py-5">
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
              <Link href="/products" className="text-[var(--text-secondary)] text-xs font-semibold uppercase tracking-[0.15em] hover:text-[var(--accent)] transition-colors">
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
            <div ref={searchRef} className="hidden md:flex flex-1 max-w-sm relative">
              <form onSubmit={handleSearchSubmit} className="w-full flex bg-transparent border-b border-[var(--border-color)] focus-within:border-[var(--accent)] transition-all">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                  className="flex-1 py-2 px-0 outline-none bg-transparent text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)]"
                />
                <button type="submit" className="px-2 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
                  {isSearching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                </button>
              </form>

              {/* Search Results Dropdown */}
              {showResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg shadow-lg z-50 overflow-hidden">
                  {searchResults.map((product) => {
                    const images = product.images ? JSON.parse(product.images) : []
                    const finalPrice = product.price - product.discount
                    return (
                      <button
                        key={product.id}
                        onClick={() => handleResultClick(product)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-[var(--bg-secondary)] transition-colors text-left border-b border-[var(--border-light)] last:border-b-0"
                      >
                        <div className="w-12 h-12 relative rounded overflow-hidden bg-[var(--bg-secondary)] flex-shrink-0">
                          {images[0] ? (
                            <Image
                              src={images[0]}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)]">
                              <ShoppingCart size={16} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--text-primary)] truncate">{product.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-sm font-semibold text-[var(--accent)]">Rs.{finalPrice.toLocaleString()}</span>
                            {product.discount > 0 && (
                              <span className="text-xs text-[var(--text-muted)] line-through">Rs.{product.price.toLocaleString()}</span>
                            )}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                  <Link
                    href={`/products?search=${encodeURIComponent(searchQuery)}`}
                    onClick={() => { setShowResults(false); setSearchQuery(''); }}
                    className="block w-full p-3 text-center text-sm font-medium text-[var(--accent)] hover:bg-[var(--bg-secondary)] transition-colors"
                  >
                    View all results
                  </Link>
                </div>
              )}

              {/* No Results Message */}
              {showResults && searchQuery.length >= 2 && searchResults.length === 0 && !isSearching && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg shadow-lg z-50 p-4 text-center">
                  <p className="text-sm text-[var(--text-muted)]">No products found for &quot;{searchQuery}&quot;</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-4 relative z-10">
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
              <Link
                href="/cart"
                className="flex items-center gap-1.5 md:gap-2 px-2.5 md:px-4 py-2 bg-[#161616] border border-[#F2F1ED]/30 hover:bg-[var(--btn-cart-hover-bg)] hover:border-[var(--btn-cart-hover-bg)] transition-all duration-300 group shadow-sm hover:shadow-md rounded-lg"
              >
                <div className="relative">
                  <ShoppingCart size={16} strokeWidth={1.5} className="text-[#F2F1ED] group-hover:text-white" />
                  {mounted && cartItems.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-[var(--crimson)] text-[var(--pearl)] h-4 w-4 rounded-full flex items-center justify-center text-[9px] font-semibold transition-colors">
                      {cartItems.length}
                    </span>
                  )}
                </div>
                <span className="hidden sm:block text-[#F2F1ED] group-hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors">Cart</span>
              </Link>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {searchOpen && (
            <div ref={mobileSearchRef} className="md:hidden mt-4 relative">
              <form onSubmit={handleSearchSubmit} className="flex border-b border-[var(--border-color)] focus-within:border-[var(--accent)]">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                  className="flex-1 py-3 px-0 outline-none bg-transparent text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)]"
                  autoFocus
                />
                <button type="submit" className="px-2 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
                  {isSearching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                </button>
              </form>

              {/* Mobile Search Results Dropdown */}
              {showResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg shadow-lg z-50 overflow-hidden">
                  {searchResults.map((product) => {
                    const images = product.images ? JSON.parse(product.images) : []
                    const finalPrice = product.price - product.discount
                    return (
                      <button
                        key={product.id}
                        onClick={() => handleResultClick(product)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-[var(--bg-secondary)] transition-colors text-left border-b border-[var(--border-light)] last:border-b-0"
                      >
                        <div className="w-12 h-12 relative rounded overflow-hidden bg-[var(--bg-secondary)] flex-shrink-0">
                          {images[0] ? (
                            <Image
                              src={images[0]}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)]">
                              <ShoppingCart size={16} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--text-primary)] truncate">{product.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-sm font-semibold text-[var(--accent)]">Rs.{finalPrice.toLocaleString()}</span>
                            {product.discount > 0 && (
                              <span className="text-xs text-[var(--text-muted)] line-through">Rs.{product.price.toLocaleString()}</span>
                            )}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                  <Link
                    href={`/products?search=${encodeURIComponent(searchQuery)}`}
                    onClick={() => { setShowResults(false); setSearchQuery(''); setSearchOpen(false); }}
                    className="block w-full p-3 text-center text-sm font-medium text-[var(--accent)] hover:bg-[var(--bg-secondary)] transition-colors"
                  >
                    View all results
                  </Link>
                </div>
              )}

              {/* No Results Message - Mobile */}
              {showResults && searchQuery.length >= 2 && searchResults.length === 0 && !isSearching && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg shadow-lg z-50 p-4 text-center">
                  <p className="text-sm text-[var(--text-muted)]">No products found for &quot;{searchQuery}&quot;</p>
                </div>
              )}
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
              <Link href="/products" onClick={() => setMobileMenuOpen(false)} className="py-3 px-0 text-[var(--text-secondary)] text-sm font-medium uppercase tracking-[0.15em] border-b border-[var(--border-light)] hover:text-[var(--text-primary)] transition-colors">
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
