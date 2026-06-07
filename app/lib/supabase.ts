import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Browser client — used in all 'use client' pages (login, signup, dashboard, etc).
// Switching from createClient to createBrowserClient (from @supabase/ssr) stores
// the session in cookies instead of localStorage, which is what lets the OAuth
// callback route (a server-side route handler) read the session and finish login.
export const supabase = createBrowserClient(supabaseUrl, supabaseKey)
