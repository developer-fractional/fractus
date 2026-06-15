'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'
import Navbar from '../../components/Navbar'
import type { Listing } from '../../lib/types'

interface SavedRow {
  id: string
  listing_id: string
  listings: Listing | null
}

function formatDate(d: string | null | undefined) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function SavedListingsPage() {
  const [rows, setRows]       = useState<SavedRow[]>([])
  const [loading, setLoading] = useState(true)
  const [removing, setRemoving] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { window.location.href = '/login'; return }

      const { data: saved } = await supabase
        .from('saved_listings')
        .select('id, listing_id, listings(*)')
        .eq('user_id', data.user.id)
        .order('created_at', { ascending: false })

      setRows((saved as SavedRow[]) ?? [])
      setLoading(false)
    })
  }, [])

  async function unsave(savedId: string) {
    setRemoving(savedId)
    setRows(prev => prev.filter(r => r.id !== savedId))
    await supabase.from('saved_listings').delete().eq('id', savedId)
    setRemoving(null)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0F1117', fontFamily: "'Nunito Sans', sans-serif" }}>

      <Navbar activeLink="listings" />

      {/* Header */}
      <div style={{ borderBottom: '1px solid #2A3145', background: '#1B2130', padding: 'clamp(32px,5vw,52px) 20px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <Link href="/dashboard"
            style={{ color: '#8892A4', textDecoration: 'none', fontSize: '14px', fontWeight: 600, display: 'inline-block', marginBottom: '20px' }}>
            ← Back to Dashboard
          </Link>
          <div>
            <p style={{ color: '#05809B', fontWeight: 700, fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Talent</p>
            <h1 style={{ fontFamily: "'Nunito', sans-serif", fontSize: 'clamp(26px,5vw,38px)', fontWeight: 800, color: 'white' }}>Saved Listings</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: 'clamp(32px,4vw,48px) 20px' }}>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#4A5568', fontSize: '18px' }}>Loading...</div>

        ) : rows.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔖</div>
            <h3 style={{ fontFamily: "'Nunito', sans-serif", fontSize: '22px', fontWeight: 800, color: 'white', marginBottom: '10px' }}>No saved listings yet</h3>
            <p style={{ color: '#8892A4', fontSize: '15px', marginBottom: '28px' }}>Browse open roles and tap 🔖 to save ones you want to revisit.</p>
            <Link href="/listings"
              style={{ background: '#F6981F', color: 'white', textDecoration: 'none', borderRadius: '100px', padding: '14px 28px', fontSize: '15px', fontWeight: 700 }}>
              Browse listings →
            </Link>
          </div>

        ) : (
          <>
            <p style={{ color: '#4A5568', fontSize: '14px', marginBottom: '20px' }}>
              {rows.length} saved listing{rows.length !== 1 ? 's' : ''}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {rows.map(row => {
                const l = row.listings
                if (!l) return null
                return (
                  <div key={row.id} style={{ background: '#1B2130', border: '1px solid #2A3145', borderRadius: '16px', padding: 'clamp(20px,3vw,28px)' }}>

                    {/* Title row */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                      <div>
                        <Link href={`/listings/${l.id}`} style={{ textDecoration: 'none' }}>
                          <h3 style={{ fontFamily: "'Nunito', sans-serif", fontSize: '19px', fontWeight: 800, color: 'white', marginBottom: '4px' }}>{l.title}</h3>
                        </Link>
                        {l.company && <p style={{ color: '#05809B', fontSize: '15px', fontWeight: 600 }}>{l.company}</p>}
                      </div>
                      <span style={{
                        fontSize: '12px', padding: '4px 12px', borderRadius: '100px', fontWeight: 700, whiteSpace: 'nowrap',
                        background: l.status === 'active' ? 'rgba(246,152,32,0.15)' : 'rgba(74,85,104,0.15)',
                        color:      l.status === 'active' ? '#F6981F' : '#4A5568',
                        border:     l.status === 'active' ? '1px solid rgba(246,152,32,0.3)' : '1px solid #2A3145',
                      }}>
                        {l.status === 'active' ? '● Active' : '● Closed'}
                      </span>
                    </div>

                    {/* Tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
                      {l.discipline     && <span style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '100px', background: 'rgba(5,128,155,0.1)', color: '#05809B', border: '1px solid rgba(5,128,155,0.2)', fontWeight: 600 }}>{l.discipline}</span>}
                      {l.engagement_type && <span style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '100px', background: 'rgba(5,128,155,0.1)', color: '#05809B', border: '1px solid rgba(5,128,155,0.2)', fontWeight: 600 }}>{l.engagement_type}</span>}
                      {l.remote         && <span style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '100px', background: '#1B2130', color: '#8892A4', border: '1px solid #2A3145', fontWeight: 600 }}>🌐 Remote</span>}
                    </div>

                    {/* Meta */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
                      {l.location   && <span style={{ color: '#4A5568', fontSize: '13px' }}>📍 {l.location}</span>}
                      {l.rate       && <span style={{ color: '#4A5568', fontSize: '13px' }}>💰 {l.rate}</span>}
                      {l.created_at && <span style={{ color: '#4A5568', fontSize: '13px' }}>🗓 {formatDate(l.created_at)}</span>}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <Link href={`/listings/${l.id}`}
                        style={{ background: '#F6981F', color: 'white', textDecoration: 'none', borderRadius: '100px', padding: '8px 20px', fontSize: '13px', fontWeight: 700 }}>
                        View listing →
                      </Link>
                      <button
                        onClick={() => unsave(row.id)}
                        disabled={removing === row.id}
                        style={{
                          background: 'transparent', color: '#4A5568',
                          border: '1px solid #2A3145', borderRadius: '100px',
                          padding: '8px 20px', fontSize: '13px', fontWeight: 600,
                          cursor: removing === row.id ? 'not-allowed' : 'pointer',
                          opacity: removing === row.id ? 0.5 : 1,
                        }}>
                        {removing === row.id ? 'Removing...' : '🔖 Unsave'}
                      </button>
                    </div>

                  </div>
                )
              })}
            </div>
          </>
        )}

      </div>
    </div>
  )
}
