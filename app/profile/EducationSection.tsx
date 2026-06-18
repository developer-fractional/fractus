'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Education } from '../lib/types'

const inputClass = "w-full rounded-xl px-5 py-4 outline-none transition-all"
const inputStyle = { background: 'var(--color-bg-card)', border: '1.5px solid var(--color-border)', fontSize: '16px', color: 'var(--text-primary)' }
const labelClass = "block font-semibold mb-2"
const labelStyle = { color: 'var(--text-secondary)' }

const emptyForm = { school: '', degree: '', field_of_study: '', start_year: '', end_year: '', description: '' }

export default function EducationSection({ userId }: { userId: string }) {
  const [rows, setRows] = useState<Education[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return
    supabase.from('education').select('*').eq('user_id', userId)
      .order('start_year', { ascending: false, nullsFirst: false })
      .then(({ data }) => setRows((data as Education[]) ?? []))
  }, [userId])

  function openAdd() {
    setForm(emptyForm)
    setEditingId(null)
    setError(null)
    setShowForm(true)
  }

  function openEdit(row: Education) {
    setForm({
      school: row.school ?? '',
      degree: row.degree ?? '',
      field_of_study: row.field_of_study ?? '',
      start_year: row.start_year != null ? String(row.start_year) : '',
      end_year: row.end_year != null ? String(row.end_year) : '',
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
    if (!form.school.trim()) { setError('School is required.'); return }
    setSaving(true)
    setError(null)
    const payload = {
      user_id: userId,
      school: form.school.trim(),
      degree: form.degree.trim() || null,
      field_of_study: form.field_of_study.trim() || null,
      start_year: form.start_year ? Number(form.start_year) : null,
      end_year: form.end_year ? Number(form.end_year) : null,
      description: form.description.trim() || null,
    }

    if (editingId) {
      const { data, error: err } = await supabase.from('education').update(payload).eq('id', editingId).select().single()
      setSaving(false)
      if (err || !data) { setError('Could not save changes. Please try again.'); return }
      setRows(prev => prev.map(r => r.id === editingId ? (data as Education) : r))
      cancelForm()
    } else {
      const { data, error: err } = await supabase.from('education').insert(payload).select().single()
      setSaving(false)
      if (err || !data) { setError('Could not add this entry. Please try again.'); return }
      setRows(prev => [data as Education, ...prev])
      cancelForm()
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this education entry? This cannot be undone.')) return
    await supabase.from('education').delete().eq('id', id)
    setRows(prev => prev.filter(r => r.id !== id))
  }

  return (
    <div className="rounded-2xl border p-8" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
      <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
        <h2 className="font-bold" style={{ fontSize: '22px', color: 'var(--text-primary)' }}>Education</h2>
        {!showForm && (
          <button onClick={openAdd} className="font-bold text-sm cursor-pointer" style={{ background: '#05809B', color: 'white', borderRadius: '100px', padding: '10px 20px', border: 'none' }}>
            + Add Education
          </button>
        )}
      </div>
      <p className="mb-6" style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Schools, degrees, and fields of study.</p>

      {error && <p style={{ color: '#f87171', fontSize: '14px', marginBottom: '16px' }}>{error}</p>}

      {showForm && (
        <div className="mb-6" style={{ padding: '20px', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'var(--color-bg)' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass} style={labelStyle}>School *</label>
              <input type="text" placeholder="University of Example" value={form.school} onChange={e => setForm({ ...form, school: e.target.value })} className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Degree</label>
              <input type="text" placeholder="B.Arch" value={form.degree} onChange={e => setForm({ ...form, degree: e.target.value })} className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Field of study</label>
              <input type="text" placeholder="Architecture" value={form.field_of_study} onChange={e => setForm({ ...form, field_of_study: e.target.value })} className={inputClass} style={inputStyle} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass} style={labelStyle}>Start year</label>
                <input type="number" placeholder="2014" value={form.start_year} onChange={e => setForm({ ...form, start_year: e.target.value })} className={inputClass} style={inputStyle} />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>End year</label>
                <input type="number" placeholder="2018" value={form.end_year} onChange={e => setForm({ ...form, end_year: e.target.value })} className={inputClass} style={inputStyle} />
              </div>
            </div>
          </div>
          <div className="mt-5">
            <label className={labelClass} style={labelStyle}>Description</label>
            <textarea placeholder="Honors, activities, relevant coursework..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className={inputClass} style={{ ...inputStyle, resize: 'none' }} />
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={handleSubmit} disabled={saving} className="font-bold text-sm cursor-pointer" style={{ background: '#05809B', color: 'white', borderRadius: '100px', padding: '10px 20px', border: 'none', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Education'}
            </button>
            <button onClick={cancelForm} className="font-bold text-sm cursor-pointer" style={{ background: 'none', color: 'var(--text-secondary)', borderRadius: '100px', padding: '10px 20px', border: '1px solid var(--color-border)' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {rows.length === 0 && !showForm ? (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎓</div>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)' }}>No education added yet. Add your schools and degrees.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map(row => (
            <div key={row.id} className="flex items-start justify-between gap-3 flex-wrap" style={{ padding: '14px 18px', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'var(--color-bg)' }}>
              <div style={{ minWidth: 0 }}>
                <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '14px' }}>{row.school}</span>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>
                  {[row.degree, row.field_of_study].filter(Boolean).join(', ')}
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '2px' }}>
                  {row.start_year ?? ''}{(row.start_year || row.end_year) ? ' – ' : ''}{row.end_year ?? (row.start_year ? 'Present' : '')}
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
