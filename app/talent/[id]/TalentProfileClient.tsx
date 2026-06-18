'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'
import type { Profile, Education, WorkExperience, Credential } from '../../lib/types'
import Navbar from '../../components/Navbar'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatMonthYear(month: number | null, year: number | null) {
  if (!year) return ''
  return month ? `${MONTHS[month - 1]} ${year}` : `${year}`
}

export default function TalentProfileClient({ id }: { id: string }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([])
  const [education, setEducation] = useState<Education[]>([])
  const [credentials, setCredentials] = useState<Credential[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return
    Promise.all([
      supabase.from('profiles').select('*').eq('id', id).single(),
      supabase.from('work_experience').select('*').eq('user_id', id)
        .order('start_year', { ascending: false, nullsFirst: false })
        .order('start_month', { ascending: false, nullsFirst: false }),
      supabase.from('education').select('*').eq('user_id', id)
        .order('start_year', { ascending: false, nullsFirst: false }),
      supabase.from('credentials').select('*').eq('user_id', id)
        .order('issue_year', { ascending: false, nullsFirst: false }),
    ]).then(([profileRes, workRes, eduRes, credRes]) => {
      if (profileRes.error || !profileRes.data) {
        setNotFound(true)
      } else {
        setProfile(profileRes.data)
        setWorkExperience((workRes.data as WorkExperience[]) ?? [])
        setEducation((eduRes.data as Education[]) ?? [])
        setCredentials((credRes.data as Credential[]) ?? [])
      }
      setLoading(false)
    })
  }, [id])

  const navBar = <Navbar activeLink="talent" />

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)', fontFamily: "'Nunito Sans', sans-serif" }}>
      <p style={{ color: '#F6981F', fontSize: '20px' }}>Loading profile...</p>
    </div>
  )

  if (notFound || !profile) return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)', fontFamily: "'Nunito Sans', sans-serif" }}>
      {navBar}
      <div className="flex flex-col items-center justify-center text-center px-6" style={{ minHeight: 'calc(100vh - 86px)' }}>
        <div className="rounded-2xl border p-12 max-w-md" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <div className="font-bold mb-3" style={{ color: '#F6981F', fontSize: '64px', fontFamily: "'Nunito', sans-serif" }}>404</div>
          <h1 className="font-bold mb-3" style={{ color: 'var(--text-primary)', fontSize: '26px' }}>Profile not found</h1>
          <p className="mb-8" style={{ color: 'var(--text-muted)', fontSize: '16px' }}>
            We couldn&apos;t find an AECO professional with this profile.
          </p>
          <Link href="/talent" className="inline-block rounded-xl font-semibold text-white transition-all hover:opacity-90"
            style={{ background: '#F6981F', fontSize: '15px', padding: '14px 28px', textDecoration: 'none' }}>
            Browse all talent →
          </Link>
        </div>
      </div>
    </div>
  )

  const skills = profile.skills ? profile.skills.split(',').map((s: string) => s.trim()).filter(Boolean) : []

  const availColor =
    profile.availability === 'Available Now' ? { bg: 'rgba(34,197,94,0.12)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' } :
    profile.availability === 'Open to Work'  ? { bg: 'rgba(246,152,32,0.12)', color: '#F6981F', border: '1px solid rgba(246,152,32,0.3)' } :
    { bg: 'rgba(74,85,104,0.15)', color: '#4A5568', border: '1px solid var(--border-color)' }

  const badgeStyle: React.CSSProperties = { fontSize: '12px', padding: '4px 12px', borderRadius: '100px', fontWeight: 700, background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }

  const mailSubject = encodeURIComponent(`Inquiry about ${profile.name || 'talent'} on Fractus`)

  const initial = profile.name ? profile.name.charAt(0).toUpperCase() : '?'

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)', fontFamily: "'Nunito Sans', sans-serif" }}>
      {navBar}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-5">
        <Link href="/talent" className="text-sm font-semibold transition-colors"
          style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>← Back to Talent</Link>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        {/* Cover + avatar (read-only) */}
        <div className="relative" style={{ marginBottom: '24px' }}>
          <div className="relative rounded-2xl overflow-hidden" style={{ height: '200px', background: profile.cover_url ? undefined : 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            {profile.cover_url && (
              <img src={profile.cover_url} alt="Cover" className="w-full h-full object-cover" style={{ display: 'block' }} />
            )}
          </div>
          <div className="absolute" style={{ left: '24px', bottom: '-60px', width: '120px', height: '120px' }}>
            <div className="rounded-full overflow-hidden flex items-center justify-center" style={{ width: '120px', height: '120px', border: '4px solid var(--bg-primary)', background: profile.avatar_url ? 'var(--bg-card)' : '#F6981F', boxSizing: 'border-box' }}>
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.name ?? 'Avatar'} className="w-full h-full object-cover" />
              ) : (
                <span className="font-bold text-white" style={{ fontSize: '42px', fontFamily: "'Nunito', sans-serif" }}>{initial}</span>
              )}
            </div>
          </div>
        </div>

        {/* Header card */}
        <div className="rounded-2xl border p-5 sm:p-8 mb-6 sm:mb-8" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', paddingTop: '60px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
                <h1 className="font-bold" style={{ color: 'var(--text-primary)', fontSize: '28px', fontFamily: "'Nunito', sans-serif" }}>
                  {profile.name || 'Unnamed professional'}
                </h1>
                {profile.is_verified && (
                  <span style={{ background: 'rgba(5,128,155,0.15)', color: '#05809B', border: '1px solid rgba(5,128,155,0.3)', borderRadius: '100px', fontSize: '13px', padding: '4px 14px', fontWeight: 700 }}>
                    ✓ Verified
                  </span>
                )}
              </div>

              <p className="mb-3" style={{ color: 'var(--text-muted)', fontSize: '17px' }}>
                {profile.role || 'AECO Professional'}{profile.location ? ` · ${profile.location}` : ''}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {profile.discipline && (
                  <span style={{ ...badgeStyle, color: '#F6981F' }}>{profile.discipline}</span>
                )}
                {profile.years_experience && (
                  <span style={badgeStyle}>{profile.years_experience} yrs experience</span>
                )}
                {profile.hourly_rate && (
                  <span style={badgeStyle}>${profile.hourly_rate}/hr</span>
                )}
                {profile.availability && (
                  <span style={{ ...badgeStyle, background: availColor.bg, color: availColor.color, border: availColor.border }}>
                    {profile.availability}
                  </span>
                )}
              </div>
            </div>
          </div>

          {profile.bio && (
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.8', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
              {profile.bio}
            </p>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
            {profile.linkedin_url && (
              <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer"
                style={{ background: 'rgba(5,128,155,0.12)', color: '#05809B', border: '1px solid rgba(5,128,155,0.3)', borderRadius: '100px', padding: '10px 20px', fontSize: '14px', fontWeight: 700, textDecoration: 'none' }}>
                LinkedIn →
              </a>
            )}
            {profile.portfolio_url && (
              <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer"
                style={{ background: 'rgba(5,128,155,0.12)', color: '#05809B', border: '1px solid rgba(5,128,155,0.3)', borderRadius: '100px', padding: '10px 20px', fontSize: '14px', fontWeight: 700, textDecoration: 'none' }}>
                Portfolio →
              </a>
            )}
            <a href={`mailto:development@fractionalaeco.com?subject=${mailSubject}`}
              style={{ background: '#F6981F', color: 'white', borderRadius: '100px', padding: '10px 22px', fontSize: '14px', fontWeight: 700, textDecoration: 'none' }}>
              Contact via Fractional AECO
            </a>
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="rounded-2xl border p-8 mb-6" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <h2 className="font-bold mb-4" style={{ color: 'var(--text-primary)', fontSize: '20px', fontFamily: "'Nunito', sans-serif" }}>Skills</h2>
            <div className="flex flex-wrap gap-3">
              {skills.map((s: string, i: number) => (
                <span key={i} className="text-sm px-4 py-2 rounded-full font-medium"
                  style={{ background: 'var(--bg-primary)', color: '#F6981F', border: '1px solid var(--border-color)' }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Work Experience */}
        {workExperience.length > 0 && (
          <div className="rounded-2xl border p-8 mb-6" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <h2 className="font-bold mb-4" style={{ color: 'var(--text-primary)', fontSize: '20px', fontFamily: "'Nunito', sans-serif" }}>Work Experience</h2>
            <div className="space-y-5">
              {workExperience.map(w => (
                <div key={w.id} style={{ paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '16px' }}>{w.title}</span>
                    {w.is_current && (
                      <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '100px', background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>Current</span>
                    )}
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '2px' }}>
                    {w.company}{w.location ? ` · ${w.location}` : ''}
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '2px' }}>
                    {formatMonthYear(w.start_month, w.start_year)} – {w.is_current ? 'Present' : (formatMonthYear(w.end_month, w.end_year) || 'Present')}
                  </p>
                  {w.description && (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '8px', lineHeight: '1.7' }}>{w.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="rounded-2xl border p-8 mb-6" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <h2 className="font-bold mb-4" style={{ color: 'var(--text-primary)', fontSize: '20px', fontFamily: "'Nunito', sans-serif" }}>Education</h2>
            <div className="space-y-5">
              {education.map(e => (
                <div key={e.id} style={{ paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '16px' }}>{e.school}</span>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '2px' }}>
                    {[e.degree, e.field_of_study].filter(Boolean).join(', ')}
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '2px' }}>
                    {e.start_year ?? ''}{(e.start_year || e.end_year) ? ' – ' : ''}{e.end_year ?? (e.start_year ? 'Present' : '')}
                  </p>
                  {e.description && (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '8px', lineHeight: '1.7' }}>{e.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Licenses & Certifications */}
        {credentials.length > 0 && (
          <div className="rounded-2xl border p-8 mb-6" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <h2 className="font-bold mb-4" style={{ color: 'var(--text-primary)', fontSize: '20px', fontFamily: "'Nunito', sans-serif" }}>Licenses & Certifications</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {credentials.map(c => (
                <div key={c.id} className="rounded-xl p-5" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '15px' }}>{c.name}</span>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
                    {[c.issuing_organization, c.license_number, c.state].filter(Boolean).join(' · ')}
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '4px' }}>
                    {c.issue_year ? `Issued ${c.issue_year}` : ''}{c.expiration_year ? `${c.issue_year ? ' · ' : ''}Expires ${c.expiration_year}` : ''}
                  </p>
                  {c.credential_url && (
                    <a href={c.credential_url} target="_blank" rel="noopener noreferrer" style={{ color: '#05809B', fontSize: '12px', fontWeight: 700, marginTop: '6px', display: 'inline-block' }}>
                      View credential →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
