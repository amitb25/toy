'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[var(--obsidian)] text-[var(--pearl)] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[var(--crimson)] rounded-full blur-[200px] opacity-10" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[200px] bg-[var(--sand)] rounded-full blur-[150px] opacity-5" />

      {/* Newsletter */}
      <div className="border-b border-[var(--pearl)]/10">
        <div className="container mx-auto px-4 md:px-6 py-10 md:py-20 relative">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8">
            <div className="text-center lg:text-left">
              <h3 className="text-xl md:text-3xl font-light tracking-tight mb-2">
                Subscribe to our <span className="font-bold text-[var(--sand)]">Newsletter</span>
              </h3>
              <p className="text-[var(--pearl)]/60 text-xs md:text-sm">Get exclusive deals, new arrivals & updates</p>
            </div>
            <div className="w-full lg:w-auto flex-1 max-w-lg">
              <div className="bg-[var(--pearl)]/5 backdrop-blur-sm border border-[var(--pearl)]/10 p-1 md:p-1.5 flex rounded-lg overflow-hidden">
                <input type="email" placeholder="Enter your email" className="bg-transparent flex-1 px-3 md:px-4 outline-none text-[var(--pearl)] text-sm placeholder:text-[var(--pearl)]/40 min-w-0" />
                <button className="bg-[var(--crimson)] text-[var(--pearl)] px-4 md:px-8 py-2.5 md:py-3 text-[10px] md:text-xs font-semibold uppercase tracking-wider hover:bg-[var(--sand)] hover:text-[var(--obsidian)] transition-all duration-300 cursor-pointer whitespace-nowrap">Subscribe</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Content */}
      <div className="container mx-auto px-4 md:px-6 py-10 md:py-20 relative">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12">
          <div className="col-span-2 lg:col-span-2">
            <div className="text-xl md:text-3xl font-light tracking-tight mb-3 md:mb-4">
              <span className="font-bold">AVENGERS</span><span className="text-[var(--crimson)]">HQ</span>
            </div>
            <p className="text-[var(--pearl)]/60 text-xs md:text-sm leading-relaxed mb-4 md:mb-6 max-w-sm">Your ultimate destination for premium collectibles and exclusive merchandise.</p>
            <div className="flex gap-2 md:gap-3">
              {['Tw', 'In', 'Yt', 'Fb'].map((social) => (
                <a key={social} href="#" className="w-8 h-8 md:w-10 md:h-10 bg-[var(--pearl)]/5 flex items-center justify-center text-[var(--pearl)]/60 hover:bg-[var(--crimson)] hover:text-[var(--pearl)] transition-all duration-300 rounded-lg">
                  <span className="text-[10px] md:text-xs font-semibold">{social}</span>
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-[var(--sand)] font-bold uppercase tracking-wider text-xs md:text-sm mb-4 md:mb-6">Quick Links</h4>
            <ul className="space-y-2 md:space-y-3">
              <li><Link href="/" className="text-[var(--pearl)]/60 hover:text-[var(--sand)] transition-colors text-xs md:text-sm">Home</Link></li>
              <li><Link href="/category/all" className="text-[var(--pearl)]/60 hover:text-[var(--sand)] transition-colors text-xs md:text-sm">Shop All</Link></li>
              <li><Link href="/categories" className="text-[var(--pearl)]/60 hover:text-[var(--sand)] transition-colors text-xs md:text-sm">Categories</Link></li>
              <li><Link href="/brands" className="text-[var(--pearl)]/60 hover:text-[var(--sand)] transition-colors text-xs md:text-sm">Brands</Link></li>
              <li><Link href="/new-arrivals" className="text-[var(--pearl)]/60 hover:text-[var(--sand)] transition-colors text-xs md:text-sm">New Arrivals</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[var(--sand)] font-bold uppercase tracking-wider text-xs md:text-sm mb-4 md:mb-6">Help</h4>
            <ul className="space-y-2 md:space-y-3">
              {['Contact Us', 'FAQs', 'Shipping', 'Returns', 'Track Order'].map((link) => (
                <li key={link}><Link href="#" className="text-[var(--pearl)]/60 hover:text-[var(--sand)] transition-colors text-xs md:text-sm">{link}</Link></li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-[var(--sand)] font-bold uppercase tracking-wider text-xs md:text-sm mb-4 md:mb-6">Contact</h4>
            <ul className="space-y-2 md:space-y-3 text-[var(--pearl)]/60 text-xs md:text-sm">
              <li>Stark Tower, New York</li>
              <li>hello@avengershq.com</li>
              <li>+1 (800) AVENGER</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[var(--pearl)]/10">
        <div className="container mx-auto px-4 md:px-6 py-4 md:py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
            <p className="text-[var(--pearl)]/40 text-[10px] md:text-xs order-3 md:order-1">© 2026 Avengers HQ. All rights reserved.</p>
            <div className="flex items-center gap-4 md:gap-6 order-1 md:order-2">
              {['Privacy', 'Terms', 'Cookies'].map((link) => (
                <Link key={link} href="#" className="text-[var(--pearl)]/40 hover:text-[var(--sand)] text-[10px] md:text-xs transition-colors">{link}</Link>
              ))}
            </div>
            <div className="flex items-center gap-1.5 md:gap-2 order-2 md:order-3">
              {['VISA', 'MC', 'UPI', 'COD'].map((method) => (
                <div key={method} className="bg-[var(--pearl)]/5 px-2 md:px-3 py-1 md:py-1.5 rounded">
                  <span className="text-[8px] md:text-[10px] font-semibold text-[var(--pearl)]/60">{method}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
