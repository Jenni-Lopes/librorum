import type { Metadata } from "next";
import { Lexend, League_Spartan } from "next/font/google";
import "./globals.css";


const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
});

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-spartan", 
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
    <html lang="pt-BR" className={`${lexend.variable} ${leagueSpartan.variable}`}>
      <body>{children}</body>
    </html>
  );
}

