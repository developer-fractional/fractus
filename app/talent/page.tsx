'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'
import type { Profile } from '../lib/types'
import Navbar from '../components/Navbar'

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

  // Show demo profiles only when no real profiles exist at all.
  // When real profiles exist but filters return 0, show the empty-state message instead.
  const hasRealProfiles = profiles.length > 0
  const showEmptyState = hasRealProfiles && filtered.length === 0

  const demoProfiles: Profile[] = [
    { id: 'd1', name: 'Marcus L.', role: 'Principal Architect', discipline: 'Architecture', years_experience: '22', hourly_rate: '240', skills: 'Healthcare, Mass timber', certifications: ['AIA', 'LEED AP'], location: 'New York, NY', is_verified: true, email: null, is_admin: null, bio: null, availability: null, linkedin_url: null, portfolio_url: null },
    { id: 'd2', name: 'Priya K.', role: 'Structural Engineer', discipline: 'Structural Engineering', years_experience: '16', hourly_rate: '185', skills: 'High-rise, Seismic', certifications: ['PE'], location: 'San Francisco, CA', is_verified: true, email: null, is_admin: null, bio: null, availability: null, linkedin_url: null, portfolio_url: null },
    { id: 'd3', name: 'David O.', role: 'Construction Director', discipline: 'Construction Management', years_experience: '27', hourly_rate: '310', skills: 'Megaprojects, P3', certifications: ['CCM', 'PMP'], location: 'Chicago, IL', is_verified: true, email: null, is_admin: null, bio: null, availability: null, linkedin_url: null, portfolio_url: null },
    { id: 'd4', name: 'Sofia R.', role: 'MEP Lead', discipline: 'MEP Engineering', years_experience: '14', hourly_rate: '170', skills: 'Data centers, Net-zero', certifications: ['PE', 'LEED AP'], location: 'Austin, TX', is_verified: true, email: null, is_admin: null, bio: null, availability: null, linkedin_url: null, portfolio_url: null },
    { id: 'd5', name: 'Ethan W.', role: 'BIM Manager', discipline: 'BIM/VDC', years_experience: '11', hourly_rate: '135', skills: 'Revit, ISO 19650', certifications: ['ISO 19650'], location: 'Seattle, WA', is_verified: true, email: null, is_admin: null, bio: null, availability: null, linkedin_url: null, portfolio_url: null },
    { id: 'd6', name: 'Amara N.', role: 'Sustainability Director', discipline: 'Sustainability', years_experience: '19', hourly_rate: '220', skills: 'LEED, Embodied carbon', certifications: ['LEED AP', 'WELL AP'], location: 'Boston, MA', is_verified: true, email: null, is_admin: null, bio: null, availability: null, linkedin_url: null, portfolio_url: null },
  ]

  const displayProfiles = hasRealProfiles ? filtered : demoProfiles

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)', fontFamily: "'Nunito Sans', sans-serif" }}>

      <Navbar activeLink="talent" />

      {/* Hero */}
      <div className="px-5 sm:px-10 py-10 sm:py-16 border-b" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
        <div className="max-w-5xl mx-auto">
          <p className="font-semibold uppercase tracking-widest mb-3 text-xs sm:text-sm" style={{ color: 'var(--color-accent)' }}>The Network</p>
          <h1 className="font-bold text-white mb-3 sm:mb-4" style={{ fontSize: 'clamp(32px, 6vw, 48px)', fontFamily: "'Nunito', sans-serif" }}>Browse AECO Talent</h1>
          <p className="text-gray-400 mb-6 sm:mb-8 text-base sm:text-xl">Senior practitioners available fractionally. Vetted by FractionalAECO.</p>

          {/* Stats — 2 cols on mobile, 4 on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-6 sm:mb-8">
            {[
              { num: '320+', label: 'Senior professionals' },
              { num: '42', label: 'Disciplines covered' },
              { num: '18 yrs', label: 'Avg. experience' },
              { num: '24h', label: 'Avg. time to match' },
            ].map((s, i) => (
              <div key={i}>
                <div className="font-bold" style={{ color: 'var(--color-accent-light)', fontSize: 'clamp(22px, 4vw, 28px)', fontFamily: "'Nunito', sans-serif" }}>{s.num}</div>
                <div className="text-gray-500 text-xs sm:text-sm">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search by name, role, or skill..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 rounded-xl px-4 sm:px-5 py-3 sm:py-4 text-white outline-none placeholder-gray-600 text-sm sm:text-base"
              style={{ background: 'var(--color-bg)', border: '1.5px solid var(--color-border)' }}
            />
            <Link href="/profile"
              className="px-5 py-3 sm:py-4 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity text-center text-sm sm:text-base whitespace-nowrap"
              style={{ background: 'var(--color-primary)' }}>
              + Add your profile
            </Link>
          </div>
        </div>
      </div>

      {/* Filters — horizontally scrollable on mobile */}
      <div className="px-5 sm:px-10 py-4 sm:py-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {DISCIPLINES.map(d => (
              <button key={d} onClick={() => setFilterDiscipline(d === 'All' ? '' : d)}
                className="px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer whitespace-nowrap flex-shrink-0"
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
      </div>

      {/* Talent grid */}
      <div className="max-w-5xl mx-auto px-5 sm:px-10 py-8 sm:py-12">
        {loading ? (
          <div className="text-center text-gray-500 py-20 text-lg">Loading talent...</div>
        ) : showEmptyState ? (
          /* TASK 4 — Empty state when search/filter returns no results */
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-bold text-white mb-2 text-xl" style={{ fontFamily: "'Nunito', sans-serif" }}>No professionals found</h3>
            <p className="text-gray-400 mb-6">No professionals found matching your search. Try adjusting your filters.</p>
            <button onClick={() => { setSearch(''); setFilterDiscipline('') }}
              className="px-6 py-3 rounded-full font-semibold text-white cursor-pointer hover:opacity-90 transition-opacity text-sm"
              style={{ background: 'var(--color-primary)', border: 'none' }}>
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <p className="text-gray-500 mb-6 sm:mb-8 text-sm">
              {hasRealProfiles ? `${filtered.length} professionals found` : 'Sample profiles — sign up to see real talent'}
            </p>
            {/* Cards — single col mobile, 2 col tablet, 3 col desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {displayProfiles.map((p, i) => {
                const isDemo = p.id?.startsWith('d')
                const cardClassName = "rounded-2xl border p-5 sm:p-6 block transition-all hover:scale-[1.02] hover:shadow-xl " + (isDemo ? "cursor-default" : "cursor-pointer")
                const cardStyle = { background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }

                const cardContent = (
                  <>
                    {/* Avatar + badge */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg sm:text-xl flex-shrink-0"
                        style={{ background: 'var(--color-primary)' }}>
                        {p.name?.charAt(0)}
                      </div>
                      {p.is_verified ? (
                        <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: 'rgba(22,163,74,0.2)', color: '#4ade80', border: '1px solid rgba(22,163,74,0.3)' }}>
                          ✓ Verified
                        </span>
                      ) : isDemo ? (
                        <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: 'rgba(246,152,32,0.15)', color: 'var(--color-accent)', border: '1px solid rgba(246,152,32,0.3)' }}>
                          Demo
                        </span>
                      ) : null}
                    </div>

                    <h3 className="font-bold text-white mb-1 text-base sm:text-lg">{p.name}</h3>
                    <p className="text-gray-400 mb-3 text-sm">{p.role}</p>

                    {p.skills && (
                      <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                        {p.skills.split(',').slice(0, 2).map((s: string, j: number) => (
                          <span key={j} className="text-xs px-3 py-1 rounded-full"
                            style={{ background: 'var(--color-bg)', color: 'var(--color-accent)', border: '1px solid var(--color-border)' }}>
                            {s.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    {(p.certifications?.length ?? 0) > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                        {(p.certifications ?? []).slice(0, 3).map((c: string, j: number) => (
                          <span key={j} className="text-xs px-2 py-1 rounded-full font-medium"
                            style={{ background: 'var(--color-bg)', color: '#94a3b8', border: '1px solid var(--color-border)' }}>
                            {c}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 sm:pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
                      <span className="text-gray-500 text-xs sm:text-sm">{p.years_experience} yrs exp</span>
                      <span className="font-bold text-base sm:text-lg" style={{ color: 'var(--color-accent-light)', fontFamily: "'Nunito', sans-serif" }}>
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
      <div className="text-center px-5 sm:px-8 py-12 sm:py-16 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <h3 className="font-bold text-white mb-4" style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontFamily: "'Nunito', sans-serif" }}>Need senior AECO firepower?</h3>
        <p className="text-gray-400 mb-8 text-base sm:text-lg">Tell us what you need. We&apos;ll match you with vetted senior practitioners.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="https://www.fractionalaeco.com/contact" target="_blank" rel="noopener noreferrer"
            className="px-8 py-4 rounded-full font-semibold text-white hover:opacity-90 transition-all text-base sm:text-lg"
            style={{ background: 'var(--color-primary)' }}>
            Talk to Fractional AECO
          </a>
          <Link href="/signup"
            className="px-8 py-4 rounded-full font-semibold hover:opacity-80 transition-all text-base sm:text-lg"
            style={{ border: '1.5px solid var(--color-border)', color: 'var(--color-accent-light)' }}>
            Join as talent
          </Link>
        </div>
      </div>

    </div>
  )
}
