'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'
import Navbar from '../../components/Navbar'
import type { Listing } from '../../lib/types'

interface Company {
  id: string
  owner_id: string
  name: string
  website: string | null
  bio: string | null
  location: string | null
  logo_url: string | null
  industry: string | null
  size: string | null
}

export default function CompanyProfileClient({ id }: { id: string }) {
  const [company, setCompany]   = useState<Company | null>(null)
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    async function load() {
      const { data: co } = await supabase
        .from('companies').select('*').eq('id', id).single()
      if (!co) { setLoading(false); return }
      setCompany(co)

      const { data: ls } = await supabase
        .from('listings').select('*')
        .eq('posted_by', co.owner_id).eq('status', 'active')
        .order('created_at', { ascending: false })
      setListings(ls ?? [])
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--text-muted)', fontFamily: "'Nunito Sans', sans-serif" }}>Loading...</p>
    </div>
  )

  if (!company) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', fontFamily: "'Nunito Sans', sans-serif" }}>
      <Navbar activeLink="listings" />
      <div style={{ textAlign: 'center', padding: '80px' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Company not found.</p>
        <Link href="/listings" style={{ color: '#F6981F', textDecoration: 'none', fontWeight: 700 }}>← Back to listings</Link>
      </div>
    </div>
  )

  const tagStyle: React.CSSProperties = {
    fontSize: '12px', padding: '4px 12px', borderRadius: '100px',
    background: 'rgba(5,128,155,0.1)', color: '#05809B',
    border: '1px solid rgba(5,128,155,0.2)', fontWeight: 600,
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', fontFamily: "'Nunito Sans', sans-serif" }}>
      <Navbar activeLink="listings" />

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
        <Link href="/listings" style={{ color: '#05809B', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
          ← Back to listings
        </Link>

        {/* Company card */}
        <div style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '36px', marginTop: '24px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '20px' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '16px', background: 'rgba(5,128,155,0.12)', border: '1px solid rgba(5,128,155,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0, overflow: 'hidden' }}>
              {company.logo_url
                ? <img src={company.logo_url} alt={company.name} style={{ width: '72px', height: '72px', objectFit: 'cover' }} />
                : '🏢'}
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontFamily: "'Nunito', sans-serif", fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px', letterSpacing: '-0.5px' }}>
                {company.name}
              </h1>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {company.industry && <span style={tagStyle}>{company.industry}</span>}
                {company.size     && <span style={tagStyle}>{company.size}</span>}
                {company.location && <span style={{ ...tagStyle, background: 'rgba(246,152,32,0.08)', color: '#F6981F', border: '1px solid rgba(246,152,32,0.2)' }}>📍 {company.location}</span>}
              </div>
            </div>
          </div>

          {company.bio && (
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.8', marginBottom: '20px' }}>
              {company.bio}
            </p>
          )}

          {company.website && (
            <a href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
              target="_blank" rel="noopener noreferrer"
              style={{ color: '#05809B', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
              🌐 {company.website} ↗
            </a>
          )}
        </div>

        {/* Open roles */}
        <h2 style={{ fontFamily: "'Nunito', sans-serif", fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px' }}>
          Open Roles
        </h2>

        {listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>📋</div>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>No active listings right now.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {listings.map(l => (
              <Link key={l.id} href={`/listings/${l.id}`}
                style={{ textDecoration: 'none', display: 'block', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '22px 24px', transition: 'opacity 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                <h3 style={{ fontFamily: "'Nunito', sans-serif", fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>{l.title}</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                  {l.discipline      && <span style={tagStyle}>{l.discipline}</span>}
                  {l.engagement_type && <span style={tagStyle}>{l.engagement_type}</span>}
                  {l.remote          && <span style={{ ...tagStyle, background: 'var(--bg-primary)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>🌐 Remote</span>}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
                  {l.location && <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>📍 {l.location}</span>}
                  {l.rate     && <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>💰 {l.rate}</span>}
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
