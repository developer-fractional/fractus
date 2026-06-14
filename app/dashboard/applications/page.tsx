'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabase'
import Navbar from '../../components/Navbar'

const EMPLOYER_ROLES = ['Employer / Hiring', 'Owner / Operator']

// ── Types ────────────────────────────────────────────────────────────────────

interface TalentApplication {
  id: string
  status: string
  created_at: string
  listings: {
    title: string
    company: string | null
    location: string | null
    rate: string | null
  } | null
}

interface EmployerApplication {
  id: string
  status: string
  created_at: string
  listings: {
    title: string
    company: string | null
  } | null
  profiles: {
    name: string | null
  } | null
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; bg: string; color: string; border: string }> = {
    pending:  { label: 'Pending',  bg: 'rgba(246,152,32,0.12)',  color: '#F6981F', border: 'rgba(246,152,32,0.3)' },
    accepted: { label: 'Accepted', bg: 'rgba(34,197,94,0.12)',   color: '#22c55e', border: 'rgba(34,197,94,0.3)' },
    rejected: { label: 'Declined', bg: 'rgba(239,68,68,0.12)',   color: '#f87171', border: 'rgba(239,68,68,0.3)' },
  }
  const s = map[status] ?? map['pending']
  return (
    <span style={{
      fontSize: '12px', fontWeight: 700, padding: '4px 12px', borderRadius: '100px',
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      letterSpacing: '0.03em', whiteSpace: 'nowrap'
    }}>
      {s.label}
    </span>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function ApplicationsPage() {
  const [user, setUser]               = useState<User | null>(null)
  const [isEmployer, setIsEmployer]   = useState(false)
  const [isAdmin, setIsAdmin]         = useState(false)
  const [talentApps, setTalentApps]   = useState<TalentApplication[]>([])
  const [employerApps, setEmployerApps] = useState<EmployerApplication[]>([])
  const [loading, setLoading]         = useState(true)
  const [updating, setUpdating]       = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { window.location.href = '/login'; return }
      const u = data.user
      setUser(u)

      // Fetch profile to determine role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, is_admin')
        .eq('id', u.id)
        .single()

      const admin    = !!profile?.is_admin
      const employer = !admin && EMPLOYER_ROLES.includes(profile?.role ?? '')
      setIsAdmin(admin)
      setIsEmployer(employer)

      if (employer || admin) {
        // Employer / Admin: get applications for listings posted by this user
        // Step 1 — listing IDs this user posted
        const { data: myListings } = await supabase
          .from('listings')
          .select('id')
          .eq('posted_by', u.id)

        const listingIds = (myListings ?? []).map((l: { id: string }) => l.id)

        if (listingIds.length > 0) {
          const { data: apps } = await supabase
            .from('applications')
            .select('id, status, created_at, listings(title, company), profiles(name)')
            .in('listing_id', listingIds)
            .order('created_at', { ascending: false })
          setEmployerApps((apps as unknown as EmployerApplication[]) ?? [])
        }
      } else {
        // Talent: get applications this user submitted
        const { data: apps } = await supabase
          .from('applications')
          .select('id, status, created_at, listings(title, company, location, rate)')
          .eq('applicant_id', u.id)
          .order('created_at', { ascending: false })
        setTalentApps((apps as unknown as TalentApplication[]) ?? [])
      }

      setLoading(false)
    })
  }, [])

  async function updateStatus(appId: string, status: 'accepted' | 'rejected') {
    setUpdating(appId)
    await supabase.from('applications').update({ status }).eq('id', appId)
    setEmployerApps(prev => prev.map(a => a.id === appId ? { ...a, status } : a))
    setUpdating(null)
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F1117' }}>
      <p style={{ color: '#F6981F', fontSize: '20px', fontFamily: "'Nunito Sans', sans-serif" }}>Loading...</p>
    </div>
  )

  const showEmployerView = isEmployer || isAdmin
  const title   = showEmployerView ? 'Applications Received' : 'My Applications'
  const subtitle = showEmployerView
    ? 'Candidates who applied to your listings'
    : 'Listings you have applied to'

  // ── Shared card/section styles ─────────────────────────────────────────────
  const card: React.CSSProperties = {
    background: '#1B2130', border: '1px solid #2A3145', borderRadius: '16px',
    padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '16px'
  }
  const metaText: React.CSSProperties = { color: '#8892A4', fontSize: '13px' }

  return (
    <div style={{ minHeight: '100vh', background: '#0F1117', fontFamily: "'Nunito Sans', sans-serif" }}>

      <Navbar activeLink="dashboard" />

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: 'clamp(32px, 6vw, 56px) clamp(20px, 4vw, 32px)' }}>

        {/* Back + header */}
        <Link href="/dashboard" style={{ color: '#05809B', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
          ← Back to dashboard
        </Link>
        <h1 style={{
          fontFamily: "'Nunito', sans-serif", fontSize: 'clamp(26px, 5vw, 36px)',
          fontWeight: 800, color: 'white', margin: '16px 0 6px', letterSpacing: '-0.5px'
        }}>
          {title}
        </h1>
        <p style={{ color: '#8892A4', fontSize: '16px', marginBottom: '36px' }}>{subtitle}</p>

        {/* ── TALENT VIEW ─────────────────────────────────────────────────── */}
        {!showEmployerView && (
          talentApps.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
              <h3 style={{ fontFamily: "'Nunito', sans-serif", fontSize: '22px', fontWeight: 800, color: 'white', marginBottom: '10px' }}>
                No applications yet
              </h3>
              <p style={{ color: '#8892A4', fontSize: '15px', marginBottom: '28px' }}>
                You haven&apos;t applied to any listings yet.
              </p>
              <Link href="/listings" style={{
                background: '#F6981F', color: 'white', textDecoration: 'none',
                borderRadius: '100px', padding: '14px 28px', fontSize: '15px', fontWeight: 700
              }}>
                Browse listings →
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {talentApps.map(app => (
                <div key={app.id} style={card}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                    <div>
                      <h3 style={{ fontFamily: "'Nunito', sans-serif", fontSize: '18px', fontWeight: 800, color: 'white', marginBottom: '4px' }}>
                        {app.listings?.title ?? 'Untitled listing'}
                      </h3>
                      <p style={{ color: '#05809B', fontSize: '15px', fontWeight: 600 }}>
                        {app.listings?.company ?? ''}
                      </p>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                    {app.listings?.location && <span style={metaText}>📍 {app.listings.location}</span>}
                    {app.listings?.rate     && <span style={metaText}>💰 {app.listings.rate}</span>}
                    <span style={metaText}>🗓 Applied {formatDate(app.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* ── EMPLOYER / ADMIN VIEW ────────────────────────────────────────── */}
        {showEmployerView && (
          employerApps.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
              <h3 style={{ fontFamily: "'Nunito', sans-serif", fontSize: '22px', fontWeight: 800, color: 'white', marginBottom: '10px' }}>
                No applications yet
              </h3>
              <p style={{ color: '#8892A4', fontSize: '15px', marginBottom: '28px' }}>
                Once professionals apply to your listings, they&apos;ll appear here.
              </p>
              <Link href="/listings/new" style={{
                background: '#F6981F', color: 'white', textDecoration: 'none',
                borderRadius: '100px', padding: '14px 28px', fontSize: '15px', fontWeight: 700
              }}>
                Post a listing →
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {employerApps.map(app => (
                <div key={app.id} style={card}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                    <div>
                      <h3 style={{ fontFamily: "'Nunito', sans-serif", fontSize: '18px', fontWeight: 800, color: 'white', marginBottom: '4px' }}>
                        {app.listings?.title ?? 'Untitled listing'}
                      </h3>
                      <p style={{ color: '#8892A4', fontSize: '15px' }}>
                        Applicant: <span style={{ color: 'white', fontWeight: 600 }}>{app.profiles?.name ?? 'Unknown'}</span>
                      </p>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    <span style={metaText}>🗓 Applied {formatDate(app.created_at)}</span>
                    {app.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => updateStatus(app.id, 'accepted')}
                          disabled={updating === app.id}
                          style={{
                            background: 'rgba(34,197,94,0.12)', color: '#22c55e',
                            border: '1px solid rgba(34,197,94,0.3)', borderRadius: '100px',
                            padding: '8px 20px', fontSize: '13px', fontWeight: 700,
                            cursor: updating === app.id ? 'not-allowed' : 'pointer',
                            opacity: updating === app.id ? 0.6 : 1
                          }}>
                          {updating === app.id ? '...' : 'Accept'}
                        </button>
                        <button
                          onClick={() => updateStatus(app.id, 'rejected')}
                          disabled={updating === app.id}
                          style={{
                            background: 'rgba(239,68,68,0.12)', color: '#f87171',
                            border: '1px solid rgba(239,68,68,0.3)', borderRadius: '100px',
                            padding: '8px 20px', fontSize: '13px', fontWeight: 700,
                            cursor: updating === app.id ? 'not-allowed' : 'pointer',
                            opacity: updating === app.id ? 0.6 : 1
                          }}>
                          {updating === app.id ? '...' : 'Decline'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        )}

      </div>
    </div>
  )
}
