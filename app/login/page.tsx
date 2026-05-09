'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  async function handleLogin() {
    if (!email || !password) return setMessage('Please enter email and password')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setMessage('Login failed: ' + error.message)
    else window.location.href = '/dashboard'
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
        <a href="/signup" className="text-base text-gray-400 hover:text-white">
          Don't have an account?{' '}
          <span className="font-semibold" style={{color:'var(--color-accent-light)'}}>Sign up free →</span>
        </a>
      </nav>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-lg">

          <h1 className="font-bold text-white mb-3" style={{fontSize:'42px'}}>Welcome back</h1>
          <p className="text-gray-400 mb-12" style={{fontSize:'20px'}}>Sign in to your Fractus account</p>

          <div className="mb-6">
            <label className="block font-semibold text-gray-300 mb-3" style={{fontSize:'17px'}}>Email address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded-2xl px-6 py-5 text-white outline-none placeholder-gray-600 transition-all"
              style={{
                background:'var(--color-bg-card)',
                border:'1.5px solid var(--color-border)',
                fontSize:'18px'
              }}
            />
          </div>

          <div className="mb-10">
            <label className="block font-semibold text-gray-300 mb-3" style={{fontSize:'17px'}}>Password</label>
            <input
              type="password"
              placeholder="Your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full rounded-2xl px-6 py-5 text-white outline-none placeholder-gray-600 transition-all"
              style={{
                background:'var(--color-bg-card)',
                border:'1.5px solid var(--color-border)',
                fontSize:'18px'
              }}
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full text-white rounded-2xl font-bold cursor-pointer hover:opacity-90 transition-all mb-6"
            style={{background:'var(--color-primary)', fontSize:'20px', padding:'20px'}}
          >
            Sign In
          </button>

          <p className="text-center text-gray-500" style={{fontSize:'17px'}}>
            Don't have an account?{' '}
            <a href="/signup" className="font-semibold hover:opacity-80" style={{color:'var(--color-accent-light)'}}>
              Create one free →
            </a>
          </p>

          {message && (
            <div className="mt-8 text-center p-5 rounded-2xl border text-red-400" style={{background:'rgba(196,18,48,0.1)', borderColor:'rgba(196,18,48,0.3)', fontSize:'17px'}}>
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