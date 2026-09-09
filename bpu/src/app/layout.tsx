import type { Metadata } from "next";
import { Archivo, Roboto_Mono } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-archivo",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  title: "Portal Bukti Potong Pajak",
  description:
    "Pencarian arsip bukti potong pajak berdasarkan unit kerja atau nomor akun.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${archivo.variable} ${robotoMono.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
