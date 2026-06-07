'use client'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [resending, setResending] = useState(false)

  useEffect(() => {
    // Prefer the email passed in via the URL (?email=...), otherwise fall back
    // to whichever account is currently signed in.
    const fromQuery = searchParams?.get('email')
    if (fromQuery) {
      setEmail(fromQuery)
      return
    }
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setEmail(data.user.email)
    })
  }, [searchParams])

  async function handleResend() {
    if (!email) return setMessage("We don't have an email address to resend to — please sign up again.")
    setResending(true)
    setMessage('')
    const { error } = await supabase.auth.resend({ type: 'signup', email })
    setResending(false)
    if (error) setMessage('Could not resend: ' + error.message)
    else setMessage('Verification email sent — check your inbox.')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0F1117', display: 'flex', flexDirection: 'column', fontFamily: "'Nunito Sans', sans-serif" }}>

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
          Already verified? <span style={{ color: '#05809B', fontWeight: 700 }}>Sign in →</span>
        </Link>
      </nav>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px' }}>
        <div style={{ width: '100%', maxWidth: '480px', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'rgba(246,152,32,0.12)', border: '1px solid rgba(246,152,32,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 24px' }}>
            ✉️
          </div>
          <h1 style={{ fontFamily: "'Nunito', sans-serif", fontSize: '34px', fontWeight: 800, color: 'white', marginBottom: '12px', letterSpacing: '-1px' }}>Please verify your email</h1>
          <p style={{ color: '#8892A4', fontSize: '17px', marginBottom: '8px' }}>
            We&apos;ve sent a verification link to:
          </p>
          <p style={{ color: '#05809B', fontSize: '18px', fontWeight: 700, marginBottom: '32px' }}>
            {email || 'the email address you signed up with'}
          </p>
          <p style={{ color: '#8892A4', fontSize: '15px', marginBottom: '32px' }}>
            Click the link in that email to activate your account. If you don&apos;t see it, check your spam folder.
          </p>

          <button onClick={handleResend} disabled={resending}
            style={{ width: '100%', background: '#F6981F', color: 'white', border: 'none', borderRadius: '100px', padding: '18px', fontSize: '17px', fontWeight: 700, cursor: resending ? 'not-allowed' : 'pointer', opacity: resending ? 0.7 : 1, marginBottom: '20px', fontFamily: "'Nunito Sans', sans-serif" }}>
            {resending ? 'Resending...' : 'Resend verification email'}
          </button>

          {message && (
            <div style={{ padding: '14px 18px', background: message.includes('sent') ? 'rgba(5,128,155,0.08)' : 'rgba(255,107,107,0.08)', border: `1px solid ${message.includes('sent') ? 'rgba(5,128,155,0.2)' : 'rgba(255,107,107,0.2)'}`, borderRadius: '10px', color: message.includes('sent') ? '#05809B' : '#FF8888', fontSize: '14px', textAlign: 'center', marginBottom: '20px' }}>
              {message}
            </div>
          )}

          <p style={{ color: '#8892A4', fontSize: '15px' }}>
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

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div style={{ background: '#0F1117', minHeight: '100vh' }} />}>
      <VerifyEmailContent />
    </Suspense>
  )
}
