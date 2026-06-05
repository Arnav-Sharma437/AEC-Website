"use client";

import { motion, useReducedMotion } from "framer-motion";
import { clients } from "@/data/clients";
import ClientLogo from "./ClientLogo";
import SectionHeading from "@/components/motion/SectionHeading";
import { DURATION, EASE_OUT, fadeIn, staggerContainer, VIEWPORT_ONCE } from "@/lib/motion";

export default function OurClients() {
  const reduced = useReducedMotion();

  return (
    <section className="py-20">
      <article className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading title="Our Trusted Clients" />
        <motion.ul
          className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6"
          variants={staggerContainer}
          initial={reduced ? false : "hidden"}
          whileInView={reduced ? undefined : "visible"}
          viewport={VIEWPORT_ONCE}
        >
          {clients.map((client) => (
            <motion.li
              key={client.id}
              variants={fadeIn}
              transition={{ duration: DURATION.medium, ease: EASE_OUT }}
              className="flex flex-col items-center justify-center rounded-lg border border-border bg-surface p-4 grayscale transition-[filter] duration-300 ease-out hover:grayscale-0 dark:bg-card"
            >
              <ClientLogo client={client} />
              <p className="mt-3 text-center text-[10px] font-medium leading-tight text-muted">
                {client.name}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </article>
    </section>
  );
}
