import { FaWhatsapp } from "react-icons/fa";
import { Phone } from "lucide-react";
import { branches } from "@/data/branches";
import { buildGeneralWhatsAppUrl } from "@/lib/whatsapp";

export default function BranchCards() {
  return (
    <ul className="grid gap-6 md:grid-cols-3">
      {branches.map((branch) => (
        <li
          key={branch.city}
          className="rounded-lg border border-border bg-card p-6 shadow-sm"
        >
          <p className="mb-1 font-display text-xs font-bold uppercase text-accent">
            {branch.label} — {branch.city}
          </p>
          <p className="mb-4 text-sm font-semibold text-primary dark:text-foreground">
            {branch.entity}
          </p>
          <ul className="space-y-3">
            {branch.contacts.map((contact) => (
              <li key={contact.number}>
                <p className="text-sm font-medium">{contact.name}</p>
                <p className="mb-2 text-sm text-muted">{contact.display}</p>
                <nav className="flex gap-2">
                  <a
                    href={buildGeneralWhatsAppUrl(contact.number)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded bg-[#25D366] px-3 py-1.5 text-xs font-semibold text-white"
                  >
                    <FaWhatsapp className="h-3.5 w-3.5" /> WhatsApp
                  </a>
                  <a
                    href={`tel:+${contact.number}`}
                    className="inline-flex items-center gap-1 rounded border border-border px-3 py-1.5 text-xs font-semibold text-primary hover:bg-surface dark:text-foreground dark:hover:bg-surface"
                  >
                    <Phone className="h-3.5 w-3.5" /> Call
                  </a>
                </nav>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
