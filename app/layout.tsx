import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { getThemeScript } from "./lib/theme";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fractus — Powered by FractionalAECO",
  description: "Find fractional AECO talent. Built for Architecture, Engineering, Construction and Operations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: getThemeScript() }} />
      </head>
      <body className={geist.className} style={{margin:0, padding:0}}>
        {children}
      </body>
    </html>
  );
}