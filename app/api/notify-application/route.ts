import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '../../lib/supabase-admin'

export async function POST(req: NextRequest) {
  try {
    const { listing_id, applicant_id } = await req.json()

    if (!listing_id || !applicant_id) {
      return NextResponse.json({ error: 'Missing listing_id or applicant_id' }, { status: 400 })
    }

    const supabaseAdmin = getSupabaseAdmin()

    // Fetch listing
    const { data: listing } = await supabaseAdmin
      .from('listings')
      .select('title, company, posted_by')
      .eq('id', listing_id)
      .single()

    // Fetch applicant profile
    const { data: applicant } = await supabaseAdmin
      .from('profiles')
      .select('name, discipline, years_experience, email')
      .eq('id', applicant_id)
      .single()

    // Fetch employer profile
    const { data: employer } = await supabaseAdmin
      .from('profiles')
      .select('name, email')
      .eq('id', listing?.posted_by)
      .single()

    const employer_email = employer?.email ?? null
    const listing_title  = listing?.title ?? 'Unknown listing'
    const applicant_name = applicant?.name ?? 'Someone'

    console.log('[notify-application]', {
      employer_email,
      employer_name: employer?.name,
      listing_title,
      listing_company: listing?.company,
      applicant_name,
      applicant_discipline: applicant?.discipline,
      applicant_years: applicant?.years_experience,
    })

    // TODO: replace with Resend email send in a later phase
    // Example body when ready:
    // Subject: `New application for "${listing_title}" on Fractus`
    // Body: `${applicant_name} (${applicant?.discipline}, ${applicant?.years_experience} yrs)
    //        applied to your listing "${listing_title}" at ${listing?.company}.
    //        View their profile on Fractus.`

    return NextResponse.json({
      success: true,
      message: 'Notification logged',
      employer_email,
      listing_title,
      applicant_name,
    })
  } catch (err) {
    console.error('[notify-application] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
