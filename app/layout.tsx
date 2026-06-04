import type { Metadata } from "next";
import { Oswald, Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";
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
    "AEC — Manufacturer & Supplier of Lifting, Rigging and Material Handling Equipment. Shackles, hoists, winches, pallet trucks & lashings. Howrah, West Bengal — Pan India.",
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
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
