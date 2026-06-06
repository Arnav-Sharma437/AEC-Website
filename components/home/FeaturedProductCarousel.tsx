"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/data/products";
import ProductCard from "@/components/shop/ProductCard";

const SLIDE_TRANSITION = { duration: 0.35, ease: "easeInOut" } as const;

interface FeaturedProductCarouselProps {
  title: string;
  products: Product[];
}

export default function FeaturedProductCarousel({
  title,
  products,
}: FeaturedProductCarouselProps) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const count = products.length;

  if (count === 0) return null;

  function goPrev() {
    setActive((i) => (i - 1 + count) % count);
  }

  function goNext() {
    setActive((i) => (i + 1) % count);
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <h3 className="mb-6 text-center font-display text-lg font-semibold uppercase tracking-wide text-primary dark:text-foreground">
        {title}
      </h3>

      <div
        className="relative mx-auto h-[min(420px,72vw)] max-h-[440px] w-full [perspective:1200px]"
        aria-roledescription="carousel"
        aria-label={title}
      >
        <ul className="relative h-full w-full [transform-style:preserve-3d]">
          {products.map((product, index) => {
            let offset = index - active;
            if (offset > count / 2) offset -= count;
            if (offset < -count / 2) offset += count;

            const isActive = offset === 0;
            const visible = Math.abs(offset) <= 1;

            return (
              <motion.li
                key={product.id}
                className="absolute left-1/2 top-0 w-[min(280px,78vw)] -translate-x-1/2"
                initial={false}
                animate={
                  reduced
                    ? {
                        opacity: isActive ? 1 : 0,
                        x: 0,
                        rotateY: 0,
                        scale: 1,
                        zIndex: isActive ? 10 : 0,
                      }
                    : {
                        opacity: visible ? (isActive ? 1 : 0.55) : 0,
                        x: offset * 140,
                        rotateY: offset * -42,
                        scale: isActive ? 1 : 0.88,
                        zIndex: 10 - Math.abs(offset),
                      }
                }
                transition={SLIDE_TRANSITION}
                style={{
                  transformStyle: "preserve-3d",
                  pointerEvents: isActive ? "auto" : "none",
                }}
                aria-hidden={!isActive}
              >
                <ProductCard product={product} variant="grid" index={0} />
              </motion.li>
            );
          })}
        </ul>
      </div>

      <nav className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={goPrev}
          className="rounded-full border border-border bg-card p-2.5 shadow-sm transition hover:border-accent hover:bg-surface"
          aria-label={`Previous ${title}`}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex gap-2">
          {products.map((product, i) => (
            <button
              key={product.id}
              type="button"
              onClick={() => setActive(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === active ? "w-6 bg-accent" : "w-2 bg-border hover:bg-accent/50"
              }`}
              aria-label={`Go to ${product.name}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={goNext}
          className="rounded-full border border-border bg-card p-2.5 shadow-sm transition hover:border-accent hover:bg-surface"
          aria-label={`Next ${title}`}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </nav>
    </div>
  );
}
