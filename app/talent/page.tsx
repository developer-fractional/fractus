'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'
import type { Profile } from '../lib/types'

export default function TalentPage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterDiscipline, setFilterDiscipline] = useState('')

  const DISCIPLINES = ['All', 'Architecture', 'Structural Engineering', 'MEP Engineering', 'Civil Engineering', 'Construction Management', 'BIM/VDC', 'Sustainability', 'Owner/Operator']

  useEffect(() => {
    supabase.from('profiles')
      .select('*')
      .not('name', 'is', null)
      .then(({ data }) => {
        setProfiles(data || [])
        setLoading(false)
      })
  }, [])

  const filtered = profiles.filter(p => {
    const matchSearch = !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.role?.toLowerCase().includes(search.toLowerCase()) || p.skills?.toLowerCase().includes(search.toLowerCase())
    const matchDiscipline = !filterDiscipline || filterDiscipline === 'All' || p.discipline === filterDiscipline
    return matchSearch && matchDiscipline
  })

  // Demo profiles shown when no real ones exist
  const demoProfiles = [
    { id: 'd1', name: 'Marcus L.', role: 'Principal Architect', discipline: 'Architecture', years_experience: '22', hourly_rate: '240', skills: 'Healthcare, Mass timber', certifications: ['AIA', 'LEED AP'], location: 'New York, NY', is_verified: true },
    { id: 'd2', name: 'Priya K.', role: 'Structural Engineer', discipline: 'Structural Engineering', years_experience: '16', hourly_rate: '185', skills: 'High-rise, Seismic', certifications: ['PE'], location: 'San Francisco, CA', is_verified: true },
    { id: 'd3', name: 'David O.', role: 'Construction Director', discipline: 'Construction Management', years_experience: '27', hourly_rate: '310', skills: 'Megaprojects, P3', certifications: ['CCM', 'PMP'], location: 'Chicago, IL', is_verified: true },
    { id: 'd4', name: 'Sofia R.', role: 'MEP Lead', discipline: 'MEP Engineering', years_experience: '14', hourly_rate: '170', skills: 'Data centers, Net-zero', certifications: ['PE', 'LEED AP'], location: 'Austin, TX', is_verified: true },
    { id: 'd5', name: 'Ethan W.', role: 'BIM Manager', discipline: 'BIM/VDC', years_experience: '11', hourly_rate: '135', skills: 'Revit, ISO 19650', certifications: ['ISO 19650'], location: 'Seattle, WA', is_verified: true },
    { id: 'd6', name: 'Amara N.', role: 'Sustainability Director', discipline: 'Sustainability', years_experience: '19', hourly_rate: '220', skills: 'LEED, Embodied carbon', certifications: ['LEED AP', 'WELL AP'], location: 'Boston, MA', is_verified: true },
  ]

  const displayProfiles = filtered.length > 0 ? filtered : demoProfiles

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>

      {/* Top bar */}
      <div className="text-white text-center py-3 px-4" style={{ background: 'var(--color-primary)', fontSize: '15px' }}>
        Powered by <a href="https://www.fractionalaeco.com" target="_blank" className="underline font-semibold hover:opacity-80">Fractional AECO</a> · Your AECO Experts · <a href="tel:+19804940263" className="underline hover:opacity-80">+1 980 494 0263</a>
      </div>

      {/* Nav */}
      <nav className="flex items-center justify-between px-10 py-5 border-b" style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}>
        <Link href="/" className="flex flex-col">
          <span className="text-3xl font-bold" style={{ color: 'var(--color-accent)' }}>Fractus</span>
          <span className="text-sm text-gray-500 leading-none">by FractionalAECO</span>
        </Link>
        <div className="flex gap-6 items-center">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors" style={{ fontSize: '16px' }}>Dashboard</Link>
          <Link href="/profile" className="text-white font-medium px-5 py-2 rounded-full transition-colors" style={{ background: 'var(--color-primary)', fontSize: '16px' }}>My Profile</Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="px-10 py-16 border-b" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
        <div className="max-w-5xl mx-auto">
          <p className="font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-accent)', fontSize: '14px' }}>The Network</p>
          <h1 className="font-bold text-white mb-4" style={{ fontSize: '48px' }}>Browse AECO Talent</h1>
          <p className="text-gray-400 mb-8" style={{ fontSize: '20px' }}>Senior practitioners available fractionally. Vetted by FractionalAECO.</p>

          {/* Stats */}
          <div className="flex gap-10 mb-8">
            {[
              { num: '320+', label: 'Senior professionals' },
              { num: '42', label: 'Disciplines covered' },
              { num: '18 yrs', label: 'Avg. experience' },
              { num: '24h', label: 'Avg. time to match' },
            ].map((s, i) => (
              <div key={i}>
                <div className="font-bold" style={{ color: 'var(--color-accent-light)', fontSize: '28px' }}>{s.num}</div>
                <div className="text-gray-500" style={{ fontSize: '14px' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search by name, role, or skill..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 rounded-xl px-5 py-4 text-white outline-none placeholder-gray-600"
              style={{ background: 'var(--color-bg)', border: '1.5px solid var(--color-border)', fontSize: '16px' }}
            />
            <Link href="/profile" className="px-6 py-4 rounded-xl text-white font-semibold transition-colors hover:opacity-90 whitespace-nowrap" style={{ background: 'var(--color-primary)', fontSize: '16px' }}>
              + Add your profile
            </Link>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-10 py-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-5xl mx-auto flex gap-3 flex-wrap">
          {DISCIPLINES.map(d => (
            <button key={d} onClick={() => setFilterDiscipline(d === 'All' ? '' : d)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer"
              style={{
                background: (filterDiscipline === d || (d === 'All' && !filterDiscipline)) ? 'var(--color-primary)' : 'var(--color-bg-card)',
                color: 'white',
                border: '1px solid var(--color-border)',
              }}>
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Talent grid */}
      <div className="max-w-5xl mx-auto px-10 py-12">
        {loading ? (
          <div className="text-center text-gray-500 py-20" style={{ fontSize: '18px' }}>Loading talent...</div>
        ) : (
          <>
            <p className="text-gray-500 mb-8" style={{ fontSize: '15px' }}>{displayProfiles.length} professionals found</p>
            <div className="grid grid-cols-3 gap-6">
              {displayProfiles.map((p, i) => {
                const isDemo = p.id?.startsWith('d')
                const cardClassName = "rounded-2xl border p-6 block transition-all hover:scale-[1.02] hover:shadow-xl " + (isDemo ? "cursor-default" : "cursor-pointer")
                const cardStyle = { background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }

                const cardContent = (
                  <>
                  {/* Avatar + verified */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl" style={{ background: 'var(--color-primary)' }}>
                      {p.name?.charAt(0)}
                    </div>
                    {p.is_verified ? (
                      <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: 'rgba(22,163,74,0.2)', color: '#4ade80', border: '1px solid rgba(22,163,74,0.3)' }}>
                        ✓ Verified
                      </span>
                    ) : p.id?.startsWith('d') ? (
                      <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: 'rgba(246,152,32,0.15)', color: 'var(--color-accent)', border: '1px solid rgba(246,152,32,0.3)' }}>
                        Demo
                      </span>
                    ) : null}
                  </div>

                  {/* Name + role */}
                  <h3 className="font-bold text-white mb-1" style={{ fontSize: '19px' }}>{p.name}</h3>
                  <p className="text-gray-400 mb-3" style={{ fontSize: '15px' }}>{p.role}</p>

                  {/* Skills tags */}
                  {p.skills && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {p.skills.split(',').slice(0, 2).map((s: string, j: number) => (
                        <span key={j} className="text-xs px-3 py-1 rounded-full" style={{ background: 'var(--color-bg)', color: 'var(--color-accent)', border: '1px solid var(--color-border)' }}>
                          {s.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Certs */}
                  {(p.certifications?.length ?? 0) > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(p.certifications ?? []).slice(0, 3).map((c: string, j: number) => (
                        <span key={j} className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: 'var(--color-bg)', color: '#94a3b8', border: '1px solid var(--color-border)' }}>
                          {c}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Stats row */}
                  <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
                    <span className="text-gray-500" style={{ fontSize: '14px' }}>{p.years_experience} yrs exp</span>
                    <span className="font-bold" style={{ color: 'var(--color-accent-light)', fontSize: '18px' }}>
                      {p.hourly_rate ? `$${p.hourly_rate}/h` : 'Rate TBD'}
                    </span>
                  </div>
                  </>
                )

                if (isDemo) {
                  return (
                    <div key={p.id || i}
                      onClick={() => {}}
                      title="This is a demo profile — sign up to see real AECO professionals"
                      className={cardClassName}
                      style={cardStyle}>
                      {cardContent}
                    </div>
                  )
                }

                return (
                  <Link key={p.id || i} href={`/talent/${p.id}`}
                    className={cardClassName}
                    style={cardStyle}>
                    {cardContent}
                  </Link>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* CTA */}
      <div className="text-center px-8 py-16 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <h3 className="font-bold text-white mb-4" style={{ fontSize: '32px' }}>Need senior AECO firepower?</h3>
        <p className="text-gray-400 mb-8" style={{ fontSize: '18px' }}>Tell us what you need. We&apos;ll match you with vetted senior practitioners.</p>
        <div className="flex gap-4 justify-center">
          <a href="https://www.fractionalaeco.com/contact" target="_blank" rel="noopener noreferrer" className="px-8 py-4 rounded-full font-semibold text-white hover:opacity-90 transition-all" style={{ background: 'var(--color-primary)', fontSize: '18px' }}>
            Talk to Fractional AECO
          </a>
          <Link href="/signup" className="px-8 py-4 rounded-full font-semibold hover:opacity-80 transition-all" style={{ border: '1.5px solid var(--color-border)', color: 'var(--color-accent-light)', fontSize: '18px' }}>
            Join as talent
          </Link>
        </div>
      </div>

    </div>
  )
}