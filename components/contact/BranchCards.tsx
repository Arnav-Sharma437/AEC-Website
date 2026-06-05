"use client";

import { FaWhatsapp } from "react-icons/fa";
import { MapPin, Phone } from "lucide-react";
import { branches } from "@/data/branches";
import { buildGeneralWhatsAppUrl } from "@/lib/whatsapp";
import type { Branch } from "@/data/branches";

function ContactRow({ name, display, number }: { name: string; display: string; number: string }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-white/5 bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-medium text-white">{name}</p>
        <p className="text-sm text-white/60">{display}</p>
      </div>
      <div className="flex shrink-0 gap-2">
        <a
          href={buildGeneralWhatsAppUrl(number)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md bg-[#25D366] px-4 py-2 text-xs font-semibold text-white transition hover:brightness-110"
        >
          <FaWhatsapp className="h-4 w-4" /> WhatsApp
        </a>
        <a
          href={`tel:+${number}`}
          className="inline-flex items-center gap-1.5 rounded-md border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition hover:border-accent hover:bg-accent/10"
        >
          <Phone className="h-4 w-4" /> Call
        </a>
      </div>
    </div>
  );
}

function CityBadge({ city }: { city: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
      <MapPin className="h-3.5 w-3.5" aria-hidden />
      {city}
    </span>
  );
}

function HeadOfficeCard({ branch }: { branch: Branch }) {
  return (
    <li className="group rounded-2xl border-l-[8px] border-accent bg-[#0a0f14] p-8 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(212,168,67,0.2)] hover:ring-1 hover:ring-accent/50 md:p-10">
      <CityBadge city={branch.city} />
      <h3 className="mt-5 font-display text-3xl font-bold uppercase tracking-wide text-white md:text-4xl">
        {branch.label}
      </h3>
      <p className="mt-2 font-display text-xl font-semibold text-accent md:text-2xl">
        {branch.entity}
      </p>
      <hr className="my-8 border-white/10" />
      <ul className="grid gap-4 md:grid-cols-2">
        {branch.contacts.map((contact) => (
          <li key={contact.number}>
            <ContactRow
              name={contact.name}
              display={contact.display}
              number={contact.number}
            />
          </li>
        ))}
      </ul>
    </li>
  );
}

function RegionalCard({ branch }: { branch: Branch }) {
  return (
    <li className="group flex h-full flex-col rounded-2xl border-l-[6px] border-accent/80 bg-[#0c1218] p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_32px_rgba(212,168,67,0.18)] hover:ring-1 hover:ring-accent/40 md:p-8">
      <CityBadge city={branch.city} />
      <h3 className="mt-4 font-display text-xl font-bold uppercase tracking-wide text-white">
        {branch.label}
      </h3>
      <p className="mt-1 font-display text-lg font-semibold text-accent">{branch.entity}</p>
      <hr className="my-6 border-white/10" />
      <ul className="flex flex-1 flex-col gap-3">
        {branch.contacts.map((contact) => (
          <li key={contact.number}>
            <ContactRow
              name={contact.name}
              display={contact.display}
              number={contact.number}
            />
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
        <HeadOfficeCard branch={headOffice} />
      </ul>
      <ul className="grid gap-6 md:grid-cols-2">
        {regional.map((branch) => (
          <RegionalCard key={branch.city} branch={branch} />
        ))}
      </ul>
    </div>
  );
}
