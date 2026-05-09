'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-100">
        <h1 className="text-2xl font-bold text-orange-500">Fractus</h1>
        <button
          onClick={handleLogout}
          className="px-5 py-2 text-gray-600 hover:text-orange-500"
        >
          Logout
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to Fractus! 👋
        </h2>
        <p className="text-gray-500 mb-8">
          Logged in as: {user?.email}
        </p>

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100">
            <div className="text-3xl mb-3">👤</div>
            <h3 className="font-bold text-gray-900 mb-1">My Profile</h3>
            <p className="text-sm text-gray-500">Build your AECO profile</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="font-bold text-gray-900 mb-1">Find Talent</h3>
            <p className="text-sm text-gray-500">Browse fractional pros</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100">
            <div className="text-3xl mb-3">📋</div>
            <h3 className="font-bold text-gray-900 mb-1">My Listings</h3>
            <p className="text-sm text-gray-500">Post fractional gigs</p>
          </div>
        </div>
      </div>
    </main>
  )
}