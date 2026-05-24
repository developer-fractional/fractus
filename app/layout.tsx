import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fractus — Senior AECO Talent, Fractional by Design",
  description: "A curated network of architects, engineers, and construction leaders. Powered by FractionalAECO.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700;800&family=Nunito:ital,wght@0,400;0,700;0,800;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning style={{ margin: 0, padding: 0, fontFamily: "'Nunito Sans', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}