'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { WorkExperience } from '../lib/types'

const inputClass = "w-full rounded-xl px-5 py-4 outline-none transition-all"
const inputStyle = { background: 'var(--color-bg-card)', border: '1.5px solid var(--color-border)', fontSize: '16px', color: 'var(--text-primary)' }
const labelClass = "block font-semibold mb-2"
const labelStyle = { color: 'var(--text-secondary)' }

const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship', 'Temporary']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const emptyForm = {
  company: '', title: '', location: '', employment_type: '',
  start_month: '', start_year: '', end_month: '', end_year: '',
  is_current: false, description: '',
}

function formatMonthYear(month: number | null, year: number | null) {
  if (!year) return ''
  return month ? `${MONTHS[month - 1]} ${year}` : `${year}`
}

export default function WorkExperienceSection({ userId }: { userId: string }) {
  const [rows, setRows] = useState<WorkExperience[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return
    supabase.from('work_experience').select('*').eq('user_id', userId)
      .order('start_year', { ascending: false, nullsFirst: false })
      .order('start_month', { ascending: false, nullsFirst: false })
      .then(({ data }) => setRows((data as WorkExperience[]) ?? []))
  }, [userId])

  function openAdd() {
    setForm(emptyForm)
    setEditingId(null)
    setError(null)
    setShowForm(true)
  }

  function openEdit(row: WorkExperience) {
    setForm({
      company: row.company ?? '',
      title: row.title ?? '',
      location: row.location ?? '',
      employment_type: row.employment_type ?? '',
      start_month: row.start_month != null ? String(row.start_month) : '',
      start_year: row.start_year != null ? String(row.start_year) : '',
      end_month: row.end_month != null ? String(row.end_month) : '',
      end_year: row.end_year != null ? String(row.end_year) : '',
      is_current: !!row.is_current,
      description: row.description ?? '',
    })
    setEditingId(row.id)
    setError(null)
    setShowForm(true)
  }

  function cancelForm() {
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
    setError(null)
  }

  async function handleSubmit() {
    if (!userId) return
    if (!form.company.trim() || !form.title.trim()) { setError('Company and title are required.'); return }
    setSaving(true)
    setError(null)
    const payload = {
      user_id: userId,
      company: form.company.trim(),
      title: form.title.trim(),
      location: form.location.trim() || null,
      employment_type: form.employment_type || null,
      start_month: form.start_month ? Number(form.start_month) : null,
      start_year: form.start_year ? Number(form.start_year) : null,
      end_month: form.is_current ? null : (form.end_month ? Number(form.end_month) : null),
      end_year: form.is_current ? null : (form.end_year ? Number(form.end_year) : null),
      is_current: form.is_current,
      description: form.description.trim() || null,
    }

    if (editingId) {
      const { data, error: err } = await supabase.from('work_experience').update(payload).eq('id', editingId).select().single()
      setSaving(false)
      if (err || !data) { setError('Could not save changes. Please try again.'); return }
      setRows(prev => prev.map(r => r.id === editingId ? (data as WorkExperience) : r))
      cancelForm()
    } else {
      const { data, error: err } = await supabase.from('work_experience').insert(payload).select().single()
      setSaving(false)
      if (err || !data) { setError('Could not add this entry. Please try again.'); return }
      setRows(prev => [data as WorkExperience, ...prev])
      cancelForm()
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this work experience entry? This cannot be undone.')) return
    await supabase.from('work_experience').delete().eq('id', id)
    setRows(prev => prev.filter(r => r.id !== id))
  }

  return (
    <div className="rounded-2xl border p-8" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
      <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
        <h2 className="font-bold" style={{ fontSize: '22px', color: 'var(--text-primary)' }}>Work Experience</h2>
        {!showForm && (
          <button onClick={openAdd} className="font-bold text-sm cursor-pointer" style={{ background: '#05809B', color: 'white', borderRadius: '100px', padding: '10px 20px', border: 'none' }}>
            + Add Experience
          </button>
        )}
      </div>
      <p className="mb-6" style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Companies, roles, and dates.</p>

      {error && <p style={{ color: '#f87171', fontSize: '14px', marginBottom: '16px' }}>{error}</p>}

      {showForm && (
        <div className="mb-6" style={{ padding: '20px', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'var(--color-bg)' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass} style={labelStyle}>Company *</label>
              <input type="text" placeholder="Acme Architecture" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Job title *</label>
              <input type="text" placeholder="Project Architect" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Location</label>
              <input type="text" placeholder="New York, NY" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Employment type</label>
              <select value={form.employment_type} onChange={e => setForm({ ...form, employment_type: e.target.value })} className={inputClass} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="">Select type</option>
                {EMPLOYMENT_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
            <div>
              <label className={labelClass} style={labelStyle}>Start date</label>
              <div className="grid grid-cols-2 gap-3">
                <select value={form.start_month} onChange={e => setForm({ ...form, start_month: e.target.value })} className={inputClass} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="">Month</option>
                  {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                </select>
                <input type="number" placeholder="Year" value={form.start_year} onChange={e => setForm({ ...form, start_year: e.target.value })} className={inputClass} style={inputStyle} />
              </div>
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>End date</label>
              <div className="grid grid-cols-2 gap-3">
                <select disabled={form.is_current} value={form.end_month} onChange={e => setForm({ ...form, end_month: e.target.value })} className={inputClass} style={{ ...inputStyle, cursor: form.is_current ? 'not-allowed' : 'pointer', opacity: form.is_current ? 0.5 : 1 }}>
                  <option value="">Month</option>
                  {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                </select>
                <input type="number" placeholder="Year" disabled={form.is_current} value={form.end_year} onChange={e => setForm({ ...form, end_year: e.target.value })} className={inputClass} style={{ ...inputStyle, opacity: form.is_current ? 0.5 : 1 }} />
              </div>
            </div>
          </div>

          <label className="flex items-center gap-2 mt-4 cursor-pointer" style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 600 }}>
            <input type="checkbox" checked={form.is_current} onChange={e => setForm({ ...form, is_current: e.target.checked })} />
            I currently work here
          </label>

          <div className="mt-5">
            <label className={labelClass} style={labelStyle}>Description</label>
            <textarea placeholder="Key responsibilities and achievements..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className={inputClass} style={{ ...inputStyle, resize: 'none' }} />
          </div>

          <div className="flex gap-3 mt-5">
            <button onClick={handleSubmit} disabled={saving} className="font-bold text-sm cursor-pointer" style={{ background: '#05809B', color: 'white', borderRadius: '100px', padding: '10px 20px', border: 'none', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Experience'}
            </button>
            <button onClick={cancelForm} className="font-bold text-sm cursor-pointer" style={{ background: 'none', color: 'var(--text-secondary)', borderRadius: '100px', padding: '10px 20px', border: '1px solid var(--color-border)' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {rows.length === 0 && !showForm ? (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>💼</div>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)' }}>No work experience added yet. Add your roles and companies.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map(row => (
            <div key={row.id} className="flex items-start justify-between gap-3 flex-wrap" style={{ padding: '14px 18px', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'var(--color-bg)' }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '14px' }}>{row.title}</span>
                  {row.is_current && (
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '100px', background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>Current</span>
                  )}
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>
                  {row.company}{row.location ? ` · ${row.location}` : ''}
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '2px' }}>
                  {formatMonthYear(row.start_month, row.start_year)} – {row.is_current ? 'Present' : (formatMonthYear(row.end_month, row.end_year) || 'Present')}
                </p>
                {row.description && (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '6px', lineHeight: '1.6' }}>{row.description}</p>
                )}
              </div>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
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
          ))}
        </div>
      )}
    </div>
  )
}
