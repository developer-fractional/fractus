import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '../../lib/supabase-server'

// Handles two flows:
//
// 1. OAuth login (Google / Microsoft / LinkedIn)  — PKCE
//    Supabase appends ?code=xxx — exchange for session cookie → /dashboard.
//
// 2. Password reset — PKCE
//    resetPasswordForEmail sets redirectTo to /auth/callback?type=recovery.
//    Supabase appends ?code=xxx → exchange for session cookie → /reset-password.
//
// 3. Password reset — implicit (hash-based)
//    When Supabase is in implicit mode OR the PKCE redirectTo URL is not
//    allow-listed, the token arrives as a URL hash fragment. The server never
//    sees the hash, so we return a tiny HTML page whose inline script reads
//    window.location.hash and forwards it to /reset-password.
//
// Supabase → Authentication → URL Configuration must include:
//   https://fractus.fractionalaeco.com/auth/callback
//   http://localhost:3000/auth/callback

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const type = searchParams.get('type')   // 'recovery' for password-reset flow
  const next = searchParams.get('next') ?? '/dashboard'

  // ── PKCE flow: a one-time code was issued ──────────────────────────────────
  if (code) {
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      if (type === 'recovery') {
        return NextResponse.redirect(`${origin}/reset-password`)
      }
      return NextResponse.redirect(`${origin}${next}`)
    }

    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
  }

  // ── Implicit flow: token is in the URL hash (server never sees it) ─────────
  // Return an HTML page whose script forwards window.location.hash to
  // /reset-password so the client-side code there can call setSession().
  if (type === 'recovery') {
    const html = `<!doctype html>
<html>
  <head><meta charset="utf-8"><title>Redirecting…</title></head>
  <body>
    <script>
      // Forward the full hash fragment so /reset-password can parse the tokens.
      var hash = window.location.hash;
      window.location.replace('/reset-password' + (hash || ''));
    </script>
    <noscript>
      <meta http-equiv="refresh" content="0;url=/reset-password">
    </noscript>
  </body>
</html>`
    return new NextResponse(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    })
  }

  // No code, no recovery type — user cancelled or provider error.
  return NextResponse.redirect(`${origin}/login?error=oauth_failed`)
}
