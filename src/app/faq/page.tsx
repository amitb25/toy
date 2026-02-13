'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, HelpCircle, ChevronDown } from 'lucide-react'

const faqSections = [
  {
    title: 'Orders & Shipping',
    items: [
      { q: 'How do I place an order?', a: 'Browse our products, add items to your cart, and proceed to checkout. You can pay using credit/debit cards, UPI, or cash on delivery.' },
      { q: 'How long does delivery take?', a: 'Standard delivery takes 5–7 business days. Express delivery is available for 2–3 business days at an additional charge.' },
      { q: 'Do you offer free shipping?', a: 'Yes! We offer free standard shipping on all orders above Rs.1,999.' },
      { q: 'Can I track my order?', a: 'Absolutely. Once your order ships, you\'ll receive a tracking number via email. You can also use our Track Order page.' },
    ],
  },
  {
    title: 'Returns & Refunds',
    items: [
      { q: 'What is your return policy?', a: 'We accept returns within 30 days of delivery. Items must be unused and in their original packaging.' },
      { q: 'How do I initiate a return?', a: 'Visit your account page or contact our support team with your order ID. We\'ll arrange a pickup for you.' },
      { q: 'When will I receive my refund?', a: 'Refunds are processed within 5–7 business days after we receive and inspect the returned item.' },
      { q: 'Can I exchange an item?', a: 'Yes. Contact our support team to arrange an exchange for a different size or variant.' },
    ],
  },
  {
    title: 'Account & Payment',
    items: [
      { q: 'Do I need an account to order?', a: 'You can checkout as a guest, but creating an account lets you track orders, save wishlists, and get personalized recommendations.' },
      { q: 'What payment methods do you accept?', a: 'We accept Visa, Mastercard, UPI, net banking, and cash on delivery (COD).' },
      { q: 'Is my payment information secure?', a: 'Yes. We use industry-standard SSL encryption to protect all payment information.' },
    ],
  },
  {
    title: 'Products',
    items: [
      { q: 'Are all products authentic?', a: 'Yes. We source all products directly from authorized brands and manufacturers. Every item is 100% genuine.' },
      { q: 'How do I find my size?', a: 'Each product page includes a detailed size guide. If you need more help, feel free to contact us.' },
      { q: 'Will out-of-stock items be restocked?', a: 'We restock popular items regularly. Sign up for notifications on the product page to be alerted when it\'s back.' },
    ],
  },
]

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  const toggle = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }))
  }

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
              <HelpCircle size={14} className="text-[var(--sand)]" />
              <span className="text-[var(--sand)] text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em]">Help Center</span>
            </div>

            <h1 className="text-3xl md:text-6xl lg:text-7xl font-thin text-[var(--pearl)] tracking-tight mb-4 md:mb-6">
              Frequently Asked <span className="font-bold text-[var(--sand)]">Questions</span>
            </h1>

            <p className="text-[var(--pearl)]/60 text-sm md:text-lg max-w-xl mx-auto">
              Find quick answers to common questions about orders, shipping, and more.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <div className="space-y-10">
            {faqSections.map((section) => (
              <div key={section.title}>
                <h2 className="text-lg md:text-xl font-bold text-[var(--text-primary)] mb-4">{section.title}</h2>
                <div className="space-y-2">
                  {section.items.map((item, idx) => {
                    const key = `${section.title}-${idx}`
                    const isOpen = openItems[key]
                    return (
                      <div key={key} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl overflow-hidden">
                        <button
                          onClick={() => toggle(key)}
                          className="w-full flex items-center justify-between gap-4 p-4 md:p-5 text-left cursor-pointer"
                        >
                          <span className="text-sm font-medium text-[var(--text-primary)]">{item.q}</span>
                          <ChevronDown
                            size={18}
                            className={`text-[var(--text-muted)] flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                          />
                        </button>
                        {isOpen && (
                          <div className="px-4 md:px-5 pb-4 md:pb-5">
                            <p className="text-sm text-[var(--text-muted)] leading-relaxed">{item.a}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-[var(--text-muted)] mb-4">Still have questions?</p>
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
