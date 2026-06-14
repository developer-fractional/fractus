'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

export default function HomeNav() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    // If Supabase redirected a recovery email here (site URL + hash), forward to reset-password.
    if (typeof window !== 'undefined') {
      const hash = window.location.hash
      if (hash.includes('type=recovery')) {
        window.location.href = '/reset-password' + hash
        return
      }
    }
    supabase.auth.getSession().then(({ data }) => setLoggedIn(!!data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setLoggedIn(!!session))
    return () => listener.subscription.unsubscribe()
  }, [])

  return (
    <>
      {/* Top bar */}
      <div className="text-center py-2 px-4 text-xs sm:text-sm font-bold text-white"
        style={{ background: '#F6981F' }}>
        Powered by{' '}
        <a href="https://www.fractionalaeco.com" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'underline' }}>Fractional AECO</a>
        {' '}· Your AECO Experts ·{' '}
        <a href="tel:+19804940263" style={{ color: 'white', textDecoration: 'underline' }}>+1 980 494 0263</a>
      </div>

      {/* Nav */}
      <nav className="flex items-center justify-between px-5 sm:px-14 py-4 sm:py-5 border-b sticky top-0 z-[100]"
        style={{ background: '#0F1117', borderColor: '#2A3145' }}>
        <Link href="/" className="flex items-baseline gap-2" style={{ textDecoration: 'none' }}>
          <span className="text-xl sm:text-2xl font-bold" style={{ color: '#F6981F', fontFamily: "'Nunito', sans-serif" }}>Fractus</span>
          <span className="hidden sm:inline text-xs font-semibold" style={{ color: '#4A5568', letterSpacing: '0.08em' }}>BY FRACTIONAL AECO</span>
        </Link>

        {/* Desktop centre links */}
        <div className="hidden md:flex gap-8 items-center">
          {[['Talent', '/talent'], ['How it works', '#how'], ['Integrations', '#integrations'], ['For companies', '#companies']].map(([label, href]) => (
            <a key={label as string} href={href as string} className="text-sm font-semibold hover:text-white transition-colors"
              style={{ color: '#8892A4', textDecoration: 'none' }}>{label}</a>
          ))}
        </div>

        {/* Desktop auth */}
        <div className="hidden md:flex gap-3 items-center">
          {loggedIn ? (
            <Link href="/dashboard" className="text-white font-bold text-sm px-5 py-2 rounded-lg hover:opacity-90 transition-opacity"
              style={{ background: '#F6981F', textDecoration: 'none' }}>Dashboard</Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-semibold hover:text-white transition-colors"
                style={{ color: '#8892A4', textDecoration: 'none' }}>Sign in</Link>
              <Link href="/signup" className="text-white font-bold text-sm px-5 py-2 rounded-lg hover:opacity-90 transition-opacity"
                style={{ background: '#F6981F', textDecoration: 'none' }}>Join free</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden flex flex-col justify-center gap-[5px] p-1 cursor-pointer"
          onClick={() => setMenuOpen(o => !o)}
          style={{ background: 'none', border: 'none' }}
          aria-label="Toggle menu">
          <span className={`block w-6 h-0.5 bg-gray-400 transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`block w-6 h-0.5 bg-gray-400 transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-gray-400 transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="absolute top-full left-0 right-0 z-50 border-b flex flex-col py-3 md:hidden"
            style={{ background: '#0F1117', borderColor: '#2A3145' }}>
            {[['Talent', '/talent'], ['How it works', '#how'], ['Integrations', '#integrations'], ['For companies', '#companies']].map(([label, href]) => (
              <a key={label as string} href={href as string}
                className="px-5 py-3 text-sm font-semibold hover:text-white transition-colors"
                style={{ color: '#8892A4', textDecoration: 'none' }}
                onClick={() => setMenuOpen(false)}>{label}</a>
            ))}
            <div className="px-5 pt-3 pb-1 flex flex-col gap-3">
              {loggedIn ? (
                <Link href="/dashboard" className="text-center py-3 rounded-xl font-bold text-white"
                  style={{ background: '#F6981F', textDecoration: 'none' }}
                  onClick={() => setMenuOpen(false)}>Dashboard</Link>
              ) : (
                <>
                  <Link href="/login" className="text-center py-3 rounded-xl text-sm font-semibold border"
                    style={{ color: '#8892A4', textDecoration: 'none', borderColor: '#2A3145' }}
                    onClick={() => setMenuOpen(false)}>Sign in</Link>
                  <Link href="/signup" className="text-center py-3 rounded-xl font-bold text-white"
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
