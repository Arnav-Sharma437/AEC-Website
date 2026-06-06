"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { DURATION, EASE_OUT } from "@/lib/motion";

export const LOGO_LIGHT = "/images/logo/aec-logo-light.png";
export const LOGO_DARK = "/images/logo/aec-logo-dark.png";
export const LOGO_FALLBACK = "/images/logo/aec-logo.png";

const sizeClasses = {
  nav: "h-[68px] w-auto",
  md: "h-12 w-auto",
  lg: "h-14 w-auto",
  xl: "h-52 w-auto max-w-full",
  footer: "h-14 w-auto",
} as const;

interface AecLogoProps {
  size?: keyof typeof sizeClasses;
  className?: string;
  priority?: boolean;
  /** Force light or dark asset (footer always uses dark on navy bg) */
  variant?: "light" | "dark" | "auto";
  /** Show animated brand name with ® to the right of the logo */
  showBrandName?: boolean;
}

function AnimatedBrandName() {
  const reduced = useReducedMotion();

  return (
    <motion.span
      className="hidden min-[420px]:flex flex-col justify-center leading-tight"
      initial={reduced ? false : { opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: DURATION.medium, ease: EASE_OUT }}
      aria-label="Alamdaar Engineering Concern registered trademark"
    >
      <span className="font-display text-sm font-bold uppercase tracking-[0.12em] sm:text-base">
        <span className="animate-brand-shimmer bg-gradient-to-r from-accent via-[#e8c96a] to-accent bg-[length:200%_100%] bg-clip-text text-transparent">
          Alamdaar
        </span>
      </span>
      <span className="font-display text-[10px] font-semibold uppercase tracking-[0.18em] text-primary dark:text-foreground sm:text-xs">
        Engineering Concern
        <sup className="ml-0.5 align-super text-[9px] font-bold leading-none text-accent">
          ®
        </sup>
      </span>
    </motion.span>
  );
}

export default function AecLogo({
  size = "md",
  className,
  priority = false,
  variant = "auto",
  showBrandName = false,
}: AecLogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [imgSrc, setImgSrc] = useState(LOGO_FALLBACK);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (variant === "dark") {
      setImgSrc(LOGO_DARK);
      return;
    }
    if (variant === "light") {
      setImgSrc(LOGO_LIGHT);
      return;
    }
    if (!mounted) return;
    setImgSrc(resolvedTheme === "dark" ? LOGO_DARK : LOGO_LIGHT);
  }, [variant, resolvedTheme, mounted]);

  return (
    <span className={cn("inline-flex items-center gap-2.5 sm:gap-3", className)}>
      <Image
        src={imgSrc}
        alt="Alamdaar Engineering Concern"
        width={232}
        height={290}
        quality={100}
        unoptimized
        priority={priority}
        onError={() => setImgSrc(LOGO_FALLBACK)}
        className={cn("shrink-0 object-contain", sizeClasses[size])}
      />
      {showBrandName && <AnimatedBrandName />}
    </span>
  );
}
