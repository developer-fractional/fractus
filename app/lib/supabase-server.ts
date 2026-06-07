import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Server-side Supabase client — used in route handlers / server components,
// such as the OAuth callback route. It reads and writes the auth session via
// cookies (using Next's cookies() helper) instead of the browser's storage.
export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method can fail when called from a Server Component
            // that doesn't allow setting cookies. This is safe to ignore if you
            // have middleware refreshing sessions — not strictly needed here
            // since this client is only used in the route handler below.
          }
        },
      },
    }
  )
}
