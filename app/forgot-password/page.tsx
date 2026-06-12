'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { supabase } from '../lib/supabase'

declare global {
  interface Window {
    onTurnstileSuccess: (token: string) => void
  }
}

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)

  useEffect(() => {
    window.onTurnstileSuccess = (token: string) => {
      setCaptchaToken(token)
    }
  }, [])

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

  const inputStyle = { width: '100%', background: '#1B2130', border: '1px solid #2A3145', borderRadius: '12px', padding: '16px 18px', color: 'white', fontSize: '16px', outline: 'none', boxSizing: 'border-box' as const }
  const labelStyle = { display: 'block', color: '#8892A4', fontSize: '13px', fontWeight: 600, marginBottom: '8px', letterSpacing: '0.03em' } as const

  return (
    <div style={{ minHeight: '100vh', background: '#0F1117', display: 'flex', flexDirection: 'column', fontFamily: "'Nunito Sans', sans-serif" }}>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />

      {/* Top bar */}
      <div style={{ background: '#F6981F', color: 'white', textAlign: 'center', padding: '9px 16px', fontSize: '13px', fontWeight: 700 }}>
        Powered by <a href="https://www.fractionalaeco.com" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'underline' }}>Fractional AECO</a> · Your AECO Experts · <a href="tel:+19804940263" style={{ color: 'white', textDecoration: 'underline' }}>+1 980 494 0263</a>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 48px', borderBottom: '1px solid #2A3145' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span style={{ fontSize: '22px', fontWeight: 800, color: '#F6981F', fontFamily: "'Nunito', sans-serif" }}>Fractus</span>
          <span style={{ fontSize: '11px', color: '#4A5568', letterSpacing: '0.05em', fontWeight: 600 }}>BY FRACTIONAL AECO</span>
        </Link>
        <Link href="/login" style={{ color: '#8892A4', textDecoration: 'none', fontSize: '14px' }}>
          Remembered it? <span style={{ color: '#05809B', fontWeight: 700 }}>Sign in →</span>
        </Link>
      </nav>

      {/* Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px' }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          <h1 style={{ fontFamily: "'Nunito', sans-serif", fontSize: '40px', fontWeight: 800, color: 'white', marginBottom: '8px', letterSpacing: '-1px' }}>Forgot your password?</h1>
          <p style={{ color: '#8892A4', fontSize: '17px', marginBottom: '32px' }}>No worries — enter your email and we&apos;ll send you a reset link.</p>

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

              {/* Turnstile CAPTCHA — rendered by Cloudflare script via data-* attributes */}
              <div
                className="cf-turnstile"
                data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAADiPgJ3awUL16qTR"}
                data-callback="onTurnstileSuccess"
                style={{ margin: '16px 0' }}
              />

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

          <p style={{ textAlign: 'center', color: '#8892A4', fontSize: '15px', marginTop: '24px' }}>
            <Link href="/login" style={{ color: '#05809B', textDecoration: 'none', fontWeight: 700 }}>← Back to sign in</Link>
          </p>
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '20px', color: '#4A5568', fontSize: '13px', borderTop: '1px solid #2A3145' }}>
        © 2026 Fractional-AECO LLC · <a href="https://www.fractionalaeco.com" target="_blank" rel="noopener noreferrer" style={{ color: '#4A5568', textDecoration: 'none' }}>fractionalaeco.com</a>
      </div>
    </div>
  )
}
