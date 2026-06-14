'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'
import type { Listing } from '../lib/types'
import Navbar from '../components/Navbar'

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    supabase
      .from('listings')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setListings(data || [])
        setLoading(false)
      })
  }, [])

  const filtered = listings.filter(l =>
    !search ||
    l.title?.toLowerCase().includes(search.toLowerCase()) ||
    l.company?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen" style={{ background: '#0F1117', fontFamily: "'Nunito Sans', sans-serif" }}>

      <Navbar activeLink="listings" />

      {/* Hero */}
      <div className="px-5 sm:px-10 py-10 sm:py-16 border-b" style={{ background: '#1B2130', borderColor: '#2A3145' }}>
        <div className="max-w-4xl mx-auto">
          <p className="font-semibold uppercase tracking-widest mb-3 text-xs sm:text-sm" style={{ color: '#F6981F' }}>Opportunities</p>
          <h1 className="font-bold text-white mb-3 sm:mb-4" style={{ fontSize: 'clamp(28px, 6vw, 48px)', fontFamily: "'Nunito', sans-serif" }}>
            Fractional AECO Jobs
          </h1>
          <p className="text-gray-400 mb-6 sm:mb-8 text-base sm:text-xl">
            Part-time, project-based, and fractional roles for senior AECO professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search listings by title or company..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 rounded-xl px-4 sm:px-5 py-3 sm:py-4 text-white outline-none placeholder-gray-600 text-sm sm:text-base"
              style={{ background: '#0F1117', border: '1.5px solid #2A3145' }}
            />
            <Link href="/listings/new"
              className="px-5 py-3 sm:py-4 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity text-center text-sm sm:text-base whitespace-nowrap"
              style={{ background: '#F6981F', textDecoration: 'none' }}>
              + Post a listing
            </Link>
          </div>
        </div>
      </div>

      {/* Listings */}
      <div className="max-w-4xl mx-auto px-5 sm:px-10 py-8 sm:py-12">
        {loading ? (
          <div className="text-center text-gray-500 py-20 text-lg">Loading listings...</div>
        ) : filtered.length === 0 ? (
          /* TASK 4 — Empty state */
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="font-bold text-white mb-2 text-xl" style={{ fontFamily: "'Nunito', sans-serif" }}>
              {search ? 'No listings match your search' : 'No listings yet'}
            </h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              {search
                ? 'Try a different search term or clear the search to see all listings.'
                : 'No listings found. Be the first to post a fractional opportunity!'}
            </p>
            {search ? (
              <button onClick={() => setSearch('')}
                className="px-6 py-3 rounded-full font-semibold text-white cursor-pointer hover:opacity-90 transition-opacity text-sm"
                style={{ background: '#F6981F', border: 'none' }}>
                Clear search
              </button>
            ) : (
              <Link href="/dashboard"
                className="px-6 py-3 rounded-full font-semibold text-white hover:opacity-90 transition-opacity text-sm inline-block"
                style={{ background: '#F6981F', textDecoration: 'none' }}>
                Post a listing →
              </Link>
            )}
          </div>
        ) : (
          <>
            <p className="text-gray-500 mb-6 text-sm">{filtered.length} listing{filtered.length !== 1 ? 's' : ''} found</p>
            {/* Single column on mobile */}
            <div className="flex flex-col gap-4">
              {filtered.map((l, i) => (
                <Link key={l.id || i} href={'/listings/' + l.id}
                  className="rounded-2xl border p-5 sm:p-7 hover:opacity-90 transition-opacity"
                  style={{ textDecoration: 'none', display: 'block', background: '#1B2130', borderColor: '#2A3145' }}>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                    <div>
                      <h3 className="font-bold text-white text-base sm:text-xl mb-1" style={{ fontFamily: "'Nunito', sans-serif" }}>
                        {l.title}
                      </h3>
                      <p className="text-sm sm:text-base" style={{ color: '#05809B', fontWeight: 600 }}>{l.company}</p>
                    </div>
                    <span className="self-start text-xs px-3 py-1 rounded-full font-semibold"
                      style={{ background: 'rgba(246,152,32,0.15)', color: '#F6981F', border: '1px solid rgba(246,152,32,0.3)', whiteSpace: 'nowrap' }}>
                      {l.status === 'active' ? 'Active' : l.status}
                    </span>
                  </div>
                  {l.description && (
                    <p className="text-gray-400 text-sm sm:text-base mb-4 line-clamp-3" style={{ lineHeight: 1.6 }}>
                      {l.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-3 text-xs sm:text-sm text-gray-500">
                    {l.location && <span>📍 {l.location}</span>}
                    {l.rate && <span>💰 {l.rate}</span>}
                    {l.created_at && (
                      <span>🗓 {new Date(l.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

    </div>
  )
}
