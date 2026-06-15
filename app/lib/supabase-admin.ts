import { createClient } from '@supabase/supabase-js'

// Server-side admin client — uses service role key, bypasses RLS.
// NEVER import this in client components ('use client').
// Lazy factory so the build doesn't fail when env vars are absent at build time.
export function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
