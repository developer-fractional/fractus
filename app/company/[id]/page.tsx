import { createClient } from '@supabase/supabase-js'
import CompanyProfileClient from './CompanyProfileClient'

const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data } = await supabaseServer
    .from('companies').select('name, bio, industry, location').eq('id', id).single()

  if (!data) {
    return { title: 'Company Profile | Fractus', description: 'Employer profile on Fractus, the AECO talent network.' }
  }

  const description = data.bio
    ? data.bio.slice(0, 160)
    : `${data.name}${data.industry ? ` is hiring fractional AECO talent in ${data.industry}` : ' is hiring fractional AECO talent'} on Fractus.`

  return {
    title: `${data.name} | Fractus`,
    description,
    openGraph: { title: `${data.name} | Fractus`, description, type: 'website' },
  }
}

export default async function CompanyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <CompanyProfileClient id={id} />
}
