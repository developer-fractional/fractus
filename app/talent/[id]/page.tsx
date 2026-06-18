import { createClient } from '@supabase/supabase-js'
import TalentProfileClient from './TalentProfileClient'

const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data } = await supabaseServer
    .from('profiles').select('name, discipline, location').eq('id', id).single()
  const discipline = data?.discipline || 'AECO Professional'
  return {
    title: data ? `${data.name} — ${discipline} | Fractus` : 'Talent Profile | Fractus',
    description: data
      ? `${data.name} is a fractional ${discipline} professional on Fractus, the AECO talent network.`
      : 'AECO fractional talent on Fractus',
  }
}

export default async function TalentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <TalentProfileClient id={id} />
}
