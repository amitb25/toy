'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight, Award, Star, ChevronLeft, ChevronRight, Flame, Sparkles, TrendingUp, Tag } from 'lucide-react'
import { useEffect, useState } from 'react'
import ProductCard from '@/components/ProductCard'
import QuickView from '@/components/QuickView'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [brands, setBrands] = useState<any[]>([])
  const [banners, setBanners] = useState<any[]>([])
  const [currentBanner, setCurrentBanner] = useState(0)
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
    fetch('/api/products').then(res => res.json()).then(data => Array.isArray(data) ? setProducts(data) : setProducts([])).catch(console.error)
    fetch('/api/brands').then(res => res.json()).then(data => Array.isArray(data) ? setBrands(data) : setBrands([])).catch(console.error)
    fetch('/api/banners').then(res => res.json()).then(data => Array.isArray(data) ? setBanners(data) : setBanners([])).catch(console.error)
  }, [])

  // Auto-rotate banners
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [banners.length])

  if (!mounted) return null

  const featuredProducts = products.filter(p => p.featured)
  const newArrivals = [...products].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8)
  const bestSellers = [...products].sort((a, b) => b.soldCount - a.soldCount).slice(0, 8)
  const dealsProducts = products.filter(p => p.discount > 0).slice(0, 6)
  const ownBrandProducts = products.filter(p => p.brand?.type === 'OWN').slice(0, 4)

  const nextBanner = () => setCurrentBanner((prev) => (prev + 1) % banners.length)
  const prevBanner = () => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)

  return (
    <div className="bg-[var(--bg-primary)] min-h-screen text-[var(--text-primary)] font-sans">

      {/* 1. HERO BANNER SLIDER */}
      <section className="relative h-[350px] md:h-[500px] lg:h-[700px] w-full overflow-hidden">
        {banners.length === 0 ? (
          <div className="absolute inset-0">
            <img src="https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?q=80&w=2000" className="w-full h-full object-cover" alt="Hero" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-black/50 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4 md:px-6">
                <h1 className="text-2xl md:text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter mb-2 md:mb-4">Avengers Collection</h1>
                <p className="text-[var(--text-secondary)] text-sm md:text-lg lg:text-xl mb-4 md:mb-8">Premium Marvel collectibles & action figures</p>
                <Link href="/category/all" className="inline-block bg-[var(--accent)] text-white px-6 py-3 md:px-8 md:py-4 font-black uppercase text-xs md:text-sm tracking-wider hover:bg-white hover:text-[var(--accent)] transition-all rounded-lg">Shop Now</Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${index === currentBanner ? 'opacity-100' : 'opacity-0'}`}
              >
                <img src={banner.image} className="w-full h-full object-cover" alt={banner.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-black/50 to-transparent" />
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-4 md:px-6">
                    <h1 className="text-2xl md:text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter mb-2 md:mb-4 max-w-3xl">{banner.title}</h1>
                    <p className="text-[var(--text-secondary)] text-sm md:text-lg lg:text-xl mb-4 md:mb-8 max-w-xl">{banner.subtitle}</p>
                    <Link href={banner.link || '/category/all'} className="inline-block bg-[var(--accent)] text-white px-6 py-3 md:px-8 md:py-4 font-black uppercase text-xs md:text-sm tracking-wider hover:bg-white hover:text-[var(--accent)] transition-all rounded-lg">Shop Now</Link>
                  </div>
                </div>
              </div>
            ))}
            {banners.length > 1 && (
              <>
                <button onClick={prevBanner} className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 md:p-3 bg-black/50 text-white rounded-full hover:bg-[var(--accent)] transition-all">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={nextBanner} className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 md:p-3 bg-black/50 text-white rounded-full hover:bg-[var(--accent)] transition-all">
                  <ChevronRight size={20} />
                </button>
                <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                  {banners.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentBanner(index)}
                      className={`h-1.5 md:h-2 rounded-full transition-all ${index === currentBanner ? 'w-6 md:w-8 bg-[var(--accent)]' : 'w-1.5 md:w-2 bg-[var(--bg-secondary)]0'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </section>

      {/* 2. DEALS & OFFERS */}
      {dealsProducts.length > 0 && (
        <section className="bg-gradient-to-r from-[var(--accent)]/20 to-[var(--bg-primary)] py-8 md:py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <div className="flex items-center gap-2 md:gap-3">
                <Tag className="text-[var(--accent)]" size={20} />
                <div>
                  <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight">Hot <span className="text-[var(--accent)]">Deals</span></h2>
                  <p className="text-[var(--text-muted)] text-xs md:text-sm hidden sm:block">Limited time offers - Don't miss out!</p>
                </div>
              </div>
              <Link href="/deals" className="text-[var(--accent)] text-[10px] md:text-xs font-black uppercase tracking-wider hover:text-white transition-colors">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
              {dealsProducts.map((product) => (
                <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. FEATURED PRODUCTS */}
      {featuredProducts.length > 0 && (
        <section className="container mx-auto px-4 md:px-6 py-10 md:py-20">
          <div className="flex items-center justify-between mb-6 md:mb-12">
            <div className="flex items-center gap-2 md:gap-3">
              <Sparkles className="text-yellow-500" size={20} />
              <div>
                <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight">Featured <span className="text-yellow-500">Products</span></h2>
                <p className="text-[var(--text-muted)] text-xs md:text-sm hidden sm:block">Handpicked by our team</p>
              </div>
            </div>
            <Link href="/featured" className="text-yellow-500 text-[10px] md:text-xs font-black uppercase tracking-wider hover:text-white transition-colors">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
            ))}
          </div>
        </section>
      )}

      {/* 4. OUR EXCLUSIVES */}
      {ownBrandProducts.length > 0 && (
        <section className="container mx-auto px-4 md:px-6 py-10 md:py-20 border-y border-[var(--border-light)]">
          <div className="flex items-center justify-between mb-6 md:mb-12">
            <div className="flex items-center gap-2 md:gap-4">
              <Award className="text-[var(--accent)]" size={24} />
              <div>
                <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight">Our <span className="text-[var(--accent)]">Exclusives</span></h2>
                <p className="text-[var(--text-muted)] text-xs md:text-sm hidden sm:block">Only at Avengers HQ</p>
              </div>
            </div>
            <Link href="/category/exclusives" className="text-[var(--accent)] text-[10px] md:text-xs font-black uppercase tracking-wider hover:text-white transition-colors">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {ownBrandProducts.map((product) => (
              <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
            ))}
          </div>
        </section>
      )}

      {/* 5. SHOP BY PARTNER BRANDS */}
      {brands.filter(b => b.type === 'THIRD_PARTY').length > 0 && (
        <section className="container mx-auto px-4 md:px-6 py-10 md:py-20">
          <div className="flex items-center gap-2 md:gap-4 mb-6 md:mb-12">
            <Star className="text-[var(--text-muted)]" size={20} />
            <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight">Shop by <span className="text-[var(--text-muted)]">Partner Brands</span></h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
            {brands.filter(b => b.type === 'THIRD_PARTY').map((brand: any) => (
              <Link
                key={brand.id}
                href={`/brand/${brand.id}`}
                className="group bg-[var(--bg-card)] border border-[var(--border-color)] p-3 md:p-4 hover:border-[var(--accent)] hover:bg-[var(--bg-secondary)] transition-all duration-300 flex flex-col md:flex-row items-center gap-2 md:gap-4 rounded-xl"
              >
                <div className="w-14 h-14 md:w-20 md:h-20 flex-shrink-0 overflow-hidden rounded-lg md:rounded-xl bg-[var(--bg-secondary)]">
                  {brand.logo ? (
                    <img src={brand.logo} alt={brand.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Star className="text-[var(--text-muted)] group-hover:text-white transition-colors" size={20} />
                    </div>
                  )}
                </div>
                <div className="text-center md:text-left">
                  <p className="text-sm md:text-lg font-black uppercase tracking-wider text-[var(--text-secondary)] group-hover:text-white transition-colors">{brand.name}</p>
                  <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] block mt-0.5 md:mt-1">Official Partner</span>
                  <span className="text-[10px] text-[var(--accent)] font-bold mt-1 md:mt-2 block group-hover:underline">Shop Now →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 6. NEW ARRIVALS */}
      <section className="bg-[var(--bg-secondary)] py-10 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between mb-6 md:mb-12">
            <div className="flex items-center gap-2 md:gap-3">
              <Flame className="text-orange-500" size={20} />
              <div>
                <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight">New <span className="text-orange-500">Arrivals</span></h2>
                <p className="text-[var(--text-muted)] text-xs md:text-sm hidden sm:block">Fresh from the multiverse</p>
              </div>
            </div>
            <Link href="/new-arrivals" className="text-orange-500 text-[10px] md:text-xs font-black uppercase tracking-wider hover:text-white transition-colors">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {newArrivals.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. BEST SELLERS */}
      <section className="container mx-auto px-4 md:px-6 py-10 md:py-20">
        <div className="flex items-center justify-between mb-6 md:mb-12">
          <div className="flex items-center gap-2 md:gap-3">
            <TrendingUp className="text-green-500" size={20} />
            <div>
              <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight">Best <span className="text-green-500">Sellers</span></h2>
              <p className="text-[var(--text-muted)] text-xs md:text-sm hidden sm:block">Most loved by our heroes</p>
            </div>
          </div>
          <Link href="/best-sellers" className="text-green-500 text-[10px] md:text-xs font-black uppercase tracking-wider hover:text-white transition-colors">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {bestSellers.slice(0, 4).map((product, index) => (
            <div key={product.id} className="relative">
              <div className="absolute -top-1 -left-1 md:-top-3 md:-left-3 z-10 w-5 h-5 md:w-8 md:h-8 bg-green-500 rounded-full flex items-center justify-center text-black font-black text-[10px] md:text-sm">
                #{index + 1}
              </div>
              <ProductCard product={product} onQuickView={setQuickViewProduct} />
            </div>
          ))}
        </div>
      </section>

      {/* 8. ALL PRODUCTS */}
      <section className="container mx-auto px-4 md:px-6 py-10 md:py-20 border-t border-[var(--border-light)]">
        <div className="flex items-center justify-between mb-6 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter">Avengers <span className="text-[var(--accent)]">HQ.</span></h2>
          <div className="flex gap-2 md:gap-4">
            <button className="h-9 w-9 md:h-12 md:w-12 border border-[var(--border-color)] flex items-center justify-center hover:bg-[var(--accent)] transition-all rounded-lg">
              <ArrowLeft size={16} />
            </button>
            <button className="h-9 w-9 md:h-12 md:w-12 border border-[var(--border-color)] flex items-center justify-center hover:bg-[var(--accent)] transition-all rounded-lg">
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/category/all" className="inline-block border-2 border-[var(--accent)] text-[var(--accent)] px-12 py-4 font-black uppercase text-sm tracking-wider hover:bg-[var(--accent)] hover:text-white transition-all">
            View All Products
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[var(--bg-primary)] border-t border-[var(--accent)]/30 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--accent)] rounded-full blur-[200px] opacity-5" />

        {/* Newsletter */}
        <div className="border-b border-[var(--border-light)]">
          <div className="container mx-auto px-6 py-16">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div>
                <h3 className="text-3xl font-black uppercase tracking-tight text-white mb-2">Join The <span className="text-[var(--accent)]">Avengers</span></h3>
                <p className="text-[var(--text-muted)] text-sm">Get exclusive deals, new arrivals & superhero updates</p>
              </div>
              <div className="w-full lg:w-auto flex-1 max-w-xl">
                <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] p-1.5 flex rounded-lg focus-within:border-[var(--accent)] transition-all">
                  <input type="email" placeholder="Enter your email" className="bg-transparent flex-1 px-4 outline-none text-white text-sm placeholder:text-[var(--text-muted)]" />
                  <button className="bg-[var(--accent)] text-white px-8 py-3 text-xs font-black uppercase tracking-wider rounded-md hover:bg-white hover:text-[var(--accent)] transition-all">Subscribe</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Content */}
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2">
              <div className="text-3xl font-black text-white italic tracking-tighter uppercase mb-4">AVENGERS<span className="text-[var(--accent)]">HQ</span></div>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-6 max-w-sm">Your ultimate destination for premium Marvel collectibles, action figures, and superhero merchandise.</p>
              <div className="flex gap-3">
                {['twitter', 'instagram', 'youtube', 'facebook'].map((social) => (
                  <a key={social} href="#" className="w-10 h-10 bg-[var(--bg-secondary)] rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--accent)] hover:text-white transition-all">
                    <span className="text-xs font-bold uppercase">{social[0]}</span>
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white font-black uppercase tracking-wider text-sm mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {['Home', 'Shop All', 'Action Figures', 'Collectibles', 'Role Play'].map((link) => (
                  <li key={link}><Link href="#" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors text-sm">{link}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-black uppercase tracking-wider text-sm mb-6">Help</h4>
              <ul className="space-y-3">
                {['Contact Us', 'FAQs', 'Shipping', 'Returns', 'Track Order'].map((link) => (
                  <li key={link}><Link href="#" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors text-sm">{link}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-black uppercase tracking-wider text-sm mb-6">Contact</h4>
              <ul className="space-y-3 text-[var(--text-muted)] text-sm">
                <li>Stark Tower, New York</li>
                <li>hello@avengershq.com</li>
                <li>+1 (800) AVENGER</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[var(--border-light)]">
          <div className="container mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-[var(--text-muted)] text-xs">© 2026 Avengers HQ. All rights reserved.</p>
              <div className="flex items-center gap-6">
                {['Privacy', 'Terms', 'Cookies'].map((link) => (
                  <Link key={link} href="#" className="text-[var(--text-muted)] hover:text-white text-xs transition-colors">{link}</Link>
                ))}
              </div>
              <div className="flex items-center gap-2">
                {['VISA', 'MC', 'UPI', 'COD'].map((method) => (
                  <div key={method} className="bg-[var(--bg-secondary)] rounded px-2 py-1">
                    <span className="text-[10px] font-bold text-[var(--text-muted)]">{method}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
    </div>
  )
}
