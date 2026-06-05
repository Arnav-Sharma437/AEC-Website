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
              className="flex flex-col items-center justify-center rounded-xl border border-slate-200/90 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.06)] transition-shadow duration-300 ease-out hover:shadow-[0_8px_24px_rgba(15,23,42,0.10)]"
            >
              <div className="flex w-full items-center justify-center px-3 py-4">
                <ClientLogo client={client} />
              </div>
              <p className="mt-1 text-center text-[10px] font-medium leading-tight text-slate-500">
                {client.name}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </article>
    </section>
  );
}
