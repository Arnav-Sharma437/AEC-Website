import type { Metadata } from "next";
import { Oswald, Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StickyCTA from "@/components/layout/StickyCTA";
import ThemeProvider from "@/components/providers/ThemeProvider";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-oswald",
});

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-barlow",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-barlow-condensed",
});

export const metadata: Metadata = {
  title: {
    default: "Alamdaar Engineering Concern | Industrial Equipment",
    template: "%s | AEC",
  },
  description:
    "25+ years of precision engineering. Material handling, lifting equipment, scaffolding & safety gear. Pan India — Kolkata, Hyderabad, Chennai.",
  icons: {
    icon: "/images/logo/aec-logo.png",
    apple: "/images/logo/aec-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${oswald.variable} ${barlow.variable} ${barlowCondensed.variable}`}
    >
      <body className="font-body">
        <ThemeProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <StickyCTA />
        </ThemeProvider>
      </body>
    </html>
  );
}
