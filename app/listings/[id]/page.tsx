import { createClient } from '@supabase/supabase-js'
import ListingDetailClient from './ListingDetailClient'

const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { data } = await supabaseServer
    .from('listings').select('title, company, description').eq('id', params.id).single()
  return {
    title: data ? `${data.title} at ${data.company} | Fractus` : 'Listing | Fractus',
    description: data?.description?.substring(0, 160) ?? 'Fractional AECO opportunity on Fractus',
  }
}

export default function ListingPage({ params }: { params: { id: string } }) {
  return <ListingDetailClient id={params.id} />
}
