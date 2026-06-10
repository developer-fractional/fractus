import type { Metadata } from 'next'

const OG_IMAGE = "https://www.fractionalaeco.com/og-image.png"

export const metadata: Metadata = {
  title: "My Profile | Fractus",
  description: "Build and manage your AECO professional profile on Fractus.",
  openGraph: {
    title: "My Profile | Fractus",
    description: "Build and manage your AECO professional profile on Fractus.",
    url: "https://fractus.fractionalaeco.com/profile",
    siteName: "Fractus by FractionalAECO",
    type: "website",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "My Profile on Fractus" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "My Profile | Fractus",
    description: "Build and manage your AECO professional profile on Fractus.",
    images: [OG_IMAGE],
  },
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
