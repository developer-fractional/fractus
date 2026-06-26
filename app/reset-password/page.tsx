'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

type PageState = 'loading' | 'ready' | 'expired'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [pageState, setPageState] = useState<PageState>('loading')

  useEffect(() => {
    // Parse the hash fragment that Supabase appends to the redirectTo URL.
    // Format: #access_token=xxx&refresh_token=yyy&type=recovery&...
    const hash = window.location.hash.slice(1) // strip leading '#'
    const params = new URLSearchParams(hash)
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')
    const type = params.get('type')

    if (accessToken && type === 'recovery') {
      // Explicitly establish the session — @supabase/ssr does not auto-detect
      // hash fragments the way the legacy supabase-js client does.
      supabase.auth
        .setSession({ access_token: accessToken, refresh_token: refreshToken ?? '' })
        .then(({ error }) => {
          if (error) {
            console.error('setSession error:', error.message)
            setPageState('expired')
          } else {
            // Clean the tokens out of the URL bar (cosmetic, no navigation)
            window.history.replaceState(null, '', window.location.pathname)
            setPageState('ready')
          }
        })
    } else {
      // No hash token — maybe PKCE flow already set a cookie session.
      // Check for an existing session before giving up.
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) {
          setPageState('ready')
        } else {
          // Nothing found. Give a 3-second grace period in case the page
          // loaded before the supabase SDK initialised, then show the error.
          const timer = setTimeout(() => setPageState('expired'), 3000)
          return () => clearTimeout(timer)
        }
      })
    }
  }, [])

  async function handleUpdate() {
    if (!password || !confirmPassword) return setMessage('Please fill in both fields')
    if (password.length < 6) return setMessage('Password must be at least 6 characters')
    if (password !== confirmPassword) return setMessage('Passwords do not match')

    setLoading(true)
    setMessage('')
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) setMessage('Could not update password: ' + error.message)
    else window.location.href = '/dashboard'
  }

  const inputStyle = {
    width: '100%', background: 'var(--input-bg)', border: '1px solid var(--border-color)',
    borderRadius: '12px', padding: '16px 18px', color: 'var(--text-primary)',
    fontSize: '16px', outline: 'none', boxSizing: 'border-box' as const,
  }
  const labelStyle = {
    display: 'block', color: 'var(--text-muted)', fontSize: '13px',
    fontWeight: 600, marginBottom: '8px', letterSpacing: '0.03em',
  } as const

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', fontFamily: "'Nunito Sans', sans-serif" }}>

      {/* Top bar */}
      <div style={{ background: '#F6981F', color: 'white', textAlign: 'center', padding: '9px 16px', fontSize: '13px', fontWeight: 700 }}>
        Powered by <a href="https://www.fractionalaeco.com" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'underline' }}>Fractional AECO</a> · Your AECO Experts · <a href="tel:+19804940263" style={{ color: 'white', textDecoration: 'underline' }}>+1 980 494 0263</a>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 48px', borderBottom: '1px solid var(--border-color)' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span style={{ fontSize: '22px', fontWeight: 800, color: '#F6981F', fontFamily: "'Nunito', sans-serif" }}>Fractus</span>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '0.05em', fontWeight: 600 }}>BY FRACTIONAL AECO</span>
        </Link>
        <Link href="/login" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '14px' }}>
          <span style={{ color: '#05809B', fontWeight: 700 }}>← Back to sign in</span>
        </Link>
      </nav>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px' }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          <h1 style={{ fontFamily: "'Nunito', sans-serif", fontSize: '40px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px', letterSpacing: '-1px' }}>Set a new password</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '17px', marginBottom: '32px' }}>Choose a strong new password for your Fractus account.</p>

          {pageState === 'loading' && (
            <div style={{ padding: '20px 22px', background: 'rgba(5,128,155,0.08)', border: '1px solid rgba(5,128,155,0.2)', borderRadius: '12px', color: '#05809B', fontSize: '15px', textAlign: 'center' }}>
              Verifying your reset link…
            </div>
          )}

          {pageState === 'expired' && (
            <div style={{ padding: '20px 22px', background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: '12px', color: '#FF8888', fontSize: '15px', textAlign: 'center' }}>
              Reset link expired or already used.{' '}
              <Link href="/forgot-password" style={{ color: '#F6981F', fontWeight: 700, textDecoration: 'underline' }}>
                Request a new one →
              </Link>
            </div>
          )}

          {pageState === 'ready' && (
            <>
              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>NEW PASSWORD</label>
                <input type="password" placeholder="Min 6 characters" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ marginBottom: '32px' }}>
                <label style={labelStyle}>CONFIRM NEW PASSWORD</label>
                <input type="password" placeholder="Re-enter your new password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} style={inputStyle} />
              </div>

              <button onClick={handleUpdate} disabled={loading}
                style={{ width: '100%', background: '#F6981F', color: 'white', border: 'none', borderRadius: '100px', padding: '18px', fontSize: '17px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginBottom: '20px', fontFamily: "'Nunito Sans', sans-serif" }}>
                {loading ? 'Updating password...' : 'Update password'}
              </button>

              {message && (
                <div style={{ padding: '14px 18px', background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: '10px', color: '#FF8888', fontSize: '14px', textAlign: 'center' }}>
                  {message}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)', fontSize: '13px', borderTop: '1px solid var(--border-color)' }}>
        © 2026 Fractional-AECO LLC · <a href="https://www.fractionalaeco.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>fractionalaeco.com</a>
      </div>
    </div>
  )
}
