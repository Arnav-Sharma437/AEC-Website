"use client";

import Image from "next/image";
import type { Client } from "@/data/clients";

export default function ClientLogo({ client }: { client: Client }) {
  return (
    <Image
      src={client.logo}
      alt={`${client.name} logo`}
      width={120}
      height={48}
      unoptimized
      className="h-10 w-auto max-w-[7rem] object-contain object-center opacity-70"
    />
  );
}
