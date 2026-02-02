'use client'

import { useEffect } from 'react'
import { useThemeStore } from '@/lib/store/useThemeStore'

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore()

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return <>{children}</>
}
