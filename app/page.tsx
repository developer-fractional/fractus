import Link from 'next/link'

export default function Home() {
  return (
    <main style={{ background: '#0F1117', minHeight: '100vh', fontFamily: "'Nunito Sans', sans-serif" }}>

      {/* Top bar */}
      <div style={{ background: '#F6981F', color: 'white', textAlign: 'center', padding: '10px 16px', fontSize: '14px', fontWeight: 700, fontFamily: "'Nunito Sans', sans-serif" }}>
        Powered by{' '}
        <a href="https://www.fractionalaeco.com" target="_blank" style={{ color: 'white', textDecoration: 'underline' }}>Fractional AECO</a>
        {' '}· Your AECO Experts ·{' '}
        <a href="tel:+19804940263" style={{ color: 'white', textDecoration: 'underline' }}>+1 980 494 0263</a>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 56px', background: '#0F1117', borderBottom: '1px solid #2A3145', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: '10px' }}>
          <span style={{ fontSize: '26px', fontWeight: 800, color: '#F6981F', fontFamily: "'Nunito', sans-serif" }}>Fractus</span>
          <span style={{ fontSize: '11px', color: '#4A5568', fontWeight: 600, letterSpacing: '0.08em' }}>BY FRACTIONAL AECO</span>
        </Link>
        <div style={{ display: 'flex', gap: '36px', alignItems: 'center' }}>
          {[
            ['Talent', '/talent'],
            ['How it works', '#how'],
            ['Integrations', '#integrations'],
            ['For companies', '#companies'],
          ].map(([label, href]) => (
            <a key={label} href={href} style={{ color: '#8892A4', textDecoration: 'none', fontSize: '15px', fontWeight: 600 }}>{label}</a>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <a href="/login" style={{ color: '#8892A4', textDecoration: 'none', fontSize: '15px', fontWeight: 600 }}>Sign in</a>
          <a href="/signup" style={{ background: '#F6981F', color: 'white', textDecoration: 'none', fontSize: '14px', fontWeight: 700, padding: '10px 22px', borderRadius: '8px' }}>
            Join free
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '100px 56px 80px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
          <div style={{ width: '32px', height: '2px', background: '#05809B' }}></div>
          <span style={{ color: '#05809B', fontSize: '13px', fontWeight: 700, letterSpacing: '0.1em' }}>FRACTUS · THE AECO TALENT NETWORK</span>
        </div>
        <h1 style={{ fontFamily: "'Nunito', sans-serif", fontSize: '72px', fontWeight: 800, color: 'white', lineHeight: 1.05, letterSpacing: '-2px', maxWidth: '800px', margin: '0 0 28px' }}>
          Senior AECO expertise,{' '}
          <span style={{ color: '#F6981F', fontStyle: 'italic' }}>fractional</span>{' '}by design.
        </h1>
        <p style={{ fontSize: '20px', color: '#8892A4', lineHeight: 1.7, maxWidth: '560px', margin: '0 0 48px', fontWeight: 400 }}>
          A curated network of architects, engineers, and construction leaders. Build a LinkedIn-style profile, import your experience, and get booked by the hour.
        </p>
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <a href="/signup" style={{ background: '#F6981F', color: 'white', textDecoration: 'none', fontSize: '17px', fontWeight: 700, padding: '16px 32px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Create your profile ↗
          </a>
          <a href="/talent" style={{ background: 'transparent', color: '#8892A4', textDecoration: 'none', fontSize: '17px', fontWeight: 600, padding: '16px 24px', borderRadius: '10px', border: '1.5px solid #2A3145' }}>
            Browse talent →
          </a>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', marginTop: '80px', paddingTop: '48px', borderTop: '1px solid #2A3145' }}>
          {[
            { num: '320+', label: 'Senior professionals' },
            { num: '42', label: 'Disciplines covered' },
            { num: '18 yrs', label: 'Avg. experience' },
            { num: '24h', label: 'Avg. time to match' },
          ].map((s, i) => (
            <div key={i} style={{ paddingRight: '56px', marginRight: i < 3 ? '56px' : '0', borderRight: i < 3 ? '1px solid #2A3145' : 'none' }}>
              <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: '40px', fontWeight: 800, color: 'white' }}>{s.num}</div>
              <div style={{ fontSize: '14px', color: '#4A5568', fontWeight: 600, marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{ padding: '96px 56px', background: '#161C28', borderTop: '1px solid #2A3145' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start', marginBottom: '64px' }}>
            <div>
              <p style={{ color: '#05809B', fontSize: '13px', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '16px' }}>HOW IT WORKS</p>
              <h2 style={{ fontFamily: "'Nunito', sans-serif", fontSize: '48px', fontWeight: 800, color: 'white', lineHeight: 1.1, letterSpacing: '-1px', margin: 0 }}>
                From profile to project, in three moves.
              </h2>
            </div>
            <div style={{ paddingTop: '40px' }}>
              <p style={{ color: '#8892A4', fontSize: '18px', lineHeight: 1.7, fontWeight: 400 }}>
                Built for senior practitioners who&apos;d rather execute than chase work, and for teams that need expertise on demand.
              </p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderTop: '1px solid #2A3145' }}>
            {[
              { num: '01', icon: '🔗', title: 'Build your profile', desc: 'LinkedIn-style profile with experience, certifications, and portfolio. Import directly from LinkedIn or upload your CV.' },
              { num: '02', icon: '🔄', title: 'Sync your presence', desc: 'Connect Indeed, Glassdoor, and other platforms. Keep one source of truth for your fractional availability.' },
              { num: '03', icon: '⚡', title: 'Get booked by the hour', desc: 'Companies discover, vet, and book your hours through Fractional AECO. You execute, we handle the rest.' },
            ].map((s, i) => (
              <div key={i} style={{ padding: '48px 40px 48px', paddingLeft: i > 0 ? '40px' : '0', borderRight: i < 2 ? '1px solid #2A3145' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
                  <span style={{ fontSize: '28px' }}>{s.icon}</span>
                  <span style={{ color: '#2A3145', fontSize: '13px', fontWeight: 700, letterSpacing: '0.05em' }}>{s.num}</span>
                </div>
                <h3 style={{ fontFamily: "'Nunito', sans-serif", fontSize: '22px', fontWeight: 800, color: 'white', marginBottom: '12px' }}>{s.title}</h3>
                <p style={{ color: '#8892A4', fontSize: '15px', lineHeight: 1.7, fontWeight: 400 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured talent */}
      <section style={{ padding: '96px 56px', background: '#0F1117', borderTop: '1px solid #2A3145' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
            <div>
              <p style={{ color: '#05809B', fontSize: '13px', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '8px' }}>FEATURED TALENT</p>
              <h2 style={{ fontFamily: "'Nunito', sans-serif", fontSize: '48px', fontWeight: 800, color: 'white', letterSpacing: '-1px', margin: 0 }}>
                A glimpse of the network.
              </h2>
            </div>
            <a href="/talent" style={{ color: '#F6981F', textDecoration: 'none', fontSize: '15px', fontWeight: 700, border: '1.5px solid #F6981F', padding: '10px 22px', borderRadius: '8px' }}>
              See all profiles →
            </a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {[
              { init: 'M', name: 'Marcus L.', role: 'Principal Architect', tags: ['Healthcare', 'Mass timber'], exp: '22 yrs', rate: '$240/h', color: '#F6981F' },
              { init: 'P', name: 'Priya K.', role: 'Structural Engineer, PE', tags: ['High-rise', 'Seismic'], exp: '16 yrs', rate: '$185/h', color: '#05809B' },
              { init: 'D', name: 'David O.', role: 'Construction Director', tags: ['Megaprojects', 'P3'], exp: '27 yrs', rate: '$310/h', color: '#F6981F' },
              { init: 'S', name: 'Sofia R.', role: 'MEP Lead', tags: ['Data centers', 'Net-zero'], exp: '14 yrs', rate: '$170/h', color: '#05809B' },
              { init: 'E', name: 'Ethan W.', role: 'BIM Manager', tags: ['Revit', 'ISO 19650'], exp: '11 yrs', rate: '$135/h', color: '#F6981F' },
              { init: 'A', name: 'Amara N.', role: 'Sustainability Director', tags: ['LEED', 'Embodied carbon'], exp: '19 yrs', rate: '$220/h', color: '#05809B' },
            ].map((p, i) => (
              <a key={i} href="/talent" style={{ background: '#1B2130', border: '1px solid #2A3145', borderRadius: '14px', padding: '28px', textDecoration: 'none', display: 'block' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '10px', background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '20px', fontFamily: "'Nunito', sans-serif" }}>
                      {p.init}
                    </div>
                    <div>
                      <div style={{ color: 'white', fontWeight: 700, fontSize: '17px', fontFamily: "'Nunito Sans', sans-serif" }}>{p.name}</div>
                      <div style={{ color: '#8892A4', fontSize: '13px', marginTop: '2px' }}>{p.role}</div>
                    </div>
                  </div>
                  <span style={{ color: '#4A5568', fontSize: '16px' }}>↗</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                  {p.tags.map((tag, j) => (
                    <span key={j} style={{ border: '1px solid #2A3145', color: '#8892A4', fontSize: '12px', padding: '4px 12px', borderRadius: '6px', fontWeight: 600 }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #2A3145' }}>
                  <span style={{ color: '#4A5568', fontSize: '13px', fontWeight: 600 }}>{p.exp} experience</span>
                  <span style={{ color: '#05809B', fontWeight: 800, fontSize: '17px', fontFamily: "'Nunito', sans-serif" }}>{p.rate}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section id="integrations" style={{ padding: '96px 56px', background: '#161C28', borderTop: '1px solid #2A3145' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          <div>
            <p style={{ color: '#05809B', fontSize: '13px', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '16px' }}>INTEGRATIONS</p>
            <h2 style={{ fontFamily: "'Nunito', sans-serif", fontSize: '44px', fontWeight: 800, color: 'white', lineHeight: 1.1, letterSpacing: '-1px', marginBottom: '20px' }}>
              Your career, already written.{' '}
              <span style={{ color: '#F6981F', fontStyle: 'italic' }}>Just import it.</span>
            </h2>
            <p style={{ color: '#8892A4', fontSize: '17px', lineHeight: 1.7, marginBottom: '32px', fontWeight: 400 }}>
              Skip the form-filling. Pull your experience straight from the platforms you already use, and keep everything in sync.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['LinkedIn', 'Indeed', 'Glassdoor', 'AngelList', 'CV upload'].map((p, i) => (
                <span key={i} style={{ padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, background: i === 0 ? '#F6981F' : '#1B2130', color: i === 0 ? 'white' : '#4A5568', border: `1px solid ${i === 0 ? '#F6981F' : '#2A3145'}` }}>
                  {p}
                </span>
              ))}
            </div>
          </div>
          {/* Import preview */}
          <div style={{ background: '#0F1117', border: '1px solid #2A3145', borderRadius: '16px', padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#05809B' }}></div>
              <span style={{ color: '#4A5568', fontSize: '13px', fontFamily: 'monospace', fontWeight: 600 }}>Importing from LinkedIn…</span>
            </div>
            {[
              { title: 'Senior Architect', company: 'Foster + Partners', years: '2019 — Present', color: '#F6981F' },
              { title: 'Project Architect', company: 'Arup', years: '2014 — 2019', color: '#05809B' },
              { title: 'Designer', company: 'SOM', years: '2010 — 2014', color: '#F6981F' },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 0', borderBottom: i < 2 ? '1px solid #1B2130' : 'none' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: r.color, flexShrink: 0, opacity: 0.8 }}></div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: '15px' }}>{r.title}</div>
                  <div style={{ color: '#4A5568', fontSize: '13px', marginTop: '2px', fontWeight: 600 }}>{r.company}</div>
                </div>
                <span style={{ color: '#2A3145', fontSize: '13px', fontWeight: 600 }}>{r.years}</span>
              </div>
            ))}
            <div style={{ marginTop: '20px', padding: '12px 16px', background: 'rgba(5,128,155,0.1)', border: '1px solid rgba(5,128,155,0.3)', borderRadius: '8px', color: '#05809B', fontSize: '13px', fontWeight: 700, textAlign: 'center' }}>
              ✓ 12 roles parsed · ready to publish
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section style={{ padding: '96px 56px', background: '#0F1117', borderTop: '1px solid #2A3145' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ color: '#05809B', fontSize: '13px', fontWeight: 700, letterSpacing: '0.1em', textAlign: 'center', marginBottom: '12px' }}>WHAT WE OFFER</p>
          <h2 style={{ fontFamily: "'Nunito', sans-serif", fontSize: '48px', fontWeight: 800, color: 'white', textAlign: 'center', letterSpacing: '-1px', marginBottom: '56px' }}>Our Services</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            {[
              { icon: '🏗️', title: 'Management Services', desc: 'Fractional AECO management that drives projects forward, mitigates risk, and gives your team the leadership it needs.', color: '#F6981F' },
              { icon: '💻', title: 'AECO Technology & Systems', desc: 'We help AECO teams adopt, optimize, and get real results from technology — embedded expertise that turns tools into outcomes.', color: '#05809B' },
              { icon: '📊', title: 'Insurance, Cost & Value', desc: 'We help AECO teams manage risk, control costs, and unlock value — turning complexity into confident decisions.', color: '#F6981F' },
            ].map((s, i) => (
              <div key={i} style={{ background: '#1B2130', border: '1px solid #2A3145', borderRadius: '14px', padding: '36px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: `${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', marginBottom: '20px', border: `1px solid ${s.color}40` }}>
                  {s.icon}
                </div>
                <h3 style={{ fontFamily: "'Nunito', sans-serif", color: 'white', fontWeight: 800, fontSize: '20px', marginBottom: '12px' }}>{s.title}</h3>
                <p style={{ color: '#8892A4', fontSize: '15px', lineHeight: 1.7, fontWeight: 400 }}>{s.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <a href="https://www.fractionalaeco.com/services" target="_blank" style={{ color: '#F6981F', textDecoration: 'none', fontSize: '16px', fontWeight: 700, border: '1.5px solid #F6981F', padding: '13px 28px', borderRadius: '8px', display: 'inline-block' }}>
              Explore All Services →
            </a>
          </div>
        </div>
      </section>

      {/* For companies CTA */}
      <section id="companies" style={{ padding: '96px 56px', background: '#F6981F', textAlign: 'center' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '16px' }}>FOR COMPANIES</p>
          <h2 style={{ fontFamily: "'Nunito', sans-serif", fontSize: '52px', fontWeight: 800, color: 'white', lineHeight: 1.05, letterSpacing: '-1.5px', marginBottom: '16px' }}>
            Need senior AECO firepower? Book by the hour.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '19px', lineHeight: 1.7, marginBottom: '48px', fontWeight: 400 }}>
            Tell us what you need. We&apos;ll match you with vetted senior practitioners, available fractionally — no recruiters, no overhead.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://www.fractionalaeco.com/contact" target="_blank" style={{ background: 'white', color: '#F6981F', textDecoration: 'none', fontSize: '17px', fontWeight: 800, padding: '16px 36px', borderRadius: '10px', fontFamily: "'Nunito', sans-serif" }}>
              Talk to Fractional AECO
            </a>
            <a href="/signup" style={{ background: 'transparent', color: 'white', textDecoration: 'none', fontSize: '17px', fontWeight: 700, padding: '16px 36px', borderRadius: '10px', border: '2px solid rgba(255,255,255,0.6)' }}>
              Join as talent
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0A0D14', borderTop: '1px solid #2A3145', padding: '56px 56px 40px', fontFamily: "'Nunito Sans', sans-serif" }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '48px', flexWrap: 'wrap', gap: '32px' }}>
            <div>
              <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: '24px', fontWeight: 800, color: 'white' }}>Fractus</div>
              <div style={{ fontSize: '13px', color: '#4A5568', marginTop: '4px', fontWeight: 600 }}>A Fractional AECO product</div>
              <a href="https://www.fractionalaeco.com" target="_blank" style={{ color: '#F6981F', textDecoration: 'none', fontSize: '14px', marginTop: '8px', display: 'block', fontWeight: 600 }}>fractionalaeco.com</a>
            </div>
            <div style={{ display: 'flex', gap: '56px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ color: '#2A3145', fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '16px' }}>PLATFORM</div>
                {[['Browse Talent', '/talent'], ['Listings', '/listings'], ['Create Profile', '/signup'], ['Sign In', '/login']].map(([label, href]) => (
                  <a key={label} href={href} style={{ display: 'block', color: '#8892A4', textDecoration: 'none', fontSize: '14px', marginBottom: '10px', fontWeight: 600 }}>{label}</a>
                ))}
              </div>
              <div>
                <div style={{ color: '#2A3145', fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '16px' }}>COMPANY</div>
                {[['Our Services', 'https://www.fractionalaeco.com/services'], ['About Us', 'https://www.fractionalaeco.com/about'], ['How We Work', 'https://www.fractionalaeco.com/how-we-work'], ['Contact', 'https://www.fractionalaeco.com/contact']].map(([label, href]) => (
                  <a key={label} href={href} target="_blank" style={{ display: 'block', color: '#8892A4', textDecoration: 'none', fontSize: '14px', marginBottom: '10px', fontWeight: 600 }}>{label}</a>
                ))}
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #1B2130', paddingTop: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ color: '#2A3145', fontSize: '13px', fontWeight: 600 }}>© 2026 Fractional-AECO LLC. All rights reserved.</div>
            <a href="tel:+19804940263" style={{ color: '#4A5568', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>+1 980 494 0263</a>
          </div>
        </div>
      </footer>

    </main>
  )
}