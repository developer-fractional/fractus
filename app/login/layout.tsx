import type { Metadata } from 'next'

const OG_IMAGE = "https://www.fractionalaeco.com/og-image.png"

export const metadata: Metadata = {
  title: "Sign In | Fractus",
  description: "Sign in to your Fractus account to access AECO fractional talent.",
  openGraph: {
    title: "Sign In | Fractus",
    description: "Sign in to your Fractus account to access AECO fractional talent.",
    url: "https://fractus.fractionalaeco.com/login",
    siteName: "Fractus by FractionalAECO",
    type: "website",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Sign In to Fractus" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign In | Fractus",
    description: "Sign in to your Fractus account to access AECO fractional talent.",
    images: [OG_IMAGE],
  },
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
