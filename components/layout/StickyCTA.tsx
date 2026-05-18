"use client";

import { useState } from "react";
import { FaWhatsapp, FaFacebook, FaInstagram } from "react-icons/fa";
import { Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { branches, ctaLinks } from "@/data/branches";
import { buildGeneralWhatsAppUrl } from "@/lib/whatsapp";

export default function StickyCTA() {
  const [waOpen, setWaOpen] = useState(false);
  const [igOpen, setIgOpen] = useState(false);

  return (
    <aside className="fixed right-4 top-1/2 z-50 flex -translate-y-1/2 flex-col gap-2">
      <section
        className="relative"
        onMouseEnter={() => setWaOpen(true)}
        onMouseLeave={() => setWaOpen(false)}
      >
        <button
          type="button"
          onClick={() => setWaOpen(!waOpen)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-110"
          aria-label="WhatsApp"
        >
          <FaWhatsapp className="h-6 w-6" />
        </button>
        <AnimatePresence>
          {waOpen && (
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute right-14 top-0 w-72 rounded-lg bg-white p-3 shadow-xl"
            >
              {branches.map((branch, i) => (
                <motion.section
                  key={branch.city}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-border py-3 last:border-0"
                >
                  <p className="font-display text-xs font-bold uppercase text-accent">
                    {branch.label} — {branch.city}
                  </p>
                  <p className="mb-2 text-xs text-muted">{branch.entity}</p>
                  {branch.contacts.map((c) => (
                    <a
                      key={c.number}
                      href={buildGeneralWhatsAppUrl(c.number)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mb-1 flex items-center justify-between rounded px-2 py-1 text-sm hover:bg-surface"
                    >
                      <span>{c.name}</span>
                      <span className="font-medium text-[#25D366]">
                        {c.display}
                      </span>
                    </a>
                  ))}
                </motion.section>
              ))}
            </motion.section>
          )}
        </AnimatePresence>
      </section>

      <a
        href={ctaLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-lg transition hover:scale-110"
        aria-label="Facebook"
      >
        <FaFacebook className="h-6 w-6" />
      </a>

      <section
        className="relative"
        onMouseEnter={() => setIgOpen(true)}
        onMouseLeave={() => setIgOpen(false)}
      >
        <button
          type="button"
          onClick={() => setIgOpen(!igOpen)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white shadow-lg transition hover:scale-110"
          aria-label="Instagram"
        >
          <FaInstagram className="h-6 w-6" />
        </button>
        <AnimatePresence>
          {igOpen && (
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute right-14 top-0 w-56 rounded-lg bg-white p-3 shadow-xl"
            >
              {ctaLinks.instagram.map((ig, i) => (
                <motion.a
                  key={ig.handle}
                  href={ig.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-2 rounded px-2 py-2 text-sm hover:bg-surface"
                >
                  <FaInstagram className="text-[#E4405F]" />
                  <span>
                    <strong>{ig.label}</strong>
                    <br />
                    <span className="text-muted">{ig.handle}</span>
                  </span>
                </motion.a>
              ))}
            </motion.section>
          )}
        </AnimatePresence>
      </section>

      <a
        href={ctaLinks.email}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg transition hover:scale-110"
        aria-label="Email"
      >
        <Mail className="h-5 w-5" />
      </a>
    </aside>
  );
}
