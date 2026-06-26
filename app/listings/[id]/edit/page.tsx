'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../../lib/supabase'
import Navbar from '../../../components/Navbar'

const DISCIPLINES = [
  'Architecture', 'Structural Engineering', 'MEP Engineering',
  'Civil Engineering', 'Construction Management', 'Owner Representative',
  'Project Management', 'BIM / VDC', 'Sustainability / LEED',
  'Interior Design', 'Landscape Architecture', 'Other'
]

const ENGAGEMENT_TYPES = [
  'Fractional (ongoing)', 'Part-time', 'Project-based', 'Contract', 'Advisory'
]

export default function EditListingPage() {
  const { id } = useParams()
  const router = useRouter()
  const [loadingPage, setLoadingPage] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({
    title: '',
    company: '',
    description: '',
    discipline: '',
    engagement_type: '',
    hours_per_week: '',
    rate: '',
    location: '',
    remote: false,
  })

  useEffect(() => {
    async function load() {
      const { data: auth } = await supabase.auth.getUser()
      if (!auth.user) { router.push('/login'); return }

      const { data: listing } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single()

      if (!listing) { router.push('/listings'); return }
      if (listing.posted_by !== auth.user.id) { router.push(`/listings/${id}`); return }

      setForm({
        title: listing.title ?? '',
        company: listing.company ?? '',
        description: listing.description ?? '',
        discipline: listing.discipline ?? '',
        engagement_type: listing.engagement_type ?? '',
        hours_per_week: listing.hours_per_week?.toString() ?? '',
        rate: listing.rate?.toString() ?? '',
        location: listing.location ?? '',
        remote: listing.remote ?? false,
      })
      setLoadingPage(false)
    }
    load()
  }, [id, router])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  async function handleSubmit() {
    if (!form.title || !form.company || !form.description || !form.discipline || !form.engagement_type) {
      return setMessage('Please fill in all required fields')
    }
    setSaving(true)
    setMessage('')
    const { error } = await supabase.from('listings').update({
      title: form.title,
      company: form.company,
      description: form.description,
      discipline: form.discipline,
      engagement_type: form.engagement_type,
      hours_per_week: form.hours_per_week ? parseInt(form.hours_per_week) : null,
      rate: form.rate || null,
      location: form.location || null,
      remote: form.remote,
    }).eq('id', id)
    setSaving(false)
    if (error) return setMessage('Error saving: ' + error.message)
    router.push(`/listings/${id}`)
  }

  const inputStyle = {
    width: '100%', background: 'var(--input-bg)', border: '1.5px solid var(--border-color)',
    borderRadius: '12px', padding: '14px 18px', color: 'var(--text-primary)',
    fontSize: '15px', outline: 'none', boxSizing: 'border-box' as const,
    fontFamily: "'Nunito Sans', sans-serif"
  }
  const labelStyle = {
    display: 'block', color: 'var(--text-muted)', fontSize: '12px',
    fontWeight: 700, marginBottom: '8px', letterSpacing: '0.06em',
    textTransform: 'uppercase' as const
  }
  const fieldWrap = { marginBottom: '22px' }

  if (loadingPage) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#F6981F', fontFamily: "'Nunito Sans', sans-serif", fontSize: '18px' }}>Loading...</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', fontFamily: "'Nunito Sans', sans-serif" }}>
      <Navbar activeLink="listings" />

      {/* Header */}
      <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', padding: '40px 24px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <Link href={`/listings/${id}`} style={{ color: '#05809B', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
            ← Back to listing
          </Link>
          <h1 style={{ fontFamily: "'Nunito', sans-serif", fontSize: '36px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '16px', marginBottom: '8px', letterSpacing: '-0.5px' }}>
            Edit listing
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>
            Update the details for this role.
          </p>
        </div>
      </div>

      {/* Form */}
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '36px' }}>

          {/* Role details */}
          <h2 style={{ color: 'var(--text-primary)', fontSize: '18px', fontWeight: 700, marginBottom: '24px', fontFamily: "'Nunito', sans-serif" }}>
            Role details
          </h2>

          <div style={fieldWrap}>
            <label style={labelStyle}>Job title *</label>
            <input name="title" value={form.title} onChange={handleChange}
              placeholder="e.g. Fractional Director of Architecture" style={inputStyle} />
          </div>

          <div style={fieldWrap}>
            <label style={labelStyle}>Company / Organization *</label>
            <input name="company" value={form.company} onChange={handleChange}
              placeholder="e.g. Apex Development Group" style={inputStyle} />
          </div>

          <div style={fieldWrap}>
            <label style={labelStyle}>Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              placeholder="Describe the role, responsibilities, ideal candidate, project context..."
              rows={6}
              style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '22px' }}>
            <div>
              <label style={labelStyle}>Discipline *</label>
              <select name="discipline" value={form.discipline} onChange={handleChange}
                style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="">Select discipline</option>
                {DISCIPLINES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Engagement type *</label>
              <select name="engagement_type" value={form.engagement_type} onChange={handleChange}
                style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="">Select type</option>
                {ENGAGEMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Compensation */}
          <h2 style={{ color: 'var(--text-primary)', fontSize: '18px', fontWeight: 700, margin: '32px 0 24px', fontFamily: "'Nunito', sans-serif" }}>
            Compensation &amp; schedule
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '22px' }}>
            <div>
              <label style={labelStyle}>Hours per week</label>
              <input name="hours_per_week" type="number" min="1" max="40"
                value={form.hours_per_week} onChange={handleChange}
                placeholder="e.g. 20" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Rate / Compensation</label>
              <input name="rate" value={form.rate} onChange={handleChange}
                placeholder="e.g. $150/hr or $8,000/mo" style={inputStyle} />
            </div>
          </div>

          {/* Location */}
          <h2 style={{ color: 'var(--text-primary)', fontSize: '18px', fontWeight: 700, margin: '32px 0 24px', fontFamily: "'Nunito', sans-serif" }}>
            Location
          </h2>

          <div style={fieldWrap}>
            <label style={labelStyle}>Location</label>
            <input name="location" value={form.location} onChange={handleChange}
              placeholder="e.g. Charlotte, NC or Nationwide" style={inputStyle} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <div style={{
              width: '48px', height: '26px', borderRadius: '13px', cursor: 'pointer', position: 'relative',
              background: form.remote ? '#05809B' : 'var(--border-color)', transition: 'background 0.2s'
            }} onClick={() => setForm(prev => ({ ...prev, remote: !prev.remote }))}>
              <div style={{
                position: 'absolute', top: '3px', left: form.remote ? '25px' : '3px',
                width: '20px', height: '20px', borderRadius: '50%', background: 'white', transition: 'left 0.2s'
              }} />
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Remote / open to remote candidates</span>
          </div>

          {message && (
            <div style={{ padding: '14px 18px', background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: '10px', color: '#FF8888', fontSize: '14px', marginBottom: '24px' }}>
              {message}
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link href={`/listings/${id}`} style={{
              flex: 1, textAlign: 'center', padding: '16px', borderRadius: '100px',
              border: '1.5px solid var(--border-color)', color: 'var(--text-muted)', textDecoration: 'none',
              fontSize: '16px', fontWeight: 700
            }}>
              Cancel
            </Link>
            <button onClick={handleSubmit} disabled={saving} style={{
              flex: 2, background: '#F6981F', color: 'white', border: 'none',
              borderRadius: '100px', padding: '16px', fontSize: '16px', fontWeight: 700,
              cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1,
              fontFamily: "'Nunito Sans', sans-serif"
            }}>
              {saving ? 'Saving...' : 'Save changes →'}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
