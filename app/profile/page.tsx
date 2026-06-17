'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'

const DISCIPLINES = ['Architecture', 'Structural Engineering', 'MEP Engineering', 'Civil Engineering', 'Construction Management', 'BIM/VDC', 'Sustainability', 'Owner/Operator', 'Project Controls', 'Cost Management']
const CERTIFICATIONS = ['LEED AP', 'AIA', 'PE', 'PMP', 'RIBA', 'WELL AP', 'ISO 19650', 'CCM', 'DBIA', 'Revit Certified']
const AVAILABILITY = ['Available Now', 'Open to Work', 'Not Available']

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const RESUME_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
const RESUME_EXT = /\.(pdf|doc|docx)$/i
const MAX_RESUME_BYTES = 10 * 1024 * 1024
const MAX_RESUMES = 5

interface ResumeRow {
  id: string
  file_name: string
  file_path: string
  file_size: number | null
  is_primary: boolean
  uploaded_at: string
}

function formatSize(bytes: number | null) {
  if (!bytes) return ''
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function extFromFile(file: File) {
  const parts = file.name.split('.')
  return parts.length > 1 ? (parts.pop() as string).toLowerCase() : 'jpg'
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
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

  // Cover + avatar
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [coverUrl, setCoverUrl] = useState<string | null>(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [avatarError, setAvatarError] = useState<string | null>(null)
  const [coverError, setCoverError] = useState<string | null>(null)

  // Resumes
  const [resumes, setResumes] = useState<ResumeRow[]>([])
  const [uploadingResume, setUploadingResume] = useState(false)
  const [resumeError, setResumeError] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { window.location.href = '/login'; return }
      setUser(data.user)
      // Load existing profile
      supabase.from('profiles').select('*').eq('id', data.user.id).single().then(({ data: profile }) => {
        if (profile) {
          setForm(f => ({ ...f, ...profile }))
          setAvatarUrl(profile.avatar_url ?? null)
          setCoverUrl(profile.cover_url ?? null)
        }
      })
      // Load resumes
      supabase.from('resumes').select('*').eq('user_id', data.user.id).order('uploaded_at', { ascending: false }).then(({ data: rows }) => {
        setResumes((rows as ResumeRow[]) ?? [])
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (!user) return
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

  // ── Avatar / cover upload ──────────────────────────────────────────────────

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !user) return
    setAvatarError(null)
    if (!IMAGE_TYPES.includes(file.type)) { setAvatarError('Please upload a JPEG, PNG, or WEBP image.'); return }
    if (file.size > MAX_IMAGE_BYTES) { setAvatarError('Image must be 5MB or smaller.'); return }

    setUploadingAvatar(true)
    const path = `${user.id}/avatar.${extFromFile(file)}`
    const { error: upErr } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
    if (upErr) {
      setAvatarError('Upload failed. Please try again.')
      setUploadingAvatar(false)
      return
    }
    const { data: pub } = supabase.storage.from('avatars').getPublicUrl(path)
    const url = `${pub.publicUrl}?t=${Date.now()}`
    await supabase.from('profiles').update({ avatar_url: url }).eq('id', user.id)
    setAvatarUrl(url)
    setUploadingAvatar(false)
  }

  async function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !user) return
    setCoverError(null)
    if (!IMAGE_TYPES.includes(file.type)) { setCoverError('Please upload a JPEG, PNG, or WEBP image.'); return }
    if (file.size > MAX_IMAGE_BYTES) { setCoverError('Image must be 5MB or smaller.'); return }

    setUploadingCover(true)
    const path = `${user.id}/cover.${extFromFile(file)}`
    const { error: upErr } = await supabase.storage.from('covers').upload(path, file, { upsert: true })
    if (upErr) {
      setCoverError('Upload failed. Please try again.')
      setUploadingCover(false)
      return
    }
    const { data: pub } = supabase.storage.from('covers').getPublicUrl(path)
    const url = `${pub.publicUrl}?t=${Date.now()}`
    await supabase.from('profiles').update({ cover_url: url }).eq('id', user.id)
    setCoverUrl(url)
    setUploadingCover(false)
  }

  // ── Resumes ─────────────────────────────────────────────────────────────────

  async function handleResumeUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !user) return
    setResumeError(null)
    if (resumes.length >= MAX_RESUMES) { setResumeError('Maximum 5 resumes — delete one to upload another.'); return }
    if (!RESUME_TYPES.includes(file.type) && !RESUME_EXT.test(file.name)) { setResumeError('Please upload a PDF, DOC, or DOCX file.'); return }
    if (file.size > MAX_RESUME_BYTES) { setResumeError('File must be 10MB or smaller.'); return }

    setUploadingResume(true)
    const path = `${user.id}/${Date.now()}-${file.name}`
    const { error: upErr } = await supabase.storage.from('resumes').upload(path, file)
    if (upErr) {
      setResumeError('Upload failed. Please try again.')
      setUploadingResume(false)
      return
    }

    const { data: row, error: dbErr } = await supabase.from('resumes').insert({
      user_id: user.id,
      file_name: file.name,
      file_path: path,
      file_size: file.size,
      is_primary: resumes.length === 0,
    }).select().single()

    if (!dbErr && row) setResumes(prev => [row as ResumeRow, ...prev])
    else setResumeError('Upload saved, but we could not refresh the list. Reload the page.')
    setUploadingResume(false)
  }

  async function setPrimary(id: string) {
    if (!user) return
    await supabase.from('resumes').update({ is_primary: false }).eq('user_id', user.id)
    await supabase.from('resumes').update({ is_primary: true }).eq('id', id)
    setResumes(prev => prev.map(r => ({ ...r, is_primary: r.id === id })))
  }

  async function downloadResume(path: string, fileName: string) {
    const { data, error } = await supabase.storage.from('resumes').createSignedUrl(path, 60)
    if (error || !data) { setResumeError('Could not generate download link.'); return }
    const a = document.createElement('a')
    a.href = data.signedUrl
    a.download = fileName
    a.target = '_blank'
    a.rel = 'noopener noreferrer'
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  async function deleteResume(id: string, path: string) {
    if (!window.confirm('Delete this resume? This cannot be undone.')) return
    await supabase.storage.from('resumes').remove([path])
    await supabase.from('resumes').delete().eq('id', id)
    setResumes(prev => prev.filter(r => r.id !== id))
  }

  const inputClass = "w-full rounded-xl px-5 py-4 outline-none transition-all"
  const inputStyle = { background: 'var(--color-bg-card)', border: '1.5px solid var(--color-border)', fontSize: '16px', color: 'var(--text-primary)' }
  const labelClass = "block font-semibold mb-2"
  const labelStyle = { color: 'var(--text-secondary)' }

  const initial = (form.name || user?.email || '?').charAt(0).toUpperCase()
  const resumeUploadDisabled = uploadingResume || resumes.length >= MAX_RESUMES

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)', fontFamily: "'Nunito Sans', sans-serif" }}>

      <Navbar activeLink="profile" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        {/* Header */}
        <div className="mb-6">
          <h1 className="font-bold mb-2" style={{ fontSize: 'clamp(28px, 5vw, 38px)', fontFamily: "'Nunito', sans-serif", color: 'var(--text-primary)' }}>Your Profile</h1>
          <p className="text-base sm:text-lg" style={{ color: 'var(--text-muted)' }}>Build your AECO profile so companies can find and book you.</p>
        </div>

        {/* ── Cover + avatar (LinkedIn-style header) ──────────────────────── */}
        <div className="relative">
          {/* Cover banner */}
          <div className="group relative rounded-2xl overflow-hidden" style={{
            height: '200px',
            background: coverUrl ? undefined : 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
          }}>
            {coverUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" style={{ display: 'block' }} />
            )}
            <label className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" style={{ background: 'rgba(15,17,23,0.45)' }}>
              <span className="flex items-center gap-2 font-semibold text-sm" style={{ background: '#05809B', color: 'white', borderRadius: '100px', padding: '10px 20px' }}>
                {uploadingCover ? 'Uploading...' : '📷 Change cover'}
              </span>
              <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleCoverChange} disabled={uploadingCover} />
            </label>
          </div>

          {/* Avatar overlapping bottom-left of cover */}
          <div className="group absolute" style={{ left: '24px', bottom: '-60px', width: '120px', height: '120px' }}>
            <div className="rounded-full overflow-hidden flex items-center justify-center" style={{
              width: '120px', height: '120px', border: '4px solid var(--bg-primary)',
              background: avatarUrl ? 'var(--color-bg-card)' : '#F6981F', boxSizing: 'border-box',
            }}>
              {avatarUrl
                ? // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                : <span className="font-bold text-white" style={{ fontSize: '42px' }}>{initial}</span>}
            </div>
            <label className="absolute inset-0 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" style={{ background: 'rgba(15,17,23,0.45)', gap: '2px' }}>
              <span style={{ fontSize: '20px' }}>{uploadingAvatar ? '⏳' : '📷'}</span>
              {!uploadingAvatar && <span style={{ fontSize: '10px', fontWeight: 700, color: 'white' }}>Change photo</span>}
              <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleAvatarChange} disabled={uploadingAvatar} />
            </label>
          </div>
        </div>

        {/* Name / role / tags — sits below the avatar (single paddingTop clears the 60px avatar overlap + a 16px gap) */}
        <div style={{ paddingTop: '76px', marginBottom: '32px' }}>
          {(avatarError || coverError) && (
            <p style={{ color: '#f87171', fontSize: '13px', marginBottom: '12px' }}>{avatarError || coverError}</p>
          )}
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <span className="font-bold" style={{ fontSize: '24px', color: 'var(--text-primary)' }}>{form.name || 'Your Name'}</span>
            <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: 'var(--color-primary)', color: 'white' }}>AECO Pro</span>
          </div>
          <p style={{ fontSize: '16px', color: 'var(--text-muted)', marginBottom: '10px' }}>{form.role || 'Your role'} {form.location ? `· ${form.location}` : ''}</p>
          <div className="flex gap-3 flex-wrap">
            {form.discipline && <span className="text-xs px-3 py-1 rounded-full" style={{ background: 'var(--color-bg)', color: 'var(--color-accent)', border: '1px solid var(--color-border)' }}>{form.discipline}</span>}
            {form.years_experience && <span className="text-xs px-3 py-1 rounded-full" style={{ background: 'var(--color-bg)', color: 'var(--color-accent)', border: '1px solid var(--color-border)' }}>{form.years_experience} yrs exp</span>}
            {form.hourly_rate && <span className="text-xs px-3 py-1 rounded-full font-bold" style={{ background: 'var(--color-bg)', color: 'var(--color-accent-light)', border: '1px solid var(--color-border)' }}>${form.hourly_rate}/h</span>}
          </div>
        </div>

        {/* Completeness bar */}
        {(() => {
          const fields = [form.name, form.discipline, form.bio, form.years_experience, form.hourly_rate, form.availability, form.linkedin_url]
          const filled = fields.filter(Boolean).length
          const pct   = Math.round((filled / fields.length) * 100)
          return (
            <div style={{ marginBottom: '32px', padding: '20px 24px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
              <p style={{ color: pct === 100 ? '#22c55e' : '#05809B', fontSize: '14px', fontWeight: 700, marginBottom: '10px' }}>
                {pct === 100 ? '✓ Profile complete — you\'re discoverable!' : `Profile ${pct}% complete`}
              </p>
              <div style={{ background: 'var(--border-color)', borderRadius: '100px', height: '8px', overflow: 'hidden' }}>
                <div style={{ background: pct === 100 ? '#22c55e' : '#05809B', width: `${pct}%`, height: '100%', borderRadius: '100px', transition: 'width 0.3s' }} />
              </div>
            </div>
          )
        })()}

        {/* Form sections */}
        <div className="space-y-8">

          {/* Basic info */}
          <div className="rounded-2xl border p-8" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
            <h2 className="font-bold mb-6" style={{ fontSize: '22px', color: 'var(--text-primary)' }}>Basic Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass} style={labelStyle}>Full name</label>
                <input type="text" placeholder="Jane Smith" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputClass} style={inputStyle} />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Job title / Role</label>
                <input type="text" placeholder="Principal Architect" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className={inputClass} style={inputStyle} />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Location</label>
                <input type="text" placeholder="New York, NY" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className={inputClass} style={inputStyle} />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Years of experience</label>
                <input type="number" placeholder="12" value={form.years_experience} onChange={e => setForm({ ...form, years_experience: e.target.value })} className={inputClass} style={inputStyle} />
              </div>
            </div>
            <div className="mt-5">
              <label className={labelClass} style={labelStyle}>Bio — describe yourself in 2–3 sentences</label>
              <textarea placeholder="Senior architect with 15 years in healthcare and commercial projects. I specialize in design leadership and BIM coordination..." value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={4} className={inputClass} style={{ ...inputStyle, resize: 'none' }} />
            </div>
          </div>

          {/* AECO specifics */}
          <div className="rounded-2xl border p-8" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
            <h2 className="font-bold mb-6" style={{ fontSize: '22px', color: 'var(--text-primary)' }}>AECO Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
              <div>
                <label className={labelClass} style={labelStyle}>Primary discipline</label>
                <select value={form.discipline} onChange={e => setForm({ ...form, discipline: e.target.value })} className={inputClass} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="">Select discipline</option>
                  {DISCIPLINES.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Availability</label>
                <select value={form.availability} onChange={e => setForm({ ...form, availability: e.target.value })} className={inputClass} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="">Select availability</option>
                  {AVAILABILITY.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Hourly rate (USD)</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold" style={{ fontSize: '18px', color: 'var(--text-muted)' }}>$</span>
                  <input type="number" placeholder="185" value={form.hourly_rate} onChange={e => setForm({ ...form, hourly_rate: e.target.value })} className={inputClass} style={{ ...inputStyle, paddingLeft: '36px' }} />
                </div>
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Key skills (comma separated)</label>
                <input type="text" placeholder="Revit, BIM, Mass Timber, Healthcare" value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} className={inputClass} style={inputStyle} />
              </div>
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Certifications</label>
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
            <h2 className="font-bold mb-2" style={{ fontSize: '22px', color: 'var(--text-primary)' }}>Links & Import</h2>
            <p className="mb-6" style={{ fontSize: '15px', color: 'var(--text-muted)' }}>Connect your profiles so companies can verify your experience.</p>
            <div className="space-y-5">
              <div>
                <label className={labelClass} style={labelStyle}>LinkedIn URL</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-400 font-bold text-sm">in</span>
                  <input type="url" placeholder="https://linkedin.com/in/yourname" value={form.linkedin_url} onChange={e => setForm({ ...form, linkedin_url: e.target.value })} className={inputClass} style={{ ...inputStyle, paddingLeft: '42px' }} />
                </div>
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Portfolio / Website</label>
                <input type="url" placeholder="https://yourportfolio.com" value={form.portfolio_url} onChange={e => setForm({ ...form, portfolio_url: e.target.value })} className={inputClass} style={inputStyle} />
              </div>
            </div>
          </div>

          {/* Resumes & Documents */}
          <div className="rounded-2xl border p-8" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
            <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
              <h2 className="font-bold" style={{ fontSize: '22px', color: 'var(--text-primary)' }}>Resumes & Documents</h2>
              <label className="font-bold text-sm" style={{
                background: resumeUploadDisabled ? 'var(--color-border)' : '#05809B',
                color: resumeUploadDisabled ? 'var(--text-muted)' : 'white',
                borderRadius: '100px', padding: '10px 20px',
                cursor: resumeUploadDisabled ? 'not-allowed' : 'pointer',
              }}>
                {uploadingResume ? 'Uploading...' : '+ Upload Resume'}
                <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleResumeUpload} disabled={resumeUploadDisabled} />
              </label>
            </div>
            <p className="mb-6" style={{ fontSize: '14px', color: 'var(--text-muted)' }}>PDF, DOC, or DOCX — max 10MB, up to 5 files.</p>

            {resumeError && <p style={{ color: '#f87171', fontSize: '14px', marginBottom: '16px' }}>{resumeError}</p>}
            {resumes.length >= MAX_RESUMES && !resumeError && (
              <p style={{ color: '#F6981F', fontSize: '13px', marginBottom: '16px' }}>Maximum 5 resumes — delete one to upload another.</p>
            )}

            {resumes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>📄</div>
                <p style={{ fontSize: '15px', color: 'var(--text-muted)' }}>No resumes uploaded yet. Add one so employers can review your experience.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {resumes.map(r => (
                  <div key={r.id} className="flex items-center justify-between gap-3 flex-wrap" style={{ padding: '14px 18px', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'var(--color-bg)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                      <span style={{ fontSize: '22px' }}>📄</span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '14px' }}>{r.file_name}</span>
                          {r.is_primary && (
                            <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '100px', background: 'rgba(5,128,155,0.15)', color: '#05809B' }}>Primary</span>
                          )}
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{formatSize(r.file_size)} · Uploaded {formatDate(r.uploaded_at)}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                      {!r.is_primary && (
                        <button onClick={() => setPrimary(r.id)}
                          style={{ fontSize: '12px', fontWeight: 700, padding: '6px 14px', borderRadius: '100px', background: 'none', border: '1px solid var(--color-border)', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                          Set as Primary
                        </button>
                      )}
                      <button onClick={() => downloadResume(r.file_path, r.file_name)}
                        style={{ fontSize: '12px', fontWeight: 700, padding: '6px 14px', borderRadius: '100px', background: 'rgba(5,128,155,0.12)', border: '1px solid rgba(5,128,155,0.3)', color: '#05809B', cursor: 'pointer' }}>
                        Download
                      </button>
                      <button onClick={() => deleteResume(r.id, r.file_path)}
                        style={{ fontSize: '12px', fontWeight: 700, padding: '6px 14px', borderRadius: '100px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', cursor: 'pointer' }}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Save button */}
          <button onClick={handleSave} disabled={saving}
            className="w-full text-white rounded-2xl font-bold cursor-pointer transition-all"
            style={{ background: saved ? '#16a34a' : 'var(--color-primary)', fontSize: '20px', padding: '20px', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Saving...' : saved ? '✓ Profile Saved!' : 'Save Profile'}
          </button>

          {/* View public profile link */}
          {user && (
            <p className="text-center" style={{ fontSize: '15px', color: 'var(--text-muted)' }}>
              Your public profile →{' '}
              <Link href={`/talent/${user.id}`} className="font-medium hover:opacity-80" style={{ color: 'var(--color-accent-light)' }}>
                View how others see you
              </Link>
            </p>
          )}

        </div>
      </div>
    </div>
  )
}
