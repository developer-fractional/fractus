export default function Home() {
  return (
    <main style={{ background: '#0A0A0A' }}>

      {/* Top bar */}
      <div style={{ background: '#C41230', color: 'white', textAlign: 'center', padding: '10px 16px', fontSize: '14px', fontWeight: 500 }}>
        Powered by{' '}
        <a href="https://www.fractionalaeco.com" target="_blank" style={{ color: 'white', textDecoration: 'underline' }}>Fractional AECO</a>
        {' '}· Your AECO Experts ·{' '}
        <a href="tel:+19804940263" style={{ color: 'white', textDecoration: 'underline' }}>+1 980 494 0263</a>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 48px', background: '#0A0A0A', borderBottom: '1px solid #242424', position: 'sticky', top: 0, zIndex: 100 }}>
        <a href="/" style={{ textDecoration: 'none' }}>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#C41230', letterSpacing: '-0.5px' }}>Fractus</div>
          <div style={{ fontSize: '11px', color: '#666', marginTop: '-2px' }}>by FractionalAECO</div>
        </a>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <a href="https://www.fractionalaeco.com/services" target="_blank" style={{ color: '#A0A0A0', textDecoration: 'none', fontSize: '15px', fontWeight: 500 }}>Our Services</a>
          <a href="https://www.fractionalaeco.com/about" target="_blank" style={{ color: '#A0A0A0', textDecoration: 'none', fontSize: '15px', fontWeight: 500 }}>About Us</a>
          <a href="https://www.fractionalaeco.com/how-we-work" target="_blank" style={{ color: '#A0A0A0', textDecoration: 'none', fontSize: '15px', fontWeight: 500 }}>How We Work</a>
          <a href="/talent" style={{ color: '#A0A0A0', textDecoration: 'none', fontSize: '15px', fontWeight: 500 }}>Talent</a>
          <a href="https://www.fractionalaeco.com/contact" target="_blank" style={{ color: '#A0A0A0', textDecoration: 'none', fontSize: '15px', fontWeight: 500 }}>Contact</a>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <a href="/login" style={{ color: '#A0A0A0', textDecoration: 'none', fontSize: '15px', fontWeight: 500, padding: '8px 16px' }}>Sign in</a>
          <a href="/signup" style={{ background: '#C41230', color: 'white', textDecoration: 'none', fontSize: '15px', fontWeight: 600, padding: '10px 22px', borderRadius: '8px' }}>Join free</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: '#0A0A0A', padding: '100px 48px 80px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: 'rgba(196,18,48,0.12)', border: '1px solid rgba(196,18,48,0.3)', borderRadius: '100px', padding: '6px 18px', marginBottom: '28px' }}>
          <span style={{ color: '#C41230', fontSize: '13px', fontWeight: 600, letterSpacing: '0.05em' }}>FRACTUS · THE AECO TALENT NETWORK</span>
        </div>
        <h1 style={{ fontSize: '68px', fontWeight: 800, color: 'white', lineHeight: 1.05, letterSpacing: '-2px', maxWidth: '820px', margin: '0 auto 24px' }}>
          Senior AECO expertise,{' '}
          <span style={{ color: '#C41230' }}>fractional by design.</span>
        </h1>
        <p style={{ fontSize: '20px', color: '#888', lineHeight: 1.7, maxWidth: '580px', margin: '0 auto 48px' }}>
          A curated network of architects, engineers, and construction leaders. Build a LinkedIn-style profile, import your experience, and get booked by the hour.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/signup" style={{ background: '#C41230', color: 'white', textDecoration: 'none', fontSize: '17px', fontWeight: 600, padding: '16px 36px', borderRadius: '10px' }}>
            Create your profile
          </a>
          <a href="/talent" style={{ background: 'transparent', color: 'white', textDecoration: 'none', fontSize: '17px', fontWeight: 600, padding: '16px 36px', borderRadius: '10px', border: '1.5px solid #333' }}>
            Browse talent →
          </a>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '0', justifyContent: 'center', marginTop: '72px', borderTop: '1px solid #1F1F1F', paddingTop: '48px' }}>
          {[
            { num: '320+', label: 'Senior professionals' },
            { num: '42', label: 'Disciplines covered' },
            { num: '18 yrs', label: 'Avg. experience' },
            { num: '24h', label: 'Avg. time to match' },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center', borderRight: i < 3 ? '1px solid #1F1F1F' : 'none', padding: '0 32px' }}>
              <div style={{ fontSize: '38px', fontWeight: 800, color: 'white' }}>{s.num}</div>
              <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: '#111111', padding: '96px 48px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <p style={{ color: '#C41230', fontSize: '13px', fontWeight: 600, letterSpacing: '0.08em', textAlign: 'center', marginBottom: '12px' }}>HOW IT WORKS</p>
          <h2 style={{ fontSize: '44px', fontWeight: 800, color: 'white', textAlign: 'center', marginBottom: '8px', letterSpacing: '-1px' }}>From profile to project,</h2>
          <h2 style={{ fontSize: '44px', fontWeight: 800, color: '#555', textAlign: 'center', marginBottom: '64px', letterSpacing: '-1px' }}>in three moves.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2px', background: '#242424' }}>
            {[
              { num: '01', title: 'Build your profile', desc: 'LinkedIn-style profile with experience, certifications, and portfolio. Import directly from LinkedIn or upload your CV.' },
              { num: '02', title: 'Sync your presence', desc: 'Connect Indeed, Glassdoor, and other platforms. Keep one source of truth for your fractional availability.' },
              { num: '03', title: 'Get booked by the hour', desc: 'Companies discover, vet, and book your hours through Fractional AECO. You execute, we handle the rest.' },
            ].map((s, i) => (
              <div key={i} style={{ background: '#111', padding: '48px 40px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#C41230', marginBottom: '20px', letterSpacing: '0.05em' }}>{s.num}</div>
                <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'white', marginBottom: '14px' }}>{s.title}</h3>
                <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured talent */}
      <section style={{ background: '#0A0A0A', padding: '96px 48px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
            <div>
              <p style={{ color: '#C41230', fontSize: '13px', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '8px' }}>FEATURED TALENT</p>
              <h2 style={{ fontSize: '44px', fontWeight: 800, color: 'white', letterSpacing: '-1px', margin: 0 }}>A glimpse of the network.</h2>
            </div>
            <a href="/talent" style={{ color: '#C41230', textDecoration: 'none', fontSize: '15px', fontWeight: 600, border: '1.5px solid #C41230', padding: '10px 22px', borderRadius: '8px' }}>
              See all profiles →
            </a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {[
              { init: 'M', name: 'Marcus L.', role: 'Principal Architect', tags: ['Healthcare', 'Mass timber'], exp: '22 yrs', rate: '$240/h' },
              { init: 'P', name: 'Priya K.', role: 'Structural Engineer, PE', tags: ['High-rise', 'Seismic'], exp: '16 yrs', rate: '$185/h' },
              { init: 'D', name: 'David O.', role: 'Construction Director', tags: ['Megaprojects', 'P3'], exp: '27 yrs', rate: '$310/h' },
              { init: 'S', name: 'Sofia R.', role: 'MEP Lead', tags: ['Data centers', 'Net-zero'], exp: '14 yrs', rate: '$170/h' },
              { init: 'E', name: 'Ethan W.', role: 'BIM Manager', tags: ['Revit', 'ISO 19650'], exp: '11 yrs', rate: '$135/h' },
              { init: 'A', name: 'Amara N.', role: 'Sustainability Director', tags: ['LEED', 'Embodied carbon'], exp: '19 yrs', rate: '$220/h' },
            ].map((p, i) => (
              <a href="/talent" key={i} style={{ background: '#141414', border: '1px solid #242424', borderRadius: '12px', padding: '24px', textDecoration: 'none', display: 'block', transition: 'border-color 0.2s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                  <div style={{ width: '46px', height: '46px', borderRadius: '10px', background: '#C41230', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '18px', flexShrink: 0 }}>
                    {p.init}
                  </div>
                  <div>
                    <div style={{ color: 'white', fontWeight: 700, fontSize: '16px' }}>{p.name}</div>
                    <div style={{ color: '#888', fontSize: '13px', marginTop: '2px' }}>{p.role}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                  {p.tags.map((tag, j) => (
                    <span key={j} style={{ background: 'rgba(196,18,48,0.1)', color: '#C41230', fontSize: '12px', fontWeight: 500, padding: '4px 10px', borderRadius: '100px', border: '1px solid rgba(196,18,48,0.2)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid #242424' }}>
                  <span style={{ color: '#666', fontSize: '13px' }}>{p.exp} experience</span>
                  <span style={{ color: 'white', fontWeight: 700, fontSize: '15px' }}>{p.rate}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section style={{ background: '#111111', padding: '96px 48px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: '#C41230', fontSize: '13px', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '12px' }}>INTEGRATIONS</p>
          <h2 style={{ fontSize: '44px', fontWeight: 800, color: 'white', letterSpacing: '-1px', marginBottom: '12px' }}>Your career, already written.</h2>
          <h2 style={{ fontSize: '44px', fontWeight: 800, color: '#555', letterSpacing: '-1px', marginBottom: '24px' }}>Just import it.</h2>
          <p style={{ color: '#888', fontSize: '18px', lineHeight: 1.7, marginBottom: '48px', maxWidth: '560px', margin: '0 auto 48px' }}>
            Skip the form-filling. Pull your experience straight from the platforms you already use.
          </p>
          {/* Platform tabs */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '40px', flexWrap: 'wrap' }}>
            {['LinkedIn', 'Indeed', 'Glassdoor', 'AngelList', 'CV upload'].map((p, i) => (
              <span key={i} style={{ padding: '8px 20px', borderRadius: '100px', fontSize: '14px', fontWeight: 600, background: i === 0 ? '#C41230' : '#1A1A1A', color: i === 0 ? 'white' : '#666', border: `1px solid ${i === 0 ? '#C41230' : '#2A2A2A'}` }}>
                {p}
              </span>
            ))}
          </div>
          {/* Import preview */}
          <div style={{ background: '#0A0A0A', border: '1px solid #242424', borderRadius: '16px', padding: '28px', maxWidth: '480px', margin: '0 auto', textAlign: 'left' }}>
            <p style={{ color: '#888', fontSize: '13px', marginBottom: '20px' }}>Importing from LinkedIn…</p>
            {[
              { title: 'Senior Architect', company: 'Foster + Partners', years: '2019 — Present' },
              { title: 'Project Architect', company: 'Arup', years: '2014 — 2019' },
              { title: 'Designer', company: 'SOM', years: '2010 — 2014' },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: i < 2 ? '1px solid #1A1A1A' : 'none' }}>
                <div>
                  <div style={{ color: 'white', fontWeight: 600, fontSize: '15px' }}>{r.title}</div>
                  <div style={{ color: '#666', fontSize: '13px', marginTop: '2px' }}>{r.company}</div>
                </div>
                <div style={{ color: '#555', fontSize: '13px' }}>{r.years}</div>
              </div>
            ))}
            <div style={{ marginTop: '20px', padding: '10px 16px', background: 'rgba(196,18,48,0.1)', border: '1px solid rgba(196,18,48,0.2)', borderRadius: '8px', color: '#C41230', fontSize: '13px', fontWeight: 600, textAlign: 'center' }}>
              12 roles parsed · ready to publish
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section style={{ background: '#0A0A0A', padding: '96px 48px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ color: '#C41230', fontSize: '13px', fontWeight: 600, letterSpacing: '0.08em', textAlign: 'center', marginBottom: '12px' }}>WHAT WE OFFER</p>
          <h2 style={{ fontSize: '44px', fontWeight: 800, color: 'white', textAlign: 'center', letterSpacing: '-1px', marginBottom: '64px' }}>Our Services</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            {[
              { icon: '🏗️', title: 'Management Services', desc: 'Fractional AECO management that drives projects forward, mitigates risk, and gives your team the leadership it needs.' },
              { icon: '💻', title: 'AECO Technology & Systems', desc: 'We help AECO teams adopt, optimize, and get real results from technology — embedded expertise that turns tools into outcomes.' },
              { icon: '📊', title: 'Insurance, Cost & Value', desc: 'We help AECO teams manage risk, control costs, and unlock value — turning complexity into confident decisions.' },
            ].map((s, i) => (
              <div key={i} style={{ background: '#141414', border: '1px solid #242424', borderRadius: '12px', padding: '36px' }}>
                <div style={{ fontSize: '32px', marginBottom: '20px' }}>{s.icon}</div>
                <h3 style={{ color: 'white', fontWeight: 700, fontSize: '19px', marginBottom: '12px' }}>{s.title}</h3>
                <p style={{ color: '#888', fontSize: '15px', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <a href="https://www.fractionalaeco.com/services" target="_blank" style={{ color: '#C41230', textDecoration: 'none', fontSize: '15px', fontWeight: 600, border: '1.5px solid #C41230', padding: '12px 28px', borderRadius: '8px', display: 'inline-block' }}>
              Explore All Services →
            </a>
          </div>
        </div>
      </section>

      {/* For companies CTA */}
      <section style={{ background: '#C41230', padding: '96px 48px', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '12px' }}>FOR COMPANIES</p>
        <h2 style={{ fontSize: '48px', fontWeight: 800, color: 'white', letterSpacing: '-1.5px', marginBottom: '16px', maxWidth: '700px', margin: '0 auto 16px' }}>
          Need senior AECO firepower? Book by the hour.
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '18px', lineHeight: 1.7, maxWidth: '520px', margin: '0 auto 48px' }}>
          Tell us what you need. We'll match you with vetted senior practitioners, available fractionally — no recruiters, no overhead.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="https://www.fractionalaeco.com/contact" target="_blank" style={{ background: 'white', color: '#C41230', textDecoration: 'none', fontSize: '17px', fontWeight: 700, padding: '16px 36px', borderRadius: '10px' }}>
            Talk to Fractional AECO
          </a>
          <a href="/signup" style={{ background: 'transparent', color: 'white', textDecoration: 'none', fontSize: '17px', fontWeight: 600, padding: '16px 36px', borderRadius: '10px', border: '2px solid rgba(255,255,255,0.5)' }}>
            Join as talent
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#060606', padding: '56px 48px 40px', borderTop: '1px solid #1A1A1A' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '48px', flexWrap: 'wrap', gap: '32px' }}>
            <div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: 'white' }}>Fractus</div>
              <div style={{ fontSize: '13px', color: '#555', marginTop: '4px' }}>A Fractional AECO product</div>
              <a href="https://www.fractionalaeco.com" target="_blank" style={{ color: '#C41230', textDecoration: 'none', fontSize: '14px', marginTop: '8px', display: 'block' }}>fractionalaeco.com</a>
            </div>
            <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ color: '#444', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '16px' }}>PLATFORM</div>
                {[['Browse Talent', '/talent'], ['Create Profile', '/signup'], ['Sign In', '/login']].map(([label, href]) => (
                  <a key={label} href={href} style={{ display: 'block', color: '#888', textDecoration: 'none', fontSize: '14px', marginBottom: '10px' }}>{label}</a>
                ))}
              </div>
              <div>
                <div style={{ color: '#444', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '16px' }}>COMPANY</div>
                {[['Our Services', 'https://www.fractionalaeco.com/services'], ['About Us', 'https://www.fractionalaeco.com/about'], ['How We Work', 'https://www.fractionalaeco.com/how-we-work'], ['Contact', 'https://www.fractionalaeco.com/contact']].map(([label, href]) => (
                  <a key={label} href={href} target="_blank" style={{ display: 'block', color: '#888', textDecoration: 'none', fontSize: '14px', marginBottom: '10px' }}>{label}</a>
                ))}
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #1A1A1A', paddingTop: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ color: '#444', fontSize: '13px' }}>© 2026 Fractional-AECO LLC. All rights reserved.</div>
            <a href="tel:+19804940263" style={{ color: '#555', textDecoration: 'none', fontSize: '13px' }}>+1 980 494 0263</a>
          </div>
        </div>
      </footer>

    </main>
  )
}