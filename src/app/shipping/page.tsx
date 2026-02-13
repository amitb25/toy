import Link from 'next/link'
import { ArrowLeft, Truck, Clock, IndianRupee, MapPin } from 'lucide-react'

export default function ShippingPage() {
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
              <Truck size={14} className="text-[var(--sand)]" />
              <span className="text-[var(--sand)] text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em]">Delivery Info</span>
            </div>

            <h1 className="text-3xl md:text-6xl lg:text-7xl font-thin text-[var(--pearl)] tracking-tight mb-4 md:mb-6">
              Shipping <span className="font-bold text-[var(--sand)]">Information</span>
            </h1>

            <p className="text-[var(--pearl)]/60 text-sm md:text-lg max-w-xl mx-auto">
              Everything you need to know about how we get your orders to you.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          {/* Shipping Methods */}
          <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-6">Shipping Methods</h2>
          <div className="grid sm:grid-cols-3 gap-4 md:gap-6 mb-12">
            {[
              { icon: Clock, title: 'Standard', time: '5–7 business days', price: 'Free on orders Rs.1,999+', note: 'Rs.99 for orders under Rs.1,999' },
              { icon: Truck, title: 'Express', time: '2–3 business days', price: 'Rs.199', note: 'Available in metro cities' },
              { icon: MapPin, title: 'Same Day', time: 'Within 24 hours', price: 'Rs.399', note: 'Select cities only' },
            ].map((method) => (
              <div key={method.title} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6">
                <div className="w-10 h-10 bg-[var(--sand)]/10 rounded-lg flex items-center justify-center mb-4">
                  <method.icon size={18} className="text-[var(--sand)]" />
                </div>
                <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">{method.title}</h3>
                <p className="text-sm text-[var(--sand)] font-medium mb-2">{method.time}</p>
                <p className="text-sm text-[var(--text-primary)] font-semibold">{method.price}</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">{method.note}</p>
              </div>
            ))}
          </div>

          {/* Details Sections */}
          <div className="space-y-8">
            {[
              {
                title: 'Order Processing',
                content: `Orders are processed within 1–2 business days after payment confirmation. You will receive an email confirmation with your order details and a tracking number once your package has shipped.\n\nOrders placed on weekends or public holidays will be processed on the next business day.`,
              },
              {
                title: 'Tracking Your Order',
                content: `Once your order ships, you'll receive a tracking number via email and SMS. You can use our Track Order page to check the real-time status of your delivery.\n\nPlease allow up to 24 hours after receiving your tracking number for the carrier's system to update with tracking information.`,
              },
              {
                title: 'Delivery Areas',
                content: `We currently deliver across India. Standard and Express shipping are available in all serviceable pin codes. Same-day delivery is available in select metro cities including Mumbai, Delhi, Bangalore, Hyderabad, and Chennai.\n\nFor remote areas, delivery may take an additional 2–3 business days.`,
              },
              {
                title: 'Shipping During Sales',
                content: `During major sale events, order processing and delivery may take slightly longer due to high order volumes. We appreciate your patience and will keep you updated on your order status.`,
              },
              {
                title: 'Damaged or Lost Packages',
                content: `If your package arrives damaged or is lost in transit, please contact us within 48 hours of the expected delivery date. We will arrange a replacement or full refund at no extra cost.`,
              },
            ].map((section) => (
              <div key={section.title}>
                <h2 className="text-lg md:text-xl font-bold text-[var(--text-primary)] mb-3">{section.title}</h2>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed whitespace-pre-line">{section.content}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-[var(--text-muted)] mb-4">Have questions about shipping?</p>
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
