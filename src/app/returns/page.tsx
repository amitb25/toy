import Link from 'next/link'
import { ArrowLeft, RotateCcw, CheckCircle, XCircle, Package } from 'lucide-react'

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[var(--brand-banner-bg)] py-10 md:py-24">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-[var(--pearl)]/60 hover:text-[var(--sand)] transition-colors mb-6 md:mb-8 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs md:text-sm font-medium">Back to Home</span>
          </Link>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 md:gap-3 border border-[var(--sand)]/30 bg-[var(--sand)]/20 rounded-full px-4 md:px-6 py-2 md:py-3 mb-6 md:mb-8">
              <RotateCcw size={14} className="text-[var(--sand)]" />
              <span className="text-[var(--sand)] text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em]">Easy Returns</span>
            </div>

            <h1 className="text-3xl md:text-6xl lg:text-7xl font-thin text-[var(--pearl)] tracking-tight mb-4 md:mb-6">
              Returns & <span className="font-bold text-[var(--sand)]">Refunds</span>
            </h1>

            <p className="text-[var(--pearl)]/60 text-sm md:text-lg max-w-xl mx-auto">
              Hassle-free returns within 30 days of delivery.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          {/* How to Return Steps */}
          <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-6">How to Return an Item</h2>
          <div className="grid sm:grid-cols-3 gap-4 md:gap-6 mb-12">
            {[
              { step: '1', title: 'Request Return', desc: 'Log in to your account or contact our support team with your order ID and reason for return.' },
              { step: '2', title: 'Ship It Back', desc: 'We\'ll arrange a free pickup from your address or you can drop it off at the nearest partner location.' },
              { step: '3', title: 'Get Refunded', desc: 'Once we receive and inspect the item, your refund will be processed within 5–7 business days.' },
            ].map((item) => (
              <div key={item.step} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 relative">
                <div className="w-8 h-8 bg-[var(--sand)]/20 text-[var(--sand)] rounded-full flex items-center justify-center text-sm font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-base font-bold text-[var(--text-primary)] mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Eligible / Not Eligible */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle size={20} className="text-[var(--success)]" />
                <h3 className="text-base font-bold text-[var(--text-primary)]">Eligible for Return</h3>
              </div>
              <ul className="space-y-2">
                {[
                  'Items in unused, original condition',
                  'Items with tags and packaging intact',
                  'Items returned within 30 days of delivery',
                  'Defective or damaged items (report within 48 hours)',
                  'Wrong item received',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
                    <span className="text-[var(--success)] mt-0.5">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <XCircle size={20} className="text-[var(--error)]" />
                <h3 className="text-base font-bold text-[var(--text-primary)]">Not Eligible</h3>
              </div>
              <ul className="space-y-2">
                {[
                  'Items that have been used, worn, or washed',
                  'Items without original tags or packaging',
                  'Items returned after 30 days',
                  'Gift cards and digital products',
                  'Items marked as non-returnable on the product page',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
                    <span className="text-[var(--error)] mt-0.5">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* More Sections */}
          <div className="space-y-8">
            {[
              {
                title: 'Refund Methods',
                content: `Refunds are issued to the original payment method:\n• Credit/Debit Card — 5–7 business days\n• UPI — 2–3 business days\n• Cash on Delivery — Refund to bank account (5–7 business days)\n\nYou can also choose to receive store credit, which is applied instantly.`,
              },
              {
                title: 'Exchanges',
                content: `We offer free exchanges for a different size or color of the same product, subject to availability. To request an exchange, contact our support team with your order ID. Exchange items are shipped once the original item has been picked up.`,
              },
              {
                title: 'Damaged or Defective Items',
                content: `If you receive a damaged or defective item, please contact us within 48 hours of delivery with photos of the damage. We will arrange an immediate replacement or full refund, including shipping costs.`,
              },
            ].map((section) => (
              <div key={section.title}>
                <h2 className="text-lg md:text-xl font-bold text-[var(--text-primary)] mb-3">{section.title}</h2>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed whitespace-pre-line">{section.content}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-[var(--text-muted)] mb-4">Need help with a return?</p>
            <Link
              href="/contact-us"
              className="inline-block bg-[var(--sand)] text-white hover:bg-[var(--accent-hover)] px-8 py-3 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
