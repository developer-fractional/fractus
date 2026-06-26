'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { supabase } from '../lib/supabase'

const SITEKEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '0x4AAAAAADiPgJ3awUL16qTR'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const widgetRef = useRef<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!scriptLoaded || !containerRef.current) return
    if (widgetRef.current) return
    // @ts-ignore
    if (typeof window.turnstile === 'undefined') return
    // @ts-ignore
    widgetRef.current = window.turnstile.render(containerRef.current, {
      sitekey: SITEKEY,
      theme: 'dark',
      callback: (token: string) => setCaptchaToken(token),
      'error-callback': () => setCaptchaToken(null),
      'expired-callback': () => setCaptchaToken(null),
    })
  }, [scriptLoaded])

  async function handleReset() {
    if (!email) return setMessage('Please enter your email address')
    if (!captchaToken) return setMessage('Please complete the CAPTCHA verification')
    setLoading(true)
    setMessage('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/auth/callback?type=recovery',
    })
    setLoading(false)
    if (error) setMessage('Something went wrong: ' + error.message)
    else setSent(true)
  }

  const inputStyle = { width: '100%', background: 'var(--input-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px 18px', color: 'var(--text-primary)', fontSize: '16px', outline: 'none', boxSizing: 'border-box' as const }
  const labelStyle = { display: 'block', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600, marginBottom: '8px', letterSpacing: '0.03em' } as const

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', fontFamily: "'Nunito Sans', sans-serif" }}>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        onLoad={() => setScriptLoaded(true)}
      />

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
          Remembered it? <span style={{ color: '#05809B', fontWeight: 700 }}>Sign in →</span>
        </Link>
      </nav>

      {/* Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px' }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          <h1 style={{ fontFamily: "'Nunito', sans-serif", fontSize: '40px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px', letterSpacing: '-1px' }}>Forgot your password?</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '17px', marginBottom: '32px' }}>No worries — enter your email and we&apos;ll send you a reset link.</p>

          {sent ? (
            <div style={{ padding: '20px 22px', background: 'rgba(5,128,155,0.08)', border: '1px solid rgba(5,128,155,0.2)', borderRadius: '12px', color: '#05809B', fontSize: '15px', textAlign: 'center', marginBottom: '24px' }}>
              ✓ Check your email for a reset link
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '28px' }}>
                <label style={labelStyle}>EMAIL ADDRESS</label>
                <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
              </div>

              {/* Turnstile — explicit render via useEffect after script loads */}
              <div ref={containerRef} style={{ margin: '16px 0' }} />

              <button onClick={handleReset} disabled={loading}
                style={{ width: '100%', background: '#F6981F', color: 'white', border: 'none', borderRadius: '100px', padding: '18px', fontSize: '17px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginBottom: '20px', fontFamily: "'Nunito Sans', sans-serif" }}>
                {loading ? 'Sending link...' : 'Send reset link'}
              </button>

              {message && (
                <div style={{ padding: '14px 18px', background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: '10px', color: '#FF8888', fontSize: '14px', textAlign: 'center' }}>
                  {message}
                </div>
              )}
            </>
          )}

          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '15px', marginTop: '24px' }}>
            <Link href="/login" style={{ color: '#05809B', textDecoration: 'none', fontWeight: 700 }}>← Back to sign in</Link>
          </p>
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)', fontSize: '13px', borderTop: '1px solid var(--border-color)' }}>
        © 2026 Fractional-AECO LLC · <a href="https://www.fractionalaeco.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>fractionalaeco.com</a>
      </div>
    </div>
  )
}
