'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        window.location.href = '/login'
      } else {
        setUser(data.user)
        setLoading(false)
      }
    })
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (loading) return (
    <div style={{background:'var(--color-bg)', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}>
      <p style={{color:'var(--color-accent)', fontSize:'20px'}}>Loading...</p>
    </div>
  )

  return (
    <main className="min-h-screen" style={{background:'var(--color-bg)'}}>

      {/* Top bar */}
      <div className="text-white text-center py-3 px-4" style={{background:'var(--color-primary)', fontSize:'15px'}}>
        Powered by <a href="https://www.fractionalaeco.com" target="_blank" className="underline font-semibold hover:opacity-80">Fractional AECO</a> · Your AECO Experts · <a href="tel:+19804940263" className="underline hover:opacity-80">+1 980 494 0263</a>
      </div>

      <nav className="flex items-center justify-between px-10 py-5 border-b" style={{background:'var(--color-bg)', borderColor:'var(--color-border)'}}>
        <a href="/" className="flex flex-col">
          <span className="text-3xl font-bold" style={{color:'var(--color-accent)'}}>Fractus</span>
          <span className="text-sm text-gray-500 leading-none">by FractionalAECO</span>
        </a>
        <button onClick={handleLogout} className="text-base text-gray-400 hover:text-white cursor-pointer">
          Logout
        </button>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-16">
        <h2 className="font-bold text-white mb-3" style={{fontSize:'40px'}}>
          Welcome to Fractus! 👋
        </h2>
        <p className="text-gray-400 mb-12" style={{fontSize:'20px'}}>
          Logged in as: <span style={{color:'var(--color-accent-light)'}}>{user?.email}</span>
        </p>

        <div className="grid grid-cols-3 gap-6">
          {[
            { icon: '👤', title: 'My Profile', desc: 'Build your AECO profile', href: '/profile' },
            { icon: '🔍', title: 'Find Talent', desc: 'Browse fractional pros', href: '/marketplace' },
            { icon: '📋', title: 'My Listings', desc: 'Post fractional gigs', href: '/listings' },
          ].map((card, i) => (
            <a key={i} href={card.href} className="p-8 rounded-2xl border block hover:opacity-80 transition-all cursor-pointer" style={{background:'var(--color-bg-card)', borderColor:'var(--color-border)'}}>
              <div className="text-4xl mb-4">{card.icon}</div>
              <h3 className="font-bold text-white mb-2" style={{fontSize:'20px'}}>{card.title}</h3>
              <p className="text-gray-400" style={{fontSize:'16px'}}>{card.desc}</p>
            </a>
          ))}
        </div>
      </div>

    </main>
  )
}