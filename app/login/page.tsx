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
    <div className="min-h-screen bg-gray-950 flex flex-col">

      {/* Top bar */}
      <div className="bg-red-700 text-white text-center text-sm py-2 px-4">
        Powered by <a href="https://www.fractionalaeco.com" target="_blank" className="underline font-medium hover:text-red-200">Fractional AECO</a> · Your AECO Experts · <a href="tel:+19804940263" className="underline hover:text-red-200">+1 980 494 0263</a>
      </div>

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-4 bg-gray-950 border-b border-gray-800">
        <a href="/" className="flex flex-col">
          <span className="text-2xl font-bold text-red-600">Fractus</span>
          <span className="text-xs text-gray-500 leading-none">by FractionalAECO</span>
        </a>
        <a href="/signup" className="text-sm text-gray-400 hover:text-white">
          Don't have an account? <span className="text-red-500 font-medium">Sign up free →</span>
        </a>
      </nav>

      {/* Login form */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">

          <h1 className="text-4xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-gray-400 text-lg mb-10">Sign in to your Fractus account</p>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-300 mb-2">Email address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-5 py-4 text-white text-base outline-none focus:border-red-600 placeholder-gray-600"
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input
              type="password"
              placeholder="Your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-5 py-4 text-white text-base outline-none focus:border-red-600 placeholder-gray-600"
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-red-700 text-white py-4 rounded-xl text-lg font-semibold hover:bg-red-800 cursor-pointer mb-5 transition-colors"
          >
            Sign In
          </button>

          <p className="text-center text-gray-500 text-base">
            Don't have an account?{' '}
            <a href="/signup" className="text-red-500 font-medium hover:text-red-400">
              Create one free →
            </a>
          </p>

          {message && (
            <div className="mt-6 text-center text-base p-4 rounded-xl bg-red-900/30 text-red-400 border border-red-800">
              {message}
            </div>
          )}

        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-6 text-gray-600 text-sm border-t border-gray-800">
        © 2026 Fractional-AECO LLC · <a href="https://www.fractionalaeco.com" target="_blank" className="hover:text-gray-400">fractionalaeco.com</a>
      </div>

    </div>
  )
}