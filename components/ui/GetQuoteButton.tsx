"use client";

import Link from "next/link";
import { buildGeneralWhatsAppUrl } from "@/lib/whatsapp";

interface GetQuoteButtonProps {
  className?: string;
  phone?: string;
}

export default function GetQuoteButton({
  className = "",
  phone = "919831046296",
}: GetQuoteButtonProps) {
  return (
    <Link
      href={buildGeneralWhatsAppUrl(phone)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 font-display text-sm font-semibold uppercase tracking-wide text-primary transition hover:bg-accent-dark ${className}`}
    >
      Get a Quote
    </Link>
  );
}
