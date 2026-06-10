import type { Metadata } from 'next'

const OG_IMAGE = "https://www.fractionalaeco.com/og-image.png"

export const metadata: Metadata = {
  title: "AECO Professional Profile | Fractus",
  description: "View the full profile of a senior AECO professional on Fractus — experience, certifications, availability, and hourly rate.",
  openGraph: {
    title: "AECO Professional Profile | Fractus",
    description: "View the full profile of a senior AECO professional on Fractus — experience, certifications, availability, and hourly rate.",
    url: "https://fractus.fractionalaeco.com/talent",
    siteName: "Fractus by FractionalAECO",
    type: "profile",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "AECO Professional Profile on Fractus" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AECO Professional Profile | Fractus",
    description: "View the full profile of a senior AECO professional on Fractus.",
    images: [OG_IMAGE],
  },
}

export default function TalentProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
