import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: {
    default: "Prarthana",
    template: "%s · Prarthana",
  },
  description:
    "A quiet Sanatana Dharma prayer companion. Mantras and verses in Latin transliteration with English meaning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} antialiased`}>
        <div className="shell">
          <SiteHeader />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
