import { createSupabaseServerClient } from './supabase-server'

export async function getLiveStats() {
  const supabase = await createSupabaseServerClient()

  const [{ count: totalTalent }, { data: disciplines }, { data: experience }] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).not('name', 'is', null),
    supabase.from('profiles').select('discipline').not('discipline', 'is', null).not('name', 'is', null),
    supabase.from('profiles').select('years_experience').not('years_experience', 'is', null).not('name', 'is', null),
  ])

  const uniqueDisciplines = new Set(disciplines?.map(d => d.discipline) ?? []).size
  const avgExperience = experience?.length
    ? Math.round(experience.reduce((sum, p) => sum + (p.years_experience ?? 0), 0) / experience.length)
    : 0

  return {
    totalTalent: totalTalent ?? 0,
    uniqueDisciplines,
    avgExperience,
  }
}
