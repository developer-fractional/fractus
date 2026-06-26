'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { supabase } from '../lib/supabase'

const SITEKEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '0x4AAAAAADiPgJ3awUL16qTR'

const OAUTH_PROVIDERS: { name: string; provider: 'google' | 'azure' | 'linkedin_oidc'; icon: string }[] = [
  { name: 'Google', provider: 'google', icon: '🇬' },
  { name: 'Microsoft', provider: 'azure', icon: '🪟' },
  { name: 'LinkedIn', provider: 'linkedin_oidc', icon: 'in' },
]

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<string | null>(null)
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

  async function handleLogin() {
    if (!email || !password) return setMessage('Please enter email and password')
    if (!captchaToken) return setMessage('Please complete the CAPTCHA verification')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) setMessage('Login failed: ' + error.message)
    else window.location.href = '/dashboard'
  }

  async function handleOAuth(provider: 'google' | 'azure' | 'linkedin_oidc') {
    setOauthLoading(provider)
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) {
      setMessage('Sign-in failed: ' + error.message)
      setOauthLoading(null)
    }
  }

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
        <Link href="/signup" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '14px' }}>
          Don&apos;t have an account? <span style={{ color: '#05809B', fontWeight: 700 }}>Sign up free →</span>
        </Link>
      </nav>

      {/* Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(32px, 6vw, 60px) clamp(16px, 5vw, 24px)' }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          <h1 style={{ fontFamily: "'Nunito', sans-serif", fontSize: '40px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px', letterSpacing: '-1px' }}>Welcome back</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '17px', marginBottom: '32px' }}>Sign in to your Fractus account</p>

          {/* OAuth buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
            {OAUTH_PROVIDERS.map(p => (
              <button key={p.provider} onClick={() => handleOAuth(p.provider)} disabled={oauthLoading !== null}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '14px',
                  color: 'var(--text-primary)', fontSize: '15px', fontWeight: 700, cursor: oauthLoading ? 'not-allowed' : 'pointer',
                  opacity: oauthLoading && oauthLoading !== p.provider ? 0.5 : 1, fontFamily: "'Nunito Sans', sans-serif",
                }}>
                <span style={{ fontSize: '16px' }}>{p.icon}</span>
                {oauthLoading === p.provider ? 'Redirecting…' : `Continue with ${p.name}`}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', margin: '8px 0 28px' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
            <span style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600 }}>OR SIGN IN WITH EMAIL</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600, marginBottom: '8px', letterSpacing: '0.03em' }}>EMAIL ADDRESS</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)}
              style={{ width: '100%', background: 'var(--input-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px 18px', color: 'var(--text-primary)', fontSize: '16px', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600, marginBottom: '8px', letterSpacing: '0.03em' }}>PASSWORD</label>
            <input type="password" placeholder="Your password" value={password} onChange={e => setPassword(e.target.value)}
              style={{ width: '100%', background: 'var(--input-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px 18px', color: 'var(--text-primary)', fontSize: '16px', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <div style={{ textAlign: 'right', marginBottom: '24px' }}>
            <Link href="/forgot-password" style={{ color: '#05809B', textDecoration: 'none', fontSize: '14px', fontWeight: 700 }}>Forgot password?</Link>
          </div>

          {/* Turnstile — explicit render via useEffect after script loads */}
          <div ref={containerRef} style={{ margin: '16px 0' }} />

          <button onClick={handleLogin} disabled={loading}
            style={{ width: '100%', background: '#F6981F', color: 'white', border: 'none', borderRadius: '100px', padding: '18px', fontSize: '17px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginBottom: '20px', fontFamily: "'Nunito Sans', sans-serif" }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '15px' }}>
            Don&apos;t have an account?{' '}
            <Link href="/signup" style={{ color: '#05809B', textDecoration: 'none', fontWeight: 700 }}>Create one free →</Link>
          </p>

          {message && (
            <div style={{ marginTop: '24px', padding: '14px 18px', background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: '10px', color: '#FF8888', fontSize: '14px', textAlign: 'center' }}>
              {message}
            </div>
          )}
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)', fontSize: '13px', borderTop: '1px solid var(--border-color)' }}>
        © 2026 Fractional-AECO LLC · <a href="https://www.fractionalaeco.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>fractionalaeco.com</a>
      </div>
    </div>
  )
}
