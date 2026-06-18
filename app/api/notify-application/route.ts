import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '../../lib/supabase-admin'
import { getResend, FROM_EMAIL } from '../../lib/resend'
import { brandedEmail } from '../../lib/email-template'

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

    let employer_email = employer?.email ?? null
    if (!employer_email && listing?.posted_by) {
      const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(listing.posted_by)
      employer_email = authUser?.user?.email ?? null
    }
    const listing_title  = listing?.title ?? 'Unknown listing'
    const applicant_name = applicant?.name ?? 'Someone'

    try {
      if (employer_email) {
        const resend = getResend()
        await resend.emails.send({
          from: FROM_EMAIL,
          to: employer_email,
          subject: `New application: ${applicant_name} applied to ${listing_title}`,
          html: brandedEmail({
            greeting: `Hi ${employer?.name ?? 'there'},`,
            bodyHtml: `
              <p style="margin: 0 0 12px;"><strong>${applicant_name}</strong> just applied to your listing <strong>"${listing_title}"</strong>${listing?.company ? ` at ${listing.company}` : ''}.</p>
              <p style="margin: 0;">
                ${applicant?.discipline ? `Discipline: ${applicant.discipline}<br/>` : ''}
                ${applicant?.years_experience ? `Experience: ${applicant.years_experience} years` : ''}
              </p>
            `,
            buttonText: 'Review application',
            buttonUrl: 'https://fractus.fractionalaeco.com/dashboard/applications',
          }),
        })
      } else {
        console.warn('[notify-application] no employer email on file, skipping send', { posted_by: listing?.posted_by })
      }
    } catch (emailErr) {
      console.error('[notify-application] email send failed:', emailErr)
    }

    return NextResponse.json({
      success: true,
      employer_email,
      listing_title,
      applicant_name,
    })
  } catch (err) {
    console.error('[notify-application] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
