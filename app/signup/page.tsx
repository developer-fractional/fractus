'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('Fractional Professional')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignup() {
    if (!name || !email || !password) return setMessage('Please fill in all fields')
    if (password.length < 6) return setMessage('Password must be at least 6 characters')
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (error) setMessage('Signup failed: ' + error.message)
    else window.location.href = '/dashboard'
  }

  const inputStyle = { width: '100%', background: '#141210', border: '1px solid #2A2420', borderRadius: '12px', padding: '16px 18px', color: 'white', fontSize: '16px', outline: 'none', boxSizing: 'border-box' as const }
  const labelStyle = { display: 'block', color: '#888', fontSize: '13px', fontWeight: 500, marginBottom: '8px', letterSpacing: '0.03em' } as const

  return (
    <div style={{ minHeight: '100vh', background: '#0D0A06', display: 'flex', flexDirection: 'column' }}>

      {/* Top bar */}
      <div style={{ background: '#D4A017', color: '#0D0A06', textAlign: 'center', padding: '9px 16px', fontSize: '13px', fontWeight: 600 }}>
        Powered by <a href="https://www.fractionalaeco.com" target="_blank" style={{ color: '#0D0A06', textDecoration: 'underline' }}>Fractional AECO</a> · Your AECO Experts · <a href="tel:+19804940263" style={{ color: '#0D0A06', textDecoration: 'underline' }}>+1 980 494 0263</a>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 48px', borderBottom: '1px solid #2A2420' }}>
        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span style={{ fontSize: '22px', fontWeight: 700, color: '#D4A017', fontFamily: 'Georgia, serif' }}>Fractus</span>
          <span style={{ fontSize: '11px', color: '#444', letterSpacing: '0.05em' }}>BY FRACTIONAL AECO</span>
        </a>
        <a href="/login" style={{ color: '#888', textDecoration: 'none', fontSize: '14px' }}>
          Already have an account? <span style={{ color: '#2DD4BF', fontWeight: 600 }}>Sign in →</span>
        </a>
      </nav>

      {/* Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px' }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '44px', fontWeight: 700, color: 'white', marginBottom: '8px', letterSpacing: '-1px' }}>Join Fractus</h1>
          <p style={{ color: '#666', fontSize: '17px', marginBottom: '40px' }}>Connect with top AECO fractional talent</p>

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

          <button onClick={handleSignup} disabled={loading}
            style={{ width: '100%', background: '#D4A017', color: 'white', border: 'none', borderRadius: '100px', padding: '18px', fontSize: '17px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginBottom: '20px' }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <p style={{ textAlign: 'center', color: '#555', fontSize: '15px' }}>
            Already have an account?{' '}
            <a href="/login" style={{ color: '#2DD4BF', textDecoration: 'none', fontWeight: 600 }}>Sign in →</a>
          </p>

          {message && (
            <div style={{ marginTop: '24px', padding: '14px 18px', background: message.includes('failed') || message.includes('Please') ? 'rgba(255,100,100,0.08)' : 'rgba(45,212,191,0.08)', border: `1px solid ${message.includes('failed') || message.includes('Please') ? 'rgba(255,100,100,0.2)' : 'rgba(45,212,191,0.2)'}`, borderRadius: '10px', color: message.includes('failed') || message.includes('Please') ? '#FF8888' : '#2DD4BF', fontSize: '14px', textAlign: 'center' }}>
              {message}
            </div>
          )}
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '20px', color: '#333', fontSize: '13px', borderTop: '1px solid #1A1A1A' }}>
        © 2026 Fractional-AECO LLC · <a href="https://www.fractionalaeco.com" target="_blank" style={{ color: '#444', textDecoration: 'none' }}>fractionalaeco.com</a>
      </div>
    </div>
  )
}