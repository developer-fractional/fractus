'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'
import Navbar from '../../components/Navbar'

interface ManagedListing {
  id: string
  title: string
  company: string | null
  status: string
  created_at: string | null
  appCount: number
}

function formatDate(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const card: React.CSSProperties = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border-color)',
  borderRadius: '16px',
  padding: 'clamp(20px,3vw,28px)',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
}

export default function MyListingsPage() {
  const [listings, setListings] = useState<ManagedListing[]>([])
  const [loading, setLoading]   = useState(true)
  const [closing, setClosing]   = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { window.location.href = '/login'; return }

      const { data: rows } = await supabase
        .from('listings')
        .select('id, title, company, status, created_at')
        .eq('posted_by', data.user.id)
        .order('created_at', { ascending: false })

      if (!rows) { setLoading(false); return }

      // Fetch application counts for each listing in parallel
      const withCounts = await Promise.all(
        rows.map(async (l) => {
          const { count } = await supabase
            .from('applications')
            .select('*', { count: 'exact', head: true })
            .eq('listing_id', l.id)
          return { ...l, appCount: count ?? 0 }
        })
      )

      setListings(withCounts)
      setLoading(false)
    })
  }, [])

  async function closeListing(id: string) {
    if (!confirm('Close this listing? It will no longer appear in search.')) return
    setClosing(id)
    // Optimistic update
    setListings(prev => prev.filter(l => l.id !== id))
    await supabase.from('listings').update({ status: 'closed' }).eq('id', id)
    setClosing(null)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', fontFamily: "'Nunito Sans', sans-serif" }}>

      <Navbar activeLink="dashboard" />

      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-card)', padding: 'clamp(32px,5vw,52px) 20px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <Link href="/dashboard"
            style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '14px', fontWeight: 600, display: 'inline-block', marginBottom: '20px' }}>
            ← Back to Dashboard
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <p style={{ color: '#F6981F', fontWeight: 700, fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Employer</p>
              <h1 style={{ fontFamily: "'Nunito', sans-serif", fontSize: 'clamp(26px,5vw,38px)', fontWeight: 800, color: 'var(--text-primary)' }}>My Listings</h1>
            </div>
            <Link href="/listings/new"
              style={{ background: '#F6981F', color: 'white', textDecoration: 'none', borderRadius: '100px', padding: '14px 28px', fontSize: '15px', fontWeight: 700, whiteSpace: 'nowrap' }}>
              + Post a listing
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: 'clamp(32px,4vw,48px) 20px' }}>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-secondary)', fontSize: '18px' }}>Loading listings...</div>

        ) : listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
            <h3 style={{ fontFamily: "'Nunito', sans-serif", fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>No listings posted yet</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '28px' }}>Post your first fractional AECO opportunity to start receiving applications.</p>
            <Link href="/listings/new"
              style={{ background: '#F6981F', color: 'white', textDecoration: 'none', borderRadius: '100px', padding: '14px 28px', fontSize: '15px', fontWeight: 700 }}>
              Post a listing →
            </Link>
          </div>

        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {listings.map(l => (
              <div key={l.id} style={card}>

                {/* Top row: title + status badge */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                  <div>
                    <h3 style={{ fontFamily: "'Nunito', sans-serif", fontSize: '19px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
                      {l.title}
                    </h3>
                    {l.company && (
                      <p style={{ color: '#05809B', fontSize: '15px', fontWeight: 600 }}>{l.company}</p>
                    )}
                  </div>
                  <span style={{
                    fontSize: '12px', padding: '4px 12px', borderRadius: '100px', fontWeight: 700,
                    whiteSpace: 'nowrap',
                    background: l.status === 'active' ? 'rgba(34,197,94,0.12)' : 'rgba(74,85,104,0.15)',
                    color:      l.status === 'active' ? '#4ade80'             : 'var(--text-secondary)',
                    border:     l.status === 'active' ? '1px solid rgba(34,197,94,0.3)' : '1px solid var(--border-color)',
                  }}>
                    {l.status === 'active' ? '● Active' : '● Closed'}
                  </span>
                </div>

                {/* Meta row: date + app count */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                  <span>🗓 Posted {formatDate(l.created_at)}</span>
                  <span style={{ color: l.appCount > 0 ? '#F6981F' : 'var(--text-secondary)', fontWeight: l.appCount > 0 ? 700 : 400 }}>
                    👤 {l.appCount} application{l.appCount !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <Link href={`/listings/${l.id}/edit`}
                    style={{ background: 'rgba(5,128,155,0.12)', color: '#05809B', border: '1px solid rgba(5,128,155,0.3)', borderRadius: '100px', padding: '8px 20px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>
                    Edit
                  </Link>
                  {l.status === 'active' && (
                    <button
                      onClick={() => closeListing(l.id)}
                      disabled={closing === l.id}
                      style={{
                        background: 'transparent', color: 'var(--text-secondary)',
                        border: '1px solid var(--border-color)', borderRadius: '100px',
                        padding: '8px 20px', fontSize: '13px', fontWeight: 700,
                        cursor: closing === l.id ? 'not-allowed' : 'pointer',
                        opacity: closing === l.id ? 0.5 : 1,
                      }}>
                      {closing === l.id ? 'Closing...' : 'Close listing'}
                    </button>
                  )}
                  <Link href={`/dashboard/applications`}
                    style={{ background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border-color)', borderRadius: '100px', padding: '8px 20px', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
                    View applications →
                  </Link>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
