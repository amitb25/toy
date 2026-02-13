'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, MessageCircle, Mail, Phone, MapPin, Clock, Send } from 'lucide-react'

export default function ContactUsPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error('Failed to send message')
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
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
              <MessageCircle size={14} className="text-[var(--sand)]" />
              <span className="text-[var(--sand)] text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em]">Get in Touch</span>
            </div>

            <h1 className="text-3xl md:text-6xl lg:text-7xl font-thin text-[var(--pearl)] tracking-tight mb-4 md:mb-6">
              Contact <span className="font-bold text-[var(--sand)]">Us</span>
            </h1>

            <p className="text-[var(--pearl)]/60 text-sm md:text-lg max-w-xl mx-auto">
              Have a question or need help? We&apos;d love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-5 gap-10 md:gap-16 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="lg:col-span-3">
              <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-6">Send us a Message</h2>

              {submitted ? (
                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-8 md:p-12 text-center">
                  <div className="w-16 h-16 bg-[var(--success)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send size={24} className="text-[var(--success)]" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Message Sent!</h3>
                  <p className="text-[var(--text-muted)] text-sm">Thank you for reaching out. We&apos;ll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-sm outline-none focus:border-[var(--sand)] transition-colors"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-sm outline-none focus:border-[var(--sand)] transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Subject</label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-sm outline-none focus:border-[var(--sand)] transition-colors"
                      placeholder="How can we help?"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-sm outline-none focus:border-[var(--sand)] transition-colors resize-none"
                      placeholder="Tell us more..."
                    />
                  </div>
                  {error && (
                    <p className="text-sm text-[var(--error)]">{error}</p>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-[var(--sand)] text-white hover:bg-[var(--accent-hover)] px-8 py-3 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2">
              <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-6">Contact Info</h2>
              <div className="space-y-6">
                {[
                  { icon: MapPin, label: 'Address', value: 'Stark Tower, Manhattan,\nNew York, NY 10001' },
                  { icon: Mail, label: 'Email', value: 'hello@avengershq.com' },
                  { icon: Phone, label: 'Phone', value: '+1 (800) AVENGER' },
                  { icon: Clock, label: 'Hours', value: 'Mon – Fri: 9 AM – 8 PM\nSat – Sun: 10 AM – 6 PM' },
                ].map((item) => (
                  <div key={item.label} className="flex gap-4">
                    <div className="w-10 h-10 bg-[var(--sand)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon size={18} className="text-[var(--sand)]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">{item.label}</p>
                      <p className="text-sm text-[var(--text-primary)] whitespace-pre-line">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
