'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { PortfolioProject } from '../lib/types'

const inputClass = "w-full rounded-xl px-5 py-4 outline-none transition-all"
const inputStyle = { background: 'var(--color-bg-card)', border: '1.5px solid var(--color-border)', fontSize: '16px', color: 'var(--text-primary)' }
const labelClass = "block font-semibold mb-2"
const labelStyle = { color: 'var(--text-secondary)' }

const PROJECT_TYPES = ['Healthcare', 'Commercial', 'Residential', 'Mixed-Use', 'Infrastructure', 'Industrial', 'Education', 'Government', 'Hospitality', 'Other']

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_IMAGE_BYTES = 8 * 1024 * 1024
const IMAGE_ERROR = 'Please upload a JPG, PNG, or WebP image under 8MB'

const emptyForm = {
  project_name: '',
  project_type: '',
  role: '',
  client_or_firm: '',
  location: '',
  project_value: '',
  completion_year: '',
  description: '',
  image_url: '',
}

// Mirrors the inferFileType() fallback used elsewhere in profile/page.tsx —
// some browser/OS combos report an empty file.type.
function inferFileType(file: File) {
  if (file.type) return file.type
  const ext = file.name.split('.').pop()?.toLowerCase()
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg'
  if (ext === 'png') return 'image/png'
  if (ext === 'webp') return 'image/webp'
  return file.type
}

async function checkServerValid(bucket: string, fileType: string, fileSize: number): Promise<{ valid: boolean; error?: string }> {
  try {
    const res = await fetch('/api/validate-upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bucket, fileType, fileSize }),
    })
    return await res.json()
  } catch {
    return { valid: false, error: 'Could not validate file. Please try again.' }
  }
}

