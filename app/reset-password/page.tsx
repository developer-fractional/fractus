'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  // true once Supabase fires PASSWORD_RECOVERY (session is live)
  const [sessionReady, setSessionReady] = useState(false)

  useEffect(() => {
    // Supabase detects the access_token in the URL hash automatically and fires
    // PASSWORD_RECOVERY once the session is established from the hash fragment.
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setSessionReady(true)
      }
    })
    return () => listener.subscription.unsubscribe()
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

  const inputStyle = { width: '100%', background: '#1B2130', border: '1px solid #2A3145', borderRadius: '12px', padding: '16px 18px', color: 'white', fontSize: '16px', outline: 'none', boxSizing: 'border-box' as const }
  const labelStyle = { display: 'block', color: '#8892A4', fontSize: '13px', fontWeight: 600, marginBottom: '8px', letterSpacing: '0.03em' } as const

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
          <span style={{ color: '#05809B', fontWeight: 700 }}>← Back to sign in</span>
        </Link>
      </nav>

      {/* Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px' }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          <h1 style={{ fontFamily: "'Nunito', sans-serif", fontSize: '40px', fontWeight: 800, color: 'white', marginBottom: '8px', letterSpacing: '-1px' }}>Set a new password</h1>
          <p style={{ color: '#8892A4', fontSize: '17px', marginBottom: '32px' }}>Choose a strong new password for your Fractus account.</p>

          {!sessionReady ? (
            /* Waiting for Supabase to process the hash token */
            <div style={{ padding: '20px 22px', background: 'rgba(5,128,155,0.08)', border: '1px solid rgba(5,128,155,0.2)', borderRadius: '12px', color: '#05809B', fontSize: '15px', textAlign: 'center' }}>
              Verifying your reset link…
            </div>
          ) : (
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

      <div style={{ textAlign: 'center', padding: '20px', color: '#4A5568', fontSize: '13px', borderTop: '1px solid #2A3145' }}>
        © 2026 Fractional-AECO LLC · <a href="https://www.fractionalaeco.com" target="_blank" rel="noopener noreferrer" style={{ color: '#4A5568', textDecoration: 'none' }}>fractionalaeco.com</a>
      </div>
    </div>
  )
}
