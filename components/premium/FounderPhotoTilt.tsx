"use client";

import dynamic from "next/dynamic";
import { usePremiumMotion } from "@/components/providers/PremiumExperienceProvider";
import AecLogo from "@/components/ui/AecLogo";

const Tilt = dynamic(() => import("react-parallax-tilt"), { ssr: false });

interface FounderPhotoTiltProps {
  className?: string;
}

export default function FounderPhotoTilt({ className = "" }: FounderPhotoTiltProps) {
  const enabled = usePremiumMotion();

  const figure = (
    <figure
      className={`flex aspect-square items-center justify-center rounded-lg bg-surface p-8 dark:bg-card ${className}`}
    >
      <AecLogo size="xl" />
    </figure>
  );

  if (!enabled) return figure;

  return (
    <Tilt
      tiltMaxAngleX={12}
      tiltMaxAngleY={12}
      glareEnable
      glareMaxOpacity={0.15}
      scale={1.02}
      transitionSpeed={450}
      className="h-full w-full"
    >
      {figure}
    </Tilt>
  );
}
