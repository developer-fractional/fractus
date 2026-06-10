import type { Metadata } from 'next'

const OG_IMAGE = "https://www.fractionalaeco.com/og-image.png"

export const metadata: Metadata = {
  title: "Browse AECO Talent | Fractus",
  description: "Browse verified fractional architects, structural engineers, MEP leads, BIM managers and more. Filter by discipline, rate, and availability.",
  openGraph: {
    title: "Browse AECO Talent | Fractus",
    description: "Browse verified fractional architects, structural engineers, MEP leads, BIM managers and more. Filter by discipline, rate, and availability.",
    url: "https://fractus.fractionalaeco.com/talent",
    siteName: "Fractus by FractionalAECO",
    type: "website",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Browse AECO Talent on Fractus" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse AECO Talent | Fractus",
    description: "Browse verified fractional architects, structural engineers, MEP leads, BIM managers and more.",
    images: [OG_IMAGE],
  },
}

export default function TalentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
