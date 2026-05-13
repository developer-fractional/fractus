export default function Home() {
  return (
    <main style={{ background: '#0D0A06', minHeight: '100vh' }}>

      {/* Top bar */}
      <div style={{ background: '#D4A017', color: '#0D0A06', textAlign: 'center', padding: '9px 16px', fontSize: '13px', fontWeight: 600 }}>
        Powered by{' '}
        <a href="https://www.fractionalaeco.com" target="_blank" style={{ color: '#0D0A06', textDecoration: 'underline' }}>Fractional AECO</a>
        {' '}· Your AECO Experts ·{' '}
        <a href="tel:+19804940263" style={{ color: '#0D0A06', textDecoration: 'underline' }}>+1 980 494 0263</a>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 56px', background: '#0D0A06', borderBottom: '1px solid #2A2420', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(12px)' }}>
        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: '10px' }}>
          <span style={{ fontSize: '24px', fontWeight: 700, color: '#D4A017', fontFamily: 'var(--font-serif)' }}>Fractus</span>
          <span style={{ fontSize: '12px', color: '#555', fontWeight: 400, letterSpacing: '0.05em' }}>BY FRACTIONAL AECO</span>
        </a>
        <div style={{ display: 'flex', gap: '36px', alignItems: 'center' }}>
          {[
            ['Talent', '/talent'],
            ['How it works', '#how'],
            ['Integrations', '#integrations'],
            ['For companies', '#companies'],
          ].map(([label, href]) => (
            <a key={label} href={href} style={{ color: '#888', textDecoration: 'none', fontSize: '15px', fontWeight: 500 }}>{label}</a>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <a href="/login" style={{ color: '#888', textDecoration: 'none', fontSize: '15px', fontWeight: 500 }}>Sign in</a>
          <a href="/signup" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', fontWeight: 600, padding: '9px 20px', borderRadius: '100px', border: '1.5px solid #555' }}>Join free</a>
        </div>
      </nav>

      {/* Hero — left aligned like Lovable */}
      <section style={{ padding: '100px 56px 80px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
          <div style={{ width: '32px', height: '1px', background: '#2DD4BF' }}></div>
          <span style={{ color: '#2DD4BF', fontSize: '13px', fontWeight: 600, letterSpacing: '0.08em' }}>FRACTUS · THE AECO TALENT NETWORK</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '76px', fontWeight: 700, color: 'white', lineHeight: 1.0, letterSpacing: '-2px', maxWidth: '780px', margin: '0 0 32px' }}>
          Senior AECO expertise,{' '}
          <span style={{ color: '#2DD4BF', fontStyle: 'italic' }}>fractional</span>{' '}by design.
        </h1>
        <p style={{ fontSize: '19px', color: '#888', lineHeight: 1.7, maxWidth: '520px', margin: '0 0 48px' }}>
          A curated network of architects, engineers, and construction leaders. Build a LinkedIn-style profile, import your experience, and get booked by the hour by companies that need senior execution — now.
        </p>
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <a href="/signup" style={{ background: '#D4A017', color: 'white', textDecoration: 'none', fontSize: '16px', fontWeight: 600, padding: '14px 30px', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Create your profile <span>↗</span>
          </a>
          <a href="/talent" style={{ background: 'transparent', color: '#888', textDecoration: 'none', fontSize: '16px', fontWeight: 500, padding: '14px 24px', borderRadius: '100px', border: '1px solid #2A2420', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🔍 Browse talent
          </a>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, auto)', gap: '0', marginTop: '80px', paddingTop: '48px', borderTop: '1px solid #2A2420', width: 'fit-content' }}>
          {[
            { num: '320+', label: 'Senior professionals' },
            { num: '42', label: 'Disciplines covered' },
            { num: '18 yrs', label: 'Avg. experience' },
            { num: '24h', label: 'Avg. time to match' },
          ].map((s, i) => (
            <div key={i} style={{ paddingRight: '56px', marginRight: i < 3 ? '56px' : '0', borderRight: i < 3 ? '1px solid #2A2420' : 'none' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '42px', fontWeight: 700, color: 'white', letterSpacing: '-1px' }}>{s.num}</div>
              <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{ padding: '96px 56px', background: '#0D0A06', borderTop: '1px solid #2A2420' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start', marginBottom: '64px' }}>
            <div>
              <p style={{ color: '#2DD4BF', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '16px' }}>HOW IT WORKS</p>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '52px', fontWeight: 700, color: 'white', lineHeight: 1.1, letterSpacing: '-1.5px', margin: 0 }}>
                From profile to project, in three moves.
              </h2>
            </div>
            <div style={{ paddingTop: '48px' }}>
              <p style={{ color: '#666', fontSize: '17px', lineHeight: 1.7 }}>
                Built for senior practitioners who'd rather execute than chase work, and for teams that need expertise on demand.
              </p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderTop: '1px solid #2A2420' }}>
            {[
              { num: '01', icon: 'in', title: 'Build your profile', desc: 'LinkedIn-style profile with experience, certifications, and portfolio. Import directly from LinkedIn or upload your CV.' },
              { num: '02', icon: '⊕', title: 'Sync your presence', desc: 'Connect Indeed, Glassdoor, and other platforms. Keep one source of truth for your fractional availability.' },
              { num: '03', icon: '⊡', title: 'Get booked by the hour', desc: 'Companies discover, vet, and book your hours through Fractional AECO. You execute, we handle the rest.' },
            ].map((s, i) => (
              <div key={i} style={{ padding: '48px 40px 48px 0', paddingLeft: i > 0 ? '40px' : '0', borderRight: i < 2 ? '1px solid #2A2420' : 'none', borderLeft: i > 0 ? '1px solid #2A2420' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                  <span style={{ color: '#2DD4BF', fontSize: '18px', fontWeight: 600 }}>{s.icon}</span>
                  <span style={{ color: '#333', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em' }}>{s.num}</span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 600, color: 'white', marginBottom: '14px' }}>{s.title}</h3>
                <p style={{ color: '#666', fontSize: '15px', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured talent */}
      <section style={{ padding: '96px 56px', background: '#0A0806', borderTop: '1px solid #2A2420' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '52px', fontWeight: 700, color: 'white', letterSpacing: '-1.5px', margin: 0 }}>
              A glimpse of the network.
            </h2>
            <a href="/talent" style={{ color: '#888', textDecoration: 'none', fontSize: '15px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid #2A2420', padding: '10px 18px', borderRadius: '100px' }}>
              See all profiles ↗
            </a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {[
              { init: 'M', name: 'Marcus L.', role: 'Principal Architect', tags: ['Healthcare', 'Mass timber'], exp: '22 yrs experience', rate: '$240/h', gradient: 'linear-gradient(135deg, #8B7355, #5C4A2A)' },
              { init: 'P', name: 'Priya K.', role: 'Structural Engineer, PE', tags: ['High-rise', 'Seismic'], exp: '16 yrs experience', rate: '$185/h', gradient: 'linear-gradient(135deg, #4A7A6B, #2A5A4B)' },
              { init: 'D', name: 'David O.', role: 'Construction Director', tags: ['Megaprojects', 'P3'], exp: '27 yrs experience', rate: '$310/h', gradient: 'linear-gradient(135deg, #6B5A7A, #4A3A5A)' },
              { init: 'S', name: 'Sofia R.', role: 'MEP Lead', tags: ['Data centers', 'Net-zero'], exp: '14 yrs experience', rate: '$170/h', gradient: 'linear-gradient(135deg, #7A6B4A, #5A4B2A)' },
              { init: 'E', name: 'Ethan W.', role: 'BIM Manager', tags: ['Revit', 'ISO 19650'], exp: '11 yrs experience', rate: '$135/h', gradient: 'linear-gradient(135deg, #4A6B7A, #2A4B5A)' },
              { init: 'A', name: 'Amara N.', role: 'Sustainability Director', tags: ['LEED', 'Embodied carbon'], exp: '19 yrs experience', rate: '$220/h', gradient: 'linear-gradient(135deg, #7A4A6B, #5A2A4B)' },
            ].map((p, i) => (
              <a key={i} href="/talent" style={{ background: '#141210', border: '1px solid #2A2420', borderRadius: '16px', padding: '28px', textDecoration: 'none', display: 'block', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: p.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '20px', fontFamily: 'var(--font-serif)' }}>
                      {p.init}
                    </div>
                    <div>
                      <div style={{ color: 'white', fontWeight: 600, fontSize: '17px', fontFamily: 'var(--font-serif)' }}>{p.name}</div>
                      <div style={{ color: '#666', fontSize: '13px', marginTop: '3px' }}>{p.role}</div>
                    </div>
                  </div>
                  <span style={{ color: '#444', fontSize: '16px' }}>↗</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                  {p.tags.map((tag, j) => (
                    <span key={j} style={{ border: '1px solid #2A2420', color: '#888', fontSize: '12px', padding: '4px 12px', borderRadius: '100px' }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '18px', borderTop: '1px solid #2A2420' }}>
                  <span style={{ color: '#555', fontSize: '13px' }}>{p.exp}</span>
                  <span style={{ color: '#2DD4BF', fontWeight: 700, fontSize: '17px' }}>{p.rate}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations — split layout like Lovable */}
      <section id="integrations" style={{ padding: '96px 56px', background: '#0D0A06', borderTop: '1px solid #2A2420' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          <div>
            <p style={{ color: '#2DD4BF', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '16px' }}>INTEGRATIONS</p>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '48px', fontWeight: 700, color: 'white', lineHeight: 1.1, letterSpacing: '-1px', marginBottom: '20px' }}>
              Your career, already written.{' '}
              <span style={{ color: '#2DD4BF', fontStyle: 'italic' }}>Just import it.</span>
            </h2>
            <p style={{ color: '#666', fontSize: '17px', lineHeight: 1.7, marginBottom: '36px' }}>
              Skip the form-filling. Pull your experience straight from the platforms you already use, and keep everything in sync.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['LinkedIn', 'Indeed', 'Glassdoor', 'AngelList', 'CV upload'].map((p, i) => (
                <span key={i} style={{ padding: '8px 18px', borderRadius: '100px', fontSize: '13px', fontWeight: 500, background: 'transparent', color: i === 0 ? 'white' : '#555', border: `1px solid ${i === 0 ? '#555' : '#2A2420'}` }}>
                  {p}
                </span>
              ))}
            </div>
          </div>
          {/* Import preview card */}
          <div style={{ background: '#141210', border: '1px solid #2A2420', borderRadius: '20px', padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2DD4BF' }}></div>
              <span style={{ color: '#666', fontSize: '13px', fontFamily: 'monospace' }}>Importing from LinkedIn…</span>
            </div>
            {[
              { title: 'Senior Architect', company: 'Foster + Partners', years: '2019 — Present', gradient: 'linear-gradient(135deg, #C4A882, #8B7355)' },
              { title: 'Project Architect', company: 'Arup', years: '2014 — 2019', gradient: 'linear-gradient(135deg, #82B4C4, #4A7A8B)' },
              { title: 'Designer', company: 'SOM', years: '2010 — 2014', gradient: 'linear-gradient(135deg, #C4C482, #8B8B55)' },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 0', borderBottom: i < 2 ? '1px solid #1E1C18' : 'none' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: r.gradient, flexShrink: 0 }}></div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: 'white', fontWeight: 600, fontSize: '15px' }}>{r.title}</div>
                  <div style={{ color: '#666', fontSize: '13px', marginTop: '2px' }}>{r.company}</div>
                </div>
                <span style={{ color: '#444', fontSize: '13px', whiteSpace: 'nowrap' }}>{r.years}</span>
              </div>
            ))}
            <div style={{ marginTop: '24px', padding: '12px 16px', background: 'rgba(45,212,191,0.08)', border: '1px solid rgba(45,212,191,0.2)', borderRadius: '10px', color: '#2DD4BF', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              ⚙ 12 roles parsed · ready to publish
            </div>
          </div>
        </div>
      </section>

      {/* For companies */}
      <section id="companies" style={{ padding: '96px 56px', background: '#0A0806', borderTop: '1px solid #2A2420', textAlign: 'center' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <p style={{ color: '#666', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '20px' }}>FOR COMPANIES</p>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '56px', fontWeight: 700, color: 'white', lineHeight: 1.05, letterSpacing: '-1.5px', marginBottom: '20px' }}>
            Need senior AECO firepower?{' '}
            <span style={{ color: '#2DD4BF', fontStyle: 'italic' }}>Book by the hour.</span>
          </h2>
          <p style={{ color: '#666', fontSize: '18px', lineHeight: 1.7, marginBottom: '48px' }}>
            Tell us what you need. We'll match you with vetted senior practitioners, available fractionally — no recruiters, no overhead.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
            <a href="https://www.fractionalaeco.com/contact" target="_blank" style={{ background: '#D4A017', color: 'white', textDecoration: 'none', fontSize: '16px', fontWeight: 600, padding: '15px 32px', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Talk to Fractional AECO ↗
            </a>
            <a href="/signup" style={{ background: 'transparent', color: '#888', textDecoration: 'none', fontSize: '16px', fontWeight: 500, padding: '15px 32px', borderRadius: '100px', border: '1px solid #2A2420' }}>
              Join as talent
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0D0A06', borderTop: '1px solid #2A2420', padding: '48px 56px 36px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 700, color: 'white' }}>Fractus</span>
            <span style={{ color: '#444', fontSize: '13px' }}>· A Fractional AECO product</span>
          </div>
          <div style={{ display: 'flex', gap: '32px' }}>
            <a href="https://www.fractionalaeco.com" target="_blank" style={{ color: '#555', textDecoration: 'none', fontSize: '14px' }}>fractionalaeco.com</a>
            <a href="tel:+19804940263" style={{ color: '#555', textDecoration: 'none', fontSize: '14px' }}>+1 980 494 0263</a>
          </div>
        </div>
        <div style={{ maxWidth: '1200px', margin: '28px auto 0', paddingTop: '24px', borderTop: '1px solid #1A1A1A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#333', fontSize: '13px' }}>© 2026 Fractional-AECO LLC.</span>
          <div style={{ display: 'flex', gap: '24px' }}>
            {[['Browse Talent', '/talent'], ['Create Profile', '/signup'], ['Sign In', '/login'], ['Our Services', 'https://www.fractionalaeco.com/services']].map(([label, href]) => (
              <a key={label} href={href} style={{ color: '#444', textDecoration: 'none', fontSize: '13px' }}>{label}</a>
            ))}
          </div>
        </div>
      </footer>

    </main>
  )
}