// Shared types for data coming back from Supabase.
// Using real types instead of "any" keeps TypeScript (and the Vercel build) happy
// and helps catch typos like `profile.nmae` before they ship.

export interface Profile {
  id: string
  name: string | null
  email: string | null
  role: string | null
  discipline: string | null
  years_experience: string | number | null
  hourly_rate: string | number | null
  availability: string | null
  certifications: string[] | null
  skills: string | null
  linkedin_url: string | null
  portfolio_url: string | null
  location: string | null
  is_verified: boolean | null
  is_admin: boolean | null
  bio?: string | null
  avatar_url?: string | null
  cover_url?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export interface Listing {
  id: string
  title: string
  company: string | null
  description: string | null
  discipline: string | null
  engagement_type: string | null
  hours_per_week: number | null
  rate: string | number | null
  location: string | null
  remote: boolean | null
  status: string
  posted_by: string | null
  created_at?: string | null
}

export interface Education {
  id: string
  user_id: string
  school: string
  degree: string | null
  field_of_study: string | null
  start_year: number | null
  end_year: number | null
  description: string | null
  created_at?: string | null
}

export interface WorkExperience {
  id: string
  user_id: string
  company: string
  title: string
  location: string | null
  employment_type: string | null
  start_month: number | null
  start_year: number | null
  end_month: number | null
  end_year: number | null
  is_current: boolean | null
  description: string | null
  created_at?: string | null
}

export interface Credential {
  id: string
  user_id: string
  name: string
  issuing_organization: string | null
  license_number: string | null
  state: string | null
  issue_year: number | null
  expiration_year: number | null
  credential_url: string | null
  created_at?: string | null
}

export interface PortfolioProject {
  id: string
  user_id: string
  project_name: string
  project_type: string | null
  role: string | null
  client_or_firm: string | null
  location: string | null
  project_value: string | null
  completion_year: number | null
  description: string | null
  image_url: string | null
  display_order: number | null
  created_at?: string | null
}

export interface SoftwareSkill {
  id: string
  user_id: string
  tool_name: string
  proficiency: string
  years_used: number | null
  display_order: number | null
  created_at?: string | null
}

export interface AdminApplication {
  id: string
  status: string
  created_at: string
  listings: { title: string; company: string | null } | null
  profiles: { name: string | null; email: string | null } | null
}

export interface CustomField {
  id: string
  user_id: string
  field_label: string
  field_value: string
  display_order: number | null
  created_at?: string | null
}
