import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Jarak Jadi Dekat - Game Romantis LDR",
  description: "Game kecil untuk Airin & Tedi supaya LDR terasa lebih dekat. Main bareng secara real-time dengan pertanyaan romantis, voice chat, dan love meter.",
  keywords: ["LDR", "game romantis", "pasangan", "Airin", "Tedi", "Padang", "Bandung"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
