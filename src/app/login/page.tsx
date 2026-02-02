'use client'

import Link from 'next/link'
import { Shield, Mail, Lock, ArrowRight } from 'lucide-react'

export default function LoginPage() {
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
            <h2 className="text-2xl md:text-3xl font-black text-[var(--text-primary)] uppercase tracking-tight">Welcome Back</h2>
            <p className="mt-2 text-sm text-[var(--text-muted)]">Login to access your Avengers HQ account</p>
          </div>

          {/* Form */}
          <form className="space-y-4">
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
                placeholder="Password"
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg py-3 md:py-4 pl-12 pr-4 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none transition-colors"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm py-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-600 bg-transparent text-[var(--accent)] focus:ring-[var(--accent)]" />
                <span className="text-[var(--text-secondary)]">Remember me</span>
              </label>
              <Link href="#" className="font-bold text-[var(--accent)] hover:text-[var(--text-primary)] transition-colors">Forgot password?</Link>
            </div>

            <button className="w-full flex items-center justify-center gap-2 bg-[var(--accent)] text-[var(--text-primary)] py-3 md:py-4 rounded-lg font-black uppercase tracking-wider text-sm hover:bg-white hover:text-[var(--accent)] transition-all">
              Login <ArrowRight size={18} />
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-[var(--bg-secondary)]"></div>
            <span className="text-[var(--text-muted)] text-xs uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-[var(--bg-secondary)]"></div>
          </div>

          {/* Social Login */}
          <button className="w-full flex items-center justify-center gap-3 border border-[var(--border-color)] text-[var(--text-secondary)] py-3 rounded-lg font-bold text-sm hover:border-[var(--accent)] hover:text-[var(--text-primary)] transition-all">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>

          {/* Register Link */}
          <p className="text-center text-sm text-[var(--text-muted)] mt-6">
            Don't have an account?{' '}
            <Link href="/register" className="font-bold text-[var(--accent)] hover:text-[var(--text-primary)] transition-colors">
              Register Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
