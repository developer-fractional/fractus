'use client'
import { useLayoutEffect } from 'react'
import { getSessionTheme } from '../lib/theme'

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useLayoutEffect(() => {
    const theme = getSessionTheme()
    const root = document.documentElement
    root.style.setProperty('--color-primary', theme.primary)
    root.style.setProperty('--color-primary-hover', theme.primaryHover)
    root.style.setProperty('--color-bg', theme.bg)
    root.style.setProperty('--color-bg-card', theme.bgCard)
    root.style.setProperty('--color-border', theme.border)
    root.style.setProperty('--color-accent', theme.accent)
    root.style.setProperty('--color-accent-light', theme.accentLight)
    document.documentElement.style.backgroundColor = theme.bg
    document.body.style.backgroundColor = theme.bg
  }, [])

  return <>{children}</>
}