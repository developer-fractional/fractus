'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [profileComplete, setProfileComplete] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { window.location.href = '/login'; return }
      setUser(data.user)
      // Check if profile has the key fields filled in
      const { data: profile } = await supabase
        .from('profiles').select('name, discipline, bio').eq('id', data.user.id).single()
      setProfileComplete(!!(profile?.name && profile?.discipline && profile?.bio))
      setLoading(false)
    })
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0F1117' }}>
      <p className="text-xl" style={{ color: '#F6981F', fontFamily: "'Nunito Sans', sans-serif" }}>Loading...</p>
    </div>
  )

  return (
    <main className="min-h-screen" style={{ background: '#0F1117', fontFamily: "'Nunito Sans', sans-serif" }}>

      <Navbar activeLink="dashboard" />

      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10 sm:py-16">

        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <h2 className="font-bold text-white mb-2" style={{ fontSize: 'clamp(28px, 5vw, 40px)', fontFamily: "'Nunito', sans-serif" }}>
              Welcome to Fractus! 👋
            </h2>
            <p className="text-gray-400 text-base sm:text-lg">
              Logged in as: <span style={{ color: '#05809B' }}>{user?.email}</span>
            </p>
          </div>
          <button onClick={handleLogout}
            className="self-start sm:self-auto text-sm font-semibold px-5 py-2 rounded-full border cursor-pointer transition-colors hover:text-white"
            style={{ color: '#8892A4', background: 'none', borderColor: '#2A3145' }}>
            Log out
          </button>
        </div>

        {/* Incomplete profile banner — TASK 4 empty state */}
        {!profileComplete && (
          <div className="rounded-2xl border p-5 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            style={{ background: 'rgba(246,152,32,0.08)', borderColor: 'rgba(246,152,32,0.3)' }}>
            <div className="flex items-start gap-3">
              <span className="text-xl mt-0.5">⚠️</span>
              <div>
                <p className="font-bold text-white mb-1">Complete your profile to appear in talent search</p>
                <p className="text-sm text-gray-400">Add your name, discipline, and bio so companies can find and book you.</p>
              </div>
            </div>
            <Link href="/profile"
              className="text-white font-bold px-5 py-2 rounded-full text-sm whitespace-nowrap hover:opacity-90 transition-opacity self-start sm:self-auto"
              style={{ background: '#F6981F', textDecoration: 'none' }}>
              Go to Profile →
            </Link>
          </div>
        )}

        {/* Cards — single column on mobile, 3 columns on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
          {[
            { icon: '👤', title: 'My Profile', desc: 'Build your AECO profile so companies can find and book you', href: '/profile' },
            { icon: '🔍', title: 'Find Talent', desc: 'Browse verified fractional AECO professionals', href: '/talent' },
            { icon: '📋', title: 'My Listings', desc: 'Post fractional gigs and manage your opportunities', href: '/listings' },
          ].map((card, i) => (
            <Link key={i} href={card.href}
              className="p-7 sm:p-8 rounded-2xl border block hover:opacity-80 transition-all cursor-pointer"
              style={{ background: '#1B2130', borderColor: '#2A3145', textDecoration: 'none' }}>
              <div className="text-4xl mb-4">{card.icon}</div>
              <h3 className="font-bold text-white mb-2 text-lg sm:text-xl" style={{ fontFamily: "'Nunito', sans-serif" }}>{card.title}</h3>
              <p className="text-gray-400 text-sm sm:text-base">{card.desc}</p>
            </Link>
          ))}
        </div>
      </div>

    </main>
  )
}
