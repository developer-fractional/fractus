export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-orange-500">Fractus</h1>
        <div className="flex gap-4">
          <a href="/login" className="px-5 py-2 text-gray-600 hover:text-orange-500">Login</a>
          <a href="/signup" className="px-5 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600">Join Free</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center px-8 py-24">
        <h2 className="text-5xl font-bold text-gray-900 mb-6">
          Find Fractional Talent <br/>
          <span className="text-orange-500">Built for AECO</span>
        </h2>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          Connect with top Architects, Engineers, Construction and Operations professionals available on a fractional basis.
        </p>
        <div className="flex gap-4 justify-center">
          <a href="/signup" className="px-8 py-4 bg-orange-500 text-white rounded-full text-lg hover:bg-orange-600">
            Find Smart People
          </a>
          <a href="/signup" className="px-8 py-4 border border-orange-500 text-orange-500 rounded-full text-lg hover:bg-orange-50">
            Join as a Pro
          </a>
        </div>
      </section>

      {/* 3 Value Props */}
      <section className="grid grid-cols-3 gap-8 px-16 py-16 bg-gray-50">
        <div className="text-center p-8">
          <div className="text-4xl mb-4">🏗️</div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">AECO Specialists</h3>
          <p className="text-gray-500">Every professional is vetted and verified in Architecture, Engineering, Construction or Operations.</p>
        </div>
        <div className="text-center p-8">
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Fractional Flexible</h3>
          <p className="text-gray-500">Hire for 1 day a week or 4. Scale up or down based on your project needs.</p>
        </div>
        <div className="text-center p-8">
          <div className="text-4xl mb-4">✅</div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Verified Profiles</h3>
          <p className="text-gray-500">Every profile is reviewed by our team. You see real credentials, real experience.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-400 text-sm">
        © 2026 Fractus · fractus.fractional.com
      </footer>

    </main>
  )
}