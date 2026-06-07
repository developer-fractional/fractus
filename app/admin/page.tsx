'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { Profile, Listing } from '../lib/types'

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [users, setUsers] = useState<Profile[]>([])
  const [listings, setListings] = useState<Listing[]>([])
  const [stats, setStats] = useState({ users: 0, listings: 0, verified: 0 })

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
    const { data: u } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
    const { data: l } = await supabase.from('listings').select('*').order('created_at', { ascending: false })
    setUsers(u || [])
    setListings(l || [])
    setStats({
      users: u?.length || 0,
      listings: l?.length || 0,
      verified: u?.filter((x) => x.is_verified).length || 0,
    })
  }

  async function toggleVerified(userId: string, current: boolean) {
    await supabase.from('profiles').update({ is_verified: !current }).eq('id', userId)
    loadAll()
  }

  async function toggleListing(id: string, current: string) {
    await supabase.from('listings').update({ status: current === 'active' ? 'closed' : 'active' }).eq('id', id)
    loadAll()
  }

  async function deleteUser(userId: string) {
    if (!confirm('Delete this user?')) return
    await supabase.from('profiles').delete().eq('id', userId)
    loadAll()
  }

  async function deleteListing(id: string) {
    if (!confirm('Delete this listing?')) return
    await supabase.from('listings').delete().eq('id', id)
    loadAll()
  }

  if (loading) return (
    <div style={{ background: '#0F1117', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#F6981F', fontSize: '20px', fontFamily: "'Nunito Sans', sans-serif" }}>Loading admin panel...</p>
    </div>
  )

  const tabStyle = (tab: string) => ({
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 700,
    cursor: 'pointer',
    border: 'none',
    background: activeTab === tab ? '#F6981F' : '#1B2130',
    color: activeTab === tab ? 'white' : '#8892A4',
    fontFamily: "'Nunito Sans', sans-serif",
  })

  return (
    <div style={{ minHeight: '100vh', background: '#0F1117', fontFamily: "'Nunito Sans', sans-serif" }}>

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

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 48px' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '36px' }}>
          {[
            { label: 'Total Users', value: stats.users, color: '#F6981F' },
            { label: 'Verified Pros', value: stats.verified, color: '#05809B' },
            { label: 'Active Listings', value: listings.filter(l => l.status === 'active').length, color: '#F6981F' },
            { label: 'Total Listings', value: stats.listings, color: '#05809B' },
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
                          style={{ background: 'transparent', border: '1px solid #2A3145', borderRadius: '6px', padding: '6px 12px', color: '#F6981F', fontSize: '12px', fontWeight: 700, cursor: 'pointer', marginRight: '8px' }}>
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
            <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 800, fontFamily: "'Nunito', sans-serif", marginBottom: '20px' }}>All Users</h2>
            <div style={{ background: '#1B2130', border: '1px solid #2A3145', borderRadius: '12px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #2A3145' }}>
                    {['Name', 'Email', 'Role', 'Discipline', 'Rate', 'Verified', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '14px 16px', textAlign: 'left', color: '#4A5568', fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u.id} style={{ borderBottom: i < users.length - 1 ? '1px solid #161C28' : 'none' }}>
                      <td style={{ padding: '14px 16px', color: 'white', fontSize: '14px', fontWeight: 600 }}>{u.name || '—'}</td>
                      <td style={{ padding: '14px 16px', color: '#8892A4', fontSize: '13px' }}>{u.email}</td>
                      <td style={{ padding: '14px 16px', color: '#8892A4', fontSize: '13px' }}>{u.role || '—'}</td>
                      <td style={{ padding: '14px 16px', color: '#8892A4', fontSize: '13px' }}>{u.discipline || '—'}</td>
                      <td style={{ padding: '14px 16px', color: '#05809B', fontSize: '13px', fontWeight: 700 }}>{u.hourly_rate ? `$${u.hourly_rate}/h` : '—'}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ background: u.is_verified ? 'rgba(5,128,155,0.15)' : 'rgba(74,85,104,0.15)', color: u.is_verified ? '#05809B' : '#4A5568', fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '100px' }}>
                          {u.is_verified ? '✓ Verified' : 'Unverified'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => toggleVerified(u.id, u.is_verified ?? false)}
                            style={{ background: 'transparent', border: `1px solid ${u.is_verified ? '#2A3145' : '#05809B'}`, borderRadius: '6px', padding: '5px 10px', color: u.is_verified ? '#4A5568' : '#05809B', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
                            {u.is_verified ? 'Unverify' : '✓ Verify'}
                          </button>
                          <button onClick={() => deleteUser(u.id)}
                            style={{ background: 'transparent', border: '1px solid #3D1515', borderRadius: '6px', padding: '5px 10px', color: '#FF6B6B', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <div style={{ textAlign: 'center', padding: '48px', color: '#4A5568', fontSize: '16px' }}>No users yet</div>
              )}
            </div>
          </div>
        )}

        {/* Listings tab */}
        {activeTab === 'listings' && (
          <div>
            <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 800, fontFamily: "'Nunito', sans-serif", marginBottom: '20px' }}>All Listings</h2>
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

      </div>
    </div>
  )
}