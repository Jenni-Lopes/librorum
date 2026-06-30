import type { Metadata } from "next";
import { Geist, Geist_Mono, Lexend, League_Spartan } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

const leagueSpartan = League_Spartan({
  variable: "--font-league-spartan",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Librorum",
  description: "Sua jornada literária",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} ${lexend.variable} ${leagueSpartan.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#15131D] text-[#F5F3FF]">{children}</body>
    </html>
  );
}
