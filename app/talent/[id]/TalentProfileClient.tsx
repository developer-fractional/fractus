'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'
import type { Profile } from '../../lib/types'
import Navbar from '../../components/Navbar'

export default function TalentProfileClient({ id }: { id: string }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return
    supabase.from('profiles').select('*').eq('id', id).single().then(({ data, error }) => {
      if (error || !data) setNotFound(true)
      else setProfile(data)
      setLoading(false)
    })
  }, [id])

  const navBar = <Navbar activeLink="talent" />

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0F1117', fontFamily: "'Nunito Sans', sans-serif" }}>
      <p style={{ color: '#F6981F', fontSize: '20px' }}>Loading profile...</p>
    </div>
  )

  if (notFound || !profile) return (
    <div className="min-h-screen" style={{ background: '#0F1117', fontFamily: "'Nunito Sans', sans-serif" }}>
      {navBar}
      <div className="flex flex-col items-center justify-center text-center px-6" style={{ minHeight: 'calc(100vh - 86px)' }}>
        <div className="rounded-2xl border p-12 max-w-md" style={{ background: '#1B2130', borderColor: '#2A3145' }}>
          <div className="font-bold mb-3" style={{ color: '#F6981F', fontSize: '64px', fontFamily: "'Nunito', sans-serif" }}>404</div>
          <h1 className="font-bold text-white mb-3" style={{ fontSize: '26px' }}>Profile not found</h1>
          <p className="text-gray-400 mb-8" style={{ fontSize: '16px' }}>
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

  const certifications = Array.isArray(profile.certifications) ? profile.certifications : []
  const skills = profile.skills ? profile.skills.split(',').map((s: string) => s.trim()).filter(Boolean) : []

  const availColor =
    profile.availability === 'Available Now' ? { bg: 'rgba(34,197,94,0.12)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' } :
    profile.availability === 'Open to Work'  ? { bg: 'rgba(246,152,32,0.12)', color: '#F6981F', border: '1px solid rgba(246,152,32,0.3)' } :
    { bg: 'rgba(74,85,104,0.15)', color: '#4A5568', border: '1px solid #2A3145' }

  const badgeStyle = { fontSize: '12px', padding: '4px 12px', borderRadius: '100px', fontWeight: 700, background: '#1B2130', border: '1px solid #2A3145', color: '#8892A4' }

  const mailSubject = encodeURIComponent(`Inquiry about ${profile.name || 'talent'} on Fractus`)

  return (
    <div className="min-h-screen" style={{ background: '#0F1117', fontFamily: "'Nunito Sans', sans-serif" }}>
      {navBar}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-5">
        <Link href="/talent" className="text-sm font-semibold hover:text-white transition-colors"
          style={{ color: '#8892A4', textDecoration: 'none' }}>← Back to Talent</Link>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        {/* Header card */}
        <div className="rounded-2xl border p-5 sm:p-8 mb-6 sm:mb-8" style={{ background: '#1B2130', borderColor: '#2A3145' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap' }}>
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold flex-shrink-0"
              style={{ background: '#F6981F', fontSize: '32px', fontFamily: "'Nunito', sans-serif" }}>
              {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
            </div>

            <div style={{ flex: 1, minWidth: '200px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
                <h1 className="font-bold text-white" style={{ fontSize: '28px', fontFamily: "'Nunito', sans-serif" }}>
                  {profile.name || 'Unnamed professional'}
                </h1>
                {profile.is_verified && (
                  <span style={{ background: 'rgba(5,128,155,0.15)', color: '#05809B', border: '1px solid rgba(5,128,155,0.3)', borderRadius: '100px', fontSize: '13px', padding: '4px 14px', fontWeight: 700 }}>
                    ✓ Verified
                  </span>
                )}
              </div>

              <p className="text-gray-400 mb-3" style={{ fontSize: '17px' }}>
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
            <p style={{ color: '#C0C8D8', fontSize: '15px', lineHeight: '1.8', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #2A3145' }}>
              {profile.bio}
            </p>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #2A3145' }}>
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
          <div className="rounded-2xl border p-8 mb-6" style={{ background: '#1B2130', borderColor: '#2A3145' }}>
            <h2 className="font-bold text-white mb-4" style={{ fontSize: '20px', fontFamily: "'Nunito', sans-serif" }}>Skills</h2>
            <div className="flex flex-wrap gap-3">
              {skills.map((s: string, i: number) => (
                <span key={i} className="text-sm px-4 py-2 rounded-full font-medium"
                  style={{ background: '#0F1117', color: '#F6981F', border: '1px solid #2A3145' }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div className="rounded-2xl border p-8 mb-6" style={{ background: '#1B2130', borderColor: '#2A3145' }}>
            <h2 className="font-bold text-white mb-4" style={{ fontSize: '20px', fontFamily: "'Nunito', sans-serif" }}>Certifications</h2>
            <div className="flex flex-wrap gap-3">
              {certifications.map((c: string, i: number) => (
                <span key={i} className="text-sm px-4 py-2 rounded-full font-medium"
                  style={{ background: '#0F1117', color: '#05809B', border: '1px solid #2A3145' }}>
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
