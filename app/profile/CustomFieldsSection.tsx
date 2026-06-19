'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { CustomField } from '../lib/types'

const inputClass = "w-full rounded-xl px-5 py-4 outline-none transition-all"
const inputStyle = { background: 'var(--color-bg-card)', border: '1.5px solid var(--color-border)', fontSize: '16px', color: 'var(--text-primary)' }
const labelClass = "block font-semibold mb-2"
const labelStyle = { color: 'var(--text-secondary)' }

const emptyForm = { field_label: '', field_value: '' }

export default function CustomFieldsSection({ userId }: { userId: string }) {
  const [rows, setRows] = useState<CustomField[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragId, setDragId] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return
    supabase.from('custom_fields').select('*').eq('user_id', userId)
      .order('display_order', { ascending: true })
      .then(({ data }) => setRows((data as CustomField[]) ?? []))
  }, [userId])

  function openAdd() {
    setForm(emptyForm)
    setEditingId(null)
    setError(null)
    setShowForm(true)
  }

  function openEdit(row: CustomField) {
    setForm({ field_label: row.field_label, field_value: row.field_value })
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
    if (!form.field_label.trim() || !form.field_value.trim()) { setError('Both a label and a value are required.'); return }
    setSaving(true)
    setError(null)

    if (editingId) {
      const payload = { field_label: form.field_label.trim(), field_value: form.field_value.trim() }
      const { data, error: err } = await supabase.from('custom_fields').update(payload).eq('id', editingId).select().single()
      setSaving(false)
      if (err || !data) { setError('Could not save changes. Please try again.'); return }
      setRows(prev => prev.map(r => r.id === editingId ? (data as CustomField) : r))
      cancelForm()
    } else {
      const nextOrder = rows.length > 0 ? Math.max(...rows.map(r => r.display_order ?? 0)) + 1 : 0
      const payload = {
        user_id: userId,
        field_label: form.field_label.trim(),
        field_value: form.field_value.trim(),
        display_order: nextOrder,
      }
      const { data, error: err } = await supabase.from('custom_fields').insert(payload).select().single()
      setSaving(false)
      if (err || !data) { setError('Could not add this field. Please try again.'); return }
      setRows(prev => [...prev, data as CustomField])
      cancelForm()
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this field? This cannot be undone.')) return
    await supabase.from('custom_fields').delete().eq('id', id)
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
      supabase.from('custom_fields').update({ display_order: idx }).eq('id', row.id)
    ))
  }

  return (
    <div className="rounded-2xl border p-8" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
      <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
        <h2 className="font-bold" style={{ fontSize: '22px', color: 'var(--text-primary)' }}>Custom Fields</h2>
        {!showForm && (
          <button onClick={openAdd} className="font-bold text-sm cursor-pointer" style={{ background: '#05809B', color: 'white', borderRadius: '100px', padding: '10px 20px', border: 'none' }}>
            + Add Field
          </button>
        )}
      </div>
      <p className="mb-6" style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Add anything else employers should know — specialties, languages, publications, anything that doesn&apos;t fit elsewhere. Drag to reorder.</p>

      {error && <p style={{ color: '#f87171', fontSize: '14px', marginBottom: '16px' }}>{error}</p>}

      {showForm && (
        <div className="mb-6" style={{ padding: '20px', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'var(--color-bg)' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass} style={labelStyle}>Label *</label>
              <input type="text" placeholder="Specialization" value={form.field_label} onChange={e => setForm({ ...form, field_label: e.target.value })} className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Value *</label>
              <input type="text" placeholder="Passive House Design" value={form.field_value} onChange={e => setForm({ ...form, field_value: e.target.value })} className={inputClass} style={inputStyle} />
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={handleSubmit} disabled={saving} className="font-bold text-sm cursor-pointer" style={{ background: '#05809B', color: 'white', borderRadius: '100px', padding: '10px 20px', border: 'none', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Field'}
            </button>
            <button onClick={cancelForm} className="font-bold text-sm cursor-pointer" style={{ background: 'none', color: 'var(--text-secondary)', borderRadius: '100px', padding: '10px 20px', border: '1px solid var(--color-border)' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {rows.length === 0 && !showForm ? (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>✨</div>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)' }}>No custom fields yet. Add anything that doesn&apos;t fit elsewhere.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map(row => (
            <div key={row.id}
              draggable
              onDragStart={() => handleDragStart(row.id)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(row.id)}
              className="flex items-start justify-between gap-3 flex-wrap"
              style={{ padding: '14px 18px', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', cursor: 'grab', opacity: dragId === row.id ? 0.5 : 1 }}>
              <div style={{ minWidth: 0 }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{row.field_label}</span>
                <p style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '14px', marginTop: '2px' }}>{row.field_value}</p>
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
