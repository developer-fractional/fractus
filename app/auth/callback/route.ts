import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '../../lib/supabase-server'

// Handles two flows:
//
// 1. OAuth login (Google / Microsoft / LinkedIn)
//    Supabase appends ?code=xxx — we exchange it for a session cookie and
//    send the user to /dashboard.
//
// 2. Password reset
//    resetPasswordForEmail sets redirectTo to /auth/callback?type=recovery.
//    Supabase appends ?code=xxx to that URL — we exchange it for a session
//    cookie and send the user to /reset-password where they can set a new
//    password with an active session already loaded.
//
// Make sure both of these URLs are in Supabase → Authentication → URL Configuration:
//   https://yourdomain.com/auth/callback
//   http://localhost:3000/auth/callback
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const type = searchParams.get('type')   // 'recovery' for password-reset flow
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Password reset — send to the page where the user sets their new password.
      // The session is now stored in cookies so updateUser() will work there.
      if (type === 'recovery') {
        return NextResponse.redirect(`${origin}/reset-password`)
      }
      // OAuth login — send to dashboard (or wherever ?next= points).
      return NextResponse.redirect(`${origin}${next}`)
    }

    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
  }

  // No code present — user cancelled, provider error, or link already used.
  return NextResponse.redirect(`${origin}/login?error=oauth_failed`)
}
