'use client'

import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, Smartphone, ShieldCheck, Zap, Bell, Package, Heart, Clock, Gift, Star, ChevronRight, Download, X, CheckCircle } from 'lucide-react'

const benefits = [
  {
    icon: Bell,
    title: 'Real-Time Notifications',
    description: 'Get instant alerts for flash sales, price drops on wishlist items, order updates, and exclusive app-only deals. Never miss out on limited-time offers again.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast Experience',
    description: 'Enjoy a buttery smooth browsing experience optimized for mobile. Quick load times, seamless navigation, and one-tap checkout make shopping effortless.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Payments',
    description: 'Shop with confidence using encrypted payment processing. Multiple payment options including UPI, cards, wallets, and cash on delivery with complete data protection.',
  },
  {
    icon: Package,
    title: 'Live Order Tracking',
    description: 'Track your orders in real-time from warehouse to doorstep. Get live delivery updates, estimated arrival times, and instant delivery confirmations.',
  },
  {
    icon: Gift,
    title: 'App-Only Exclusive Deals',
    description: 'Unlock special discounts and offers available only on the app. First access to new arrivals, member-only sales, and bonus reward points on every purchase.',
  },
  {
    icon: Heart,
    title: 'Personalized For You',
    description: 'Get product recommendations tailored to your taste. Save favorites, create wishlists, and pick up right where you left off across all your devices.',
  },
  {
    icon: Clock,
    title: 'On-Time Delivery',
    description: 'We promise timely delivery on every order. Real-time tracking keeps you informed, and our dedicated support team ensures your package arrives when expected.',
  },
  {
    icon: Star,
    title: 'Loyalty Rewards',
    description: 'Earn reward points on every purchase made through the app. Redeem points for discounts, free shipping, and exclusive member perks as you level up.',
  },
]

const steps = [
  { step: '01', title: 'Download', description: 'Tap the download button below' },
  { step: '02', title: 'Sign Up', description: 'Create your account in seconds' },
  { step: '03', title: 'Explore', description: 'Browse our premium collections' },
  { step: '04', title: 'Enjoy', description: 'Shop with exclusive app benefits' },
]

