'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'
import type { Profile } from '../../lib/types'
import Navbar from '../../components/Navbar'

export default function TalentProfilePage() {
  const params = useParams<{ id: string }>()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!params?.id) return
    supabase.from('profiles').select('*').eq('id', params.id).single().then(({ data, error }) => {
      if (error || !data) {
        setNotFound(true)
      } else {
        setProfile(data)
      }
      setLoading(false)
    })
  }, [params?.id])

  const navBar = (
    <Navbar activeLink="talent" />
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0F1117', fontFamily: "'Nunito Sans', sans-serif" }}>
        <p style={{ color: '#F6981F', fontSize: '20px' }}>Loading profile...</p>
      </div>
    )
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen" style={{ background: '#0F1117', fontFamily: "'Nunito Sans', sans-serif" }}>
        {navBar}
        <div className="flex flex-col items-center justify-center text-center px-6" style={{ minHeight: 'calc(100vh - 86px)' }}>
          <div className="rounded-2xl border p-12 max-w-md" style={{ background: '#1B2130', borderColor: '#2A3145' }}>
            <div className="font-bold mb-3" style={{ color: '#F6981F', fontSize: '64px', fontFamily: "'Nunito', sans-serif" }}>404</div>
            <h1 className="font-bold text-white mb-3" style={{ fontSize: '26px' }}>Profile not found</h1>
            <p className="text-gray-400 mb-8" style={{ fontSize: '16px' }}>
              We couldn&apos;t find an AECO professional with this profile. They may have removed their listing, or the link might be incorrect.
            </p>
            <Link href="/talent" className="inline-block rounded-xl font-semibold text-white transition-all hover:opacity-90" style={{ background: '#F6981F', fontSize: '15px', padding: '14px 28px', textDecoration: 'none' }}>
              Browse all talent →
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const certifications = Array.isArray(profile.certifications) ? profile.certifications : []
  const skills = profile.skills ? profile.skills.split(',').map(s => s.trim()).filter(Boolean) : []

  return (
    <div className="min-h-screen" style={{ background: '#0F1117', fontFamily: "'Nunito Sans', sans-serif" }}>
      {navBar}

      {/* Back link shown below nav on profile pages */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-5">
        <Link href="/talent" className="text-sm font-semibold hover:text-white transition-colors"
          style={{ color: '#8892A4', textDecoration: 'none' }}>← Back to Talent</Link>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        {/* Header card */}
        <div className="rounded-2xl border p-5 sm:p-8 mb-6 sm:mb-8 flex items-start gap-4 sm:gap-6 flex-wrap" style={{ background: '#1B2130', borderColor: '#2A3145' }}>
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold flex-shrink-0" style={{ background: '#F6981F', fontSize: '32px', fontFamily: "'Nunito', sans-serif" }}>
            {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="font-bold text-white" style={{ fontSize: '28px', fontFamily: "'Nunito', sans-serif" }}>{profile.name || 'Unnamed professional'}</h1>
              {profile.is_verified && (
                <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{ background: 'rgba(5,128,155,0.15)', color: '#05809B', border: '1px solid rgba(5,128,155,0.3)' }}>
                  ✓ Verified
                </span>
              )}
            </div>
            <p className="text-gray-400 mb-3" style={{ fontSize: '17px' }}>
              {profile.role || 'AECO Professional'}{profile.location ? ` · ${profile.location}` : ''}
            </p>
            <div className="flex gap-3 flex-wrap">
              {profile.discipline && (
                <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: '#0F1117', color: '#F6981F', border: '1px solid #2A3145' }}>
                  {profile.discipline}
                </span>
              )}
              {profile.years_experience && (
                <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: '#0F1117', color: '#F6981F', border: '1px solid #2A3145' }}>
                  {profile.years_experience} yrs experience
                </span>
              )}
              {profile.availability && (
                <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: '#0F1117', color: '#05809B', border: '1px solid #2A3145' }}>
                  {profile.availability}
                </span>
              )}
            </div>
          </div>
          {profile.hourly_rate && (
            <div className="text-right flex-shrink-0">
              <div className="font-bold" style={{ color: '#05809B', fontSize: '28px', fontFamily: "'Nunito', sans-serif" }}>${profile.hourly_rate}/h</div>
              <div className="text-gray-500" style={{ fontSize: '13px' }}>hourly rate</div>
            </div>
          )}
        </div>

        {/* Bio */}
        {profile.bio && (
          <div className="rounded-2xl border p-8 mb-6" style={{ background: '#1B2130', borderColor: '#2A3145' }}>
            <h2 className="font-bold text-white mb-4" style={{ fontSize: '20px', fontFamily: "'Nunito', sans-serif" }}>About</h2>
            <p className="text-gray-400" style={{ fontSize: '16px', lineHeight: 1.7 }}>{profile.bio}</p>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="rounded-2xl border p-8 mb-6" style={{ background: '#1B2130', borderColor: '#2A3145' }}>
            <h2 className="font-bold text-white mb-4" style={{ fontSize: '20px', fontFamily: "'Nunito', sans-serif" }}>Skills</h2>
            <div className="flex flex-wrap gap-3">
              {skills.map((s, i) => (
                <span key={i} className="text-sm px-4 py-2 rounded-full font-medium" style={{ background: '#0F1117', color: '#F6981F', border: '1px solid #2A3145' }}>
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
              {certifications.map((c, i) => (
                <span key={i} className="text-sm px-4 py-2 rounded-full font-medium" style={{ background: '#0F1117', color: '#05809B', border: '1px solid #2A3145' }}>
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Links */}
        {(profile.linkedin_url || profile.portfolio_url) && (
          <div className="rounded-2xl border p-8 mb-6" style={{ background: '#1B2130', borderColor: '#2A3145' }}>
            <h2 className="font-bold text-white mb-4" style={{ fontSize: '20px', fontFamily: "'Nunito', sans-serif" }}>Links</h2>
            <div className="flex flex-col gap-3">
              {profile.linkedin_url && (
                <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="font-medium hover:opacity-80 transition-opacity" style={{ color: '#05809B', fontSize: '15px', textDecoration: 'none' }}>
                  in&nbsp;&nbsp;LinkedIn profile →
                </a>
              )}
              {profile.portfolio_url && (
                <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer" className="font-medium hover:opacity-80 transition-opacity" style={{ color: '#05809B', fontSize: '15px', textDecoration: 'none' }}>
                  🔗 Portfolio / website →
                </a>
              )}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="rounded-2xl border p-8 text-center" style={{ background: '#1B2130', borderColor: '#2A3145' }}>
          <h2 className="font-bold text-white mb-2" style={{ fontSize: '22px', fontFamily: "'Nunito', sans-serif" }}>
            Want to work with {profile.name?.split(' ')[0] || 'this professional'}?
          </h2>
          <p className="text-gray-400 mb-6" style={{ fontSize: '15px' }}>
            Fractional AECO handles vetting, scheduling, and contracts — so you can get straight to the work.
          </p>
          <a
            href="https://www.fractionalaeco.com/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-xl font-bold text-white transition-all hover:opacity-90"
            style={{ background: '#F6981F', fontSize: '16px', padding: '16px 36px', textDecoration: 'none', fontFamily: "'Nunito Sans', sans-serif" }}
          >
            Contact via FractionalAECO
          </a>
        </div>

      </div>
    </div>
  )
}
