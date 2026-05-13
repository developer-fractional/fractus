import type { Metadata } from "next";
import { Geist, Playfair_Display } from "next/font/google";
import "./globals.css";
import { getThemeScript } from "./lib/theme";

const geist = Geist({ subsets: ["latin"], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-serif', style: ['normal', 'italic'] });

export const metadata: Metadata = {
  title: "Fractus — Senior AECO Talent, Fractional by Design",
  description: "A curated network of architects, engineers, and construction leaders. Powered by FractionalAECO.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: getThemeScript() }} />
      </head>
      <body suppressHydrationWarning className={`${geist.variable} ${playfair.variable}`} style={{ margin: 0, padding: 0, fontFamily: 'var(--font-sans)' }}>
        {children}
      </body>
    </html>
  );
}