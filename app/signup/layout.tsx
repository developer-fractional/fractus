import type { Metadata } from 'next'

const OG_IMAGE = "https://www.fractionalaeco.com/og-image.png"

export const metadata: Metadata = {
  title: "Join Fractus | AECO Fractional Talent Network",
  description: "Create your free Fractus account. Join the network of senior AECO professionals available for fractional work.",
  openGraph: {
    title: "Join Fractus | AECO Fractional Talent Network",
    description: "Create your free Fractus account. Join the network of senior AECO professionals available for fractional work.",
    url: "https://fractus.fractionalaeco.com/signup",
    siteName: "Fractus by FractionalAECO",
    type: "website",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Join Fractus" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Join Fractus | AECO Fractional Talent Network",
    description: "Create your free Fractus account. Join the network of senior AECO professionals available for fractional work.",
    images: [OG_IMAGE],
  },
}

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
