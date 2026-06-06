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
  /** Show brand name to the right of the logo */
  showBrandName?: boolean;
  /** Show ® mark on the logo image (navbar) */
  showRegisteredMark?: boolean;
}

function AnimatedBrandName() {
  const reduced = useReducedMotion();

  return (
    <motion.span
      className="hidden min-[480px]:flex max-w-[12rem] flex-col justify-center sm:max-w-none"
      initial={reduced ? false : { opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: DURATION.medium, ease: EASE_OUT }}
      aria-label="Alamdaar Engineering Concern"
    >
      <span className="font-blackletter text-[1.15rem] leading-[1.2] tracking-[0.06em] text-primary antialiased dark:text-foreground sm:text-[1.35rem] md:text-[1.45rem]">
        Alamdaar Engineering Concern
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
  showRegisteredMark = false,
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
    <span className={cn("inline-flex items-center gap-2 sm:gap-3", className)}>
      <span className="relative shrink-0">
        <Image
          src={imgSrc}
          alt="Alamdaar Engineering Concern"
          width={232}
          height={290}
          quality={100}
          unoptimized
          priority={priority}
          onError={() => setImgSrc(LOGO_FALLBACK)}
          className={cn("object-contain", sizeClasses[size])}
        />
        {showRegisteredMark && (
          <sup
            className="absolute -right-0.5 top-0 font-display text-[10px] font-bold leading-none text-primary dark:text-foreground sm:text-[11px]"
            aria-label="Registered trademark"
          >
            ®
          </sup>
        )}
      </span>
      {showBrandName && <AnimatedBrandName />}
    </span>
  );
}
