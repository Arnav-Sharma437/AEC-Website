"use client";

import { useState } from "react";
import Image from "next/image";
import type { Client } from "@/data/clients";

function initialsFallback(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

export default function ClientLogo({ client }: { client: Client }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className="flex h-10 min-w-[3rem] items-center justify-center rounded bg-surface px-2 font-display text-sm font-bold text-primary/40 dark:bg-card"
        aria-hidden
      >
        {initialsFallback(client.name)}
      </span>
    );
  }

  return (
    <Image
      src={client.logo}
      alt={`${client.name} logo`}
      width={120}
      height={48}
      unoptimized
      className="h-10 w-auto max-w-[7rem] object-contain object-center"
      onError={() => setFailed(true)}
    />
  );
}
