import type { Metadata } from "next";
import "./globals.css";

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
