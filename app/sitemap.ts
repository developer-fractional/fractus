import { createClient } from '@supabase/supabase-js'
import type { MetadataRoute } from 'next'

const BASE_URL = 'https://fractus.fractionalaeco.com'

const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ data: profiles }, { data: listings }] = await Promise.all([
    supabaseServer.from('profiles').select('id, updated_at, created_at').not('name', 'is', null),
    supabaseServer.from('listings').select('id, created_at').eq('status', 'active'),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/talent`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/listings`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/login`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/signup`, changeFrequency: 'monthly', priority: 0.3 },
  ]

  const talentPages: MetadataRoute.Sitemap = (profiles ?? []).map(p => ({
    url: `${BASE_URL}/talent/${p.id}`,
    lastModified: p.updated_at ?? p.created_at ?? undefined,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const listingPages: MetadataRoute.Sitemap = (listings ?? []).map(l => ({
    url: `${BASE_URL}/listings/${l.id}`,
    lastModified: l.created_at ?? undefined,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...talentPages, ...listingPages]
}
