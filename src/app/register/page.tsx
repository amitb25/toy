'use client'

import Link from 'next/link'
import { Shield, Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-[var(--accent)] text-[var(--text-primary)] mb-6">
              <Shield size={32} />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-[var(--text-primary)] uppercase tracking-tight">Join The Team</h2>
            <p className="mt-2 text-sm text-[var(--text-muted)]">Create your Avengers HQ account</p>
          </div>

          {/* Form */}
          <form className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
              <input
                type="text"
                placeholder="Full Name"
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg py-3 md:py-4 pl-12 pr-4 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none transition-colors"
                required
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg py-3 md:py-4 pl-12 pr-4 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none transition-colors"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
              <input
                type="password"
                placeholder="Create Password"
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg py-3 md:py-4 pl-12 pr-4 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none transition-colors"
                required
              />
            </div>

            <div className="flex items-start gap-3 py-2">
              <input type="checkbox" className="mt-1 h-4 w-4 rounded border-gray-600 bg-transparent text-[var(--accent)] focus:ring-[var(--accent)]" required />
              <span className="text-xs text-[var(--text-muted)]">
                I agree to the <span className="text-[var(--accent)] font-bold cursor-pointer hover:text-[var(--text-primary)] transition-colors">Terms of Service</span> and <span className="text-[var(--accent)] font-bold cursor-pointer hover:text-[var(--text-primary)] transition-colors">Privacy Policy</span>
              </span>
            </div>

            <button className="w-full flex items-center justify-center gap-2 bg-[var(--accent)] text-[var(--text-primary)] py-3 md:py-4 rounded-lg font-black uppercase tracking-wider text-sm hover:bg-white hover:text-[var(--accent)] transition-all">
              Create Account <ArrowRight size={18} />
            </button>
          </form>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 py-6 text-xs font-bold text-green-500 uppercase tracking-widest">
            <ShieldCheck size={16} /> 100% Secure Signup
          </div>

          {/* Login Link */}
          <p className="text-center text-sm text-[var(--text-muted)]">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-[var(--accent)] hover:text-[var(--text-primary)] transition-colors">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
