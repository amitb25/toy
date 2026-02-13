import Link from 'next/link'
import { ArrowLeft, Shield } from 'lucide-react'

export default function PrivacyPage() {
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
              <Shield size={14} className="text-[var(--sand)]" />
              <span className="text-[var(--sand)] text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em]">Your Privacy</span>
            </div>

            <h1 className="text-3xl md:text-6xl lg:text-7xl font-thin text-[var(--pearl)] tracking-tight mb-4 md:mb-6">
              Privacy <span className="font-bold text-[var(--sand)]">Policy</span>
            </h1>

            <p className="text-[var(--pearl)]/60 text-sm md:text-lg max-w-xl mx-auto">
              How we collect, use, and protect your personal information.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <p className="text-xs text-[var(--text-muted)] mb-8">Last updated: February 2026</p>

          <div className="space-y-8">
            {[
              {
                title: '1. Information We Collect',
                content: `We collect information you provide directly to us, including your name, email address, shipping address, phone number, and payment details when you create an account, place an order, or contact us.\n\nWe also automatically collect certain information when you visit our site, such as your IP address, browser type, device information, and browsing activity through cookies and similar technologies.`,
              },
              {
                title: '2. How We Use Your Information',
                content: `We use your information to:\n• Process and fulfill your orders\n• Send order confirmations and shipping updates\n• Respond to your questions and support requests\n• Send promotional communications (with your consent)\n• Improve our website and services\n• Prevent fraud and ensure security`,
              },
              {
                title: '3. Information Sharing',
                content: `We do not sell your personal information. We may share your data with:\n• Payment processors to complete transactions\n• Shipping carriers to deliver your orders\n• Analytics providers to improve our services\n\nAll third parties are contractually bound to protect your data.`,
              },
              {
                title: '4. Data Security',
                content: `We implement industry-standard security measures including SSL encryption, secure payment processing, and regular security audits to protect your personal information from unauthorized access, disclosure, or misuse.`,
              },
              {
                title: '5. Cookies',
                content: `We use cookies and similar tracking technologies to enhance your browsing experience, remember your preferences, and analyze site traffic. You can manage cookie preferences through your browser settings.`,
              },
              {
                title: '6. Your Rights',
                content: `You have the right to:\n• Access the personal data we hold about you\n• Request correction of inaccurate data\n• Request deletion of your data\n• Opt out of marketing communications\n• Request a copy of your data in a portable format\n\nTo exercise these rights, contact us at privacy@avengershq.com.`,
              },
              {
                title: '7. Contact Us',
                content: `If you have questions about this privacy policy, please contact us at:\n\nAvengers HQ\nStark Tower, Manhattan, New York, NY 10001\nEmail: privacy@avengershq.com\nPhone: +1 (800) AVENGER`,
              },
            ].map((section) => (
              <div key={section.title}>
                <h2 className="text-lg md:text-xl font-bold text-[var(--text-primary)] mb-3">{section.title}</h2>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed whitespace-pre-line">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
