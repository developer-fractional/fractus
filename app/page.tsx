export default function Home() {
  return (
    <main className="min-h-screen bg-white">

      {/* Top bar */}
      <div className="bg-red-700 text-white text-center text-sm py-2 px-4">
        Powered by <a href="https://www.fractionalaeco.com" target="_blank" className="underline font-medium hover:text-red-200">Fractional AECO</a> · Your AECO Experts · <a href="tel:+19804940263" className="underline hover:text-red-200">+1 980 494 0263</a>
      </div>

      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-3">
          <div>
            <span className="text-2xl font-bold text-red-700">Fractus</span>
            <span className="text-xs text-gray-400 block leading-none">by FractionalAECO</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <a href="https://www.fractionalaeco.com/services" target="_blank" className="hover:text-red-700">Our Services</a>
          <a href="https://www.fractionalaeco.com/about" target="_blank" className="hover:text-red-700">About Us</a>
          <a href="https://www.fractionalaeco.com/how-we-work" target="_blank" className="hover:text-red-700">How We Work</a>
          <a href="https://www.fractionalaeco.com/contact" target="_blank" className="hover:text-red-700">Contact</a>
        </div>
        <div className="flex gap-3">
          <a href="/login" className="px-5 py-2 text-gray-600 hover:text-red-700 text-sm font-medium">Login</a>
          <a href="/signup" className="px-5 py-2 bg-red-700 text-white rounded-full text-sm font-medium hover:bg-red-800">Join Free</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gray-950 text-white text-center px-8 py-28">
        <p className="text-red-400 text-sm font-medium uppercase tracking-widest mb-4">Fractus · Powered by FractionalAECO</p>
        <h2 className="text-5xl font-bold mb-6 max-w-4xl mx-auto leading-tight">
          Senior AECO Expertise.<br/>
          <span className="text-red-500">Fractional by Design.</span><br/>
          Built to Execute.
        </h2>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Your trusted partners for expert Architecture, Engineering, Construction, and Owner/Operator solutions — without overhiring or slowing down.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a href="/signup" className="px-8 py-4 bg-red-700 text-white rounded-full text-lg font-medium hover:bg-red-800">
            Find Smart People
          </a>
          <a href="/signup" className="px-8 py-4 border border-gray-600 text-white rounded-full text-lg font-medium hover:border-red-500 hover:text-red-400">
            Join as a Pro
          </a>
          <a href="https://www.fractionalaeco.com/contact" target="_blank" className="px-8 py-4 border border-red-700 text-red-400 rounded-full text-lg font-medium hover:bg-red-700 hover:text-white">
            Book a Consult
          </a>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-red-700 text-white py-8 px-8">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold">500+</div>
            <div className="text-red-200 text-sm mt-1">AECO Professionals</div>
          </div>
          <div>
            <div className="text-3xl font-bold">3</div>
            <div className="text-red-200 text-sm mt-1">Core Service Areas</div>
          </div>
          <div>
            <div className="text-3xl font-bold">100%</div>
            <div className="text-red-200 text-sm mt-1">Fractional Model</div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="px-8 py-20 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-red-700 text-sm font-medium uppercase tracking-widest text-center mb-3">What We Offer</p>
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Services</h3>
          <div className="grid grid-cols-3 gap-8">
            <div className="p-8 border border-gray-100 rounded-2xl hover:border-red-200 hover:shadow-sm transition-all">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-5">
                <span className="text-2xl">🏗️</span>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-3">Management Services</h4>
              <p className="text-gray-500 text-sm leading-relaxed">Fractional AECO management that drives projects forward, mitigates risk, and gives your team the leadership it needs — without the cost of full-time hires.</p>
            </div>
            <div className="p-8 border border-gray-100 rounded-2xl hover:border-red-200 hover:shadow-sm transition-all">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-5">
                <span className="text-2xl">💻</span>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-3">AECO Technology & Systems</h4>
              <p className="text-gray-500 text-sm leading-relaxed">We help AECO teams adopt, optimize, and get real results from technology — embedded expertise that turns tools into executable outcomes.</p>
            </div>
            <div className="p-8 border border-gray-100 rounded-2xl hover:border-red-200 hover:shadow-sm transition-all">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-5">
                <span className="text-2xl">📊</span>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-3">Insurance, Cost & Value</h4>
              <p className="text-gray-500 text-sm leading-relaxed">We help AECO teams manage risk, control costs, and unlock value — turning complexity into confident decisions.</p>
            </div>
          </div>
          <div className="text-center mt-10">
            <a href="https://www.fractionalaeco.com/services" target="_blank" className="px-8 py-3 border border-red-700 text-red-700 rounded-full font-medium hover:bg-red-700 hover:text-white transition-all">
              Explore All Services →
            </a>
          </div>
        </div>
      </section>

      {/* Who we serve */}
      <section className="bg-gray-50 px-8 py-20">
        <div className="max-w-5xl mx-auto">
          <p className="text-red-700 text-sm font-medium uppercase tracking-widest text-center mb-3">Who We Serve</p>
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">Built for Every AECO Role</h3>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center">
              <div className="text-3xl mb-3">👷</div>
              <h4 className="font-bold text-gray-900 mb-2">Contractors</h4>
              <p className="text-sm text-gray-500">Project delivery, risk management, and field leadership on a fractional basis.</p>
              <a href="https://www.fractionalaeco.com/services" target="_blank" className="mt-4 inline-block text-sm text-red-700 font-medium hover:underline">Learn More →</a>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center">
              <div className="text-3xl mb-3">📐</div>
              <h4 className="font-bold text-gray-900 mb-2">Architects</h4>
              <p className="text-sm text-gray-500">Design leadership, BIM expertise, and project oversight without full-time overhead.</p>
              <a href="https://www.fractionalaeco.com/services" target="_blank" className="mt-4 inline-block text-sm text-red-700 font-medium hover:underline">Learn More →</a>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center">
              <div className="text-3xl mb-3">🏢</div>
              <h4 className="font-bold text-gray-900 mb-2">Owners & Operators</h4>
              <p className="text-sm text-gray-500">Asset management, operations optimization, and owner's rep services.</p>
              <a href="https://www.fractionalaeco.com/services" target="_blank" className="mt-4 inline-block text-sm text-red-700 font-medium hover:underline">Learn More →</a>
            </div>
          </div>
        </div>
      </section>

      {/* Who we are */}
      <section id="who-we-are" className="px-8 py-20 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-red-700 text-sm font-medium uppercase tracking-widest mb-3">Who We Are</p>
          <h3 className="text-3xl font-bold text-gray-900 mb-6">Shaping the Future of AECO</h3>
          <p className="text-gray-500 text-lg leading-relaxed mb-8">
            We are shaping the future of the AECO industry by harnessing the power of top-tier talent through a fractional employment model that thrives on flexibility, innovation, and collaboration. Future-leaning in every sense — embracing emerging technologies, empowering the next generation of thinkers and builders.
          </p>
          <a href="https://www.fractionalaeco.com/about" target="_blank" className="px-8 py-3 bg-red-700 text-white rounded-full font-medium hover:bg-red-800">
            Learn More About Us →
          </a>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-gray-950 text-white px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <p className="text-red-400 text-sm font-medium uppercase tracking-widest text-center mb-3">How It Works</p>
          <h3 className="text-3xl font-bold text-center mb-12">Get Started in 3 Steps</h3>
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-700 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">1</div>
              <h4 className="font-bold mb-2">Create Your Profile</h4>
              <p className="text-gray-400 text-sm">Sign up and build your AECO profile with your discipline, certifications, and availability.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-red-700 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">2</div>
              <h4 className="font-bold mb-2">Get Verified</h4>
              <p className="text-gray-400 text-sm">Our team reviews your credentials and awards you a Verified badge so clients trust you instantly.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-red-700 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">3</div>
              <h4 className="font-bold mb-2">Connect & Work</h4>
              <p className="text-gray-400 text-sm">Match with AECO organisations who need your exact expertise on a fractional basis.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-red-700 text-white text-center px-8 py-16">
        <h3 className="text-3xl font-bold mb-4">Ready to elevate your AECO projects?</h3>
        <p className="text-red-200 mb-8 text-lg">Transformational solutions tailored for your project's unique needs.</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a href="/signup" className="px-8 py-4 bg-white text-red-700 rounded-full font-bold hover:bg-red-50">
            Get Started Free
          </a>
          <a href="https://www.fractionalaeco.com/contact" target="_blank" className="px-8 py-4 border border-white text-white rounded-full font-bold hover:bg-red-800">
            Book Your Consult Today
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 px-8 py-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <span className="text-white font-bold text-lg">Fractus</span>
            <span className="text-gray-500 text-sm ml-2">by FractionalAECO</span>
            <p className="text-xs text-gray-600 mt-1">fractus.fractional.com</p>
          </div>
          <div className="flex gap-6 text-sm">
            <a href="https://www.fractionalaeco.com/services" target="_blank" className="hover:text-white">Our Services</a>
            <a href="https://www.fractionalaeco.com/about" target="_blank" className="hover:text-white">About Us</a>
            <a href="https://www.fractionalaeco.com/how-we-work" target="_blank" className="hover:text-white">How We Work</a>
            <a href="https://www.fractionalaeco.com/contact" target="_blank" className="hover:text-white">Contact</a>
          </div>
          <div className="text-sm">
            <a href="tel:+19804940263" className="hover:text-white">+1 980 494 0263</a>
          </div>
        </div>
        <div className="text-center text-xs text-gray-600 mt-8">
          © 2026 Fractional-AECO LLC. All rights reserved. · Fractus platform powered by FractionalAECO.
        </div>
      </footer>

    </main>
  )
}