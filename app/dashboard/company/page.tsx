'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'
import Navbar from '../../components/Navbar'

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

export default function CompanyProfilePage() {
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [message, setMessage]   = useState('')
  const [company, setCompany]   = useState<Company | null>(null)
  const [userId, setUserId]     = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '', website: '', bio: '', location: '', industry: '', size: '',
  })

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { window.location.href = '/login'; return }
      setUserId(data.user.id)
      const { data: co } = await supabase
        .from('companies').select('*').eq('owner_id', data.user.id).maybeSingle()
      if (co) {
        setCompany(co)
        setForm({
          name:     co.name     ?? '',
          website:  co.website  ?? '',
          bio:      co.bio      ?? '',
          location: co.location ?? '',
          industry: co.industry ?? '',
          size:     co.size     ?? '',
        })
      }
      setLoading(false)
    })
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSave() {
    if (!form.name.trim()) return setMessage('Company name is required')
    setSaving(true)
    setMessage('')
    const { error } = await supabase.from('companies').upsert({
      owner_id: userId,
      name:     form.name,
      website:  form.website  || null,
      bio:      form.bio      || null,
      location: form.location || null,
      industry: form.industry || null,
      size:     form.size     || null,
    }, { onConflict: 'owner_id' })
    setSaving(false)
    if (error) return setMessage('Error saving: ' + error.message)
    const { data: co } = await supabase
      .from('companies').select('*').eq('owner_id', userId).maybeSingle()
    setCompany(co)
    setMessage('✓ Company profile saved!')
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', background: '#0F1117', border: '1.5px solid #2A3145',
    borderRadius: '12px', padding: '14px 18px', color: 'white',
    fontSize: '15px', outline: 'none', boxSizing: 'border-box',
    fontFamily: "'Nunito Sans', sans-serif",
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', color: '#8892A4', fontSize: '12px',
    fontWeight: 700, marginBottom: '8px', letterSpacing: '0.06em',
    textTransform: 'uppercase',
  }
  const fieldWrap = { marginBottom: '22px' }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0F1117', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#F6981F', fontFamily: "'Nunito Sans', sans-serif" }}>Loading...</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0F1117', fontFamily: "'Nunito Sans', sans-serif" }}>
      <Navbar activeLink="dashboard" />

      {/* Header */}
      <div style={{ borderBottom: '1px solid #2A3145', background: '#1B2130', padding: 'clamp(32px,5vw,52px) 20px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <Link href="/dashboard" style={{ color: '#8892A4', textDecoration: 'none', fontSize: '14px', fontWeight: 600, display: 'inline-block', marginBottom: '20px' }}>
            ← Back to Dashboard
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <p style={{ color: '#F6981F', fontWeight: 700, fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Employer</p>
              <h1 style={{ fontFamily: "'Nunito', sans-serif", fontSize: 'clamp(26px,5vw,38px)', fontWeight: 800, color: 'white' }}>Company Profile</h1>
            </div>
            {company && (
              <Link href={`/company/${company.id}`}
                style={{ background: 'rgba(5,128,155,0.12)', color: '#05809B', border: '1px solid rgba(5,128,155,0.3)', borderRadius: '100px', padding: '10px 22px', fontSize: '14px', fontWeight: 700, textDecoration: 'none' }}>
                View public profile →
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Form */}
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: 'clamp(32px,4vw,48px) 20px' }}>
        <div style={{ background: '#1B2130', borderRadius: '16px', border: '1px solid #2A3145', padding: '36px' }}>

          {!company && (
            <div style={{ marginBottom: '28px', padding: '16px 20px', background: 'rgba(246,152,32,0.07)', border: '1px solid rgba(246,152,32,0.2)', borderRadius: '12px' }}>
              <p style={{ color: '#F6981F', fontSize: '14px', fontWeight: 600 }}>
                Set up your company profile so talent can learn about your organization.
              </p>
            </div>
          )}

          <div style={fieldWrap}>
            <label style={labelStyle}>Company name *</label>
            <input name="name" value={form.name} onChange={handleChange}
              placeholder="e.g. Apex Development Group" style={inputStyle} />
          </div>

          <div style={fieldWrap}>
            <label style={labelStyle}>Industry</label>
            <input name="industry" value={form.industry} onChange={handleChange}
              placeholder="e.g. Real Estate Development" style={inputStyle} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '22px' }}>
            <div>
              <label style={labelStyle}>Location</label>
              <input name="location" value={form.location} onChange={handleChange}
                placeholder="e.g. Charlotte, NC" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Company size</label>
              <select name="size" value={form.size} onChange={handleChange}
                style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="">Select size</option>
                <option value="1–10">1–10 employees</option>
                <option value="11–50">11–50 employees</option>
                <option value="51–200">51–200 employees</option>
                <option value="201–500">201–500 employees</option>
                <option value="500+">500+ employees</option>
              </select>
            </div>
          </div>

          <div style={fieldWrap}>
            <label style={labelStyle}>Website</label>
            <input name="website" value={form.website} onChange={handleChange}
              placeholder="https://yourcompany.com" style={inputStyle} />
          </div>

          <div style={fieldWrap}>
            <label style={labelStyle}>About your company</label>
            <textarea name="bio" value={form.bio} onChange={handleChange}
              placeholder="Tell talent about your company, projects, and culture..."
              rows={5}
              style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }} />
          </div>

          {message && (
            <div style={{
              padding: '14px 18px', borderRadius: '10px', fontSize: '14px', marginBottom: '24px',
              background: message.startsWith('✓') ? 'rgba(34,197,94,0.08)' : 'rgba(255,107,107,0.08)',
              border:     message.startsWith('✓') ? '1px solid rgba(34,197,94,0.2)' : '1px solid rgba(255,107,107,0.2)',
              color:      message.startsWith('✓') ? '#4ade80' : '#FF8888',
            }}>
              {message}
            </div>
          )}

          <button onClick={handleSave} disabled={saving} style={{
            width: '100%', background: '#F6981F', color: 'white', border: 'none',
            borderRadius: '100px', padding: '16px', fontSize: '16px', fontWeight: 700,
            cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1,
            fontFamily: "'Nunito Sans', sans-serif",
          }}>
            {saving ? 'Saving...' : company ? 'Save changes →' : 'Create company profile →'}
          </button>

        </div>
      </div>
    </div>
  )
}
