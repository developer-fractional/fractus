import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { buildResumePdf } from '../../../lib/resume-pdf'
import type { Profile, Education, WorkExperience, Credential } from '../../../lib/types'

// Public resume PDF generator for any talent profile — mirrors the data
// already shown on /talent/[id], which is publicly readable via RLS.
const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const [profileRes, educationRes, workRes, credentialsRes] = await Promise.all([
      supabaseServer.from('profiles').select('*').eq('id', id).single(),
      supabaseServer.from('education').select('*').eq('user_id', id)
        .order('start_year', { ascending: false, nullsFirst: false }),
      supabaseServer.from('work_experience').select('*').eq('user_id', id)
        .order('start_year', { ascending: false, nullsFirst: false })
        .order('start_month', { ascending: false, nullsFirst: false }),
      supabaseServer.from('credentials').select('*').eq('user_id', id)
        .order('issue_year', { ascending: false, nullsFirst: false }),
    ])

    if (profileRes.error || !profileRes.data) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const profile = profileRes.data as Profile
    const education = (educationRes.data ?? []) as Education[]
    const workExperience = (workRes.data ?? []) as WorkExperience[]
    const credentials = (credentialsRes.data ?? []) as Credential[]

    const { bytes, fileName } = buildResumePdf(profile, education, workExperience, credentials)

    return new NextResponse(Buffer.from(bytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    })
  } catch (err) {
    console.error('[generate-resume/id] error:', err)
    return NextResponse.json({ error: 'Could not generate resume PDF' }, { status: 500 })
  }
}
