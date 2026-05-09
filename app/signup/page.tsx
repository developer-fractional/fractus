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
        <a href="/login" className="text-sm text-gray-400 hover:text-white">
          Already have an account? <span className="text-red-500 font-medium">Sign in →</span>
        </a>
      </nav>

      {/* Signup form */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">

          <h1 className="text-4xl font-bold text-white mb-2">Join Fractus</h1>
          <p className="text-gray-400 text-lg mb-10">Connect with top AECO fractional talent</p>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-300 mb-2">Full name</label>
            <input
              type="text"
              placeholder="Jane Smith"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-5 py-4 text-white text-base outline-none focus:border-red-600 placeholder-gray-600"
            />
          </div>

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

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input
              type="password"
              placeholder="Min 6 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-5 py-4 text-white text-base outline-none focus:border-red-600 placeholder-gray-600"
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-300 mb-2">I am joining as a...</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-5 py-4 text-white text-base outline-none focus:border-red-600"
            >
              <option>Fractional Professional</option>
              <option>Contractor</option>
              <option>Architect</option>
              <option>Engineer</option>
              <option>Owner / Operator</option>
              <option>Employer / Hiring</option>
            </select>
          </div>

          <button
            onClick={handleSignup}
            className="w-full bg-red-700 text-white py-4 rounded-xl text-lg font-semibold hover:bg-red-800 cursor-pointer mb-5 transition-colors"
          >
            Create Account
          </button>

          <p className="text-center text-gray-500 text-base">
            Already have an account?{' '}
            <a href="/login" className="text-red-500 font-medium hover:text-red-400">
              Sign in →
            </a>
          </p>

          {message && (
            <div className={`mt-6 text-center text-base p-4 rounded-xl border ${
              message.includes('failed') || message.includes('Please')
                ? 'bg-red-900/30 text-red-400 border-red-800'
                : 'bg-green-900/30 text-green-400 border-green-800'
            }`}>
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