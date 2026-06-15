import { createClient } from '@supabase/supabase-js'
import TalentProfileClient from './TalentProfileClient'

const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { data } = await supabaseServer
    .from('profiles').select('name, discipline, location').eq('id', params.id).single()
  return {
    title: data ? `${data.name} — ${data.discipline} | Fractus` : 'Talent Profile | Fractus',
    description: data
      ? `${data.name} is a fractional ${data.discipline} professional on Fractus, the AECO talent network.`
      : 'AECO fractional talent on Fractus',
  }
}

export default function TalentPage({ params }: { params: { id: string } }) {
  return <TalentProfileClient id={params.id} />
}
