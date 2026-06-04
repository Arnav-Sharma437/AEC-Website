"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

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
  showTrademark?: boolean;
}

export default function AecLogo({
  size = "md",
  className,
  priority = false,
  variant = "auto",
  showTrademark = false,
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
    <span className={cn("inline-flex items-center gap-0.5", className)}>
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
      {showTrademark && (
        <sup className="font-display text-[10px] font-bold leading-none text-accent">
          ™
        </sup>
      )}
    </span>
  );
}
