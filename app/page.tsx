'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from './lib/supabase'

export default function Home() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    // If Supabase redirected a recovery email here (site URL + hash), forward to reset-password.
    if (typeof window !== 'undefined') {
      const hash = window.location.hash
      if (hash.includes('type=recovery')) {
        window.location.href = '/reset-password' + hash
        return
      }
    }
    supabase.auth.getSession().then(({ data }) => setLoggedIn(!!data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setLoggedIn(!!session))
    return () => listener.subscription.unsubscribe()
  }, [])

  return (
    <main style={{ background: '#0F1117', minHeight: '100vh', fontFamily: "'Nunito Sans', sans-serif" }}>

      {/* Top bar */}
      <div className="text-center py-2 px-4 text-xs sm:text-sm font-bold text-white"
        style={{ background: '#F6981F' }}>
        Powered by{' '}
        <a href="https://www.fractionalaeco.com" target="_blank" style={{ color: 'white', textDecoration: 'underline' }}>Fractional AECO</a>
        {' '}· Your AECO Experts ·{' '}
        <a href="tel:+19804940263" style={{ color: 'white', textDecoration: 'underline' }}>+1 980 494 0263</a>
      </div>

      {/* Nav */}
      <nav className="flex items-center justify-between px-5 sm:px-14 py-4 sm:py-5 border-b sticky top-0 z-[100]"
        style={{ background: '#0F1117', borderColor: '#2A3145' }}>
        <Link href="/" className="flex items-baseline gap-2" style={{ textDecoration: 'none' }}>
          <span className="text-xl sm:text-2xl font-bold" style={{ color: '#F6981F', fontFamily: "'Nunito', sans-serif" }}>Fractus</span>
          <span className="hidden sm:inline text-xs font-semibold" style={{ color: '#4A5568', letterSpacing: '0.08em' }}>BY FRACTIONAL AECO</span>
        </Link>

        {/* Desktop centre links */}
        <div className="hidden md:flex gap-8 items-center">
          {[['Talent', '/talent'], ['How it works', '#how'], ['Integrations', '#integrations'], ['For companies', '#companies']].map(([label, href]) => (
            <a key={label as string} href={href as string} className="text-sm font-semibold hover:text-white transition-colors"
              style={{ color: '#8892A4', textDecoration: 'none' }}>{label}</a>
          ))}
        </div>

        {/* Desktop auth */}
        <div className="hidden md:flex gap-3 items-center">
          {loggedIn ? (
            <Link href="/dashboard" className="text-white font-bold text-sm px-5 py-2 rounded-lg hover:opacity-90 transition-opacity"
              style={{ background: '#F6981F', textDecoration: 'none' }}>Dashboard</Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-semibold hover:text-white transition-colors"
                style={{ color: '#8892A4', textDecoration: 'none' }}>Sign in</Link>
              <Link href="/signup" className="text-white font-bold text-sm px-5 py-2 rounded-lg hover:opacity-90 transition-opacity"
                style={{ background: '#F6981F', textDecoration: 'none' }}>Join free</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden flex flex-col justify-center gap-[5px] p-1 cursor-pointer"
          onClick={() => setMenuOpen(o => !o)}
          style={{ background: 'none', border: 'none' }}
          aria-label="Toggle menu">
          <span className={`block w-6 h-0.5 bg-gray-400 transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`block w-6 h-0.5 bg-gray-400 transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-gray-400 transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="absolute top-full left-0 right-0 z-50 border-b flex flex-col py-3 md:hidden"
            style={{ background: '#0F1117', borderColor: '#2A3145' }}>
            {[['Talent', '/talent'], ['How it works', '#how'], ['Integrations', '#integrations'], ['For companies', '#companies']].map(([label, href]) => (
              <a key={label as string} href={href as string}
                className="px-5 py-3 text-sm font-semibold hover:text-white transition-colors"
                style={{ color: '#8892A4', textDecoration: 'none' }}
                onClick={() => setMenuOpen(false)}>{label}</a>
            ))}
            <div className="px-5 pt-3 pb-1 flex flex-col gap-3">
              {loggedIn ? (
                <Link href="/dashboard" className="text-center py-3 rounded-xl font-bold text-white"
                  style={{ background: '#F6981F', textDecoration: 'none' }}
                  onClick={() => setMenuOpen(false)}>Dashboard</Link>
              ) : (
                <>
                  <Link href="/login" className="text-center py-3 rounded-xl text-sm font-semibold border"
                    style={{ color: '#8892A4', textDecoration: 'none', borderColor: '#2A3145' }}
                    onClick={() => setMenuOpen(false)}>Sign in</Link>
                  <Link href="/signup" className="text-center py-3 rounded-xl font-bold text-white"
                    style={{ background: '#F6981F', textDecoration: 'none' }}
                    onClick={() => setMenuOpen(false)}>Join free</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="px-5 sm:px-14 pt-16 sm:pt-24 pb-14 sm:pb-20 max-w-[1200px] mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-0.5" style={{ background: '#05809B' }}></div>
          <span className="text-xs sm:text-sm font-bold tracking-widest" style={{ color: '#05809B' }}>FRACTUS · THE AECO TALENT NETWORK</span>
        </div>
        <h1 className="font-bold text-white mb-6 sm:mb-7"
          style={{ fontFamily: "'Nunito', sans-serif", fontSize: 'clamp(40px, 8vw, 72px)', lineHeight: 1.05, letterSpacing: '-2px', maxWidth: '800px' }}>
          Senior AECO expertise,{' '}
          <span style={{ color: '#F6981F', fontStyle: 'italic' }}>fractional</span>{' '}by design.
        </h1>
        <p className="mb-10 sm:mb-12 max-w-lg" style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', color: '#8892A4', lineHeight: 1.7, fontWeight: 400 }}>
          A curated network of architects, engineers, and construction leaders. Build a LinkedIn-style profile, import your experience, and get booked by the hour.
        </p>
        {/* CTA buttons — stacked on mobile */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <a href="/signup" className="text-white font-bold text-base sm:text-lg px-7 py-4 rounded-xl w-full sm:w-auto text-center hover:opacity-90 transition-opacity"
            style={{ background: '#F6981F', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            Create your profile ↗
          </a>
          <a href="/talent" className="font-semibold text-base sm:text-lg px-6 py-4 rounded-xl w-full sm:w-auto text-center hover:opacity-80 transition-opacity"
            style={{ background: 'transparent', color: '#8892A4', textDecoration: 'none', border: '1.5px solid #2A3145' }}>
            Browse talent →
          </a>
        </div>

        {/* Stats — 2×2 on mobile, 4 across on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-0 mt-16 sm:mt-20 pt-10 sm:pt-12 border-t" style={{ borderColor: '#2A3145' }}>
          {[
            { num: '320+', label: 'Senior professionals' },
            { num: '42', label: 'Disciplines covered' },
            { num: '18 yrs', label: 'Avg. experience' },
            { num: '24h', label: 'Avg. time to match' },
          ].map((s, i) => (
            <div key={i} className="sm:pr-14 sm:mr-14 sm:border-r last:sm:border-r-0 last:sm:mr-0 last:sm:pr-0"
              style={{ borderColor: '#2A3145' }}>
              <div className="font-bold text-white" style={{ fontFamily: "'Nunito', sans-serif", fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 800 }}>{s.num}</div>
              <div className="text-xs sm:text-sm font-semibold mt-1" style={{ color: '#4A5568' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="px-5 sm:px-14 py-16 sm:py-24 border-t" style={{ background: '#161C28', borderColor: '#2A3145' }}>
        <div className="max-w-[1200px] mx-auto">
          {/* Two-column header — stack on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 items-start mb-12 sm:mb-16">
            <div>
              <p className="text-xs sm:text-sm font-bold tracking-widest mb-4" style={{ color: '#05809B' }}>HOW IT WORKS</p>
              <h2 className="font-bold text-white" style={{ fontFamily: "'Nunito', sans-serif", fontSize: 'clamp(28px, 5vw, 48px)', lineHeight: 1.1, letterSpacing: '-1px', margin: 0 }}>
                From profile to project, in three moves.
              </h2>
            </div>
            <div className="md:pt-10">
              <p style={{ color: '#8892A4', fontSize: 'clamp(15px, 2vw, 18px)', lineHeight: 1.7 }}>
                Built for senior practitioners who&apos;d rather execute than chase work, and for teams that need expertise on demand.
              </p>
            </div>
          </div>
          {/* Three steps — single column on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-3 border-t" style={{ borderColor: '#2A3145' }}>
            {[
              { num: '01', icon: '🔗', title: 'Build your profile', desc: 'LinkedIn-style profile with experience, certifications, and portfolio. Import directly from LinkedIn or upload your CV.' },
              { num: '02', icon: '🔄', title: 'Sync your presence', desc: 'Connect Indeed, Glassdoor, and other platforms. Keep one source of truth for your fractional availability.' },
              { num: '03', icon: '⚡', title: 'Get booked by the hour', desc: 'Companies discover, vet, and book your hours through Fractional AECO. You execute, we handle the rest.' },
            ].map((s, i) => (
              <div key={i} className="py-10 sm:py-12 md:border-r last:md:border-r-0"
                style={{ paddingLeft: i > 0 ? undefined : '0', paddingRight: '40px', borderColor: '#2A3145' }}>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-2xl sm:text-3xl">{s.icon}</span>
                  <span className="text-xs sm:text-sm font-bold" style={{ color: '#2A3145' }}>{s.num}</span>
                </div>
                <h3 className="font-bold text-white mb-3 text-lg sm:text-xl" style={{ fontFamily: "'Nunito', sans-serif" }}>{s.title}</h3>
                <p className="text-sm sm:text-base" style={{ color: '#8892A4', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured talent */}
      <section className="px-5 sm:px-14 py-16 sm:py-24 border-t" style={{ background: '#0F1117', borderColor: '#2A3145' }}>
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-10 sm:mb-12">
            <div>
              <p className="text-xs sm:text-sm font-bold tracking-widest mb-2" style={{ color: '#05809B' }}>FEATURED TALENT</p>
              <h2 className="font-bold text-white" style={{ fontFamily: "'Nunito', sans-serif", fontSize: 'clamp(28px, 5vw, 48px)', letterSpacing: '-1px', margin: 0 }}>
                A glimpse of the network.
              </h2>
            </div>
            <a href="/talent" className="self-start sm:self-auto text-sm font-bold px-5 py-2 rounded-lg hover:opacity-90 transition-opacity"
              style={{ color: '#F6981F', textDecoration: 'none', border: '1.5px solid #F6981F' }}>
              See all profiles →
            </a>
          </div>
          {/* Cards — 1 col mobile, 2 col sm, 3 col lg */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { init: 'M', name: 'Marcus L.', role: 'Principal Architect', tags: ['Healthcare', 'Mass timber'], exp: '22 yrs', rate: '$240/h', color: '#F6981F' },
              { init: 'P', name: 'Priya K.', role: 'Structural Engineer, PE', tags: ['High-rise', 'Seismic'], exp: '16 yrs', rate: '$185/h', color: '#05809B' },
              { init: 'D', name: 'David O.', role: 'Construction Director', tags: ['Megaprojects', 'P3'], exp: '27 yrs', rate: '$310/h', color: '#F6981F' },
              { init: 'S', name: 'Sofia R.', role: 'MEP Lead', tags: ['Data centers', 'Net-zero'], exp: '14 yrs', rate: '$170/h', color: '#05809B' },
              { init: 'E', name: 'Ethan W.', role: 'BIM Manager', tags: ['Revit', 'ISO 19650'], exp: '11 yrs', rate: '$135/h', color: '#F6981F' },
              { init: 'A', name: 'Amara N.', role: 'Sustainability Director', tags: ['LEED', 'Embodied carbon'], exp: '19 yrs', rate: '$220/h', color: '#05809B' },
            ].map((p, i) => (
              <a key={i} href="/talent" className="block p-5 sm:p-7 rounded-2xl hover:opacity-90 transition-opacity"
                style={{ background: '#1B2130', border: '1px solid #2A3145', textDecoration: 'none' }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg sm:text-xl flex-shrink-0"
                      style={{ background: p.color, fontFamily: "'Nunito', sans-serif" }}>{p.init}</div>
                    <div>
                      <div className="text-white font-bold text-sm sm:text-base">{p.name}</div>
                      <div className="text-xs sm:text-sm mt-0.5" style={{ color: '#8892A4' }}>{p.role}</div>
                    </div>
                  </div>
                  <span style={{ color: '#4A5568' }}>↗</span>
                </div>
                <div className="flex gap-2 mb-4 flex-wrap">
                  {p.tags.map((tag, j) => (
                    <span key={j} className="text-xs px-3 py-1 rounded-md font-semibold"
                      style={{ border: '1px solid #2A3145', color: '#8892A4' }}>{tag}</span>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-4 border-t" style={{ borderColor: '#2A3145' }}>
                  <span className="text-xs sm:text-sm font-semibold" style={{ color: '#4A5568' }}>{p.exp} experience</span>
                  <span className="font-bold text-base sm:text-lg" style={{ color: '#05809B', fontFamily: "'Nunito', sans-serif" }}>{p.rate}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section id="integrations" className="px-5 sm:px-14 py-16 sm:py-24 border-t" style={{ background: '#161C28', borderColor: '#2A3145' }}>
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
          <div>
            <p className="text-xs sm:text-sm font-bold tracking-widest mb-4" style={{ color: '#05809B' }}>INTEGRATIONS</p>
            <h2 className="font-bold text-white mb-5" style={{ fontFamily: "'Nunito', sans-serif", fontSize: 'clamp(26px, 4.5vw, 44px)', lineHeight: 1.1, letterSpacing: '-1px' }}>
              Your career, already written.{' '}
              <span style={{ color: '#F6981F', fontStyle: 'italic' }}>Just import it.</span>
            </h2>
            <p className="mb-8 text-sm sm:text-lg" style={{ color: '#8892A4', lineHeight: 1.7 }}>
              Skip the form-filling. Pull your experience straight from the platforms you already use, and keep everything in sync.
            </p>
            <div className="flex gap-2 flex-wrap">
              {['LinkedIn', 'Indeed', 'Glassdoor', 'AngelList', 'CV upload'].map((p, i) => (
                <span key={i} className="px-4 py-2 rounded-lg text-xs sm:text-sm font-bold"
                  style={{ background: i === 0 ? '#F6981F' : '#1B2130', color: i === 0 ? 'white' : '#4A5568', border: `1px solid ${i === 0 ? '#F6981F' : '#2A3145'}` }}>
                  {p}
                </span>
              ))}
            </div>
          </div>
          {/* Import preview */}
          <div className="rounded-2xl p-6 sm:p-8" style={{ background: '#0F1117', border: '1px solid #2A3145' }}>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full" style={{ background: '#05809B' }}></div>
              <span className="text-xs sm:text-sm font-semibold" style={{ color: '#4A5568', fontFamily: 'monospace' }}>Importing from LinkedIn…</span>
            </div>
            {[
              { title: 'Senior Architect', company: 'Foster + Partners', years: '2019 — Present', color: '#F6981F' },
              { title: 'Project Architect', company: 'Arup', years: '2014 — 2019', color: '#05809B' },
              { title: 'Designer', company: 'SOM', years: '2010 — 2014', color: '#F6981F' },
            ].map((r, i) => (
              <div key={i} className="flex items-center gap-3 sm:gap-4 py-3 sm:py-4"
                style={{ borderBottom: i < 2 ? '1px solid #1B2130' : 'none' }}>
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex-shrink-0" style={{ background: r.color, opacity: 0.8 }}></div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-bold text-sm sm:text-base truncate">{r.title}</div>
                  <div className="text-xs sm:text-sm font-semibold mt-0.5 truncate" style={{ color: '#4A5568' }}>{r.company}</div>
                </div>
                <span className="text-xs font-semibold flex-shrink-0" style={{ color: '#2A3145' }}>{r.years}</span>
              </div>
            ))}
            <div className="mt-5 px-4 py-3 rounded-lg text-center text-xs sm:text-sm font-bold"
              style={{ background: 'rgba(5,128,155,0.1)', border: '1px solid rgba(5,128,155,0.3)', color: '#05809B' }}>
              ✓ 12 roles parsed · ready to publish
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="px-5 sm:px-14 py-16 sm:py-24 border-t" style={{ background: '#0F1117', borderColor: '#2A3145' }}>
        <div className="max-w-[1200px] mx-auto">
          <p className="text-xs sm:text-sm font-bold tracking-widest text-center mb-3" style={{ color: '#05809B' }}>WHAT WE OFFER</p>
          <h2 className="font-bold text-white text-center mb-12 sm:mb-14" style={{ fontFamily: "'Nunito', sans-serif", fontSize: 'clamp(28px, 5vw, 48px)', letterSpacing: '-1px' }}>Our Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: '🏗️', title: 'Management Services', desc: 'Fractional AECO management that drives projects forward, mitigates risk, and gives your team the leadership it needs.', color: '#F6981F' },
              { icon: '💻', title: 'AECO Technology & Systems', desc: 'We help AECO teams adopt, optimize, and get real results from technology — embedded expertise that turns tools into outcomes.', color: '#05809B' },
              { icon: '📊', title: 'Insurance, Cost & Value', desc: 'We help AECO teams manage risk, control costs, and unlock value — turning complexity into confident decisions.', color: '#F6981F' },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl p-7 sm:p-9" style={{ background: '#1B2130', border: '1px solid #2A3145' }}>
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-2xl sm:text-3xl mb-5"
                  style={{ background: `${s.color}20`, border: `1px solid ${s.color}40` }}>{s.icon}</div>
                <h3 className="font-bold text-white mb-3 text-lg sm:text-xl" style={{ fontFamily: "'Nunito', sans-serif" }}>{s.title}</h3>
                <p className="text-sm sm:text-base" style={{ color: '#8892A4', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <a href="https://www.fractionalaeco.com/services" target="_blank"
              className="inline-block font-bold px-7 py-3 rounded-lg text-sm sm:text-base hover:opacity-90 transition-opacity"
              style={{ color: '#F6981F', textDecoration: 'none', border: '1.5px solid #F6981F' }}>
              Explore All Services →
            </a>
          </div>
        </div>
      </section>

      {/* For companies CTA */}
      <section id="companies" className="px-5 sm:px-14 py-16 sm:py-24 text-center" style={{ background: '#F6981F' }}>
        <div className="max-w-2xl mx-auto">
          <p className="text-xs sm:text-sm font-bold tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.75)' }}>FOR COMPANIES</p>
          <h2 className="font-bold text-white mb-4" style={{ fontFamily: "'Nunito', sans-serif", fontSize: 'clamp(28px, 6vw, 52px)', lineHeight: 1.05, letterSpacing: '-1.5px' }}>
            Need senior AECO firepower? Book by the hour.
          </h2>
          <p className="mb-10 text-sm sm:text-lg" style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>
            Tell us what you need. We&apos;ll match you with vetted senior practitioners, available fractionally — no recruiters, no overhead.
          </p>
          {/* CTA buttons — stacked on mobile */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="https://www.fractionalaeco.com/contact" target="_blank"
              className="w-full sm:w-auto font-bold text-base sm:text-lg px-9 py-4 rounded-xl hover:opacity-90 transition-opacity"
              style={{ background: 'white', color: '#F6981F', textDecoration: 'none', fontFamily: "'Nunito', sans-serif" }}>
              Talk to Fractional AECO
            </a>
            <a href="/signup"
              className="w-full sm:w-auto font-bold text-base sm:text-lg px-9 py-4 rounded-xl hover:opacity-80 transition-opacity"
              style={{ background: 'transparent', color: 'white', textDecoration: 'none', border: '2px solid rgba(255,255,255,0.6)' }}>
              Join as talent
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-5 sm:px-14 pt-12 sm:pt-14 pb-8 sm:pb-10 border-t" style={{ background: '#0A0D14', borderColor: '#2A3145', fontFamily: "'Nunito Sans', sans-serif" }}>
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-10 mb-10 sm:mb-12">
            <div>
              <div className="font-bold text-white text-xl sm:text-2xl" style={{ fontFamily: "'Nunito', sans-serif" }}>Fractus</div>
              <div className="text-xs sm:text-sm font-semibold mt-1" style={{ color: '#4A5568' }}>A Fractional AECO product</div>
              <a href="https://www.fractionalaeco.com" target="_blank"
                className="text-sm font-semibold mt-2 block hover:opacity-80" style={{ color: '#F6981F', textDecoration: 'none' }}>
                fractionalaeco.com
              </a>
            </div>
            <div className="flex gap-10 sm:gap-14 flex-wrap">
              <div>
                <div className="text-xs font-bold tracking-widest mb-4" style={{ color: '#2A3145' }}>PLATFORM</div>
                {[['Browse Talent', '/talent'], ['Listings', '/listings'], ['Create Profile', '/signup'], ['Sign In', '/login']].map(([label, href]) => (
                  <a key={label as string} href={href as string}
                    className="block text-sm font-semibold mb-2 hover:text-white transition-colors"
                    style={{ color: '#8892A4', textDecoration: 'none' }}>{label}</a>
                ))}
              </div>
              <div>
                <div className="text-xs font-bold tracking-widest mb-4" style={{ color: '#2A3145' }}>COMPANY</div>
                {[['Our Services', 'https://www.fractionalaeco.com/services'], ['About Us', 'https://www.fractionalaeco.com/about'], ['How We Work', 'https://www.fractionalaeco.com/how-we-work'], ['Contact', 'https://www.fractionalaeco.com/contact']].map(([label, href]) => (
                  <a key={label as string} href={href as string} target="_blank"
                    className="block text-sm font-semibold mb-2 hover:text-white transition-colors"
                    style={{ color: '#8892A4', textDecoration: 'none' }}>{label}</a>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-6 border-t" style={{ borderColor: '#1B2130' }}>
            <div className="text-xs sm:text-sm font-semibold" style={{ color: '#2A3145' }}>© 2026 Fractional-AECO LLC. All rights reserved.</div>
            <a href="tel:+19804940263" className="text-xs sm:text-sm font-semibold hover:text-white transition-colors"
              style={{ color: '#4A5568', textDecoration: 'none' }}>+1 980 494 0263</a>
          </div>
        </div>
      </footer>

    </main>
  )
}
