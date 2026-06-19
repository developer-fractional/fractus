'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { SoftwareSkill } from '../lib/types'

const inputClass = "w-full rounded-xl px-5 py-4 outline-none transition-all"
const inputStyle = { background: 'var(--color-bg-card)', border: '1.5px solid var(--color-border)', fontSize: '16px', color: 'var(--text-primary)' }
const labelClass = "block font-semibold mb-2"
const labelStyle = { color: 'var(--text-secondary)' }

const PRESET_TOOLS = [
  'Revit', 'AutoCAD', 'Civil 3D', 'Navisworks', 'Bluebeam', 'Procore', 'Primavera P6',
  'MS Project', 'SketchUp', 'Rhino', 'Grasshopper', 'ETABS', 'RAM Structural', 'Tekla',
  'Bentley MicroStation', 'Enscape', 'Lumion', 'Adobe Creative Suite', 'Microsoft 365', 'BIM 360/ACC',
]

const PROFICIENCY_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert']

const PROFICIENCY_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  Beginner: { bg: 'rgba(156,163,175,0.15)', color: '#6B7280', border: '1px solid rgba(156,163,175,0.35)' },
  Intermediate: { bg: 'rgba(5,128,155,0.12)', color: '#05809B', border: '1px solid rgba(5,128,155,0.3)' },
  Advanced: { bg: 'rgba(246,152,32,0.12)', color: '#F6981F', border: '1px solid rgba(246,152,32,0.3)' },
  Expert: { bg: 'rgba(194,65,12,0.14)', color: '#C2410C', border: '1px solid rgba(194,65,12,0.35)' },
}

export default function SoftwareSkillsSection({ userId }: { userId: string }) {
  const [rows, setRows] = useState<SoftwareSkill[]>([])
  const [customTool, setCustomTool] = useState('')
  const [pendingTool, setPendingTool] = useState<string | null>(null)
  const [proficiency, setProficiency] = useState('Intermediate')
  const [yearsUsed, setYearsUsed] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragId, setDragId] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return
    supabase.from('software_skills').select('*').eq('user_id', userId)
      .order('display_order', { ascending: true })
      .then(({ data }) => setRows((data as SoftwareSkill[]) ?? []))
  }, [userId])

  const addedToolNames = new Set(rows.map(r => r.tool_name.toLowerCase()))

  function startAdd(toolName: string) {
    const trimmed = toolName.trim()
    if (!trimmed) return
    setPendingTool(trimmed)
    setProficiency('Intermediate')
    setYearsUsed('')
    setError(null)
  }

  function cancelAdd() {
    setPendingTool(null)
    setError(null)
  }

  async function confirmAdd() {
    if (!userId || !pendingTool) return
    setSaving(true)
    setError(null)
    const nextOrder = rows.length > 0 ? Math.max(...rows.map(r => r.display_order ?? 0)) + 1 : 0
    const payload = {
      user_id: userId,
      tool_name: pendingTool,
      proficiency,
      years_used: yearsUsed ? Number(yearsUsed) : null,
      display_order: nextOrder,
    }
    const { data, error: err } = await supabase.from('software_skills').insert(payload).select().single()
    setSaving(false)
    if (err || !data) { setError('Could not add this tool. Please try again.'); return }
    setRows(prev => [...prev, data as SoftwareSkill])
    setCustomTool('')
    setPendingTool(null)
  }

  async function handleDelete(id: string) {
    await supabase.from('software_skills').delete().eq('id', id)
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
      supabase.from('software_skills').update({ display_order: idx }).eq('id', row.id)
    ))
  }

  return (
    <div className="rounded-2xl border p-8" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
      <h2 className="font-bold mb-2" style={{ fontSize: '22px', color: 'var(--text-primary)' }}>Software &amp; Tools</h2>
      <p className="mb-6" style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Pick the tools you use, then set your proficiency. Drag badges to reorder.</p>

      {error && <p style={{ color: '#f87171', fontSize: '14px', marginBottom: '16px' }}>{error}</p>}

      {/* Quick-add presets */}
      <div className="flex flex-wrap gap-2 mb-4">
        {PRESET_TOOLS.map(tool => {
          const added = addedToolNames.has(tool.toLowerCase())
          return (
            <button key={tool} onClick={() => !added && startAdd(tool)} disabled={added}
              className="text-sm font-semibold"
              style={{
                padding: '8px 16px', borderRadius: '100px', cursor: added ? 'default' : 'pointer',
                background: added ? 'var(--color-border)' : 'none',
                color: added ? 'var(--text-muted)' : '#05809B',
                border: '1px solid ' + (added ? 'var(--color-border)' : 'rgba(5,128,155,0.3)'),
              }}>
              {added ? `✓ ${tool}` : `+ ${tool}`}
            </button>
          )
        })}
      </div>

      {/* Custom tool input */}
      <div className="flex gap-3 flex-wrap mb-6">
        <input type="text" placeholder="Add a custom tool..." value={customTool}
          onChange={e => setCustomTool(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); startAdd(customTool) } }}
          className={inputClass} style={{ ...inputStyle, maxWidth: '280px' }} />
        <button onClick={() => startAdd(customTool)} className="font-bold text-sm cursor-pointer"
          style={{ background: '#05809B', color: 'white', borderRadius: '100px', padding: '10px 20px', border: 'none' }}>
          + Add
        </button>
      </div>

      {/* Inline configure form for the tool just selected */}
      {pendingTool && (
        <div className="mb-6" style={{ padding: '20px', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'var(--color-bg)' }}>
          <p className="mb-4" style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: 700 }}>Adding: {pendingTool}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass} style={labelStyle}>Proficiency</label>
              <select value={proficiency} onChange={e => setProficiency(e.target.value)} className={inputClass} style={inputStyle}>
                {PROFICIENCY_LEVELS.map(level => <option key={level} value={level}>{level}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Years used (optional)</label>
              <input type="number" placeholder="3" value={yearsUsed} onChange={e => setYearsUsed(e.target.value)} className={inputClass} style={inputStyle} />
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={confirmAdd} disabled={saving} className="font-bold text-sm cursor-pointer" style={{ background: '#05809B', color: 'white', borderRadius: '100px', padding: '10px 20px', border: 'none', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Saving...' : 'Add Tool'}
            </button>
            <button onClick={cancelAdd} className="font-bold text-sm cursor-pointer" style={{ background: 'none', color: 'var(--text-secondary)', borderRadius: '100px', padding: '10px 20px', border: '1px solid var(--color-border)' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {rows.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🛠️</div>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)' }}>No tools added yet. Pick from the presets above or add your own.</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {rows.map(row => {
            const style = PROFICIENCY_STYLES[row.proficiency] ?? PROFICIENCY_STYLES.Intermediate
            return (
              <div key={row.id}
                draggable
                onDragStart={() => handleDragStart(row.id)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(row.id)}
                className="flex items-center gap-2"
                style={{ padding: '8px 8px 8px 16px', borderRadius: '100px', background: style.bg, border: style.border, cursor: 'grab', opacity: dragId === row.id ? 0.5 : 1 }}>
                <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}>{row.tool_name}</span>
                <span style={{ fontWeight: 700, fontSize: '12px', color: style.color }}>
                  {row.proficiency}{row.years_used ? ` · ${row.years_used}yr` : ''}
                </span>
                <button onClick={() => handleDelete(row.id)} aria-label={`Remove ${row.tool_name}`}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: style.color, fontSize: '15px', fontWeight: 700, lineHeight: 1, padding: '0 4px' }}>
                  ×
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
