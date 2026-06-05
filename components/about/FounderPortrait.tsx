"use client";

import { useState } from "react";
import AecLogo from "@/components/ui/AecLogo";

const FOUNDER_SRC = "/images/about/founder.jpg";

export default function FounderPortrait() {
  const [useFallback, setUseFallback] = useState(false);

  return (
    <figure className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border bg-surface shadow-lg dark:bg-card lg:max-w-md">
      {!useFallback ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={FOUNDER_SRC}
          alt="Mr. Hozefa Yusuf Ali Dhinojwala — Founder, Alamdaar Engineering Concern"
          className="h-full w-full object-cover object-center"
          onError={() => setUseFallback(true)}
        />
      ) : (
        <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-4 bg-gradient-to-br from-surface to-slate-100 p-10 dark:from-card dark:to-[#0a0f14]">
          <AecLogo size="xl" variant="auto" />
          <p className="text-center font-display text-sm font-semibold uppercase tracking-wide text-muted">
            Alamdaar Engineering Concern
          </p>
        </div>
      )}
    </figure>
  );
}
