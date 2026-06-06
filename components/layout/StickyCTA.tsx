"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { FaWhatsapp, FaFacebook, FaInstagram } from "react-icons/fa";
import { ChevronLeft, ChevronRight, Mail, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { branches, ctaLinks } from "@/data/branches";
import { buildGeneralWhatsAppUrl } from "@/lib/whatsapp";

const SLIDE = { duration: 0.3, ease: "easeInOut" } as const;

function WhatsAppPanel({ onClose }: { onClose: () => void }) {
  return (
    <>
      {branches.map((branch, i) => (
        <section
          key={branch.city}
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
              onClick={onClose}
              className="mb-1 flex items-center justify-between gap-2 rounded px-2 py-1.5 text-sm hover:bg-surface"
            >
              <span className="min-w-0 truncate">{c.name}</span>
              <span className="shrink-0 font-medium text-[#25D366]">{c.display}</span>
            </a>
          ))}
        </section>
      ))}
    </>
  );
}

function InstagramPanel({ onClose }: { onClose: () => void }) {
  return (
    <>
      {ctaLinks.instagram.map((ig) => (
        <a
          key={ig.handle}
          href={ig.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className="flex items-center gap-2 rounded px-2 py-2 text-sm hover:bg-surface"
        >
          <FaInstagram className="shrink-0 text-[#E4405F]" />
          <span className="min-w-0">
            <strong>{ig.label}</strong>
            <br />
            <span className="text-muted">{ig.handle}</span>
          </span>
        </a>
      ))}
    </>
  );
}

function MobileSheet({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={SLIDE}
            className="fixed inset-0 z-[60] bg-black/45 md:hidden"
            onClick={onClose}
          />
          <motion.section
            role="dialog"
            aria-label={title}
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={SLIDE}
            className="fixed inset-x-3 bottom-3 z-[70] max-h-[min(70vh,520px)] overflow-y-auto rounded-xl bg-card p-4 shadow-2xl md:hidden"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="font-display text-sm font-bold uppercase text-primary dark:text-foreground">
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface text-muted"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {children}
          </motion.section>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

function CTAButtons({
  waOpen,
  setWaOpen,
  igOpen,
  setIgOpen,
  compact = false,
}: {
  waOpen: boolean;
  setWaOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
  igOpen: boolean;
  setIgOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
  compact?: boolean;
}) {
  const btnClass = compact
    ? "flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition active:scale-95"
    : "flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition hover:scale-110";
  const iconClass = compact ? "h-5 w-5" : "h-6 w-6";

  return (
    <>
      <section
        className="relative"
        onMouseEnter={() => !compact && setWaOpen(true)}
        onMouseLeave={() => !compact && setWaOpen(false)}
      >
        <button
          type="button"
          onClick={() => {
            setIgOpen(false);
            setWaOpen((prev) => !prev);
          }}
          className={`${btnClass} bg-[#25D366] text-white`}
          aria-label="WhatsApp"
          aria-expanded={waOpen}
        >
          <FaWhatsapp className={iconClass} />
        </button>
        {!compact && (
          <AnimatePresence>
            {waOpen && (
              <motion.section
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute right-14 top-0 hidden w-72 rounded-lg bg-card p-3 shadow-xl md:block"
              >
                <WhatsAppPanel onClose={() => setWaOpen(false)} />
              </motion.section>
            )}
          </AnimatePresence>
        )}
      </section>

      <a
        href={ctaLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className={`${btnClass} bg-[#1877F2] text-white`}
        aria-label="Facebook"
      >
        <FaFacebook className={iconClass} />
      </a>

      <section
        className="relative"
        onMouseEnter={() => !compact && setIgOpen(true)}
        onMouseLeave={() => !compact && setIgOpen(false)}
      >
        <button
          type="button"
          onClick={() => {
            setWaOpen(false);
            setIgOpen((prev) => !prev);
          }}
          className={`${btnClass} bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white`}
          aria-label="Instagram"
          aria-expanded={igOpen}
        >
          <FaInstagram className={iconClass} />
        </button>
        {!compact && (
          <AnimatePresence>
            {igOpen && (
              <motion.section
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute right-14 top-0 hidden w-56 rounded-lg bg-card p-3 shadow-xl md:block"
              >
                <InstagramPanel onClose={() => setIgOpen(false)} />
              </motion.section>
            )}
          </AnimatePresence>
        )}
      </section>

      <a
        href={ctaLinks.email}
        className={`${btnClass} bg-primary text-white`}
        aria-label="Email"
      >
        <Mail className={compact ? "h-4 w-4" : "h-5 w-5"} />
      </a>
    </>
  );
}

export default function StickyCTA() {
  const [waOpen, setWaOpen] = useState(false);
  const [igOpen, setIgOpen] = useState(false);
  const [mobileVisible, setMobileVisible] = useState(true);

  useEffect(() => {
    function handleScroll() {
      if (window.matchMedia("(min-width: 768px)").matches) return;
      setMobileVisible(false);
      setWaOpen(false);
      setIgOpen(false);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function toggleMobile() {
    setMobileVisible((prev) => {
      if (prev) {
        setWaOpen(false);
        setIgOpen(false);
      }
      return !prev;
    });
  }

  function closeMobilePanels() {
    setWaOpen(false);
    setIgOpen(false);
  }

  return (
    <>
      <MobileSheet open={waOpen} title="WhatsApp Contacts" onClose={closeMobilePanels}>
        <WhatsAppPanel onClose={closeMobilePanels} />
      </MobileSheet>
      <MobileSheet open={igOpen} title="Instagram" onClose={closeMobilePanels}>
        <InstagramPanel onClose={closeMobilePanels} />
      </MobileSheet>

      <aside className="fixed bottom-20 right-3 z-50 max-w-[calc(100vw-1.5rem)] sm:bottom-24 sm:right-4 md:bottom-auto md:right-4 md:top-1/2 md:max-w-none md:-translate-y-1/2">
        <div className="flex items-center justify-end gap-1.5 md:hidden">
          <motion.div
            className="flex flex-col gap-1.5 overflow-hidden"
            initial={false}
            animate={{
              x: mobileVisible ? 0 : "110%",
              opacity: mobileVisible ? 1 : 0,
            }}
            transition={SLIDE}
            style={{ pointerEvents: mobileVisible ? "auto" : "none" }}
            aria-hidden={!mobileVisible}
          >
            <CTAButtons
              compact
              waOpen={waOpen}
              setWaOpen={setWaOpen}
              igOpen={igOpen}
              setIgOpen={setIgOpen}
            />
          </motion.div>

          <button
            type="button"
            onClick={toggleMobile}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent text-primary shadow-lg transition active:scale-95"
            aria-label={mobileVisible ? "Hide contact shortcuts" : "Show contact shortcuts"}
            aria-expanded={mobileVisible}
          >
            {mobileVisible ? (
              <ChevronLeft className="h-5 w-5" aria-hidden />
            ) : (
              <ChevronRight className="h-5 w-5" aria-hidden />
            )}
          </button>
        </div>

        <div className="hidden flex-col gap-2 md:flex">
          <CTAButtons
            waOpen={waOpen}
            setWaOpen={setWaOpen}
            igOpen={igOpen}
            setIgOpen={setIgOpen}
          />
        </div>
      </aside>
    </>
  );
}
