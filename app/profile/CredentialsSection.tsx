'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Credential } from '../lib/types'

const inputClass = "w-full rounded-xl px-5 py-4 outline-none transition-all"
const inputStyle = { background: 'var(--color-bg-card)', border: '1.5px solid var(--color-border)', fontSize: '16px', color: 'var(--text-primary)' }
const labelClass = "block font-semibold mb-2"
const labelStyle = { color: 'var(--text-secondary)' }

const emptyForm = {
  name: '', issuing_organization: '', license_number: '', state: '',
  issue_year: '', expiration_year: '', credential_url: '',
}

export default function CredentialsSection({ userId }: { userId: string }) {
  const [rows, setRows] = useState<Credential[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return
    supabase.from('credentials').select('*').eq('user_id', userId)
      .order('issue_year', { ascending: false, nullsFirst: false })
      .then(({ data }) => setRows((data as Credential[]) ?? []))
  }, [userId])

  function openAdd() {
    setForm(emptyForm)
    setEditingId(null)
    setError(null)
    setShowForm(true)
  }

  function openEdit(row: Credential) {
    setForm({
      name: row.name ?? '',
      issuing_organization: row.issuing_organization ?? '',
      license_number: row.license_number ?? '',
      state: row.state ?? '',
      issue_year: row.issue_year != null ? String(row.issue_year) : '',
      expiration_year: row.expiration_year != null ? String(row.expiration_year) : '',
      credential_url: row.credential_url ?? '',
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
    if (!form.name.trim()) { setError('Credential name is required.'); return }
    setSaving(true)
    setError(null)
    const payload = {
      user_id: userId,
      name: form.name.trim(),
      issuing_organization: form.issuing_organization.trim() || null,
      license_number: form.license_number.trim() || null,
      state: form.state.trim() || null,
      issue_year: form.issue_year ? Number(form.issue_year) : null,
      expiration_year: form.expiration_year ? Number(form.expiration_year) : null,
      credential_url: form.credential_url.trim() || null,
    }

    if (editingId) {
      const { data, error: err } = await supabase.from('credentials').update(payload).eq('id', editingId).select().single()
      setSaving(false)
      if (err || !data) { setError('Could not save changes. Please try again.'); return }
      setRows(prev => prev.map(r => r.id === editingId ? (data as Credential) : r))
      cancelForm()
    } else {
      const { data, error: err } = await supabase.from('credentials').insert(payload).select().single()
      setSaving(false)
      if (err || !data) { setError('Could not add this entry. Please try again.'); return }
      setRows(prev => [data as Credential, ...prev])
      cancelForm()
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this credential? This cannot be undone.')) return
    await supabase.from('credentials').delete().eq('id', id)
    setRows(prev => prev.filter(r => r.id !== id))
  }

  return (
    <div className="rounded-2xl border p-8" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
      <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
        <h2 className="font-bold" style={{ fontSize: '22px', color: 'var(--text-primary)' }}>Licenses & Certifications</h2>
        {!showForm && (
          <button onClick={openAdd} className="font-bold text-sm cursor-pointer" style={{ background: '#05809B', color: 'white', borderRadius: '100px', padding: '10px 20px', border: 'none' }}>
            + Add Credential
          </button>
        )}
      </div>
      <p className="mb-6" style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Licenses, registrations, and professional certifications.</p>

      {error && <p style={{ color: '#f87171', fontSize: '14px', marginBottom: '16px' }}>{error}</p>}

      {showForm && (
        <div className="mb-6" style={{ padding: '20px', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'var(--color-bg)' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass} style={labelStyle}>Credential name *</label>
              <input type="text" placeholder="Licensed Architect (PE)" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Issuing organization</label>
              <input type="text" placeholder="NCARB" value={form.issuing_organization} onChange={e => setForm({ ...form, issuing_organization: e.target.value })} className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>License number</label>
              <input type="text" placeholder="AR123456" value={form.license_number} onChange={e => setForm({ ...form, license_number: e.target.value })} className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>State</label>
              <input type="text" placeholder="NY" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Issue year</label>
              <input type="number" placeholder="2019" value={form.issue_year} onChange={e => setForm({ ...form, issue_year: e.target.value })} className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Expiration year</label>
              <input type="number" placeholder="2026" value={form.expiration_year} onChange={e => setForm({ ...form, expiration_year: e.target.value })} className={inputClass} style={inputStyle} />
            </div>
          </div>
          <div className="mt-5">
            <label className={labelClass} style={labelStyle}>Credential URL</label>
            <input type="url" placeholder="https://verify.example.com/..." value={form.credential_url} onChange={e => setForm({ ...form, credential_url: e.target.value })} className={inputClass} style={inputStyle} />
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={handleSubmit} disabled={saving} className="font-bold text-sm cursor-pointer" style={{ background: '#05809B', color: 'white', borderRadius: '100px', padding: '10px 20px', border: 'none', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Credential'}
            </button>
            <button onClick={cancelForm} className="font-bold text-sm cursor-pointer" style={{ background: 'none', color: 'var(--text-secondary)', borderRadius: '100px', padding: '10px 20px', border: '1px solid var(--color-border)' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {rows.length === 0 && !showForm ? (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>📜</div>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)' }}>No licenses or certifications added yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map(row => (
            <div key={row.id} className="flex items-start justify-between gap-3 flex-wrap" style={{ padding: '14px 18px', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'var(--color-bg)' }}>
              <div style={{ minWidth: 0 }}>
                <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '14px' }}>{row.name}</span>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>
                  {[row.issuing_organization, row.license_number, row.state].filter(Boolean).join(' · ')}
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '2px' }}>
                  {row.issue_year ? `Issued ${row.issue_year}` : ''}{row.expiration_year ? `${row.issue_year ? ' · ' : ''}Expires ${row.expiration_year}` : ''}
                </p>
                {row.credential_url && (
                  <a href={row.credential_url} target="_blank" rel="noopener noreferrer" style={{ color: '#05809B', fontSize: '12px', fontWeight: 700, marginTop: '4px', display: 'inline-block' }}>
                    View credential →
                  </a>
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