export default function PortfolioSection({ userId }: { userId: string }) {
  const [rows, setRows] = useState<PortfolioProject[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)
  const [dragId, setDragId] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return
    supabase.from('portfolio_projects').select('*').eq('user_id', userId)
      .order('display_order', { ascending: true })
      .then(({ data }) => setRows((data as PortfolioProject[]) ?? []))
  }, [userId])

  function openAdd() {
    setForm(emptyForm)
    setEditingId(null)
    setError(null)
    setImageError(null)
    setShowForm(true)
  }

  function openEdit(row: PortfolioProject) {
    setForm({
      project_name: row.project_name ?? '',
      project_type: row.project_type ?? '',
      role: row.role ?? '',
      client_or_firm: row.client_or_firm ?? '',
      location: row.location ?? '',
      project_value: row.project_value ?? '',
      completion_year: row.completion_year != null ? String(row.completion_year) : '',
      description: row.description ?? '',
      image_url: row.image_url ?? '',
    })
    setEditingId(row.id)
    setError(null)
    setImageError(null)
    setShowForm(true)
  }

  function cancelForm() {
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
    setError(null)
    setImageError(null)
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !userId) return
    setImageError(null)
    const fileType = inferFileType(file)
    if (!IMAGE_TYPES.includes(fileType)) { setImageError(IMAGE_ERROR); return }
    if (file.size > MAX_IMAGE_BYTES) { setImageError(IMAGE_ERROR); return }

    setUploadingImage(true)
    const serverCheck = await checkServerValid('portfolio', fileType, file.size)
    if (!serverCheck.valid) {
      setImageError(serverCheck.error || IMAGE_ERROR)
      setUploadingImage(false)
      return
    }

    const path = `${userId}/${Date.now()}-${file.name}`
    const { error: upErr } = await supabase.storage.from('portfolio').upload(path, file)
    if (upErr) {
      setImageError('Upload failed. Please try again.')
      setUploadingImage(false)
      return
    }
    const { data: pub } = supabase.storage.from('portfolio').getPublicUrl(path)
    setForm(f => ({ ...f, image_url: pub.publicUrl }))
    setUploadingImage(false)
  }

  async function handleSubmit() {
    if (!userId) return
    if (!form.project_name.trim()) { setError('Project name is required.'); return }
    setSaving(true)
    setError(null)
    const payload = {
      user_id: userId,
      project_name: form.project_name.trim(),
      project_type: form.project_type || null,
      role: form.role.trim() || null,
      client_or_firm: form.client_or_firm.trim() || null,
      location: form.location.trim() || null,
      project_value: form.project_value.trim() || null,
      completion_year: form.completion_year ? Number(form.completion_year) : null,
      description: form.description.trim() || null,
      image_url: form.image_url || null,
    }

    if (editingId) {
      const { data, error: err } = await supabase.from('portfolio_projects').update(payload).eq('id', editingId).select().single()
      setSaving(false)
      if (err || !data) { setError('Could not save changes. Please try again.'); return }
      setRows(prev => prev.map(r => r.id === editingId ? (data as PortfolioProject) : r))
      cancelForm()
    } else {
      const nextOrder = rows.length > 0 ? Math.max(...rows.map(r => r.display_order ?? 0)) + 1 : 0
      const { data, error: err } = await supabase.from('portfolio_projects').insert({ ...payload, display_order: nextOrder }).select().single()
      setSaving(false)
      if (err || !data) { setError('Could not add this project. Please try again.'); return }
      setRows(prev => [...prev, data as PortfolioProject])
      cancelForm()
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this project? This cannot be undone.')) return
    await supabase.from('portfolio_projects').delete().eq('id', id)
    setRows(prev => prev.filter(r => r.id !== id))
  }

  function handleDragStart(id: string) {
    setDragId(id)
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
  }

  async function handleDrop(targetId: string) {
    if (!dragId || dragId === targetId) { setDragId(null); return }
    const fromIndex = rows.findIndex(r => r.id === dragId)
    const toIndex = rows.findIndex(r => r.id === targetId)
    if (fromIndex === -1 || toIndex === -1) { setDragId(null); return }

    const reordered = [...rows]
    const [moved] = reordered.splice(fromIndex, 1)
    reordered.splice(toIndex, 0, moved)
    setRows(reordered)
    setDragId(null)

    await Promise.all(reordered.map((row, idx) =>
      supabase.from('portfolio_projects').update({ display_order: idx }).eq('id', row.id)
    ))
  }

  return (
    <div className="rounded-2xl border p-8" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
      <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
        <h2 className="font-bold" style={{ fontSize: '22px', color: 'var(--text-primary)' }}>Project Portfolio</h2>
        {!showForm && (
          <button onClick={openAdd} className="font-bold text-sm cursor-pointer" style={{ background: '#05809B', color: 'white', borderRadius: '100px', padding: '10px 20px', border: 'none' }}>
            + Add Project
          </button>
        )}
      </div>
      <p className="mb-6" style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Showcase the projects you&apos;ve worked on. Drag cards to reorder.</p>

      {error && <p style={{ color: '#f87171', fontSize: '14px', marginBottom: '16px' }}>{error}</p>}

      {showForm && (
        <div className="mb-6" style={{ padding: '20px', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'var(--color-bg)' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass} style={labelStyle}>Project name *</label>
              <input type="text" placeholder="Riverside Medical Center" value={form.project_name} onChange={e => setForm({ ...form, project_name: e.target.value })} className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Project type</label>
              <select value={form.project_type} onChange={e => setForm({ ...form, project_type: e.target.value })} className={inputClass} style={inputStyle}>
                <option value="">Select type</option>
                {PROJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Your role</label>
              <input type="text" placeholder="Project Architect" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Client / firm</label>
              <input type="text" placeholder="HOK" value={form.client_or_firm} onChange={e => setForm({ ...form, client_or_firm: e.target.value })} className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Location</label>
              <input type="text" placeholder="Chicago, IL" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className={inputClass} style={inputStyle} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass} style={labelStyle}>Project value</label>
                <input type="text" placeholder="$15M" value={form.project_value} onChange={e => setForm({ ...form, project_value: e.target.value })} className={inputClass} style={inputStyle} />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Completion year</label>
                <input type="number" placeholder="2023" value={form.completion_year} onChange={e => setForm({ ...form, completion_year: e.target.value })} className={inputClass} style={inputStyle} />
              </div>
            </div>
          </div>
          <div className="mt-5">
            <label className={labelClass} style={labelStyle}>Description</label>
            <textarea placeholder="Scope, scale, and your contribution to the project..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className={inputClass} style={{ ...inputStyle, resize: 'none' }} />
          </div>

          <div className="mt-5">
            <label className={labelClass} style={labelStyle}>Project image</label>
            {imageError && <p style={{ color: '#f87171', fontSize: '13px', marginBottom: '10px' }}>{imageError}</p>}
            <div className="flex items-center gap-4 flex-wrap">
              {form.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.image_url} alt="Project preview" style={{ width: '120px', height: '90px', objectFit: 'cover', borderRadius: '10px', border: '1px solid var(--color-border)' }} />
              )}
              <label className="font-bold text-sm flex items-center gap-2" style={{
                background: uploadingImage ? 'var(--color-border)' : 'none',
                color: uploadingImage ? 'var(--text-muted)' : '#05809B',
                borderRadius: '100px', padding: '10px 20px',
                border: '1px solid ' + (uploadingImage ? 'var(--color-border)' : 'rgba(5,128,155,0.3)'),
                cursor: uploadingImage ? 'not-allowed' : 'pointer',
              }}>
                {uploadingImage && <span className="inline-block animate-spin rounded-full h-4 w-4 border-2" style={{ borderColor: 'rgba(5,128,155,0.25)', borderTopColor: '#05809B' }} />}
                {uploadingImage ? 'Uploading...' : form.image_url ? 'Replace image' : '+ Upload image'}
                <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageChange} disabled={uploadingImage} />
              </label>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>JPG, PNG, or WebP — max 8MB.</p>
          </div>

          <div className="flex gap-3 mt-5">
            <button onClick={handleSubmit} disabled={saving} className="font-bold text-sm cursor-pointer" style={{ background: '#05809B', color: 'white', borderRadius: '100px', padding: '10px 20px', border: 'none', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Project'}
            </button>
            <button onClick={cancelForm} className="font-bold text-sm cursor-pointer" style={{ background: 'none', color: 'var(--text-secondary)', borderRadius: '100px', padding: '10px 20px', border: '1px solid var(--color-border)' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {rows.length === 0 && !showForm ? (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🏗️</div>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)' }}>No projects added yet. Showcase your work to stand out.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {rows.map(row => (
            <div key={row.id}
              draggable
              onDragStart={() => handleDragStart(row.id)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(row.id)}
              style={{ borderRadius: '14px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', overflow: 'hidden', cursor: 'grab', opacity: dragId === row.id ? 0.5 : 1 }}>
              {row.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={row.image_url} alt={row.project_name} style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }} />
              ) : (
                <div style={{ width: '100%', height: '140px', background: 'linear-gradient(135deg, #05809B, #0a4a5c)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 700, fontSize: '14px' }}>{row.project_type || 'Project'}</span>
                </div>
              )}
              <div style={{ padding: '16px' }}>
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '15px' }}>{row.project_name}</span>
                  {row.project_value && (
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '100px', background: 'rgba(5,128,155,0.15)', color: '#05809B', whiteSpace: 'nowrap' }}>{row.project_value}</span>
                  )}
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
                  {[row.role, row.client_or_firm].filter(Boolean).join(' · ')}
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '2px' }}>
                  {[row.location, row.completion_year].filter(Boolean).join(' · ')}
                </p>
                {row.description && (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '8px', lineHeight: '1.6' }}>{row.description}</p>
                )}
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button onClick={() => openEdit(row)}
                    style={{ fontSize: '12px', fontWeight: 700, padding: '6px 14px', borderRadius: '100px', background: 'rgba(5,128,155,0.12)', border: '1px solid rgba(5,128,155,0.3)', color: '#05809B', cursor: 'pointer' }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(row.id)}
                    style={{ fontSize: '12px', fontWeight: 700, padding: '6px 14px', borderRadius: '100px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', cursor: 'pointer' }}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
