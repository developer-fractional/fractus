'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'
import Navbar from '../../components/Navbar'

const DISCIPLINES = [
  'Architecture', 'Structural Engineering', 'MEP Engineering',
  'Civil Engineering', 'Construction Management', 'Owner Representative',
  'Project Management', 'BIM / VDC', 'Sustainability / LEED',
  'Interior Design', 'Landscape Architecture', 'Other'
]

const ENGAGEMENT_TYPES = [
  'Fractional (ongoing)', 'Part-time', 'Project-based', 'Contract', 'Advisory'
]

export default function NewListingPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
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
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push('/login')
      else setUser(data.user)
    })
  }, [router])

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
    setLoading(true)
    setMessage('')
    const { error } = await supabase.from('listings').insert({
      title: form.title,
      company: form.company,
      description: form.description,
      discipline: form.discipline,
      engagement_type: form.engagement_type,
      hours_per_week: form.hours_per_week ? parseInt(form.hours_per_week) : null,
      rate: form.rate || null,
      location: form.location || null,
      remote: form.remote,
      status: 'active',
      posted_by: user?.id,
    })
    setLoading(false)
    if (error) return setMessage('Error posting listing: ' + error.message)
    router.push('/listings?posted=true')
  }

  const inputStyle = {
    width: '100%', background: '#1B2130', border: '1.5px solid #2A3145',
    borderRadius: '12px', padding: '14px 18px', color: 'white',
    fontSize: '15px', outline: 'none', boxSizing: 'border-box' as const,
    fontFamily: "'Nunito Sans', sans-serif"
  }
  const labelStyle = {
    display: 'block', color: '#8892A4', fontSize: '12px',
    fontWeight: 700, marginBottom: '8px', letterSpacing: '0.06em',
    textTransform: 'uppercase' as const
  }
  const fieldWrap = { marginBottom: '22px' }

  if (!user) return null

  return (
    <div style={{ minHeight: '100vh', background: '#0F1117', fontFamily: "'Nunito Sans', sans-serif" }}>
      <Navbar activeLink="listings" />

      {/* Header */}
      <div style={{ background: '#1B2130', borderBottom: '1px solid #2A3145', padding: '40px 24px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <Link href="/listings" style={{ color: '#05809B', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
            ← Back to listings
          </Link>
          <h1 style={{ fontFamily: "'Nunito', sans-serif", fontSize: '36px', fontWeight: 800, color: 'white', marginTop: '16px', marginBottom: '8px', letterSpacing: '-0.5px' }}>
            Post a listing
          </h1>
          <p style={{ color: '#8892A4', fontSize: '16px' }}>
            Find senior AECO fractional talent for your project or organization.
          </p>
        </div>
      </div>

      {/* Form */}
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ background: '#1B2130', borderRadius: '16px', border: '1px solid #2A3145', padding: '36px' }}>

          {/* Section: Role details */}
          <h2 style={{ color: 'white', fontSize: '18px', fontWeight: 700, marginBottom: '24px', fontFamily: "'Nunito', sans-serif" }}>
            Role details
          </h2>

          <div style={fieldWrap}>
            <label style={labelStyle}>Job title *</label>
            <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Fractional Director of Architecture" style={inputStyle} />
          </div>

          <div style={fieldWrap}>
            <label style={labelStyle}>Company / Organization *</label>
            <input name="company" value={form.company} onChange={handleChange} placeholder="e.g. Apex Development Group" style={inputStyle} />
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
              <select name="discipline" value={form.discipline} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="">Select discipline</option>
                {DISCIPLINES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Engagement type *</label>
              <select name="engagement_type" value={form.engagement_type} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="">Select type</option>
                {ENGAGEMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Section: Compensation & schedule */}
          <h2 style={{ color: 'white', fontSize: '18px', fontWeight: 700, margin: '32px 0 24px', fontFamily: "'Nunito', sans-serif" }}>
            Compensation &amp; schedule
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '22px' }}>
            <div>
              <label style={labelStyle}>Hours per week</label>
              <input name="hours_per_week" type="number" min="1" max="40" value={form.hours_per_week} onChange={handleChange}
                placeholder="e.g. 20" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Rate / Compensation</label>
              <input name="rate" value={form.rate} onChange={handleChange}
                placeholder="e.g. $150/hr or $8,000/mo" style={inputStyle} />
            </div>
          </div>

          {/* Section: Location */}
          <h2 style={{ color: 'white', fontSize: '18px', fontWeight: 700, margin: '32px 0 24px', fontFamily: "'Nunito', sans-serif" }}>
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
              background: form.remote ? '#05809B' : '#2A3145', transition: 'background 0.2s'
            }} onClick={() => setForm(prev => ({ ...prev, remote: !prev.remote }))}>
              <div style={{
                position: 'absolute', top: '3px', left: form.remote ? '25px' : '3px',
                width: '20px', height: '20px', borderRadius: '50%', background: 'white', transition: 'left 0.2s'
              }} />
            </div>
            <span style={{ color: '#8892A4', fontSize: '15px' }}>
              Remote / open to remote candidates
            </span>
          </div>

          {message && (
            <div style={{ padding: '14px 18px', background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: '10px', color: '#FF8888', fontSize: '14px', marginBottom: '24px' }}>
              {message}
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link href="/listings" style={{
              flex: 1, textAlign: 'center', padding: '16px', borderRadius: '100px',
              border: '1.5px solid #2A3145', color: '#8892A4', textDecoration: 'none',
              fontSize: '16px', fontWeight: 700
            }}>
              Cancel
            </Link>
            <button onClick={handleSubmit} disabled={loading} style={{
              flex: 2, background: '#F6981F', color: 'white', border: 'none',
              borderRadius: '100px', padding: '16px', fontSize: '16px', fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
              fontFamily: "'Nunito Sans', sans-serif"
            }}>
              {loading ? 'Posting...' : 'Post listing →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
