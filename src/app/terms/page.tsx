import Link from 'next/link'
import { ArrowLeft, FileText } from 'lucide-react'

export default function TermsPage() {
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
              <FileText size={14} className="text-[var(--sand)]" />
              <span className="text-[var(--sand)] text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em]">Legal</span>
            </div>

            <h1 className="text-3xl md:text-6xl lg:text-7xl font-thin text-[var(--pearl)] tracking-tight mb-4 md:mb-6">
              Terms of <span className="font-bold text-[var(--sand)]">Service</span>
            </h1>

            <p className="text-[var(--pearl)]/60 text-sm md:text-lg max-w-xl mx-auto">
              Please read these terms carefully before using our services.
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
                title: '1. Acceptance of Terms',
                content: `By accessing or using Avengers HQ (the "Site"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Site.`,
              },
              {
                title: '2. Use of the Site',
                content: `You agree to use the Site only for lawful purposes and in accordance with these Terms. You must not:\n• Use the Site in any way that violates applicable laws or regulations\n• Attempt to gain unauthorized access to any part of the Site\n• Use the Site to transmit harmful or malicious code\n• Interfere with or disrupt the Site's operation`,
              },
              {
                title: '3. Accounts',
                content: `When you create an account, you are responsible for maintaining the confidentiality of your credentials and for all activities that occur under your account. You must provide accurate and complete information and keep it updated. We reserve the right to suspend or terminate accounts that violate these terms.`,
              },
              {
                title: '4. Products & Pricing',
                content: `We strive to display accurate product descriptions and pricing. However, we reserve the right to correct any errors and to change or update information at any time without prior notice. If a product is listed at an incorrect price, we reserve the right to cancel orders placed at that price.`,
              },
              {
                title: '5. Orders & Payment',
                content: `By placing an order, you are making an offer to purchase the products. We reserve the right to refuse or cancel any order for any reason, including product availability, pricing errors, or suspected fraud. Payment must be received in full before orders are shipped.`,
              },
              {
                title: '6. Shipping & Delivery',
                content: `Delivery timelines are estimates and not guaranteed. We are not responsible for delays caused by shipping carriers, weather, or other circumstances beyond our control. Risk of loss and title for products passes to you upon delivery.`,
              },
              {
                title: '7. Returns & Refunds',
                content: `Returns and refunds are handled according to our Returns & Refunds Policy. Please review that policy for detailed information on eligibility, timelines, and procedures.`,
              },
              {
                title: '8. Intellectual Property',
                content: `All content on the Site — including text, graphics, logos, images, and software — is the property of Avengers HQ or its licensors and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works from this content without our written permission.`,
              },
              {
                title: '9. Limitation of Liability',
                content: `To the fullest extent permitted by law, Avengers HQ shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Site or products purchased through the Site.`,
              },
              {
                title: '10. Changes to Terms',
                content: `We may update these Terms of Service at any time. Continued use of the Site after changes are posted constitutes your acceptance of the revised terms. We encourage you to review this page periodically.`,
              },
              {
                title: '11. Contact Us',
                content: `If you have questions about these Terms of Service, please contact us at:\n\nAvengers HQ\nStark Tower, Manhattan, New York, NY 10001\nEmail: legal@avengershq.com\nPhone: +1 (800) AVENGER`,
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
