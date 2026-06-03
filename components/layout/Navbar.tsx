"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { gsap } from "@/lib/premium/gsap";
import { usePremiumMotion } from "@/components/providers/PremiumExperienceProvider";
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
  const premium = usePremiumMotion();
  const headerRef = useRef<HTMLElement>(null);
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const lastScroll = useRef(0);

  useEffect(() => {
    if (!premium) return;
    const header = headerRef.current;
    if (!header) return;

    const onLenisScroll = (e: Event) => {
      const { scroll, direction } = (
        e as CustomEvent<{ scroll: number; direction: number }>
      ).detail;
      if (direction === 1 && scroll > 100) {
        gsap.to(header, { y: "-100%", duration: 0.4, ease: "power2.inOut" });
      } else if (direction === -1) {
        gsap.to(header, { y: 0, duration: 0.45, ease: "power2.out" });
      }
      lastScroll.current = scroll;
    };

    window.addEventListener("lenis-scroll", onLenisScroll);
    return () => window.removeEventListener("lenis-scroll", onLenisScroll);
  }, [premium]);

  useEffect(() => {
    if (!premium) return;
    const wrap = logoWrapRef.current;
    if (!wrap) return;

    const onMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(wrap, {
        rotateY: x * 14,
        rotateX: -y * 10,
        duration: 0.4,
        ease: "power2.out",
        transformPerspective: 600,
      });
    };
    const onLeave = () => {
      gsap.to(wrap, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: "power2.out",
      });
    };

    wrap.addEventListener("mousemove", onMove);
    wrap.addEventListener("mouseleave", onLeave);
    return () => {
      wrap.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseleave", onLeave);
    };
  }, [premium]);

  return (
    <header
      ref={headerRef}
      className="fixed top-0 z-50 w-full border-b border-border/70 bg-white shadow-nav will-change-transform dark:border-border dark:bg-card dark:shadow-nav-dark"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center" data-cursor-hover>
          <div
            ref={logoWrapRef}
            className={premium ? "logo-tilt-3d" : undefined}
            style={premium ? { transformStyle: "preserve-3d" } : undefined}
          >
            <AecLogo size="nav" priority />
          </div>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                data-cursor-hover
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
