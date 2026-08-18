"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Eye, X, ChevronLeft, ChevronRight, Download, Grid } from "lucide-react";
import SectionHeading from "@/components/motion/SectionHeading";
import { toTitleCase } from "@/lib/title-case";
import { DURATION, EASE_OUT, fadeIn, fadeUp, transition, VIEWPORT_ONCE } from "@/lib/motion";

const factoryImages = [
  { src: "/images/factory/Factory-1.jpeg", alt: "AEC factory and warehouse — raw material storage" },
  { src: "/images/factory/Factory-2.jpeg", alt: "AEC factory and warehouse — manufacturing workshop" },
  { src: "/images/factory/Factory-3.jpeg", alt: "AEC factory and warehouse — quality control floor" },
  { src: "/images/factory/Factory-4.jpeg", alt: "AEC factory and warehouse — shipping and dispatch area" },
  { src: "/images/factory/Factory-5.jpeg", alt: "AEC factory and warehouse — manufacturing process" },
  { src: "/images/factory/Factory-6.jpeg", alt: "AEC factory and warehouse — material handling equipment" },
  { src: "/images/factory/Factory-7.jpeg", alt: "AEC factory and warehouse — heavy machinery bay" },
  { src: "/images/factory/Factory-8.jpeg", alt: "AEC factory and warehouse — testing and verification yard" },
  { src: "/images/factory/Factory-9.jpeg", alt: "AEC factory and warehouse — product assembly section" },
  { src: "/images/factory/Factory-10.jpeg", alt: "AEC factory and warehouse — finished goods warehouse" },
  { src: "/images/factory/Factory-11.jpeg", alt: "AEC factory and warehouse — raw storage loading dock" },
  { src: "/images/factory/Factory-12.jpeg", alt: "AEC factory and warehouse — aerial warehouse view" },
];

export default function FactoryProduction() {
  const reduced = useReducedMotion();
  const [isExpanded, setIsExpanded] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Visible items count: 6 initially, all 12 if expanded
  const visibleImages = isExpanded ? factoryImages : factoryImages.slice(0, 6);

  const handlePrev = useCallback(() => {
    setLightboxIndex((prev) => (prev === null ? null : (prev - 1 + factoryImages.length) % factoryImages.length));
  }, []);

  const handleNext = useCallback(() => {
    setLightboxIndex((prev) => (prev === null ? null : (prev + 1) % factoryImages.length));
  }, []);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      else if (e.key === "ArrowLeft") handlePrev();
      else if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, handlePrev, handleNext]);

  return (
    <section className="bg-background py-20">
      <article className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading
          title="Our Factory & Warehouse"
          subtitle={toTitleCase(
            "state-of-the-art manufacturing and warehouse facility in howrah, west bengal"
          )}
        />

        {/* Gallery Grid */}
        <motion.ul 
          layout="position"
          className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {visibleImages.map((img, index) => (
              <motion.li
                layout
                key={img.src}
                initial={reduced ? false : fadeUp.hidden}
                whileInView={reduced ? undefined : fadeUp.visible}
                viewport={VIEWPORT_ONCE}
                transition={{
                  ...transition(reduced, DURATION.medium),
                  delay: reduced ? 0 : (index % 6) * 0.05,
                  ease: EASE_OUT,
                }}
                onClick={() => setLightboxIndex(index)}
                className="relative group overflow-hidden rounded-xl border border-slate-200/60 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/40 aspect-[4/3] shadow-sm hover:shadow-xl cursor-pointer transition-all duration-300"
              >
                {/* Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={img.alt}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />

                {/* Glassmorphic Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 opacity-0 group-hover:bg-black/40 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                  <div className="bg-white/95 dark:bg-slate-900/95 p-3.5 rounded-full shadow-lg scale-90 group-hover:scale-100 transition-transform duration-300 ease-out text-primary dark:text-accent">
                    <Eye className="h-6 w-6" />
                  </div>
                </div>

                {/* Subtitle tag */}
                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/70 via-black/40 to-transparent translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                  <p className="text-xs font-medium text-white/90 truncate">
                    {img.alt}
                  </p>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        {/* Explore Button */}
        <div className="mt-12 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-200 dark:border-slate-800 bg-card hover:bg-slate-50 dark:hover:bg-slate-900/80 text-sm font-semibold text-primary dark:text-foreground shadow-sm transition-colors duration-200"
          >
            <Grid className="h-4 w-4 text-accent" />
            {isExpanded ? "Show Less Photos" : "Explore Full Gallery (12 Photos)"}
          </motion.button>
        </div>
      </article>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col justify-between bg-black/95 p-4 md:p-8 backdrop-blur-md"
          >
            {/* Header controls */}
            <div className="flex w-full items-center justify-between z-10">
              <span className="text-sm font-medium text-white/70">
                {lightboxIndex + 1} of {factoryImages.length}
              </span>
              <div className="flex items-center gap-3">
                <a
                  href={factoryImages[lightboxIndex].src}
                  download={`AEC-Factory-${lightboxIndex + 1}.jpeg`}
                  title="Download image"
                  className="rounded-full bg-white/10 hover:bg-white/20 p-2.5 text-white transition-colors duration-200"
                >
                  <Download className="h-5 w-5" />
                </a>
                <button
                  type="button"
                  onClick={() => setLightboxIndex(null)}
                  title="Close gallery"
                  className="rounded-full bg-white/10 hover:bg-white/20 p-2.5 text-white transition-colors duration-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Main Carousel Area */}
            <div className="relative flex flex-1 items-center justify-center p-4">
              {/* Previous Button */}
              <button
                onClick={handlePrev}
                className="absolute left-2 md:left-4 z-10 rounded-full bg-white/5 hover:bg-white/15 p-3 text-white transition-colors duration-200"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              {/* Image Frame */}
              <motion.div
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="max-h-[75vh] max-w-[85vw] flex flex-col items-center gap-3"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={factoryImages[lightboxIndex].src}
                  alt={factoryImages[lightboxIndex].alt}
                  className="max-h-[70vh] max-w-full rounded-lg object-contain shadow-2xl border border-white/10"
                />
                <p className="text-center text-sm font-medium text-white/80 max-w-xl">
                  {factoryImages[lightboxIndex].alt}
                </p>
              </motion.div>

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="absolute right-2 md:right-4 z-10 rounded-full bg-white/5 hover:bg-white/15 p-3 text-white transition-colors duration-200"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            {/* Empty footer for vertical spacing balance */}
            <div className="h-6 w-full invisible" />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
