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
      <button className="p-2">
        <div className="w-[18px] h-[18px]" />
      </button>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun size={18} strokeWidth={1.5} className="hover:rotate-180 transition-transform duration-500" />
      ) : (
        <Moon size={18} strokeWidth={1.5} className="hover:rotate-12 transition-transform duration-300" />
      )}
    </button>
  )
}
