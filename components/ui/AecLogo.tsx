import Image from "next/image";
import { cn } from "@/lib/utils";

export const LOGO_SRC = "/images/logo/aec-logo.png";

const sizeClasses = {
  sm: "h-10 w-auto",
  md: "h-12 w-auto",
  lg: "h-14 w-auto",
  xl: "h-52 w-auto max-w-full",
} as const;

interface AecLogoProps {
  size?: keyof typeof sizeClasses;
  className?: string;
  priority?: boolean;
}

export default function AecLogo({
  size = "md",
  className,
  priority = false,
}: AecLogoProps) {
  return (
    <Image
      src={LOGO_SRC}
      alt="Alamdaar Engineering Concern"
      width={160}
      height={200}
      priority={priority}
      className={cn("object-contain", sizeClasses[size], className)}
    />
  );
}
