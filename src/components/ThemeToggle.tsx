'use client'

import { Sun, Moon } from 'lucide-react'
import { useThemeStore } from '@/lib/store/useThemeStore'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button className="p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]">
        <div className="w-5 h-5" />
      </button>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--accent)] transition-all group"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun size={20} className="text-yellow-500 group-hover:rotate-180 transition-transform duration-500" />
      ) : (
        <Moon size={20} className="text-[var(--accent)] group-hover:rotate-12 transition-transform duration-300" />
      )}
    </button>
  )
}
