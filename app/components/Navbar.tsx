'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

interface NavbarProps {
  /** Highlight the active page link — 'talent' | 'listings' | 'profile' etc. */
  activeLink?: string
  /** Extra element shown to the right of nav links (e.g. a Back button) */
  rightSlot?: React.ReactNode
}

export default function Navbar({ activeLink, rightSlot }: NavbarProps) {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setLoggedIn(!!data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => setLoggedIn(!!session))
    return () => listener.subscription.unsubscribe()
  }, [])

  const linkStyle = (key: string) => ({
    textDecoration: 'none' as const,
    color: activeLink === key ? 'white' : '#8892A4',
    fontWeight: 600,
  })

  return (
    <>
      {/* Top bar */}
      <div className="text-white text-center py-2 px-4 text-xs sm:text-sm font-bold"
        style={{ background: '#F6981F', fontFamily: "'Nunito Sans', sans-serif" }}>
        Powered by{' '}
        <a href="https://www.fractionalaeco.com" target="_blank" rel="noopener noreferrer"
          style={{ color: 'white', textDecoration: 'underline' }}>Fractional AECO</a>
        {' '}· Your AECO Experts ·{' '}
        <a href="tel:+19804940263" style={{ color: 'white', textDecoration: 'underline' }}>+1 980 494 0263</a>
      </div>

      {/* Nav */}
      <nav className="flex items-center justify-between px-5 sm:px-10 py-4 sm:py-5 border-b relative"
        style={{ background: '#0F1117', borderColor: '#2A3145' }}>

        {/* Logo */}
        <Link href="/" className="flex flex-col" style={{ textDecoration: 'none' }}>
          <span className="text-2xl sm:text-3xl font-bold"
            style={{ color: '#F6981F', fontFamily: "'Nunito', sans-serif" }}>Fractus</span>
          <span className="text-xs leading-none" style={{ color: '#4A5568' }}>by FractionalAECO</span>
        </Link>

        {/* Desktop centre links */}
        <div className="hidden md:flex gap-6 items-center">
          <Link href="/talent" className="text-sm hover:text-white transition-colors"
            style={linkStyle('talent')}>Browse Talent</Link>
          <Link href="/listings" className="text-sm hover:text-white transition-colors"
            style={linkStyle('listings')}>Listings</Link>
          {rightSlot}
        </div>

        {/* Desktop auth */}
        <div className="hidden md:flex gap-3 items-center">
          {loggedIn ? (
            <Link href="/dashboard"
              className="text-white font-bold px-5 py-2 rounded-full text-sm hover:opacity-90 transition-opacity"
              style={{ background: '#F6981F', textDecoration: 'none' }}>
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-semibold hover:text-white transition-colors"
                style={{ color: '#8892A4', textDecoration: 'none' }}>Sign in</Link>
              <Link href="/signup"
                className="text-white font-bold px-5 py-2 rounded-full text-sm hover:opacity-90 transition-opacity"
                style={{ background: '#F6981F', textDecoration: 'none' }}>
                Join free
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center gap-[5px] w-8 h-8 cursor-pointer"
          onClick={() => setMenuOpen(o => !o)}
          style={{ background: 'none', border: 'none', padding: '4px' }}
          aria-label="Toggle menu">
          <span className={`block h-0.5 bg-gray-400 transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-[7px] w-6' : 'w-6'}`} />
          <span className={`block h-0.5 bg-gray-400 transition-all duration-200 ${menuOpen ? 'opacity-0 w-6' : 'w-6'}`} />
          <span className={`block h-0.5 bg-gray-400 transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-[7px] w-6' : 'w-6'}`} />
        </button>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="absolute top-full left-0 right-0 z-50 border-b flex flex-col py-3 md:hidden"
            style={{ background: '#0F1117', borderColor: '#2A3145' }}>
            <Link href="/talent" className="px-5 py-3 text-sm font-semibold hover:text-white transition-colors"
              style={{ ...linkStyle('talent'), textDecoration: 'none' }}
              onClick={() => setMenuOpen(false)}>Browse Talent</Link>
            <Link href="/listings" className="px-5 py-3 text-sm font-semibold hover:text-white transition-colors"
              style={{ ...linkStyle('listings'), textDecoration: 'none' }}
              onClick={() => setMenuOpen(false)}>Listings</Link>
            <div className="px-5 pt-3 pb-1 flex flex-col gap-3">
              {loggedIn ? (
                <Link href="/dashboard"
                  className="text-center py-3 rounded-xl font-bold text-white"
                  style={{ background: '#F6981F', textDecoration: 'none' }}
                  onClick={() => setMenuOpen(false)}>Dashboard</Link>
              ) : (
                <>
                  <Link href="/login"
                    className="text-center py-3 rounded-xl font-semibold border text-sm"
                    style={{ color: '#8892A4', textDecoration: 'none', borderColor: '#2A3145' }}
                    onClick={() => setMenuOpen(false)}>Sign in</Link>
                  <Link href="/signup"
                    className="text-center py-3 rounded-xl font-bold text-white"
                    style={{ background: '#F6981F', textDecoration: 'none' }}
                    onClick={() => setMenuOpen(false)}>Join free</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
