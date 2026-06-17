import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '../../lib/supabase-admin'
import { resend, FROM_EMAIL } from '../../lib/resend'
import { brandedEmail } from '../../lib/email-template'

export async function POST(req: NextRequest) {
  try {
    const { application_id, status } = await req.json()

    if (!application_id || !status) {
      return NextResponse.json({ error: 'Missing application_id or status' }, { status: 400 })
    }
    if (status !== 'accepted' && status !== 'rejected') {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const supabaseAdmin = getSupabaseAdmin()

    // Fetch application
    const { data: application } = await supabaseAdmin
      .from('applications')
      .select('id, listing_id, applicant_id')
      .eq('id', application_id)
      .single()

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    // Fetch listing
    const { data: listing } = await supabaseAdmin
      .from('listings')
      .select('title, company')
      .eq('id', application.listing_id)
      .single()

    // Fetch applicant
    const { data: applicant } = await supabaseAdmin
      .from('profiles')
      .select('name, email')
      .eq('id', application.applicant_id)
      .single()

    const applicant_email = applicant?.email ?? null
    const listing_title   = listing?.title ?? 'Unknown listing'
    const listing_company = listing?.company ?? ''
    const verb            = status === 'accepted' ? 'accepted' : 'declined'

    try {
      if (applicant_email) {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: applicant_email,
          subject: `Update on your application to ${listing_title}`,
          html: brandedEmail({
            greeting: `Hi ${applicant?.name ?? 'there'},`,
            bodyHtml: `
              <p style="margin: 0;">Your application to <strong>${listing_title}</strong>${listing_company ? ` at ${listing_company}` : ''} has been <strong>${verb}</strong>.</p>
            `,
            buttonText: 'View your applications',
            buttonUrl: 'https://fractus.fractionalaeco.com/dashboard/applications',
          }),
        })
      }
    } catch (emailErr) {
      console.error('[notify-application-status] email send failed:', emailErr)
    }

    return NextResponse.json({
      success: true,
      applicant_email,
      listing_title,
      status,
    })
  } catch (err) {
    console.error('[notify-application-status] error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
