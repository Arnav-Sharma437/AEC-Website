"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import GetQuoteButton from "@/components/ui/GetQuoteButton";
import AecLogo from "@/components/ui/AecLogo";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || !isHome;

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        solid
          ? "bg-primary shadow-lg"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <AecLogo size="sm" priority />
          <span
            className={cn(
              "hidden font-display text-sm font-semibold uppercase tracking-wider sm:block",
              solid ? "text-white" : "text-white"
            )}
          >
            Alamdaar Engineering
          </span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "font-medium transition hover:text-accent",
                  pathname === link.href
                    ? "border-b-2 border-accent text-accent"
                    : "text-white"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <GetQuoteButton />
        </div>

        <button
          type="button"
          className="text-white md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 top-[72px] z-40 bg-primary md:hidden">
          <ul className="flex flex-col gap-6 p-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "font-display text-2xl font-semibold uppercase",
                    pathname === link.href ? "text-accent" : "text-white"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-4">
              <GetQuoteButton className="w-full text-center" />
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
