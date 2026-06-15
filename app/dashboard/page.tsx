'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'

const TALENT_ROLES = ['Fractional Professional', 'Contractor', 'Architect', 'Engineer']
const EMPLOYER_ROLES = ['Employer / Hiring', 'Owner / Operator']

interface Profile {
  role: string | null
  name: string | null
  discipline: string | null
  is_admin: boolean | null
}

interface DashCard {
  icon: string
  title: string
  desc: string
  href: string
  accent?: string   // border/icon colour override
  prominent?: boolean
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { window.location.href = '/login'; return }
      setUser(data.user)
      const { data: p } = await supabase
        .from('profiles')
        .select('role, name, discipline, is_admin')
        .eq('id', data.user.id)
        .single()
      setProfile(p ?? null)
      setLoading(false)
    })
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F1117' }}>
      <p style={{ color: '#F6981F', fontSize: '20px', fontFamily: "'Nunito Sans', sans-serif" }}>Loading...</p>
    </div>
  )

  // ── Derive view type ──────────────────────────────────────────────────────
  const isAdmin   = !!profile?.is_admin
  const role      = profile?.role ?? ''
  const name      = profile?.name ?? user?.email ?? ''
  const isTalent  = !isAdmin && (TALENT_ROLES.includes(role) || !EMPLOYER_ROLES.includes(role))
  const isEmployer = !isAdmin && EMPLOYER_ROLES.includes(role)

  const profileComplete = !!(profile?.name && profile?.discipline)

  // ── Card sets ─────────────────────────────────────────────────────────────
  const talentCards: DashCard[] = [
    profileComplete
      ? { icon: '✅', title: 'Profile Looks Great', desc: 'Your profile is visible to employers — keep it up to date', href: '/profile', accent: '#22c55e' }
      : { icon: '👤', title: 'Complete Your Profile', desc: 'Add your name, discipline, and bio so companies can find and book you', href: '/profile', accent: '#05809B' },
    { icon: '🔍', title: 'Browse Jobs',            desc: 'Find fractional AECO opportunities',            href: '/listings' },
    { icon: '📨', title: 'My Applications',        desc: 'Track your job applications',                   href: '/dashboard/applications' },
    { icon: '🔖', title: 'Saved Listings',         desc: "Listings you've bookmarked",                    href: '/dashboard/saved' },
  ]

  const employerCards: DashCard[] = [
    { icon: '➕', title: 'Post a Listing',        desc: 'Find fractional AECO talent for your project',  href: '/listings/new',               accent: '#F6981F', prominent: true },
    { icon: '📋', title: 'Manage Listings',       desc: 'View and manage your posted roles',             href: '/dashboard/listings' },
    { icon: '🏢', title: 'Company Profile',       desc: 'Manage your company profile',                   href: '/dashboard/company' },
    { icon: '🔍', title: 'Browse Talent',         desc: 'Search verified AECO professionals',            href: '/talent' },
    { icon: '📥', title: 'Applications Received', desc: 'Review candidates who applied',                 href: '/dashboard/applications' },
  ]

  const adminCards: DashCard[] = [
    { icon: '🛠️', title: 'Manage Users',    desc: 'View and manage all users',           href: '/admin' },
    { icon: '📋', title: 'All Listings',    desc: 'View all active listings',             href: '/listings' },
    { icon: '🌐', title: 'Browse Talent',   desc: 'Search all talent profiles',           href: '/talent' },
    { icon: '➕', title: 'Post a Listing',  desc: 'Post on behalf of a client',           href: '/listings/new', accent: '#F6981F' },
  ]

  const cards    = isAdmin ? adminCards : isEmployer ? employerCards : talentCards
  const greeting = isAdmin ? 'Admin Dashboard 🛠️' : `Welcome back, ${name.split(' ')[0] || name}! 👋`

  // Role pill
  const pillLabel = isAdmin ? 'Admin' : role || 'Fractional Professional'
  const pillColor = isAdmin ? '#F6981F' : isEmployer ? '#F6981F' : '#05809B'

  return (
    <main style={{ minHeight: '100vh', background: '#0F1117', fontFamily: "'Nunito Sans', sans-serif" }}>

      <Navbar activeLink="dashboard" />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: 'clamp(32px, 6vw, 64px) clamp(20px, 4vw, 32px)' }}>

        {/* Header row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '40px' }}>
          <div>
            <h2 style={{ fontFamily: "'Nunito', sans-serif", fontSize: 'clamp(26px, 5vw, 38px)', fontWeight: 800, color: 'white', marginBottom: '10px', letterSpacing: '-0.5px' }}>
              {greeting}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '14px', color: '#8892A4' }}>
                {user?.email}
              </span>
              <span style={{
                fontSize: '12px', fontWeight: 700, padding: '3px 12px', borderRadius: '100px',
                background: `${pillColor}1A`, color: pillColor, border: `1px solid ${pillColor}40`,
                letterSpacing: '0.03em'
              }}>
                {pillLabel}
              </span>
            </div>
          </div>
          <button onClick={handleLogout}
            style={{ color: '#8892A4', background: 'none', border: '1px solid #2A3145', borderRadius: '100px', padding: '8px 20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
            Log out
          </button>
        </div>

        {/* Profile completion banner — talent only, when incomplete */}
        {isTalent && !profileComplete && (
          <div style={{
            borderRadius: '16px', border: '1px solid rgba(246,152,32,0.3)',
            background: 'rgba(246,152,32,0.07)', padding: '20px 24px',
            display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between',
            gap: '16px', marginBottom: '32px'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <span style={{ fontSize: '20px', marginTop: '2px' }}>⚠️</span>
              <div>
                <p style={{ color: 'white', fontWeight: 700, marginBottom: '4px' }}>Complete your profile to appear in talent search</p>
                <p style={{ color: '#8892A4', fontSize: '14px' }}>Add your name, discipline, and bio so companies can find and book you.</p>
              </div>
            </div>
            <Link href="/profile" style={{
              background: '#F6981F', color: 'white', textDecoration: 'none',
              borderRadius: '100px', padding: '10px 22px', fontSize: '14px', fontWeight: 700,
              whiteSpace: 'nowrap'
            }}>
              Go to Profile →
            </Link>
          </div>
        )}

        {/* Dashboard cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {cards.map((card, i) => {
            const accent = card.accent ?? '#05809B'
            return (
              <Link key={i} href={card.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: '#1B2130',
                  border: `1px solid ${card.prominent ? accent + '50' : '#2A3145'}`,
                  borderRadius: '16px',
                  padding: '28px 24px',
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'opacity 0.15s',
                  boxSizing: 'border-box',
                  ...(card.prominent ? { boxShadow: `0 0 0 1px ${accent}30` } : {}),
                }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '12px',
                    background: `${accent}18`, border: `1px solid ${accent}35`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '22px', marginBottom: '18px'
                  }}>
                    {card.icon}
                  </div>
                  <h3 style={{
                    fontFamily: "'Nunito', sans-serif", fontSize: '17px', fontWeight: 800,
                    color: card.prominent ? accent : 'white', marginBottom: '8px'
                  }}>
                    {card.title}
                  </h3>
                  <p style={{ color: '#8892A4', fontSize: '14px', lineHeight: 1.6 }}>
                    {card.desc}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>

      </div>
    </main>
  )
}
