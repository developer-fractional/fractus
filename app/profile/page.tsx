'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const DISCIPLINES = ['Architecture', 'Structural Engineering', 'MEP Engineering', 'Civil Engineering', 'Construction Management', 'BIM/VDC', 'Sustainability', 'Owner/Operator', 'Project Controls', 'Cost Management']
const CERTIFICATIONS = ['LEED AP', 'AIA', 'PE', 'PMP', 'RIBA', 'WELL AP', 'ISO 19650', 'CCM', 'DBIA', 'Revit Certified']
const AVAILABILITY = ['1–2 days/week', '3 days/week', '4 days/week', 'Full-time fractional', 'Project-based only']

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    name: '',
    role: '',
    bio: '',
    discipline: '',
    years_experience: '',
    hourly_rate: '',
    availability: '',
    certifications: [] as string[],
    skills: '',
    linkedin_url: '',
    portfolio_url: '',
    location: '',
  })

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { window.location.href = '/login'; return }
      setUser(data.user)
      // Load existing profile
      supabase.from('profiles').select('*').eq('id', data.user.id).single().then(({ data: profile }) => {
        if (profile) setForm({ ...form, ...profile })
      })
    })
  }, [])

  function toggleCert(cert: string) {
    setForm(f => ({
      ...f,
      certifications: f.certifications.includes(cert)
        ? f.certifications.filter(c => c !== cert)
        : [...f.certifications, cert]
    }))
  }

  async function handleSave() {
    setSaving(true)
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      email: user.email,
      ...form,
      updated_at: new Date().toISOString(),
    })
    setSaving(false)
    if (!error) { setSaved(true); setTimeout(() => setSaved(false), 3000) }
  }

  const inputClass = "w-full rounded-xl px-5 py-4 text-white outline-none placeholder-gray-600 transition-all"
  const inputStyle = { background: 'var(--color-bg-card)', border: '1.5px solid var(--color-border)', fontSize: '16px' }
  const labelClass = "block font-semibold text-gray-300 mb-2"

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>

      {/* Top bar */}
      <div className="text-white text-center py-3 px-4" style={{ background: 'var(--color-primary)', fontSize: '15px' }}>
        Powered by <a href="https://www.fractionalaeco.com" target="_blank" className="underline font-semibold hover:opacity-80">Fractional AECO</a> · Your AECO Experts · <a href="tel:+19804940263" className="underline hover:opacity-80">+1 980 494 0263</a>
      </div>

      {/* Nav */}
      <nav className="flex items-center justify-between px-10 py-5 border-b" style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}>
        <a href="/" className="flex flex-col">
          <span className="text-3xl font-bold" style={{ color: 'var(--color-accent)' }}>Fractus</span>
          <span className="text-sm text-gray-500 leading-none">by FractionalAECO</span>
        </a>
        <div className="flex gap-6 items-center">
          <a href="/dashboard" className="text-gray-400 hover:text-white transition-colors" style={{ fontSize: '16px' }}>Dashboard</a>
          <a href="/talent" className="text-gray-400 hover:text-white transition-colors" style={{ fontSize: '16px' }}>Browse Talent</a>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-10">
          <h1 className="font-bold text-white mb-2" style={{ fontSize: '38px' }}>Your Profile</h1>
          <p className="text-gray-400" style={{ fontSize: '18px' }}>Build your AECO profile so companies can find and book you.</p>
        </div>

        {/* Profile preview card */}
        <div className="rounded-2xl border p-6 mb-10 flex items-center gap-5" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-3xl flex-shrink-0" style={{ background: 'var(--color-primary)' }}>
            {form.name ? form.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-white font-bold" style={{ fontSize: '22px' }}>{form.name || 'Your Name'}</span>
              <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: 'var(--color-primary)', color: 'white' }}>AECO Pro</span>
            </div>
            <p className="text-gray-400" style={{ fontSize: '16px' }}>{form.role || 'Your role'} {form.location ? `· ${form.location}` : ''}</p>
            <div className="flex gap-3 mt-2 flex-wrap">
              {form.discipline && <span className="text-xs px-3 py-1 rounded-full" style={{ background: 'var(--color-bg)', color: 'var(--color-accent)', border: '1px solid var(--color-border)' }}>{form.discipline}</span>}
              {form.years_experience && <span className="text-xs px-3 py-1 rounded-full" style={{ background: 'var(--color-bg)', color: 'var(--color-accent)', border: '1px solid var(--color-border)' }}>{form.years_experience} yrs exp</span>}
              {form.hourly_rate && <span className="text-xs px-3 py-1 rounded-full font-bold" style={{ background: 'var(--color-bg)', color: 'var(--color-accent-light)', border: '1px solid var(--color-border)' }}>${form.hourly_rate}/h</span>}
            </div>
          </div>
        </div>

        {/* Form sections */}
        <div className="space-y-8">

          {/* Basic info */}
          <div className="rounded-2xl border p-8" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
            <h2 className="font-bold text-white mb-6" style={{ fontSize: '22px' }}>Basic Information</h2>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Full name</label>
                <input type="text" placeholder="Jane Smith" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputClass} style={inputStyle} />
              </div>
              <div>
                <label className={labelClass}>Job title / Role</label>
                <input type="text" placeholder="Principal Architect" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className={inputClass} style={inputStyle} />
              </div>
              <div>
                <label className={labelClass}>Location</label>
                <input type="text" placeholder="New York, NY" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className={inputClass} style={inputStyle} />
              </div>
              <div>
                <label className={labelClass}>Years of experience</label>
                <input type="number" placeholder="12" value={form.years_experience} onChange={e => setForm({ ...form, years_experience: e.target.value })} className={inputClass} style={inputStyle} />
              </div>
            </div>
            <div className="mt-5">
              <label className={labelClass}>Bio — describe yourself in 2–3 sentences</label>
              <textarea placeholder="Senior architect with 15 years in healthcare and commercial projects. I specialize in design leadership and BIM coordination..." value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={4} className={inputClass} style={{ ...inputStyle, resize: 'none' }} />
            </div>
          </div>

          {/* AECO specifics */}
          <div className="rounded-2xl border p-8" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
            <h2 className="font-bold text-white mb-6" style={{ fontSize: '22px' }}>AECO Details</h2>
            <div className="grid grid-cols-2 gap-5 mb-6">
              <div>
                <label className={labelClass}>Primary discipline</label>
                <select value={form.discipline} onChange={e => setForm({ ...form, discipline: e.target.value })} className={inputClass} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="">Select discipline</option>
                  {DISCIPLINES.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Availability</label>
                <select value={form.availability} onChange={e => setForm({ ...form, availability: e.target.value })} className={inputClass} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="">Select availability</option>
                  {AVAILABILITY.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Hourly rate (USD)</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold" style={{ fontSize: '18px' }}>$</span>
                  <input type="number" placeholder="185" value={form.hourly_rate} onChange={e => setForm({ ...form, hourly_rate: e.target.value })} className={inputClass} style={{ ...inputStyle, paddingLeft: '36px' }} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Key skills (comma separated)</label>
                <input type="text" placeholder="Revit, BIM, Mass Timber, Healthcare" value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} className={inputClass} style={inputStyle} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Certifications</label>
              <div className="flex flex-wrap gap-3 mt-1">
                {CERTIFICATIONS.map(cert => (
                  <button key={cert} onClick={() => toggleCert(cert)}
                    className="px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer"
                    style={{
                      background: form.certifications.includes(cert) ? 'var(--color-primary)' : 'var(--color-bg)',
                      color: form.certifications.includes(cert) ? 'white' : 'var(--color-accent)',
                      border: `1.5px solid ${form.certifications.includes(cert) ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    }}>
                    {form.certifications.includes(cert) ? '✓ ' : ''}{cert}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="rounded-2xl border p-8" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
            <h2 className="font-bold text-white mb-2" style={{ fontSize: '22px' }}>Links & Import</h2>
            <p className="text-gray-500 mb-6" style={{ fontSize: '15px' }}>Connect your profiles so companies can verify your experience.</p>
            <div className="space-y-5">
              <div>
                <label className={labelClass}>LinkedIn URL</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-400 font-bold text-sm">in</span>
                  <input type="url" placeholder="https://linkedin.com/in/yourname" value={form.linkedin_url} onChange={e => setForm({ ...form, linkedin_url: e.target.value })} className={inputClass} style={{ ...inputStyle, paddingLeft: '42px' }} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Portfolio / Website</label>
                <input type="url" placeholder="https://yourportfolio.com" value={form.portfolio_url} onChange={e => setForm({ ...form, portfolio_url: e.target.value })} className={inputClass} style={inputStyle} />
              </div>
            </div>
          </div>

          {/* Save button */}
          <button onClick={handleSave} disabled={saving}
            className="w-full text-white rounded-2xl font-bold cursor-pointer transition-all"
            style={{ background: saved ? '#16a34a' : 'var(--color-primary)', fontSize: '20px', padding: '20px', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Saving...' : saved ? '✓ Profile Saved!' : 'Save Profile'}
          </button>

          {/* View public profile link */}
          {user && (
            <p className="text-center text-gray-500" style={{ fontSize: '15px' }}>
              Your public profile →{' '}
              <a href={`/talent/${user.id}`} className="font-medium hover:opacity-80" style={{ color: 'var(--color-accent-light)' }}>
                View how others see you
              </a>
            </p>
          )}

        </div>
      </div>
    </div>
  )
}