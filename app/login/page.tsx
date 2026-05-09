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

  async function handleSignup() {
    if (!email || !password) return setMessage('Please enter email and password')
    if (password.length < 6) return setMessage('Password must be at least 6 characters')
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) setMessage('Signup failed: ' + error.message)
    else setMessage('✅ Account created! You can now log in.')
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-md p-8 border border-gray-100 rounded-2xl shadow-sm">
        
        <h1 className="text-2xl font-bold text-orange-500 mb-2">Fractus</h1>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Sign in to your account</h2>

        <div className="mb-3">
          <label className="block text-sm text-gray-600 mb-1">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 outline-none focus:border-orange-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-1">Password</label>
          <input
            type="password"
            placeholder="Min 6 characters"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 outline-none focus:border-orange-500"
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-orange-500 text-white py-3 rounded-full font-medium hover:bg-orange-600 mb-3 cursor-pointer"
        >
          Login
        </button>

        <button
          onClick={handleSignup}
          className="w-full border border-orange-500 text-orange-500 py-3 rounded-full font-medium hover:bg-orange-50 cursor-pointer"
        >
          Create Account
        </button>

        {message && (
          <div className={`mt-4 text-center text-sm p-3 rounded-lg ${
            message.startsWith('✅') 
              ? 'bg-green-50 text-green-600' 
              : 'bg-red-50 text-red-600'
          }`}>
            {message}
          </div>
        )}

      </div>
    </main>
  )
}