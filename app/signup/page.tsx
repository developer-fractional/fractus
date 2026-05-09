'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('Fractional Professional')
  const [message, setMessage] = useState('')

  async function handleSignup() {
    if (!name || !email || !password) return setMessage('Please fill in all fields')
    if (password.length < 6) return setMessage('Password must be at least 6 characters')
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) setMessage('Signup failed: ' + error.message)
    else window.location.href = '/dashboard'
  }

  const inputStyle = {
    background: 'var(--color-bg-card)',
    border: '1.5px solid var(--color-border)',
    fontSize: '18px'
  }

  return (
    <div className="min-h-screen flex flex-col" style={{background:'var(--color-bg)'}}>

      {/* Top bar */}
      <div className="text-white text-center py-3 px-4" style={{background:'var(--color-primary)', fontSize:'15px'}}>
        Powered by{' '}
        <a href="https://www.fractionalaeco.com" target="_blank" className="underline font-semibold hover:opacity-80">
          Fractional AECO
        </a>{' '}
        · Your AECO Experts ·{' '}
        <a href="tel:+19804940263" className="underline hover:opacity-80">+1 980 494 0263</a>
      </div>

      {/* Nav */}
      <nav className="flex items-center justify-between px-10 py-5 border-b" style={{background:'var(--color-bg)', borderColor:'var(--color-border)'}}>
        <a href="/" className="flex flex-col">
          <span className="text-3xl font-bold" style={{color:'var(--color-accent)'}}>Fractus</span>
          <span className="text-sm text-gray-500 leading-none">by FractionalAECO</span>
        </a>
        <a href="/login" className="text-base text-gray-400 hover:text-white">
          Already have an account?{' '}
          <span className="font-semibold" style={{color:'var(--color-accent-light)'}}>Sign in →</span>
        </a>
      </nav>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-lg">

          <h1 className="font-bold text-white mb-3" style={{fontSize:'42px'}}>Join Fractus</h1>
          <p className="text-gray-400 mb-10" style={{fontSize:'20px'}}>Connect with top AECO fractional talent</p>

          <div className="mb-6">
            <label className="block font-semibold text-gray-300 mb-3" style={{fontSize:'17px'}}>Full name</label>
            <input type="text" placeholder="Jane Smith" value={name} onChange={e => setName(e.target.value)}
              className="w-full rounded-2xl px-6 py-5 text-white outline-none placeholder-gray-600" style={inputStyle} />
          </div>

          <div className="mb-6">
            <label className="block font-semibold text-gray-300 mb-3" style={{fontSize:'17px'}}>Email address</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full rounded-2xl px-6 py-5 text-white outline-none placeholder-gray-600" style={inputStyle} />
          </div>

          <div className="mb-6">
            <label className="block font-semibold text-gray-300 mb-3" style={{fontSize:'17px'}}>Password</label>
            <input type="password" placeholder="Min 6 characters" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full rounded-2xl px-6 py-5 text-white outline-none placeholder-gray-600" style={inputStyle} />
          </div>

          <div className="mb-10">
            <label className="block font-semibold text-gray-300 mb-3" style={{fontSize:'17px'}}>I am joining as a...</label>
            <select value={role} onChange={e => setRole(e.target.value)}
              className="w-full rounded-2xl px-6 py-5 text-white outline-none"
              style={{...inputStyle, fontSize:'18px'}}>
              <option>Fractional Professional</option>
              <option>Contractor</option>
              <option>Architect</option>
              <option>Engineer</option>
              <option>Owner / Operator</option>
              <option>Employer / Hiring</option>
            </select>
          </div>

          <button onClick={handleSignup}
            className="w-full text-white rounded-2xl font-bold cursor-pointer hover:opacity-90 transition-all mb-6"
            style={{background:'var(--color-primary)', fontSize:'20px', padding:'20px'}}>
            Create Account
          </button>

          <p className="text-center text-gray-500" style={{fontSize:'17px'}}>
            Already have an account?{' '}
            <a href="/login" className="font-semibold hover:opacity-80" style={{color:'var(--color-accent-light)'}}>Sign in →</a>
          </p>

          {message && (
            <div className={`mt-8 text-center p-5 rounded-2xl border`}
              style={{
                background: message.includes('failed') || message.includes('Please') ? 'rgba(196,18,48,0.1)' : 'rgba(20,100,50,0.1)',
                borderColor: message.includes('failed') || message.includes('Please') ? 'rgba(196,18,48,0.3)' : 'rgba(20,100,50,0.3)',
                color: message.includes('failed') || message.includes('Please') ? '#FF6B6B' : '#5DDDAA',
                fontSize: '17px'
              }}>
              {message}
            </div>
          )}

        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-6 text-gray-600 border-t" style={{borderColor:'var(--color-border)', fontSize:'15px'}}>
        © 2026 Fractional-AECO LLC ·{' '}
        <a href="https://www.fractionalaeco.com" target="_blank" className="hover:text-gray-400">fractionalaeco.com</a>
      </div>

    </div>
  )
}