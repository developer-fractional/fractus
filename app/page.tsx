export default function Home() {
  return (
    <main className="min-h-screen" style={{background:'var(--color-bg)'}}>

      {/* Top bar */}
      <div className="text-white text-center py-3 px-4" style={{background:'var(--color-primary)', fontSize:'16px'}}>
        Powered by <a href="https://www.fractionalaeco.com" target="_blank" className="underline font-semibold hover:opacity-80">Fractional AECO</a> · Your AECO Experts · <a href="tel:+19804940263" className="underline hover:opacity-80">+1 980 494 0263</a>
      </div>

      {/* Navigation */}
      <nav className="flex items-center justify-between px-10 py-6 border-b" style={{background:'var(--color-bg)', borderColor:'var(--color-border)'}}>
        <div>
          <span className="font-bold" style={{color:'var(--color-accent)', fontSize:'32px'}}>Fractus</span>
          <span className="block text-gray-500" style={{fontSize:'14px'}}>by FractionalAECO</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-gray-400" style={{fontSize:'16px'}}>
          <a href="https://www.fractionalaeco.com/services" target="_blank" className="hover:text-white transition-colors">Our Services</a>
          <a href="https://www.fractionalaeco.com/about" target="_blank" className="hover:text-white transition-colors">About Us</a>
          <a href="https://www.fractionalaeco.com/how-we-work" target="_blank" className="hover:text-white transition-colors">How We Work</a>
          <a href="https://www.fractionalaeco.com/contact" target="_blank" className="hover:text-white transition-colors">Contact</a>
        </div>
        <div className="flex gap-4">
          <a href="/login" className="px-6 py-3 text-gray-400 hover:text-white font-medium transition-colors" style={{fontSize:'16px'}}>Login</a>
          <a href="/signup" className="px-6 py-3 text-white rounded-full font-semibold transition-colors" style={{background:'var(--color-primary)', fontSize:'16px'}}>Join Free</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-white text-center px-8 py-32" style={{background:'var(--color-bg)'}}>
        <p className="font-semibold uppercase tracking-widest mb-6" style={{color:'var(--color-accent)', fontSize:'16px'}}>Fractus · Powered by FractionalAECO</p>
        <h2 className="font-bold mb-8 max-w-4xl mx-auto leading-tight text-white" style={{fontSize:'64px'}}>
          Senior AECO Expertise.<br/>
          <span style={{color:'var(--color-accent)'}}>Fractional by Design.</span><br/>
          Built to Execute.
        </h2>
        <p className="text-gray-400 mb-12 max-w-3xl mx-auto" style={{fontSize:'22px', lineHeight:'1.7'}}>
          Your trusted partners for expert Architecture, Engineering, Construction, and Owner/Operator solutions — without overhiring or slowing down.
        </p>
        <div className="flex gap-5 justify-center flex-wrap">
          <a href="/signup" className="text-white rounded-full font-semibold transition-colors hover:opacity-90" style={{background:'var(--color-primary)', fontSize:'20px', padding:'18px 36px'}}>
            Find Smart People
          </a>
          <a href="/signup" className="border text-white rounded-full font-semibold hover:opacity-80 transition-colors" style={{borderColor:'var(--color-border)', fontSize:'20px', padding:'18px 36px'}}>
            Join as a Pro
          </a>
          <a href="https://www.fractionalaeco.com/contact" target="_blank" className="border rounded-full font-semibold transition-colors hover:opacity-80" style={{borderColor:'var(--color-primary)', color:'var(--color-accent)', fontSize:'20px', padding:'18px 36px'}}>
            Book a Consult
          </a>
        </div>
      </section>

      {/* Stats */}
      <section className="text-white py-10 px-8" style={{background:'var(--color-primary)'}}>
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4 text-center">
          {[
            { num: '500+', label: 'AECO Professionals' },
            { num: '3', label: 'Core Service Areas' },
            { num: '100%', label: 'Fractional Model' },
          ].map((s, i) => (
            <div key={i}>
              <div className="font-bold" style={{fontSize:'42px'}}>{s.num}</div>
              <div className="opacity-80 mt-1" style={{fontSize:'17px'}}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="px-8 py-24" style={{background:'var(--color-bg-card)'}}>
        <div className="max-w-5xl mx-auto">
          <p className="font-semibold uppercase tracking-widest text-center mb-4" style={{color:'var(--color-accent)', fontSize:'15px'}}>What We Offer</p>
          <h3 className="font-bold text-white text-center mb-14" style={{fontSize:'42px'}}>Our Services</h3>
          <div className="grid grid-cols-3 gap-8">
            {[
              { icon: '🏗️', title: 'Management Services', desc: 'Fractional AECO management that drives projects forward, mitigates risk, and gives your team the leadership it needs — without the cost of full-time hires.' },
              { icon: '💻', title: 'AECO Technology & Systems', desc: 'We help AECO teams adopt, optimize, and get real results from technology — embedded expertise that turns tools into executable outcomes.' },
              { icon: '📊', title: 'Insurance, Cost & Value', desc: 'We help AECO teams manage risk, control costs, and unlock value — turning complexity into confident decisions.' },
            ].map((s, i) => (
              <div key={i} className="p-8 rounded-2xl border transition-all hover:opacity-90" style={{background:'var(--color-bg)', borderColor:'var(--color-border)'}}>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5" style={{background:'var(--color-bg-card)', fontSize:'28px'}}>
                  {s.icon}
                </div>
                <h4 className="font-bold text-white mb-3" style={{fontSize:'20px'}}>{s.title}</h4>
                <p className="text-gray-400 leading-relaxed" style={{fontSize:'16px'}}>{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <a href="https://www.fractionalaeco.com/services" target="_blank" className="border rounded-full font-semibold transition-all hover:opacity-80" style={{borderColor:'var(--color-primary)', color:'var(--color-accent)', fontSize:'18px', padding:'14px 36px'}}>
              Explore All Services →
            </a>
          </div>
        </div>
      </section>

      {/* Who we serve */}
      <section className="px-8 py-24" style={{background:'var(--color-bg)'}}>
        <div className="max-w-5xl mx-auto">
          <p className="font-semibold uppercase tracking-widest text-center mb-4" style={{color:'var(--color-accent)', fontSize:'15px'}}>Who We Serve</p>
          <h3 className="font-bold text-white text-center mb-14" style={{fontSize:'42px'}}>Built for Every AECO Role</h3>
          <div className="grid grid-cols-3 gap-6">
            {[
              { icon: '👷', title: 'Contractors', desc: 'Project delivery, risk management, and field leadership on a fractional basis.' },
              { icon: '📐', title: 'Architects', desc: 'Design leadership, BIM expertise, and project oversight without full-time overhead.' },
              { icon: '🏢', title: 'Owners & Operators', desc: 'Asset management, operations optimization, and owner\'s rep services.' },
            ].map((r, i) => (
              <div key={i} className="p-8 rounded-2xl border text-center" style={{background:'var(--color-bg-card)', borderColor:'var(--color-border)'}}>
                <div style={{fontSize:'42px'}} className="mb-4">{r.icon}</div>
                <h4 className="font-bold text-white mb-3" style={{fontSize:'20px'}}>{r.title}</h4>
                <p className="text-gray-400 mb-4" style={{fontSize:'16px'}}>{r.desc}</p>
                <a href="https://www.fractionalaeco.com/services" target="_blank" className="font-semibold hover:opacity-80" style={{color:'var(--color-accent)', fontSize:'16px'}}>Learn More →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who we are */}
      <section className="px-8 py-24" style={{background:'var(--color-bg-card)'}}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-semibold uppercase tracking-widest mb-4" style={{color:'var(--color-accent)', fontSize:'15px'}}>Who We Are</p>
          <h3 className="font-bold text-white mb-8" style={{fontSize:'42px'}}>Shaping the Future of AECO</h3>
          <p className="text-gray-400 leading-relaxed mb-10" style={{fontSize:'20px'}}>
            We are shaping the future of the AECO industry by harnessing the power of top-tier talent through a fractional employment model that thrives on flexibility, innovation, and collaboration. Future-leaning in every sense — embracing emerging technologies, empowering the next generation of thinkers and builders.
          </p>
          <a href="https://www.fractionalaeco.com/about" target="_blank" className="text-white rounded-full font-semibold hover:opacity-90 transition-colors" style={{background:'var(--color-primary)', fontSize:'18px', padding:'16px 36px'}}>
            Learn More About Us →
          </a>
        </div>
      </section>

      {/* How it works */}
      <section className="text-white px-8 py-24" style={{background:'var(--color-bg)'}}>
        <div className="max-w-4xl mx-auto">
          <p className="font-semibold uppercase tracking-widest text-center mb-4" style={{color:'var(--color-accent)', fontSize:'15px'}}>How It Works</p>
          <h3 className="font-bold text-center mb-16" style={{fontSize:'42px'}}>Get Started in 3 Steps</h3>
          <div className="grid grid-cols-3 gap-10">
            {[
              { n: '1', title: 'Create Your Profile', desc: 'Sign up and build your AECO profile with your discipline, certifications, and availability.' },
              { n: '2', title: 'Get Verified', desc: 'Our team reviews your credentials and awards you a Verified badge so clients trust you instantly.' },
              { n: '3', title: 'Connect & Work', desc: 'Match with AECO organisations who need your exact expertise on a fractional basis.' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-5" style={{background:'var(--color-primary)', fontSize:'24px'}}>
                  {s.n}
                </div>
                <h4 className="font-bold mb-3" style={{fontSize:'20px'}}>{s.title}</h4>
                <p className="text-gray-400" style={{fontSize:'17px'}}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-white text-center px-8 py-20" style={{background:'var(--color-primary)'}}>
        <h3 className="font-bold mb-5" style={{fontSize:'42px'}}>Ready to elevate your AECO projects?</h3>
        <p className="opacity-80 mb-10" style={{fontSize:'22px'}}>Transformational solutions tailored for your project's unique needs.</p>
        <div className="flex gap-5 justify-center flex-wrap">
          <a href="/signup" className="rounded-full font-bold hover:opacity-90 transition-colors" style={{background:'white', color:'var(--color-primary)', fontSize:'20px', padding:'18px 40px'}}>
            Get Started Free
          </a>
          <a href="https://www.fractionalaeco.com/contact" target="_blank" className="border-2 border-white text-white rounded-full font-bold hover:bg-white/10 transition-colors" style={{fontSize:'20px', padding:'18px 40px'}}>
            Book Your Consult Today
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-gray-400 px-8 py-12" style={{background:'var(--color-bg)', borderTop:'1px solid var(--color-border)'}}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <span className="text-white font-bold" style={{fontSize:'22px'}}>Fractus</span>
            <span className="text-gray-500 ml-2" style={{fontSize:'16px'}}>by FractionalAECO</span>
            <p className="text-gray-600 mt-1" style={{fontSize:'13px'}}>fractus.fractional.com</p>
          </div>
          <div className="flex gap-8" style={{fontSize:'16px'}}>
            <a href="https://www.fractionalaeco.com/services" target="_blank" className="hover:text-white transition-colors">Our Services</a>
            <a href="https://www.fractionalaeco.com/about" target="_blank" className="hover:text-white transition-colors">About Us</a>
            <a href="https://www.fractionalaeco.com/how-we-work" target="_blank" className="hover:text-white transition-colors">How We Work</a>
            <a href="https://www.fractionalaeco.com/contact" target="_blank" className="hover:text-white transition-colors">Contact</a>
          </div>
          <div style={{fontSize:'16px'}}>
            <a href="tel:+19804940263" className="hover:text-white transition-colors">+1 980 494 0263</a>
          </div>
        </div>
        <div className="text-center text-gray-600 mt-10" style={{fontSize:'14px'}}>
          © 2026 Fractional-AECO LLC. All rights reserved. · Fractus platform powered by FractionalAECO.
        </div>
      </footer>

    </main>
  )
}