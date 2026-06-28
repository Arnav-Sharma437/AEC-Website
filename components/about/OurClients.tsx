"use client";

import { motion, useReducedMotion } from "framer-motion";
import { clients, type Client } from "@/data/clients";
import ClientLogo from "./ClientLogo";
import SectionHeading from "@/components/motion/SectionHeading";
import { DURATION, EASE_OUT, fadeIn, staggerContainer, VIEWPORT_ONCE } from "@/lib/motion";

export default function OurClients() {
  const reduced = useReducedMotion();

  // Define client groups by their imageFile property
  const row1Images = ["Client-1", "Client-2", "Client-13", "Client-14", "Client-15", "Client-16"];
  const row2Images = ["Client-3", "Client-4", "Client-5", "Client-6", "Client-7", "Client-8"];
  const row3Images = ["Client-9", "Client-10", "Client-11", "Client-12", "Client-17", "Client-18"];

  const row1 = row1Images.map(img => clients.find(c => c.imageFile === img)).filter((c): c is Client => !!c);
  const row2 = row2Images.map(img => clients.find(c => c.imageFile === img)).filter((c): c is Client => !!c);
  const row3 = row3Images.map(img => clients.find(c => c.imageFile === img)).filter((c): c is Client => !!c);

  return (
    <section className="py-20">
      <article className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading title="Our Trusted Clients" />
        <motion.div
          variants={staggerContainer}
          initial={reduced ? false : "hidden"}
          whileInView={reduced ? undefined : "visible"}
          viewport={VIEWPORT_ONCE}
          className="flex flex-col gap-6 items-center"
        >
          {/* Row 1 */}
          <ul className="grid grid-cols-2 justify-items-center gap-6 sm:grid-cols-3 lg:grid-cols-6 w-full max-w-[1080px] mx-auto">
            {row1.map((client) => (
              <motion.li
                key={client.id}
                variants={fadeIn}
                transition={{ duration: DURATION.medium, ease: EASE_OUT }}
                className="w-[160px] h-[80px] flex items-center justify-center bg-white rounded-xl border border-slate-200/90 p-4 shadow-[0_2px_10px_rgba(15,23,42,0.06)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.10)] transition-all duration-300 ease-out"
                title={client.name}
              >
                <ClientLogo client={client} />
              </motion.li>
            ))}
          </ul>

          {/* Row 2 */}
          <ul className="grid grid-cols-2 justify-items-center gap-6 sm:grid-cols-3 lg:grid-cols-6 w-full max-w-[1080px] mx-auto">
            {row2.map((client) => (
              <motion.li
                key={client.id}
                variants={fadeIn}
                transition={{ duration: DURATION.medium, ease: EASE_OUT }}
                className="w-[160px] h-[80px] flex items-center justify-center bg-white rounded-xl border border-slate-200/90 p-4 shadow-[0_2px_10px_rgba(15,23,42,0.06)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.10)] transition-all duration-300 ease-out"
                title={client.name}
              >
                <ClientLogo client={client} />
              </motion.li>
            ))}
          </ul>

          {/* Row 3 (Centered, flex wrap) */}
          <ul className="flex flex-wrap justify-center gap-6 w-full max-w-[1080px] mx-auto">
            {row3.map((client) => (
              <motion.li
                key={client.id}
                variants={fadeIn}
                transition={{ duration: DURATION.medium, ease: EASE_OUT }}
                className="w-[160px] h-[80px] flex items-center justify-center bg-white rounded-xl border border-slate-200/90 p-4 shadow-[0_2px_10px_rgba(15,23,42,0.06)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.10)] transition-all duration-300 ease-out"
                title={client.name}
              >
                <ClientLogo client={client} />
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </article>
    </section>
  );
}
