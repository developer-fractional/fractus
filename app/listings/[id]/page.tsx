'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabase'
import Navbar from '../../components/Navbar'
import type { Listing } from '../../lib/types'

// Server-side client for generateMetadata (anon key is safe here)
const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { data } = await supabaseServer
    .from('listings').select('title, company, description').eq('id', params.id).single()
  return {
    title: data ? `${data.title} at ${data.company} | Fractus` : 'Listing | Fractus',
    description: data?.description?.substring(0, 160) ?? 'Fractional AECO opportunity on Fractus',
  }
}

export default function ListingDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [listing, setListing] = useState<Listing | null>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const [message, setMessage] = useState('')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [companyProfile, setCompanyProfile] = useState<{id: string; name: string} | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user)
      if (data.user && id) {
        const { data: sv } = await supabase
          .from('saved_listings').select('id')
          .eq('user_id', data.user.id).eq('listing_id', id).maybeSingle()
        setSaved(!!sv)
      }
    })
    supabase.from('listings').select('*').eq('id', id).single()
      .then(async ({ data }) => {
        setListing(data)
        setLoading(false)
        if (data?.posted_by) {
          const { data: co } = await supabase
            .from('companies').select('id, name').eq('owner_id', data.posted_by).maybeSingle()
          if (co) setCompanyProfile({ id: co.id, name: co.name })
        }
      })
  }, [id])

  async function handleApply() {
    if (!user) return router.push('/login')
    setApplying(true)
    const { error } = await supabase.from('applications').insert({
      listing_id: id,
      applicant_id: user.id,
      status: 'pending',
    })
    setApplying(false)
    if (error) {
      if (error.code === '23505') setMessage('You have already applied to this listing.')
      else setMessage('Error applying: ' + error.message)
    } else {
      setApplied(true)
      fetch('/api/notify-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing_id: id, applicant_id: user.id }),
      })
    }
  }

  async function handleSave() {
    if (!user) return router.push('/login')
    setSaving(true)
    if (saved) {
      await supabase.from('saved_listings').delete().eq('user_id', user.id).eq('listing_id', id)
      setSaved(false)
    } else {
      await supabase.from('saved_listings').insert({ user_id: user.id, listing_id: id })
      setSaved(true)
    }
    setSaving(false)
  }

  const tagStyle = {
    padding: '6px 14px', borderRadius: '100px', fontSize: '13px', fontWeight: 600,
    background: 'rgba(5,128,155,0.12)', color: '#05809B', border: '1px solid rgba(5,128,155,0.25)'
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0F1117', fontFamily: "'Nunito Sans', sans-serif" }}>
      <Navbar activeLink="listings" />
      <div style={{ textAlign: 'center', padding: '80px', color: '#8892A4' }}>Loading...</div>
    </div>
  )

  if (!listing) return (
    <div style={{ minHeight: '100vh', background: '#0F1117', fontFamily: "'Nunito Sans', sans-serif" }}>
      <Navbar activeLink="listings" />
      <div style={{ textAlign: 'center', padding: '80px' }}>
        <p style={{ color: '#8892A4', marginBottom: '24px' }}>Listing not found.</p>
        <Link href="/listings" style={{ color: '#F6981F', textDecoration: 'none', fontWeight: 700 }}>← Back to listings</Link>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0F1117', fontFamily: "'Nunito Sans', sans-serif" }}>
      <Navbar activeLink="listings" />

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
        <Link href="/listings" style={{ color: '#05809B', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
          ← Back to listings
        </Link>

        {/* Main card */}
        <div style={{ background: '#1B2130', borderRadius: '16px', border: '1px solid #2A3145', padding: '36px', marginTop: '24px' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '24px' }}>
            <div>
              <h1 style={{ fontFamily: "'Nunito', sans-serif", fontSize: '28px', fontWeight: 800, color: 'white', marginBottom: '8px', letterSpacing: '-0.5px' }}>
                {listing.title}
              </h1>
              {companyProfile ? (
                <Link href={`/company/${companyProfile.id}`}
                  style={{ color: '#05809B', fontSize: '18px', fontWeight: 700, textDecoration: 'none' }}>
                  {listing.company} ↗
                </Link>
              ) : (
                <p style={{ color: '#05809B', fontSize: '18px', fontWeight: 700 }}>{listing.company}</p>
              )}
            </div>
            <span style={{ padding: '6px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: 700, background: 'rgba(246,152,32,0.15)', color: '#F6981F', border: '1px solid rgba(246,152,32,0.3)', whiteSpace: 'nowrap' }}>
              {listing.status === 'active' ? '● Active' : listing.status}
            </span>
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '28px' }}>
            {listing.discipline && <span style={tagStyle}>{listing.discipline}</span>}
            {listing.engagement_type && <span style={tagStyle}>{listing.engagement_type}</span>}
            {listing.remote && <span style={tagStyle}>🌐 Remote</span>}
            {listing.location && <span style={{ ...tagStyle, background: 'rgba(246,152,32,0.08)', color: '#F6981F', border: '1px solid rgba(246,152,32,0.2)' }}>📍 {listing.location}</span>}
          </div>

          {/* Key details */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            {listing.rate && (
              <div style={{ background: '#0F1117', borderRadius: '12px', padding: '16px' }}>
                <p style={{ color: '#8892A4', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Rate</p>
                <p style={{ color: 'white', fontSize: '16px', fontWeight: 700 }}>{listing.rate}</p>
              </div>
            )}
            {listing.hours_per_week && (
              <div style={{ background: '#0F1117', borderRadius: '12px', padding: '16px' }}>
                <p style={{ color: '#8892A4', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Hours/week</p>
                <p style={{ color: 'white', fontSize: '16px', fontWeight: 700 }}>{listing.hours_per_week} hrs</p>
              </div>
            )}
            {listing.created_at && (
              <div style={{ background: '#0F1117', borderRadius: '12px', padding: '16px' }}>
                <p style={{ color: '#8892A4', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Posted</p>
                <p style={{ color: 'white', fontSize: '16px', fontWeight: 700 }}>
                  {new Date(listing.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            )}
          </div>

          {/* Description */}
          {listing.description && (
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ color: 'white', fontSize: '18px', fontWeight: 700, marginBottom: '16px', fontFamily: "'Nunito', sans-serif" }}>About this role</h2>
              <p style={{ color: '#C0C8D8', fontSize: '16px', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>{listing.description}</p>
            </div>
          )}

          {/* Divider */}
          <div style={{ height: '1px', background: '#2A3145', margin: '32px 0' }} />

          {/* Apply + Save section */}
          {applied ? (
            <div style={{ textAlign: 'center', padding: '24px', background: 'rgba(5,128,155,0.08)', borderRadius: '12px', border: '1px solid rgba(5,128,155,0.2)' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>✅</div>
              <h3 style={{ color: 'white', fontSize: '18px', fontWeight: 700, marginBottom: '8px', fontFamily: "'Nunito', sans-serif" }}>Application submitted!</h3>
              <p style={{ color: '#8892A4', fontSize: '15px' }}>The employer will be in touch if your profile is a match.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {message && (
                <div style={{ padding: '12px 16px', background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: '10px', color: '#FF8888', fontSize: '14px' }}>
                  {message}
                </div>
              )}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handleApply} disabled={applying} style={{
                  flex: 1, background: '#F6981F', color: 'white', border: 'none',
                  borderRadius: '100px', padding: '18px', fontSize: '17px', fontWeight: 700,
                  cursor: applying ? 'not-allowed' : 'pointer', opacity: applying ? 0.7 : 1,
                  fontFamily: "'Nunito Sans', sans-serif"
                }}>
                  {applying ? 'Submitting...' : user ? 'Apply for this role →' : 'Sign in to apply →'}
                </button>
                <button onClick={handleSave} disabled={saving} style={{
                  background: saved ? 'rgba(5,128,155,0.12)' : 'transparent',
                  color: saved ? '#05809B' : '#8892A4',
                  border: saved ? '1px solid rgba(5,128,155,0.3)' : '1px solid #2A3145',
                  borderRadius: '100px', padding: '18px 22px', fontSize: '20px',
                  cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1,
                  transition: 'all 0.15s',
                }}>
                  🔖
                </button>
              </div>
              {!user && (
                <p style={{ textAlign: 'center', color: '#8892A4', fontSize: '14px' }}>
                  <Link href="/login" style={{ color: '#05809B', textDecoration: 'none', fontWeight: 700 }}>Sign in</Link> or <Link href="/signup" style={{ color: '#05809B', textDecoration: 'none', fontWeight: 700 }}>create an account</Link> to apply
                </p>
              )}
              {saved && (
                <p style={{ textAlign: 'center', color: '#05809B', fontSize: '13px', fontWeight: 600 }}>
                  🔖 Saved to your <Link href="/dashboard/saved" style={{ color: '#05809B', textDecoration: 'underline' }}>saved listings</Link>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
