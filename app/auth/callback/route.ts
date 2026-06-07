import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '../../lib/supabase-server'

// This route is where Google / Microsoft / LinkedIn send the user back to
// after they approve the sign-in on the provider's site. Supabase appends a
// one-time `code` to the URL — we trade that code for a real session, which
// stores the user's login in cookies, then send them on to the dashboard.
//
// Set this exact URL — https://yourdomain.com/auth/callback (and the
// http://localhost:3000/auth/callback version for local dev) — as a Redirect
// URL in Supabase under Authentication → URL Configuration, and as the
// callback/redirect URI in each OAuth provider's developer console.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
  }

  // No code present — something went wrong (user cancelled, provider error, etc).
  return NextResponse.redirect(`${origin}/login?error=oauth_failed`)
}
