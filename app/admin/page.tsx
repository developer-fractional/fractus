'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { Profile, Listing, AdminApplication } from '../lib/types'

const SUPERADMIN = 'development@fractionalaeco.com'
const ROLES = ['Fractional Professional', 'Contractor', 'Architect', 'Engineer', 'Owner / Operator', 'Employer / Hiring']
const DISCIPLINES = ['Architecture', 'Structural Engineering', 'MEP Engineering', 'Civil Engineering', 'Construction Management', 'BIM/VDC', 'Sustainability', 'Owner/Operator', 'Project Controls', 'Cost Management', 'Interior Design', 'Urban Planning']

type AddUserForm = { name: string; email: string; role: string; discipline: string; is_admin: boolean }

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [users, setUsers] = useState<Profile[]>([])
  const [listings, setListings] = useState<Listing[]>([])
  const [applications, setApplications] = useState<AdminApplication[]>([])
  const [stats, setStats] = useState({ users: 0, listings: 0, verified: 0, applications: 0 })
  const [userSearch, setUserSearch] = useState('')
  const [appStatusFilter, setAppStatusFilter] = useState('all')

  // Add user modal
  const [showAddUser, setShowAddUser] = useState(false)
  const [addForm, setAddForm] = useState<AddUserForm>({ name: '', email: '', role: '', discipline: '', is_admin: false })
  const [addLoading, setAddLoading] = useState(false)
  const [addMsg, setAddMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Role inline edit
  const [roleEditId, setRoleEditId] = useState<string | null>(null)

  // Admin toggle error
  const [adminError, setAdminError] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { window.location.href = '/login'; return }
      setUser(data.user)
      const { data: profile } = await supabase
        .from('profiles').select('is_admin').eq('id', data.user.id).single()
      if (!profile?.is_admin) { window.location.href = '/dashboard'; return }
      loadAll()
      setLoading(false)
    })
  }, [])

  async function loadAll() {
    const [{ data: u }, { data: l }, { data: a }] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('listings').select('*').order('created_at', { ascending: false }),
      supabase.from('applications')
        .select('id, status, created_at, listings(title, company), profiles(name, email)')
        .order('created_at', { ascending: false }),
    ])
    setUsers(u || [])
    setListings(l || [])
    setApplications((a as unknown as AdminApplication[]) ?? [])
    setStats({
      users:        u?.length || 0,
      listings:     l?.length || 0,
      verified:     u?.filter(x => x.is_verified).length || 0,
      applications: a?.length ?? 0,
    })
  }

  async function toggleVerified(userId: string, current: boolean) {
    const newVal = !current
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_verified: newVal } : u))
    setStats(prev => ({ ...prev, verified: prev.verified + (newVal ? 1 : -1) }))
    await supabase.from('profiles').update({ is_verified: newVal }).eq('id', userId)
  }

  async function toggleListing(id: string, current: string) {
    const newStatus = current === 'active' ? 'closed' : 'active'
    setListings(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l))
    await supabase.from('listings').update({ status: newStatus }).eq('id', id)
  }

  async function deleteUser(userId: string) {
    if (!confirm('Delete this user?')) return
    setUsers(prev => prev.filter(u => u.id !== userId))
    await supabase.from('profiles').delete().eq('id', userId)
  }

  async function deleteListing(id: string) {
    if (!confirm('Delete this listing?')) return
    setListings(prev => prev.filter(l => l.id !== id))
    await supabase.from('listings').delete().eq('id', id)
  }

  async function handleAddUser() {
    if (!addForm.name.trim() || !addForm.email.trim()) {
      setAddMsg({ type: 'error', text: 'Name and email are required.' })
      return
    }
    setAddLoading(true)
    setAddMsg(null)
    const newId = crypto.randomUUID()
    const now = new Date().toISOString()
    const newProfile: any = {
      id: newId,
      name: addForm.name.trim(),
      email: addForm.email.trim(),
      role: addForm.role || null,
      discipline: addForm.discipline || null,
      is_admin: addForm.is_admin,
      is_verified: false,
      created_at: now,
      updated_at: now,
    }
    const { error } = await supabase.from('profiles').insert(newProfile)
    setAddLoading(false)
    if (error) {
      setAddMsg({ type: 'error', text: error.message })
    } else {
      setUsers(prev => [newProfile, ...prev])
      setStats(prev => ({ ...prev, users: prev.users + 1 }))
      setAddMsg({ type: 'success', text: `${addForm.name} added successfully.` })
      setAddForm({ name: '', email: '', role: '', discipline: '', is_admin: false })
    }
  }

  async function changeRole(userId: string, newRole: string) {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
    setRoleEditId(null)
    await supabase.from('profiles').update({ role: newRole }).eq('id', userId)
  }

  async function toggleAdmin(userId: string, email: string, currentIsAdmin: boolean) {
    setAdminError(null)
    if (email === SUPERADMIN && currentIsAdmin) {
      setAdminError('Cannot remove superadmin permissions.')
      setTimeout(() => setAdminError(null), 4000)
      return
    }
    const newVal = !currentIsAdmin
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_admin: newVal } : u))
    await supabase.from('profiles').update({ is_admin: newVal }).eq('id', userId)
  }

  const isFrAECO = (email?: string | null) => !!email?.endsWith('@fractionalaeco.com')

  function fmtDate(iso?: string | null) {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  function csvEscape(value: unknown): string {
    const str = value === null || value === undefined ? '' : String(value)
    if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`
    return str
  }

  function downloadCsv(filename: string, headers: string[], rows: unknown[][]) {
    const lines = [headers, ...rows].map(row => row.map(csvEscape).join(','))
    const csv = lines.join('\r\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  function exportUsersCsv() {
    const headers = ['Name', 'Email', 'Role', 'Discipline', 'Joined', 'Verified', 'Admin']
    const rows = filteredUsers.map(u => [
      u.name ?? '',
      u.email ?? '',
      u.role ?? '',
      u.discipline ?? '',
      fmtDate((u as any).created_at),
      u.is_verified ? 'Yes' : 'No',
      (u as any).is_admin ? 'Yes' : 'No',
    ])
    downloadCsv(`fractus-users-${new Date().toISOString().slice(0, 10)}.csv`, headers, rows)
  }

  function exportListingsCsv() {
    const headers = ['Title', 'Company', 'Discipline', 'Type', 'Rate', 'Location', 'Remote', 'Status', 'Posted']
    const rows = listings.map(l => [
      l.title ?? '',
      l.company ?? '',
      l.discipline ?? '',
      l.engagement_type ?? '',
      l.rate ?? '',
      l.location ?? '',
      l.remote ? 'Yes' : 'No',
      l.status ?? '',
      fmtDate(l.created_at),
    ])
    downloadCsv(`fractus-listings-${new Date().toISOString().slice(0, 10)}.csv`, headers, rows)
  }

  function exportApplicationsCsv() {
    const headers = ['Applicant', 'Applicant Email', 'Listing', 'Company', 'Status', 'Applied']
    const rows = applications.map(a => [
      a.profiles?.name ?? '',
      a.profiles?.email ?? '',
      a.listings?.title ?? '',
      a.listings?.company ?? '',
      a.status ?? '',
      fmtDate(a.created_at),
    ])
    downloadCsv(`fractus-applications-${new Date().toISOString().slice(0, 10)}.csv`, headers, rows)
  }

  if (loading) return (
    <div style={{ background: '#0F1117', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#F6981F', fontSize: '20px', fontFamily: "'Nunito Sans', sans-serif" }}>Loading admin panel...</p>
    </div>
  )

  const tabStyle = (tab: string) => ({
    padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 700,
    cursor: 'pointer', border: 'none',
    background: activeTab === tab ? '#F6981F' : '#1B2130',
    color: activeTab === tab ? 'white' : '#8892A4',
    fontFamily: "'Nunito Sans', sans-serif",
  })

  const inputSt: React.CSSProperties = {
    width: '100%', background: '#0F1117', border: '1px solid #2A3145', borderRadius: '8px',
    padding: '10px 14px', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
    fontFamily: "'Nunito Sans', sans-serif",
  }
  const labelSt: React.CSSProperties = { color: '#8892A4', fontSize: '12px', fontWeight: 700, marginBottom: '6px', display: 'block', letterSpacing: '0.05em' }

  const filteredUsers = users.filter(u =>
    !userSearch ||
    u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email?.toLowerCase().includes(userSearch.toLowerCase())
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0F1117', fontFamily: "'Nunito Sans', sans-serif" }}>

      {/* Add User Modal */}
      {showAddUser && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
          onClick={e => { if (e.target === e.currentTarget) setShowAddUser(false) }}>
          <div style={{ background: '#1B2130', border: '1px solid #2A3145', borderRadius: '20px', padding: '36px', width: '100%', maxWidth: '480px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <h2 style={{ color: 'white', fontSize: '22px', fontWeight: 800, fontFamily: "'Nunito', sans-serif" }}>Add User</h2>
              <button onClick={() => { setShowAddUser(false); setAddMsg(null) }}
                style={{ background: 'transparent', border: 'none', color: '#4A5568', fontSize: '22px', cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelSt}>FULL NAME *</label>
                <input style={inputSt} placeholder="Jane Smith" value={addForm.name}
                  onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label style={labelSt}>EMAIL *</label>
                <input style={inputSt} type="email" placeholder="jane@firm.com" value={addForm.email}
                  onChange={e => setAddForm(f => ({ ...f, email: e.target.value, is_admin: f.is_admin && isFrAECO(e.target.value) }))} />
              </div>
              <div>
                <label style={labelSt}>ROLE</label>
                <select style={inputSt} value={addForm.role} onChange={e => setAddForm(f => ({ ...f, role: e.target.value }))}>
                  <option value="">Select role...</option>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label style={labelSt}>DISCIPLINE</label>
                <select style={inputSt} value={addForm.discipline} onChange={e => setAddForm(f => ({ ...f, discipline: e.target.value }))}>
                  <option value="">Select discipline...</option>
                  {DISCIPLINES.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              {isFrAECO(addForm.email) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', background: 'rgba(246,152,32,0.08)', borderRadius: '10px', border: '1px solid rgba(246,152,32,0.2)' }}>
                  <input type="checkbox" id="is_admin_toggle" checked={addForm.is_admin}
                    onChange={e => setAddForm(f => ({ ...f, is_admin: e.target.checked }))}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#F6981F' }} />
                  <label htmlFor="is_admin_toggle" style={{ color: '#F6981F', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
                    Grant admin access
                  </label>
                </div>
              )}

              {addMsg && (
                <div style={{ padding: '12px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 600,
                  background: addMsg.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(255,107,107,0.1)',
                  border: `1px solid ${addMsg.type === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(255,107,107,0.3)'}`,
                  color: addMsg.type === 'success' ? '#22c55e' : '#FF8888' }}>
                  {addMsg.text}
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button onClick={() => { setShowAddUser(false); setAddMsg(null) }}
                  style={{ flex: 1, background: 'transparent', border: '1px solid #2A3145', borderRadius: '100px', padding: '13px', color: '#8892A4', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button onClick={handleAddUser} disabled={addLoading}
                  style={{ flex: 2, background: '#F6981F', border: 'none', borderRadius: '100px', padding: '13px', color: 'white', fontSize: '14px', fontWeight: 700, cursor: addLoading ? 'not-allowed' : 'pointer', opacity: addLoading ? 0.7 : 1 }}>
                  {addLoading ? 'Adding...' : 'Add User'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top bar */}
      <div style={{ background: '#F6981F', color: 'white', textAlign: 'center', padding: '9px 16px', fontSize: '13px', fontWeight: 700 }}>
        Powered by <a href="https://www.fractionalaeco.com" target="_blank" style={{ color: 'white', textDecoration: 'underline' }}>Fractional AECO</a> · Admin Panel
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 48px', borderBottom: '1px solid #2A3145', background: '#0F1117' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '24px', fontWeight: 800, color: '#F6981F', fontFamily: "'Nunito', sans-serif" }}>Fractus</span>
          </Link>
          <span style={{ fontSize: '12px', color: '#F6981F', fontWeight: 700, background: 'rgba(246,152,31,0.15)', padding: '3px 10px', borderRadius: '100px', border: '1px solid rgba(246,152,31,0.3)' }}>ADMIN</span>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link href="/dashboard" style={{ color: '#8892A4', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>← Back to Dashboard</Link>
          <span style={{ color: '#4A5568', fontSize: '14px' }}>{user?.email}</span>
        </div>
      </nav>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 48px' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '36px' }}>
          {[
            { label: 'Total Users',        value: stats.users,        color: '#F6981F' },
            { label: 'Total Listings',     value: stats.listings,     color: '#05809B' },
            { label: 'Total Applications', value: stats.applications, color: '#F6981F' },
            { label: 'Verified Talent',    value: stats.verified,     color: '#05809B' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#1B2130', border: '1px solid #2A3145', borderRadius: '12px', padding: '24px' }}>
              <div style={{ color: s.color, fontSize: '36px', fontWeight: 800, fontFamily: "'Nunito', sans-serif" }}>{s.value}</div>
              <div style={{ color: '#8892A4', fontSize: '14px', fontWeight: 600, marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
          <button style={tabStyle('overview')} onClick={() => setActiveTab('overview')}>Overview</button>
          <button style={tabStyle('users')} onClick={() => setActiveTab('users')}>Users ({stats.users})</button>
          <button style={tabStyle('listings')} onClick={() => setActiveTab('listings')}>Listings ({stats.listings})</button>
          <button style={tabStyle('applications')} onClick={() => setActiveTab('applications')}>Applications ({stats.applications})</button>
        </div>

        {/* Overview tab */}
        {activeTab === 'overview' && (
          <div>
            <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 800, fontFamily: "'Nunito', sans-serif", marginBottom: '20px' }}>Recent Users</h2>
            <div style={{ background: '#1B2130', border: '1px solid #2A3145', borderRadius: '12px', overflow: 'hidden', marginBottom: '32px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #2A3145' }}>
                    {['Name', 'Email', 'Discipline', 'Verified', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '14px 20px', textAlign: 'left', color: '#4A5568', fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.slice(0, 5).map((u, i) => (
                    <tr key={u.id} style={{ borderBottom: i < 4 ? '1px solid #161C28' : 'none' }}>
                      <td style={{ padding: '14px 20px', color: 'white', fontSize: '14px', fontWeight: 600 }}>{u.name || '—'}</td>
                      <td style={{ padding: '14px 20px', color: '#8892A4', fontSize: '14px' }}>{u.email}</td>
                      <td style={{ padding: '14px 20px', color: '#8892A4', fontSize: '14px' }}>{u.discipline || '—'}</td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ background: u.is_verified ? 'rgba(5,128,155,0.15)' : 'rgba(74,85,104,0.15)', color: u.is_verified ? '#05809B' : '#4A5568', fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '100px' }}>
                          {u.is_verified ? '✓ Verified' : 'Unverified'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <button onClick={() => toggleVerified(u.id, u.is_verified ?? false)}
                          style={{ background: 'transparent', border: '1px solid #2A3145', borderRadius: '6px', padding: '6px 12px', color: '#F6981F', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                          {u.is_verified ? 'Unverify' : 'Verify'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users tab */}
        {activeTab === 'users' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 800, fontFamily: "'Nunito', sans-serif" }}>All Users</h2>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  type="text" value={userSearch} onChange={e => setUserSearch(e.target.value)}
                  placeholder="Search by name or email..."
                  style={{ background: '#1B2130', border: '1px solid #2A3145', borderRadius: '10px', padding: '10px 16px', color: 'white', fontSize: '14px', outline: 'none', minWidth: '240px' }}
                />
                <button onClick={exportUsersCsv}
                  style={{ background: 'transparent', border: '1px solid #2A3145', borderRadius: '10px', padding: '10px 18px', color: '#8892A4', fontSize: '14px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: "'Nunito Sans', sans-serif" }}>
                  ⤓ Export CSV
                </button>
                <button onClick={() => { setShowAddUser(true); setAddMsg(null) }}
                  style={{ background: '#F6981F', border: 'none', borderRadius: '10px', padding: '10px 20px', color: 'white', fontSize: '14px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: "'Nunito Sans', sans-serif" }}>
                  + Add User
                </button>
              </div>
            </div>

            {adminError && (
              <div style={{ marginBottom: '16px', padding: '12px 16px', background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.25)', borderRadius: '10px', color: '#FF8888', fontSize: '14px', fontWeight: 600 }}>
                ⚠ {adminError}
              </div>
            )}

            <div style={{ background: '#1B2130', border: '1px solid #2A3145', borderRadius: '12px', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #2A3145' }}>
                    {['Name', 'Email', 'Role', 'Discipline', 'Joined', 'Verified', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '14px 14px', textAlign: 'left', color: '#4A5568', fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u, i) => (
                    <tr key={u.id} style={{ borderBottom: i < filteredUsers.length - 1 ? '1px solid #161C28' : 'none' }}>

                      {/* Name */}
                      <td style={{ padding: '13px 14px', color: 'white', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                        {u.name || '—'}
                        {(u as any).is_admin && (
                          <span style={{ marginLeft: '6px', fontSize: '10px', fontWeight: 700, color: '#F6981F', background: 'rgba(246,152,32,0.12)', padding: '2px 7px', borderRadius: '100px', border: '1px solid rgba(246,152,32,0.25)' }}>ADMIN</span>
                        )}
                      </td>

                      {/* Email */}
                      <td style={{ padding: '13px 14px', color: '#8892A4', fontSize: '12px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</td>

                      {/* Role (inline edit) */}
                      <td style={{ padding: '13px 14px' }}>
                        {roleEditId === u.id ? (
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <select
                              autoFocus
                              defaultValue={u.role || ''}
                              onChange={e => changeRole(u.id, e.target.value)}
                              onBlur={() => setRoleEditId(null)}
                              style={{ background: '#0F1117', border: '1px solid #05809B', borderRadius: '6px', color: 'white', fontSize: '12px', padding: '4px 8px', outline: 'none', cursor: 'pointer' }}>
                              <option value="">No role</option>
                              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                          </div>
                        ) : (
                          <button onClick={() => setRoleEditId(u.id)}
                            style={{ background: 'transparent', border: 'none', padding: '2px 0', cursor: 'pointer', textAlign: 'left' }}>
                            <span style={{ color: u.role ? '#C0C8D8' : '#4A5568', fontSize: '12px' }}>{u.role || 'No role'}</span>
                            <span style={{ color: '#2A3145', fontSize: '11px', marginLeft: '4px' }}>✎</span>
                          </button>
                        )}
                      </td>

                      {/* Discipline */}
                      <td style={{ padding: '13px 14px', color: '#8892A4', fontSize: '12px', whiteSpace: 'nowrap' }}>{u.discipline || '—'}</td>

                      {/* Joined */}
                      <td style={{ padding: '13px 14px', color: '#4A5568', fontSize: '12px', whiteSpace: 'nowrap' }}>{fmtDate((u as any).created_at)}</td>

                      {/* Verified */}
                      <td style={{ padding: '13px 14px' }}>
                        <span style={{ background: u.is_verified ? 'rgba(5,128,155,0.15)' : 'rgba(74,85,104,0.15)', color: u.is_verified ? '#05809B' : '#4A5568', fontSize: '11px', fontWeight: 700, padding: '3px 9px', borderRadius: '100px', whiteSpace: 'nowrap' }}>
                          {u.is_verified ? '✓ Verified' : 'Unverified'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '13px 14px' }}>
                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                          {/* Verify */}
                          <button onClick={() => toggleVerified(u.id, u.is_verified ?? false)}
                            style={{ background: 'transparent', border: `1px solid ${u.is_verified ? '#2A3145' : '#05809B'}`, borderRadius: '6px', padding: '4px 9px', color: u.is_verified ? '#4A5568' : '#05809B', fontSize: '11px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                            {u.is_verified ? 'Unverify' : '✓ Verify'}
                          </button>

                          {/* Admin toggle — only for @fractionalaeco.com */}
                          {isFrAECO(u.email) && u.email !== SUPERADMIN && (
                            <button onClick={() => toggleAdmin(u.id, u.email ?? '', !!(u as any).is_admin)}
                              style={{ background: 'transparent', border: `1px solid ${(u as any).is_admin ? '#3D2A00' : 'rgba(246,152,32,0.3)'}`, borderRadius: '6px', padding: '4px 9px', color: (u as any).is_admin ? '#8892A4' : '#F6981F', fontSize: '11px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                              {(u as any).is_admin ? 'Remove Admin' : 'Make Admin'}
                            </button>
                          )}
                          {isFrAECO(u.email) && u.email === SUPERADMIN && (
                            <span style={{ fontSize: '11px', color: '#F6981F', fontWeight: 700, padding: '4px 9px', background: 'rgba(246,152,32,0.08)', borderRadius: '6px', whiteSpace: 'nowrap' }}>
                              Superadmin
                            </span>
                          )}

                          {/* View Profile */}
                          <Link href={`/talent/${u.id}`}
                            style={{ background: 'transparent', border: '1px solid #2A3145', borderRadius: '6px', padding: '4px 9px', color: '#8892A4', fontSize: '11px', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                            Profile →
                          </Link>

                          {/* Delete */}
                          <button onClick={() => deleteUser(u.id)}
                            style={{ background: 'transparent', border: '1px solid #3D1515', borderRadius: '6px', padding: '4px 9px', color: '#FF6B6B', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && (
                <div style={{ textAlign: 'center', padding: '48px', color: '#4A5568', fontSize: '16px' }}>
                  {userSearch ? 'No users match your search.' : 'No users yet.'}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Listings tab */}
        {activeTab === 'listings' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 800, fontFamily: "'Nunito', sans-serif" }}>All Listings</h2>
              <button onClick={exportListingsCsv}
                style={{ background: 'transparent', border: '1px solid #2A3145', borderRadius: '10px', padding: '10px 18px', color: '#8892A4', fontSize: '14px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: "'Nunito Sans', sans-serif" }}>
                ⤓ Export CSV
              </button>
            </div>
            <div style={{ background: '#1B2130', border: '1px solid #2A3145', borderRadius: '12px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #2A3145' }}>
                    {['Title', 'Company', 'Discipline', 'Type', 'Rate', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '14px 16px', textAlign: 'left', color: '#4A5568', fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {listings.map((l, i) => (
                    <tr key={l.id} style={{ borderBottom: i < listings.length - 1 ? '1px solid #161C28' : 'none' }}>
                      <td style={{ padding: '14px 16px', color: 'white', fontSize: '14px', fontWeight: 600 }}>{l.title}</td>
                      <td style={{ padding: '14px 16px', color: '#8892A4', fontSize: '13px' }}>{l.company}</td>
                      <td style={{ padding: '14px 16px', color: '#8892A4', fontSize: '13px' }}>{l.discipline || '—'}</td>
                      <td style={{ padding: '14px 16px', color: '#8892A4', fontSize: '13px' }}>{l.engagement_type || '—'}</td>
                      <td style={{ padding: '14px 16px', color: '#05809B', fontSize: '13px', fontWeight: 700 }}>{l.rate ? `$${l.rate}/h` : '—'}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ background: l.status === 'active' ? 'rgba(5,128,155,0.15)' : 'rgba(74,85,104,0.15)', color: l.status === 'active' ? '#05809B' : '#4A5568', fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '100px' }}>
                          {l.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => toggleListing(l.id, l.status)}
                            style={{ background: 'transparent', border: '1px solid #2A3145', borderRadius: '6px', padding: '5px 10px', color: '#F6981F', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
                            {l.status === 'active' ? 'Close' : 'Reopen'}
                          </button>
                          <button onClick={() => deleteListing(l.id)}
                            style={{ background: 'transparent', border: '1px solid #3D1515', borderRadius: '6px', padding: '5px 10px', color: '#FF6B6B', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {listings.length === 0 && (
                <div style={{ textAlign: 'center', padding: '48px', color: '#4A5568', fontSize: '16px' }}>No listings yet</div>
              )}
            </div>
          </div>
        )}

        {/* Applications tab */}
        {activeTab === 'applications' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 800, fontFamily: "'Nunito', sans-serif" }}>All Applications</h2>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                <select value={appStatusFilter} onChange={e => setAppStatusFilter(e.target.value)}
                  style={{ background: '#1B2130', border: '1px solid #2A3145', borderRadius: '10px', padding: '10px 14px', color: 'white', fontSize: '14px', outline: 'none', cursor: 'pointer' }}>
                  <option value="all">All statuses</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Declined</option>
                </select>
                <button onClick={exportApplicationsCsv}
                  style={{ background: 'transparent', border: '1px solid #2A3145', borderRadius: '10px', padding: '10px 18px', color: '#8892A4', fontSize: '14px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: "'Nunito Sans', sans-serif" }}>
                  ⤓ Export CSV
                </button>
              </div>
            </div>
            <div style={{ background: '#1B2130', border: '1px solid #2A3145', borderRadius: '12px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #2A3145' }}>
                    {['Applicant', 'Email', 'Listing', 'Company', 'Status', 'Applied'].map(h => (
                      <th key={h} style={{ padding: '14px 16px', textAlign: 'left', color: '#4A5568', fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {applications
                    .filter(a => appStatusFilter === 'all' || a.status === appStatusFilter)
                    .map((a, i, arr) => (
                    <tr key={a.id} style={{ borderBottom: i < arr.length - 1 ? '1px solid #161C28' : 'none' }}>
                      <td style={{ padding: '14px 16px', color: 'white', fontSize: '14px', fontWeight: 600 }}>{a.profiles?.name || '—'}</td>
                      <td style={{ padding: '14px 16px', color: '#8892A4', fontSize: '13px' }}>{a.profiles?.email || '—'}</td>
                      <td style={{ padding: '14px 16px', color: '#8892A4', fontSize: '13px' }}>{a.listings?.title || '—'}</td>
                      <td style={{ padding: '14px 16px', color: '#8892A4', fontSize: '13px' }}>{a.listings?.company || '—'}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          background: a.status === 'accepted' ? 'rgba(34,197,94,0.12)' : a.status === 'rejected' ? 'rgba(239,68,68,0.12)' : 'rgba(246,152,32,0.12)',
                          color: a.status === 'accepted' ? '#22c55e' : a.status === 'rejected' ? '#f87171' : '#F6981F',
                          fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '100px', textTransform: 'capitalize'
                        }}>
                          {a.status === 'rejected' ? 'Declined' : a.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#4A5568', fontSize: '12px', whiteSpace: 'nowrap' }}>{fmtDate(a.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {applications.length === 0 && (
                <div style={{ textAlign: 'center', padding: '48px', color: '#4A5568', fontSize: '16px' }}>No applications yet</div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
