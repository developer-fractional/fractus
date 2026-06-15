'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'
import type { Listing } from '../lib/types'
import Navbar from '../components/Navbar'

const DISCIPLINES     = ['All', 'Architecture', 'Structural Engineering', 'MEP Engineering', 'Civil Engineering', 'Construction Management', 'BIM/VDC', 'Sustainability', 'Owner/Operator']
const ENGAGEMENT_TYPES = ['All', 'Fractional (ongoing)', 'Part-time', 'Project-based', 'Contract', 'Advisory']
const REMOTE_OPTIONS  = ['All', 'Remote only', 'On-site only']
const SORTS = [
  { label: 'Newest first', value: 'newest' },
  { label: 'Oldest first', value: 'oldest' },
]

// ── Style helpers ─────────────────────────────────────────────────────────────

function pill(active: boolean): React.CSSProperties {
  return active
    ? { background: 'rgba(5,128,155,0.15)', border: '1px solid #05809B',  color: '#05809B',  borderRadius: '100px', padding: '7px 16px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }
    : { background: '#1B2130',               border: '1px solid #2A3145',  color: '#8892A4',  borderRadius: '100px', padding: '7px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }
}

const filterLabel: React.CSSProperties = {
  color: '#4A5568', fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em',
  textTransform: 'uppercase', whiteSpace: 'nowrap', alignSelf: 'center', marginRight: '4px'
}

const filterBar: React.CSSProperties = {
  borderBottom: '1px solid #2A3145', padding: '14px 0'
}

const innerRow = (extra?: React.CSSProperties): React.CSSProperties => ({
  maxWidth: '960px', margin: '0 auto', padding: '0 20px',
  display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap',
  ...extra
})

export default function ListingsPage() {
  const [listings,         setListings]         = useState<Listing[]>([])
  const [loading,          setLoading]          = useState(true)
  const [search,           setSearch]           = useState('')
  const [filterDiscipline, setFilterDiscipline] = useState('')
  const [filterEngagement, setFilterEngagement] = useState('')
  const [filterRemote,     setFilterRemote]     = useState('')   // '' | 'remote' | 'onsite'
  const [sort,             setSort]             = useState('newest')

  useEffect(() => {
    supabase.from('listings')
      .select('*')
      .eq('status', 'active')
      .then(({ data }) => { setListings(data || []); setLoading(false) })
  }, [])

  // ── Active filter count ────────────────────────────────────────────────────
  const activeFilterCount = [filterDiscipline, filterEngagement, filterRemote, sort !== 'newest' ? sort : ''].filter(Boolean).length

  // ── Filter + sort ──────────────────────────────────────────────────────────
  const filtered = listings
    .filter(l => {
      const q = search.toLowerCase()
      const matchSearch     = !search || l.title?.toLowerCase().includes(q) || l.company?.toLowerCase().includes(q) || l.description?.toLowerCase().includes(q)
      const matchDiscipline = !filterDiscipline || l.discipline === filterDiscipline
      const matchEngagement = !filterEngagement || l.engagement_type === filterEngagement
      const matchRemote     = !filterRemote
        || (filterRemote === 'remote'  &&  l.remote)
        || (filterRemote === 'onsite'  && !l.remote)
      return matchSearch && matchDiscipline && matchEngagement && matchRemote
    })
    .sort((a, b) => {
      const tA = a.created_at ? new Date(a.created_at).getTime() : 0
      const tB = b.created_at ? new Date(b.created_at).getTime() : 0
      return sort === 'oldest' ? tA - tB : tB - tA
    })

  function clearAll() { setSearch(''); setFilterDiscipline(''); setFilterEngagement(''); setFilterRemote(''); setSort('newest') }

  return (
    <div style={{ minHeight: '100vh', background: '#0F1117', fontFamily: "'Nunito Sans', sans-serif" }}>

      <Navbar activeLink="listings" />

      {/* Hero */}
      <div style={{ background: '#1B2130', borderBottom: '1px solid #2A3145', padding: 'clamp(40px,6vw,64px) 20px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <p style={{ color: '#F6981F', fontWeight: 700, fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Opportunities</p>
          <h1 style={{ fontFamily: "'Nunito', sans-serif", fontSize: 'clamp(28px,6vw,48px)', fontWeight: 800, color: 'white', marginBottom: '12px' }}>
            Fractional AECO Jobs
          </h1>
          <p style={{ color: '#8892A4', fontSize: '18px', marginBottom: '28px' }}>
            Part-time, project-based, and fractional roles for senior AECO professionals.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <input type="text" placeholder="Search listings by title, company, or description..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, minWidth: '200px', background: '#0F1117', border: '1.5px solid #2A3145', borderRadius: '12px', padding: '14px 18px', color: 'white', fontSize: '15px', outline: 'none' }} />
            <Link href="/listings/new"
              style={{ background: '#F6981F', color: 'white', textDecoration: 'none', borderRadius: '12px', padding: '14px 22px', fontSize: '15px', fontWeight: 700, whiteSpace: 'nowrap' }}>
              + Post a listing
            </Link>
          </div>
        </div>
      </div>

      {/* ── Filter bar: Discipline pills ────────────────────────────────────── */}
      <div style={filterBar}>
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px', scrollbarWidth: 'none', alignItems: 'center' }}>
            <span style={filterLabel}>Discipline</span>
            {DISCIPLINES.map(d => (
              <button key={d} onClick={() => setFilterDiscipline(d === 'All' ? '' : d)} style={pill((d === 'All' && !filterDiscipline) || filterDiscipline === d)}>
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Filter bar: Engagement type pills ──────────────────────────────── */}
      <div style={filterBar}>
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px', scrollbarWidth: 'none', alignItems: 'center' }}>
            <span style={filterLabel}>Type</span>
            {ENGAGEMENT_TYPES.map(t => (
              <button key={t} onClick={() => setFilterEngagement(t === 'All' ? '' : t)} style={pill((t === 'All' && !filterEngagement) || filterEngagement === t)}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Filter bar: Remote toggle + Sort (same row) ─────────────────────── */}
      <div style={filterBar}>
        <div style={innerRow({ justifyContent: 'space-between' })}>
          {/* Remote pills */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={filterLabel}>Location</span>
            {REMOTE_OPTIONS.map(r => {
              const val = r === 'Remote only' ? 'remote' : r === 'On-site only' ? 'onsite' : ''
              return (
                <button key={r} onClick={() => setFilterRemote(val)} style={pill(filterRemote === val)}>
                  {r}
                </button>
              )
            })}
          </div>
          {/* Sort + active count */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {activeFilterCount > 0 && (
              <button onClick={clearAll}
                style={{ background: 'rgba(246,152,32,0.12)', border: '1px solid rgba(246,152,32,0.3)', borderRadius: '100px', padding: '6px 14px', color: '#F6981F', fontSize: '12px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                ✕ {activeFilterCount} active filter{activeFilterCount > 1 ? 's' : ''}
              </button>
            )}
            <span style={filterLabel}>Sort</span>
            <select value={sort} onChange={e => setSort(e.target.value)}
              style={{ background: '#1B2130', border: '1px solid #2A3145', borderRadius: '10px', padding: '8px 14px', color: 'white', fontSize: '13px', fontWeight: 600, outline: 'none', cursor: 'pointer' }}>
              {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* ── Listings ─────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: 'clamp(32px,4vw,48px) 20px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#4A5568', fontSize: '18px' }}>Loading listings...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
            <h3 style={{ fontFamily: "'Nunito', sans-serif", fontSize: '22px', fontWeight: 800, color: 'white', marginBottom: '10px' }}>
              {search || activeFilterCount > 0 ? 'No listings match your filters' : 'No listings yet'}
            </h3>
            <p style={{ color: '#8892A4', fontSize: '15px', marginBottom: '28px', maxWidth: '400px', margin: '0 auto 28px' }}>
              {search || activeFilterCount > 0
                ? 'Try adjusting your search or clearing the filters.'
                : 'No listings found. Be the first to post a fractional opportunity!'}
            </p>
            {search || activeFilterCount > 0 ? (
              <button onClick={clearAll}
                style={{ background: '#F6981F', color: 'white', border: 'none', borderRadius: '100px', padding: '14px 28px', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}>
                Clear all filters
              </button>
            ) : (
              <Link href="/listings/new"
                style={{ background: '#F6981F', color: 'white', textDecoration: 'none', borderRadius: '100px', padding: '14px 28px', fontSize: '15px', fontWeight: 700, display: 'inline-block' }}>
                Post a listing →
              </Link>
            )}
          </div>
        ) : (
          <>
            <p style={{ color: '#4A5568', fontSize: '14px', marginBottom: '20px' }}>
              {filtered.length} listing{filtered.length !== 1 ? 's' : ''} found
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {filtered.map((l, i) => (
                <Link key={l.id || i} href={'/listings/' + l.id}
                  style={{ textDecoration: 'none', display: 'block', background: '#1B2130', border: '1px solid #2A3145', borderRadius: '16px', padding: 'clamp(20px,3vw,28px)', transition: 'opacity 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>

                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    <div>
                      <h3 style={{ fontFamily: "'Nunito', sans-serif", fontSize: '19px', fontWeight: 800, color: 'white', marginBottom: '4px' }}>{l.title}</h3>
                      <p style={{ color: '#05809B', fontSize: '15px', fontWeight: 600 }}>{l.company}</p>
                    </div>
                    <span style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '100px', fontWeight: 700, background: 'rgba(246,152,32,0.15)', color: '#F6981F', border: '1px solid rgba(246,152,32,0.3)', whiteSpace: 'nowrap' }}>
                      {l.status === 'active' ? '● Active' : l.status}
                    </span>
                  </div>

                  {/* Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
                    {l.discipline    && <span style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '100px', background: 'rgba(5,128,155,0.1)', color: '#05809B', border: '1px solid rgba(5,128,155,0.2)', fontWeight: 600 }}>{l.discipline}</span>}
                    {l.engagement_type && <span style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '100px', background: 'rgba(5,128,155,0.1)', color: '#05809B', border: '1px solid rgba(5,128,155,0.2)', fontWeight: 600 }}>{l.engagement_type}</span>}
                    {l.remote        && <span style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '100px', background: '#1B2130', color: '#8892A4', border: '1px solid #2A3145', fontWeight: 600 }}>🌐 Remote</span>}
                  </div>

                  {l.description && (
                    <p style={{ color: '#8892A4', fontSize: '14px', lineHeight: 1.6, marginBottom: '14px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {l.description}
                    </p>
                  )}

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                    {l.location    && <span style={{ color: '#4A5568', fontSize: '13px' }}>📍 {l.location}</span>}
                    {l.rate        && <span style={{ color: '#4A5568', fontSize: '13px' }}>💰 {l.rate}</span>}
                    {l.created_at  && <span style={{ color: '#4A5568', fontSize: '13px' }}>🗓 {new Date(l.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

    </div>
  )
}
