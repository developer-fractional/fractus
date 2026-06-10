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

const OAUTH_PROVIDERS: { name: string; provider: 'google' | 'azure' | 'linkedin_oidc'; icon: string }[] = [
  { name: 'Google', provider: 'google', icon: '🇬' },
  { name: 'Microsoft', provider: 'azure', icon: '🪟' },
  { name: 'LinkedIn', provider: 'linkedin_oidc', icon: 'in' },
]

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('Fractional Professional')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<string | null>(null)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)

  useEffect(() => {
    window.onTurnstileSuccess = (token: string) => {
      setCaptchaToken(token)
    }
  }, [])

  async function handleSignup() {
    if (!name || !email || !password) return setMessage('Please fill in all fields')
    if (password.length < 6) return setMessage('Password must be at least 6 characters')
    if (!captchaToken) return setMessage('Please complete the CAPTCHA verification')
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setLoading(false)
      return setMessage('Signup failed: ' + error.message)
    }

    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: data.user.id,
        email,
        name,
        role,
      })
      if (profileError) {
        setLoading(false)
        return setMessage('Account created, but saving your profile failed: ' + profileError.message)
      }
    }

    setLoading(false)
    window.location.href = '/verify-email?email=' + encodeURIComponent(email)
  }

  async function handleOAuth(provider: 'google' | 'azure' | 'linkedin_oidc') {
    setOauthLoading(provider)
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) {
      setMessage('Sign-up failed: ' + error.message)
      setOauthLoading(null)
    }
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
          Already have an account? <span style={{ color: '#05809B', fontWeight: 700 }}>Sign in →</span>
        </Link>
      </nav>

      {/* Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(32px, 6vw, 60px) clamp(16px, 5vw, 24px)' }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          <h1 style={{ fontFamily: "'Nunito', sans-serif", fontSize: '40px', fontWeight: 800, color: 'white', marginBottom: '8px', letterSpacing: '-1px' }}>Join Fractus</h1>
          <p style={{ color: '#8892A4', fontSize: '17px', marginBottom: '32px' }}>Connect with top AECO fractional talent</p>

          {/* OAuth buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
            {OAUTH_PROVIDERS.map(p => (
              <button key={p.provider} onClick={() => handleOAuth(p.provider)} disabled={oauthLoading !== null}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  background: '#1B2130', border: '1px solid #2A3145', borderRadius: '12px', padding: '14px',
                  color: 'white', fontSize: '15px', fontWeight: 700, cursor: oauthLoading ? 'not-allowed' : 'pointer',
                  opacity: oauthLoading && oauthLoading !== p.provider ? 0.5 : 1, fontFamily: "'Nunito Sans', sans-serif",
                }}>
                <span style={{ fontSize: '16px' }}>{p.icon}</span>
                {oauthLoading === p.provider ? 'Redirecting…' : `Sign up with ${p.name}`}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', margin: '8px 0 28px' }}>
            <div style={{ flex: 1, height: '1px', background: '#2A3145' }} />
            <span style={{ color: '#4A5568', fontSize: '13px', fontWeight: 600 }}>OR SIGN UP WITH EMAIL</span>
            <div style={{ flex: 1, height: '1px', background: '#2A3145' }} />
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={labelStyle}>FULL NAME</label>
            <input type="text" placeholder="Jane Smith" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ marginBottom: '18px' }}>
            <label style={labelStyle}>EMAIL ADDRESS</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ marginBottom: '18px' }}>
            <label style={labelStyle}>PASSWORD</label>
            <input type="password" placeholder="Min 6 characters" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ marginBottom: '32px' }}>
            <label style={labelStyle}>I AM JOINING AS A...</label>
            <select value={role} onChange={e => setRole(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
              <option>Fractional Professional</option>
              <option>Contractor</option>
              <option>Architect</option>
              <option>Engineer</option>
              <option>Owner / Operator</option>
              <option>Employer / Hiring</option>
            </select>
          </div>

          {/* Turnstile CAPTCHA — rendered by Cloudflare script via data-* attributes */}
          <div
            className="cf-turnstile"
            data-sitekey="0x4AAAAAADiPgJ3awUL16qTR"
            data-callback="onTurnstileSuccess"
            style={{ margin: '16px 0' }}
          />

          <button onClick={handleSignup} disabled={loading}
            style={{ width: '100%', background: '#F6981F', color: 'white', border: 'none', borderRadius: '100px', padding: '18px', fontSize: '17px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginBottom: '20px', fontFamily: "'Nunito Sans', sans-serif" }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <p style={{ textAlign: 'center', color: '#8892A4', fontSize: '15px' }}>
            Already have an account?{' '}
            <Link href="/signup" style={{ color: '#05809B', textDecoration: 'none', fontWeight: 700 }}>Sign in →</Link>
          </p>

          {message && (
            <div style={{ marginTop: '24px', padding: '14px 18px', background: message.includes('failed') || message.includes('Please') ? 'rgba(255,107,107,0.08)' : 'rgba(5,128,155,0.08)', border: `1px solid ${message.includes('failed') || message.includes('Please') ? 'rgba(255,107,107,0.2)' : 'rgba(5,128,155,0.2)'}`, borderRadius: '10px', color: message.includes('failed') || message.includes('Please') ? '#FF8888' : '#05809B', fontSize: '14px', textAlign: 'center' }}>
              {message}
            </div>
          )}
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '20px', color: '#4A5568', fontSize: '13px', borderTop: '1px solid #2A3145' }}>
        © 2026 Fractional-AECO LLC · <a href="https://www.fractionalaeco.com" target="_blank" rel="noopener noreferrer" style={{ color: '#4A5568', textDecoration: 'none' }}>fractionalaeco.com</a>
      </div>
    </div>
  )
}
