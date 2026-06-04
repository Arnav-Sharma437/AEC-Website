import { FaWhatsapp } from "react-icons/fa";
import { Phone } from "lucide-react";
import { branches } from "@/data/branches";
import { buildGeneralWhatsAppUrl } from "@/lib/whatsapp";

function BranchCard({
  branch,
  highlighted,
}: {
  branch: (typeof branches)[0];
  highlighted?: boolean;
}) {
  return (
    <li
      className={
        highlighted
          ? "rounded-xl border-2 border-accent bg-card p-8 shadow-lg ring-2 ring-accent/20"
          : "rounded-lg border border-border bg-card p-6 shadow-sm"
      }
    >
      <p className="mb-1 font-display text-xs font-bold uppercase tracking-widest text-accent">
        {branch.label} — {branch.city}
      </p>
      <p
        className={`mb-4 font-semibold text-primary dark:text-foreground ${
          highlighted ? "text-xl" : "text-sm"
        }`}
      >
        {branch.entity}
      </p>
      <ul className="space-y-3">
        {branch.contacts.map((contact) => (
          <li key={contact.number}>
            <p className="text-sm font-medium">{contact.name}</p>
            <p className="mb-2 text-sm text-muted">{contact.display}</p>
            <nav className="flex flex-wrap gap-2">
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
  );
}

export default function BranchCards() {
  const headOffice = branches.find((b) => b.isHeadOffice) ?? branches[0];
  const regional = branches.filter((b) => !b.isHeadOffice);

  return (
    <div className="space-y-6">
      <ul>
        <BranchCard branch={headOffice} highlighted />
      </ul>
      <ul className="grid gap-6 md:grid-cols-2">
        {regional.map((branch) => (
          <BranchCard key={branch.city} branch={branch} />
        ))}
      </ul>
    </div>
  );
}
