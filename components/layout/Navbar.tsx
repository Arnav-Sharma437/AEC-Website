"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import GetQuoteButton from "@/components/ui/GetQuoteButton";
import AecLogo from "@/components/ui/AecLogo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/70 bg-white shadow-nav dark:border-border dark:bg-card dark:shadow-nav-dark">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center">
          <AecLogo size="nav" priority variant="auto" showTrademark />
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "font-medium text-primary transition hover:text-accent dark:text-foreground",
                  pathname === link.href &&
                    "border-b-2 border-accent text-accent"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <GetQuoteButton />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="text-primary dark:text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-border bg-white dark:border-border dark:bg-card md:hidden">
          <ul className="flex flex-col gap-6 p-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "font-display text-2xl font-semibold uppercase text-primary dark:text-foreground",
                    pathname === link.href && "text-accent"
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
