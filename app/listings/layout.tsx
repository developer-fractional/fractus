import type { Metadata } from 'next'

const OG_IMAGE = "https://www.fractionalaeco.com/og-image.png"

export const metadata: Metadata = {
  title: "Fractional AECO Jobs | Fractus",
  description: "Find fractional, part-time, and project-based AECO opportunities. Post and browse jobs for architects, engineers, and construction professionals.",
  openGraph: {
    title: "Fractional AECO Jobs | Fractus",
    description: "Find fractional, part-time, and project-based AECO opportunities. Post and browse jobs for architects, engineers, and construction professionals.",
    url: "https://fractus.fractionalaeco.com/listings",
    siteName: "Fractus by FractionalAECO",
    type: "website",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "AECO Fractional Jobs on Fractus" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fractional AECO Jobs | Fractus",
    description: "Find fractional, part-time, and project-based AECO opportunities.",
    images: [OG_IMAGE],
  },
}

export default function ListingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
