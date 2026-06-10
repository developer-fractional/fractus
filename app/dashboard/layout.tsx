import type { Metadata } from 'next'

const OG_IMAGE = "https://www.fractionalaeco.com/og-image.png"

export const metadata: Metadata = {
  title: "Dashboard | Fractus",
  description: "Manage your Fractus profile, listings, and connections.",
  openGraph: {
    title: "Dashboard | Fractus",
    description: "Manage your Fractus profile, listings, and connections.",
    url: "https://fractus.fractionalaeco.com/dashboard",
    siteName: "Fractus by FractionalAECO",
    type: "website",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Fractus Dashboard" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dashboard | Fractus",
    description: "Manage your Fractus profile, listings, and connections.",
    images: [OG_IMAGE],
  },
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
