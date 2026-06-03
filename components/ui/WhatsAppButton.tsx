"use client";

import { FaWhatsapp } from "react-icons/fa";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface WhatsAppButtonProps {
  productName: string;
  category: string;
  className?: string;
  compact?: boolean;
}

export default function WhatsAppButton({
  productName,
  category,
  className = "",
  compact = false,
}: WhatsAppButtonProps) {
  return (
    <a
      href={buildWhatsAppUrl(productName, category)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-md bg-[#25D366] px-4 py-2 text-sm font-semibold text-white transition-colors duration-300 ease-out hover:bg-[#1da851] ${className}`}
    >
      <FaWhatsapp className={compact ? "h-4 w-4" : "h-5 w-5"} />
      Get Quote
    </a>
  );
}