export default function DownloadAppPage() {
  const [showModal, setShowModal] = useState(false)
  const [countdown, setCountdown] = useState(3)
  const [phase, setPhase] = useState<'countdown' | 'downloading' | 'done'>('countdown')
  const [progress, setProgress] = useState(0)

  const startDownload = useCallback(() => {
    setShowModal(true)
    setCountdown(3)
    setPhase('countdown')
    setProgress(0)
  }, [])

  // Countdown timer
  useEffect(() => {
    if (!showModal || phase !== 'countdown') return
    if (countdown <= 0) {
      setPhase('downloading')
      return
    }
    const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000)
    return () => clearTimeout(timer)
  }, [showModal, countdown, phase])

  // Progress bar animation
  useEffect(() => {
    if (phase !== 'downloading') return
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setPhase('done')
          return 100
        }
        return prev + 2
      })
    }, 30)
    return () => clearInterval(interval)
  }, [phase])

  // Trigger actual file download only when done
  useEffect(() => {
    if (phase !== 'done') return
    const link = document.createElement('a')
    link.href = '/velcario app/velcario.apk'
    link.download = 'velcario.apk'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [phase])

  const closeModal = () => {
    setShowModal(false)
    setPhase('countdown')
    setCountdown(3)
    setProgress(0)
  }

  return (
    <div className="bg-[var(--bg-primary)] min-h-screen text-[var(--text-primary)]">

      {/* Download Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={closeModal}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />

          {/* Modal */}
          <div
            className="relative w-full max-w-md bg-gradient-to-b from-[#1a1a2e] to-[#0a0a14] border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl"
            onClick={e => e.stopPropagation()}
            style={{ animation: 'modalIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
            {/* Close button */}
            <button onClick={closeModal} className="absolute top-4 right-4 text-white/30 hover:text-white/70 transition-colors">
              <X size={20} />
            </button>

            {/* Glow effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[var(--crimson)]/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 text-center">
              {/* App Icon */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--sand)] to-[var(--crimson)] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[var(--crimson)]/30"
                style={{ animation: phase === 'countdown' ? 'pulse 1s ease-in-out infinite' : 'none' }}>
                {phase === 'done' ? (
                  <CheckCircle size={36} className="text-white" />
                ) : (
                  <span className="text-white text-2xl font-black" style={{ fontFamily: 'var(--font-heading)' }}>V</span>
                )}
              </div>

              <h3 className="text-white text-xl font-bold mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                VELCARIO
              </h3>
              <p className="text-white/40 text-xs tracking-widest uppercase mb-8">Premium Shopping App</p>

              {/* Countdown Phase */}
              {phase === 'countdown' && (
                <div style={{ animation: 'fadeIn 0.3s ease' }}>
                  <p className="text-white/50 text-sm mb-6 font-medium">Your download starts in</p>
                  <div className="relative w-32 h-32 mx-auto mb-8">
                    {/* Circular progress ring */}
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="52" fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="4" />
                      <circle
                        cx="60" cy="60" r="52" fill="none"
                        stroke="url(#countdownGradient)" strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={`${(countdown / 3) * 327} 327`}
                        style={{ transition: 'stroke-dasharray 1s linear' }}
                      />
                      <defs>
                        <linearGradient id="countdownGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="var(--sand)" />
                          <stop offset="100%" stopColor="var(--crimson)" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        key={countdown}
                        className="text-6xl font-black bg-gradient-to-b from-[var(--sand)] to-[var(--crimson)] bg-clip-text text-transparent"
                        style={{ animation: 'countPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)', fontFamily: 'var(--font-heading)' }}
                      >
                        {countdown}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-white/30 text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--sand)] animate-pulse" />
                    Preparing your download...
                  </div>
                </div>
              )}

              {/* Downloading Phase */}
              {phase === 'downloading' && (
                <div style={{ animation: 'fadeIn 0.3s ease' }}>
                  <p className="text-[var(--sand)] text-sm font-bold mb-6 tracking-wider uppercase">Downloading...</p>

                  {/* Progress bar */}
                  <div className="relative w-full h-2 bg-white/5 rounded-full overflow-hidden mb-4">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[var(--sand)] to-[var(--crimson)] transition-all duration-100 ease-linear"
                      style={{ width: `${progress}%` }}
                    />
                    <div
                      className="absolute top-0 h-full w-20 rounded-full opacity-40"
                      style={{
                        background: 'linear-gradient(90deg, transparent, white, transparent)',
                        animation: 'shimmer 1.5s infinite',
                        left: `${progress - 15}%`,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs mb-8">
                    <span className="text-white/40">velcario.apk</span>
                    <span className="text-[var(--sand)] font-bold">{progress}%</span>
                  </div>

                  {/* Download icon animation */}
                  <div className="flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[var(--sand)]/10 border border-[var(--sand)]/20 flex items-center justify-center">
                      <Download size={20} className="text-[var(--sand)]" style={{ animation: 'downloadBounce 1s ease-in-out infinite' }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Done Phase */}
              {phase === 'done' && (
                <div style={{ animation: 'fadeIn 0.4s ease' }}>
                  <div className="w-16 h-16 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center mx-auto mb-5"
                    style={{ animation: 'scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
                    <CheckCircle size={32} className="text-green-400" />
                  </div>
                  <p className="text-green-400 text-lg font-bold mb-2">Download Complete!</p>
                  <p className="text-white/40 text-sm mb-8">Open the APK file to install Velcario</p>

                  <button
                    onClick={closeModal}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--sand)] to-[var(--crimson)] text-white px-8 py-3.5 rounded-xl font-bold text-sm tracking-wider uppercase hover:opacity-90 transition-opacity"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style jsx global>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes countPop {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        @keyframes downloadBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(4px); }
        }
        @keyframes scaleIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(var(--crimson-rgb, 139, 0, 0), 0.4); }
          50% { box-shadow: 0 0 0 15px rgba(var(--crimson-rgb, 139, 0, 0), 0); }
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-[var(--obsidian)] overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--crimson)]/15 rounded-full blur-[150px] -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[var(--sand)]/10 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          {/* Back button */}
          <Link href="/" className="inline-flex items-center gap-2 text-[var(--pearl)]/60 hover:text-[var(--sand)] transition-colors mb-10">
            <ArrowLeft size={16} />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>

          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-3 bg-[var(--sand)]/10 backdrop-blur-md border border-[var(--sand)]/30 rounded-full px-5 py-2.5 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--sand)]"></span>
                </span>
                <span className="text-[var(--sand)] text-[11px] font-bold uppercase tracking-[0.3em]">Download Now</span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extralight text-[var(--pearl)] tracking-tight mb-6 leading-[1.1]">
                Experience <br />
                <span className="font-black text-[var(--sand)]">Velcario</span><br />
                On Your Phone
              </h1>

              <p className="text-[var(--pearl)]/50 text-base md:text-lg max-w-lg leading-relaxed mb-10">
                The ultimate shopping companion. Browse premium collections, get instant deal alerts, track your orders in real-time, and enjoy a seamless mobile shopping experience.
              </p>

              {/* Download button */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={startDownload}
                  className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-[var(--crimson)] to-[#9a001f] text-[var(--pearl)] px-8 py-4 md:px-10 md:py-5 rounded-xl font-bold uppercase text-xs md:text-sm tracking-wider overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_var(--crimson)] hover:scale-105"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[var(--sand)] to-[var(--crimson)] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                  <Download size={20} className="relative" />
                  <span className="relative">Download App</span>
                </button>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-10 pt-8 border-t border-[var(--pearl)]/10">
                <div>
                  <div className="text-2xl md:text-3xl font-black text-[var(--sand)]">50K+</div>
                  <div className="text-[var(--pearl)]/40 text-xs mt-1">Downloads</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-black text-[var(--sand)]">4.8</div>
                  <div className="text-[var(--pearl)]/40 text-xs mt-1">App Rating</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-black text-[var(--sand)]">99%</div>
                  <div className="text-[var(--pearl)]/40 text-xs mt-1">Happy Users</div>
                </div>
              </div>
            </div>

            {/* Right - Phone Mockup */}
            <div className="relative flex justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-72 h-72 md:w-96 md:h-96 bg-[var(--crimson)]/20 rounded-full blur-[100px]" />
              </div>

              <div className="relative w-[260px] md:w-[300px]">
                <div className="relative bg-[var(--obsidian)] rounded-[44px] p-3.5 shadow-2xl shadow-black/50 border border-white/10">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[var(--obsidian)] rounded-b-2xl z-10" />
                  <div className="rounded-[32px] overflow-hidden bg-gradient-to-b from-[var(--crimson)] via-[#1a0008] to-[var(--obsidian)] aspect-[9/19.5] flex flex-col items-center justify-center p-6">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-[var(--sand)] to-[var(--crimson)] flex items-center justify-center mb-5 shadow-lg">
                      <span className="text-white text-2xl md:text-3xl font-black" style={{ fontFamily: 'var(--font-heading)' }}>V</span>
                    </div>
                    <h3 className="text-white text-base font-bold tracking-wider mb-1" style={{ fontFamily: 'var(--font-heading)' }}>VELCARIO</h3>
                    <p className="text-white/40 text-[10px] tracking-widest uppercase mb-6">Premium Store</p>
                    <div className="w-full space-y-2.5">
                      <div className="h-2.5 bg-white/10 rounded-full w-full" />
                      <div className="h-2.5 bg-white/10 rounded-full w-3/4" />
                      <div className="flex gap-2 mt-4">
                        <div className="h-20 bg-white/5 rounded-xl flex-1" />
                        <div className="h-20 bg-white/5 rounded-xl flex-1" />
                      </div>
                      <div className="flex gap-2">
                        <div className="h-20 bg-white/5 rounded-xl flex-1" />
                        <div className="h-20 bg-white/5 rounded-xl flex-1" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[80%] h-10 bg-[var(--sand)]/10 blur-xl rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 md:py-32 bg-[var(--bg-primary)]">
        <div className="container mx-auto px-4 md:px-6">
          {/* Section Header */}
          <div className="text-center mb-16 md:mb-20">
            <div className="inline-flex items-center gap-3 bg-[var(--sand)]/10 border border-[var(--sand)]/30 rounded-full px-6 py-3 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-gradient-to-r from-[var(--sand)] to-[var(--crimson)]"></span>
              </span>
              <span className="text-[var(--sand)] text-[11px] font-bold uppercase tracking-[0.3em]">Why Our App</span>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-extralight text-[var(--text-primary)] tracking-tight mb-4">
              Benefits That <span className="font-black text-[var(--sand)]">Matter</span>
            </h2>
            <p className="text-[var(--text-muted)] text-base md:text-lg max-w-xl mx-auto">
              Everything you need for a premium shopping experience, right in your pocket
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 md:p-8 hover:border-[var(--sand)]/40 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--crimson)]/10 to-[var(--sand)]/10 flex items-center justify-center mb-5 group-hover:from-[var(--crimson)]/20 group-hover:to-[var(--sand)]/20 transition-all duration-300">
                  <benefit.icon size={24} className="text-[var(--sand)]" />
                </div>
                <h3 className="text-[var(--text-primary)] text-lg font-bold mb-3">{benefit.title}</h3>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-28 bg-[var(--bg-secondary)]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extralight text-[var(--text-primary)] tracking-tight mb-4">
              Get Started In <span className="font-black text-[var(--sand)]">4 Steps</span>
            </h2>
            <p className="text-[var(--text-muted)] text-base max-w-md mx-auto">
              From download to your first order in minutes
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto">
            {steps.map((item, index) => (
              <div key={index} className="text-center">
                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[var(--crimson)] to-[var(--sand)] mb-5">
                  <span className="text-white text-xl font-black">{item.step}</span>
                  {index < steps.length - 1 && (
                    <ChevronRight size={20} className="absolute -right-8 top-1/2 -translate-y-1/2 text-[var(--sand)] hidden lg:block" />
                  )}
                </div>
                <h4 className="text-[var(--text-primary)] font-bold text-lg mb-1">{item.title}</h4>
                <p className="text-[var(--text-muted)] text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-[var(--obsidian)] relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[500px] h-[500px] bg-[var(--crimson)]/15 rounded-full blur-[150px]" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--sand)] to-[var(--crimson)] flex items-center justify-center mx-auto mb-8 shadow-lg">
            <Download size={32} className="text-white" />
          </div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-extralight text-[var(--pearl)] tracking-tight mb-4">
            Ready To <span className="font-black text-[var(--sand)]">Download?</span>
          </h2>
          <p className="text-[var(--pearl)]/50 text-base md:text-lg max-w-lg mx-auto mb-10">
            Join thousands of happy shoppers. Download the Velcario app today and unlock exclusive deals.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={startDownload}
              className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-[var(--crimson)] to-[#9a001f] text-[var(--pearl)] px-8 py-4 md:px-10 md:py-5 rounded-xl font-bold uppercase text-xs md:text-sm tracking-wider overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_var(--crimson)] hover:scale-105"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[var(--sand)] to-[var(--crimson)] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
              <Download size={20} className="relative" />
              <span className="relative">Download App</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
