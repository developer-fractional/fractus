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
            placeholder="Your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 outline-none focus:border-orange-500"
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-orange-500 text-white py-3 rounded-full font-medium hover:bg-orange-600 mb-4 cursor-pointer"
        >
          Login
        </button>

        <p className="text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <a href="/signup" className="text-orange-500 font-medium hover:underline">
            Sign up free
          </a>
        </p>

        {message && (
          <div className="mt-4 text-center text-sm p-3 rounded-lg bg-red-50 text-red-600">
            {message}
          </div>
        )}
      </div>
    </main>
  )
}