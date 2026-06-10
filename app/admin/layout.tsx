import type { Metadata } from 'next'

const OG_IMAGE = "https://www.fractionalaeco.com/og-image.png"

export const metadata: Metadata = {
  title: "Admin Panel | Fractus",
  description: "Fractus platform administration.",
  openGraph: {
    title: "Admin Panel | Fractus",
    description: "Fractus platform administration.",
    url: "https://fractus.fractionalaeco.com/admin",
    siteName: "Fractus by FractionalAECO",
    type: "website",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Fractus Admin" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Admin Panel | Fractus",
    description: "Fractus platform administration.",
    images: [OG_IMAGE],
  },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
