'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'
import type { Profile } from '../lib/types'
import Navbar from '../components/Navbar'

const DISCIPLINES   = ['All', 'Architecture', 'Structural Engineering', 'MEP Engineering', 'Civil Engineering', 'Construction Management', 'BIM/VDC', 'Sustainability', 'Owner/Operator']
const AVAILABILITIES = ['All', 'Available Now', 'Open to Work']
const SORTS = [
  { label: 'Newest first',      value: 'newest' },
  { label: 'Most experienced',  value: 'exp_desc' },
  { label: 'Lowest rate',       value: 'rate_asc' },
  { label: 'Highest rate',      value: 'rate_desc' },
]

// ── Style helpers ─────────────────────────────────────────────────────────────

function pill(active: boolean): React.CSSProperties {
  return active
    ? { background: 'rgba(5,128,155,0.15)', border: '1px solid #05809B',  color: '#05809B',  borderRadius: '100px', padding: '7px 16px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }
    : { background: '#1B2130',               border: '1px solid #2A3145',  color: '#8892A4',  borderRadius: '100px', padding: '7px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }
}

export default function TalentPage() {
  const [profiles,          setProfiles]          = useState<Profile[]>([])
  const [loading,           setLoading]           = useState(true)
  const [search,            setSearch]            = useState('')
  const [filterDiscipline,  setFilterDiscipline]  = useState('')
  const [filterAvailability,setFilterAvailability]= useState('')
  const [filterLocation,    setFilterLocation]    = useState('')
  const [sort,              setSort]              = useState('newest')
  const [stats,             setStats]             = useState({ totalTalent: 0, uniqueDisciplines: 0, avgExperience: 0 })

  useEffect(() => {
    supabase.from('profiles')
      .select('*')
      .not('name', 'is', null)
      .then(({ data }) => { setProfiles(data || []); setLoading(false) })
  }, [])

  useEffect(() => {
    Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }).not('name', 'is', null),
      supabase.from('profiles').select('discipline').not('discipline', 'is', null).not('name', 'is', null),
      supabase.from('profiles').select('years_experience').not('years_experience', 'is', null).not('name', 'is', null),
    ]).then(([{ count }, { data: disciplines }, { data: experience }]) => {
      const uniqueDisciplines = new Set(disciplines?.map(d => d.discipline) ?? []).size
      const avgExperience = experience?.length
        ? Math.round(experience.reduce((sum, p) => sum + (p.years_experience ?? 0), 0) / experience.length)
        : 0
      setStats({ totalTalent: count ?? 0, uniqueDisciplines, avgExperience })
    })
  }, [])

  // ── Active filter count ────────────────────────────────────────────────────
  const activeFilterCount = [filterDiscipline, filterAvailability, filterLocation, sort !== 'newest' ? sort : ''].filter(Boolean).length

  // ── Filter + sort ──────────────────────────────────────────────────────────
  const filtered = profiles
    .filter(p => {
      const q = search.toLowerCase()
      const matchSearch       = !search || p.name?.toLowerCase().includes(q) || p.role?.toLowerCase().includes(q) || p.skills?.toLowerCase().includes(q)
      const matchDiscipline   = !filterDiscipline   || p.discipline   === filterDiscipline
      const matchAvailability = !filterAvailability || p.availability === filterAvailability
      const matchLocation     = !filterLocation     || p.location?.toLowerCase().includes(filterLocation.toLowerCase())
      return matchSearch && matchDiscipline && matchAvailability && matchLocation
    })
    .sort((a, b) => {
      if (sort === 'exp_desc')  return (Number(b.years_experience) || 0) - (Number(a.years_experience) || 0)
      if (sort === 'rate_asc')  return (Number(a.hourly_rate)      || 0) - (Number(b.hourly_rate)      || 0)
      if (sort === 'rate_desc') return (Number(b.hourly_rate)      || 0) - (Number(a.hourly_rate)      || 0)
      return 0 // newest first = server order
    })

  const hasRealProfiles = profiles.length > 0
  const showEmptyState  = hasRealProfiles && filtered.length === 0

  const demoProfiles: Profile[] = [
    { id: 'd1', name: 'Marcus L.',  role: 'Principal Architect',     discipline: 'Architecture',           years_experience: '22', hourly_rate: '240', skills: 'Healthcare, Mass timber',   certifications: ['AIA', 'LEED AP'], location: 'New York, NY',       is_verified: true,  email: null, is_admin: null, bio: null, availability: null, linkedin_url: null, portfolio_url: null },
    { id: 'd2', name: 'Priya K.',   role: 'Structural Engineer',     discipline: 'Structural Engineering', years_experience: '16', hourly_rate: '185', skills: 'High-rise, Seismic',        certifications: ['PE'],             location: 'San Francisco, CA',  is_verified: true,  email: null, is_admin: null, bio: null, availability: null, linkedin_url: null, portfolio_url: null },
    { id: 'd3', name: 'David O.',   role: 'Construction Director',   discipline: 'Construction Management',years_experience: '27', hourly_rate: '310', skills: 'Megaprojects, P3',          certifications: ['CCM', 'PMP'],     location: 'Chicago, IL',        is_verified: true,  email: null, is_admin: null, bio: null, availability: null, linkedin_url: null, portfolio_url: null },
    { id: 'd4', name: 'Sofia R.',   role: 'MEP Lead',                discipline: 'MEP Engineering',        years_experience: '14', hourly_rate: '170', skills: 'Data centers, Net-zero',    certifications: ['PE', 'LEED AP'],  location: 'Austin, TX',         is_verified: true,  email: null, is_admin: null, bio: null, availability: null, linkedin_url: null, portfolio_url: null },
    { id: 'd5', name: 'Ethan W.',   role: 'BIM Manager',             discipline: 'BIM/VDC',                years_experience: '11', hourly_rate: '135', skills: 'Revit, ISO 19650',         certifications: ['ISO 19650'],      location: 'Seattle, WA',        is_verified: true,  email: null, is_admin: null, bio: null, availability: null, linkedin_url: null, portfolio_url: null },
    { id: 'd6', name: 'Amara N.',   role: 'Sustainability Director', discipline: 'Sustainability',         years_experience: '19', hourly_rate: '220', skills: 'LEED, Embodied carbon',    certifications: ['LEED AP', 'WELL AP'], location: 'Boston, MA',    is_verified: true,  email: null, is_admin: null, bio: null, availability: null, linkedin_url: null, portfolio_url: null },
  ]

  const displayProfiles = hasRealProfiles ? filtered : demoProfiles

  function clearAll() { setSearch(''); setFilterDiscipline(''); setFilterAvailability(''); setFilterLocation(''); setSort('newest') }

  const filterBar: React.CSSProperties = { borderBottom: '1px solid #2A3145', padding: '14px 0' }
  const rowWrap:   React.CSSProperties = { maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }

  return (
    <div style={{ minHeight: '100vh', background: '#0F1117', fontFamily: "'Nunito Sans', sans-serif" }}>

      <Navbar activeLink="talent" />

      {/* Hero */}
      <div style={{ background: '#1B2130', borderBottom: '1px solid #2A3145', padding: 'clamp(40px,6vw,64px) 20px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ color: '#05809B', fontWeight: 700, fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>The Network</p>
          <h1 style={{ fontFamily: "'Nunito', sans-serif", fontSize: 'clamp(32px,6vw,48px)', fontWeight: 800, color: 'white', marginBottom: '12px' }}>Browse AECO Talent</h1>
          <p style={{ color: '#8892A4', fontSize: '18px', marginBottom: '28px' }}>Senior practitioners available fractionally. Vetted by FractionalAECO.</p>

          {/* Live stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px', marginBottom: '28px' }}>
            {[
              { value: stats.totalTalent > 0 ? `${stats.totalTalent}+` : '—', label: 'Senior professionals' },
              { value: stats.uniqueDisciplines > 0 ? String(stats.uniqueDisciplines) : '—', label: 'Disciplines covered' },
              { value: stats.avgExperience > 0 ? `${stats.avgExperience} yrs` : '—', label: 'Avg. experience' },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ color: '#05809B', fontSize: 'clamp(22px,4vw,28px)', fontWeight: 800, fontFamily: "'Nunito', sans-serif" }}>{s.value}</div>
                <div style={{ color: '#4A5568', fontSize: '13px' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Search + CTA */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <input type="text" placeholder="Search by name, role, or skill..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, minWidth: '200px', background: '#0F1117', border: '1.5px solid #2A3145', borderRadius: '12px', padding: '14px 18px', color: 'white', fontSize: '15px', outline: 'none' }} />
            <Link href="/profile" style={{ background: '#F6981F', color: 'white', textDecoration: 'none', borderRadius: '12px', padding: '14px 22px', fontSize: '15px', fontWeight: 700, whiteSpace: 'nowrap' }}>
              + Add your profile
            </Link>
          </div>
        </div>
      </div>

      {/* ── Filter bar: Discipline pills ────────────────────────────────────── */}
      <div style={filterBar}>
        <div style={rowWrap}>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px', scrollbarWidth: 'none' }}>
            {DISCIPLINES.map(d => (
              <button key={d} onClick={() => setFilterDiscipline(d === 'All' ? '' : d)} style={pill((d === 'All' && !filterDiscipline) || filterDiscipline === d)}>
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Filter bar: Availability + Sort (same row) ───────────────────────── */}
      <div style={filterBar}>
        <div style={{ ...rowWrap, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          {/* Availability pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ color: '#4A5568', fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', alignSelf: 'center', marginRight: '4px', textTransform: 'uppercase' }}>Availability</span>
            {AVAILABILITIES.map(a => (
              <button key={a} onClick={() => setFilterAvailability(a === 'All' ? '' : a)} style={pill((a === 'All' && !filterAvailability) || filterAvailability === a)}>
                {a}
              </button>
            ))}
          </div>
          {/* Sort dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#4A5568', fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Sort</span>
            <select value={sort} onChange={e => setSort(e.target.value)}
              style={{ background: '#1B2130', border: '1px solid #2A3145', borderRadius: '10px', padding: '8px 14px', color: 'white', fontSize: '13px', fontWeight: 600, outline: 'none', cursor: 'pointer' }}>
              {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* ── Filter bar: Location ─────────────────────────────────────────────── */}
      <div style={{ ...filterBar, display: 'flex', alignItems: 'center' }}>
        <div style={{ ...rowWrap, display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
          <span style={{ color: '#4A5568', fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Location</span>
          <input type="text" placeholder="Filter by location..." value={filterLocation} onChange={e => setFilterLocation(e.target.value)}
            style={{ flex: 1, maxWidth: '320px', background: '#1B2130', border: '1px solid #2A3145', borderRadius: '10px', padding: '8px 14px', color: 'white', fontSize: '13px', outline: 'none' }} />
          {/* Active filter count */}
          {activeFilterCount > 0 && (
            <button onClick={clearAll} style={{ marginLeft: 'auto', background: 'rgba(246,152,32,0.12)', border: '1px solid rgba(246,152,32,0.3)', borderRadius: '100px', padding: '6px 14px', color: '#F6981F', fontSize: '12px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              ✕ {activeFilterCount} active filter{activeFilterCount > 1 ? 's' : ''}
            </button>
          )}
        </div>
      </div>

      {/* ── Talent grid ──────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(32px,4vw,48px) 20px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#4A5568', fontSize: '18px' }}>Loading talent...</div>
        ) : showEmptyState ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ fontFamily: "'Nunito', sans-serif", fontSize: '22px', fontWeight: 800, color: 'white', marginBottom: '10px' }}>No professionals found</h3>
            <p style={{ color: '#8892A4', fontSize: '15px', marginBottom: '28px' }}>No professionals match your current filters. Try adjusting your search.</p>
            <button onClick={clearAll}
              style={{ background: '#F6981F', color: 'white', border: 'none', borderRadius: '100px', padding: '14px 28px', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}>
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <p style={{ color: '#4A5568', fontSize: '14px', marginBottom: '24px' }}>
              {hasRealProfiles ? `${filtered.length} professional${filtered.length !== 1 ? 's' : ''} found` : 'Sample profiles — sign up to see real talent'}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {displayProfiles.map((p, i) => {
                const isDemo = p.id?.startsWith('d')
                const cardStyle: React.CSSProperties = {
                  background: '#1B2130', border: '1px solid #2A3145', borderRadius: '16px',
                  padding: '24px', display: 'block', textDecoration: 'none',
                  cursor: isDemo ? 'default' : 'pointer', transition: 'opacity 0.15s'
                }
                const cardContent = (
                  <>
                    {/* Avatar + badge */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: '#F6981F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '20px', fontFamily: "'Nunito', sans-serif" }}>
                        {p.name?.charAt(0)}
                      </div>
                      {p.is_verified ? (
                        <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '100px', background: 'rgba(34,197,94,0.15)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.3)', fontWeight: 700 }}>✓ Verified</span>
                      ) : isDemo ? (
                        <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '100px', background: 'rgba(246,152,32,0.15)', color: '#F6981F', border: '1px solid rgba(246,152,32,0.3)', fontWeight: 700 }}>Demo</span>
                      ) : null}
                    </div>

                    <h3 style={{ fontFamily: "'Nunito', sans-serif", fontSize: '17px', fontWeight: 800, color: 'white', marginBottom: '4px' }}>{p.name}</h3>
                    <p style={{ color: '#8892A4', fontSize: '14px', marginBottom: '14px' }}>{p.role}</p>

                    {p.skills && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                        {p.skills.split(',').slice(0, 2).map((s: string, j: number) => (
                          <span key={j} style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '100px', background: '#0F1117', color: '#05809B', border: '1px solid #2A3145' }}>{s.trim()}</span>
                        ))}
                      </div>
                    )}

                    {(p.certifications?.length ?? 0) > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                        {(p.certifications ?? []).slice(0, 3).map((c: string, j: number) => (
                          <span key={j} style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '100px', background: '#0F1117', color: '#94a3b8', border: '1px solid #2A3145' }}>{c}</span>
                        ))}
                      </div>
                    )}

                    {p.location && (
                      <p style={{ color: '#4A5568', fontSize: '13px', marginBottom: '14px' }}>📍 {p.location}</p>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid #2A3145' }}>
                      <span style={{ color: '#4A5568', fontSize: '13px' }}>{p.years_experience} yrs exp</span>
                      <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '17px', fontWeight: 800, color: '#05809B' }}>
                        {p.hourly_rate ? `$${p.hourly_rate}/h` : 'Rate TBD'}
                      </span>
                    </div>
                  </>
                )

                if (isDemo) {
                  return <div key={p.id || i} style={cardStyle} title="Demo profile — sign up to see real talent">{cardContent}</div>
                }
                return <Link key={p.id || i} href={`/talent/${p.id}`} style={cardStyle}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')} onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>{cardContent}</Link>
              })}
            </div>
          </>
        )}
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', padding: 'clamp(48px,6vw,64px) 20px', borderTop: '1px solid #2A3145' }}>
        <h3 style={{ fontFamily: "'Nunito', sans-serif", fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, color: 'white', marginBottom: '12px' }}>Need senior AECO firepower?</h3>
        <p style={{ color: '#8892A4', fontSize: '17px', marginBottom: '32px' }}>Tell us what you need. We&apos;ll match you with vetted senior practitioners.</p>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="https://www.fractionalaeco.com/contact" target="_blank" rel="noopener noreferrer"
            style={{ background: '#05809B', color: 'white', textDecoration: 'none', borderRadius: '100px', padding: '16px 32px', fontSize: '16px', fontWeight: 700 }}>
            Talk to Fractional AECO
          </a>
          <Link href="/signup"
            style={{ border: '1.5px solid #2A3145', color: '#8892A4', textDecoration: 'none', borderRadius: '100px', padding: '16px 32px', fontSize: '16px', fontWeight: 600 }}>
            Join as talent
          </Link>
        </div>
      </div>

    </div>
  )
}
