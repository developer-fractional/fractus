import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from './lib/ThemeContext'

const OG_IMAGE = "https://www.fractionalaeco.com/og-image.png"
const BASE_URL = "https://fractus.fractionalaeco.com"

export const metadata: Metadata = {
  title: "Fractus — Senior AECO Fractional Talent | FractionalAECO",
  description: "Find and hire senior architects, engineers, and construction leaders on a fractional basis. Vetted AECO professionals available by the hour.",
  openGraph: {
    title: "Fractus — Senior AECO Fractional Talent | FractionalAECO",
    description: "Find and hire senior architects, engineers, and construction leaders on a fractional basis. Vetted AECO professionals available by the hour.",
    url: BASE_URL,
    siteName: "Fractus by FractionalAECO",
    type: "website",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Fractus AECO Talent Network" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fractus — Senior AECO Fractional Talent | FractionalAECO",
    description: "Find and hire senior architects, engineers, and construction leaders on a fractional basis. Vetted AECO professionals available by the hour.",
    images: [OG_IMAGE],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700;800&family=Nunito:ital,wght@0,400;0,700;0,800;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning style={{ margin: 0, padding: 0, fontFamily: "'Nunito Sans', sans-serif" }}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}