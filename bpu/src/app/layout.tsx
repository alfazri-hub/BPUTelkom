import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Sans } from "next/font/google";
import { c } from "@/lib/design-system";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Portal Dokumen Pajak",
  description: "Sistem pencarian dokumen bukti potong pajak",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${spaceGrotesk.variable} ${ibmPlexSans.variable}`}
    >
      <body
        className="min-h-screen font-sans antialiased"
        style={
          {
            "--accent": c.red,
            "--accent-soft": c.redSoft,
            "--accent-soft-strong": c.redSoft2,
            "--navy": c.navy,
            "--navy2": c.navy2,
            "--ink": c.ink,
            "--paper": c.paper,
            "--paper-alt": c.paper2,
            "--line": c.line,
            "--muted": c.muted,
          } as React.CSSProperties
        }
      >
        {children}
      </body>
    </html>
  );
}
