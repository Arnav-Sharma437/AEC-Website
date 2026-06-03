"use client";

import { useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { testimonials } from "@/data/testimonials";
import SectionHeading from "@/components/premium/SectionHeading";
import ScrollReveal from "@/components/premium/ScrollReveal";

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const visible = [
    testimonials[index % testimonials.length],
    testimonials[(index + 1) % testimonials.length],
    testimonials[(index + 2) % testimonials.length],
  ];

  return (
    <ScrollReveal className="bg-background py-20">
      <article className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading title="What Our Clients Say" />
        <ul className="grid gap-6 md:grid-cols-3">
          {visible.map((t) => (
            <li
              key={`${t.id}-${index}`}
              className="rounded-lg border border-border bg-card p-6 shadow-sm"
              data-cursor-hover
            >
              <p className="mb-4 italic text-muted">&ldquo;{t.quote}&rdquo;</p>
              <p className="font-semibold text-primary dark:text-foreground">{t.name}</p>
              <p className="text-sm text-muted">{t.company}</p>
              <p className="mt-2 flex gap-0.5 text-accent">
                {Array.from({ length: t.rating }).map((_, star) => (
                  <Star key={star} className="h-4 w-4 fill-current" />
                ))}
              </p>
            </li>
          ))}
        </ul>
        <nav className="mt-8 flex justify-center gap-4">
          <button
            type="button"
            onClick={() => setIndex((i) => i - 1)}
            className="rounded-full border border-border p-2 hover:bg-surface dark:hover:bg-card"
            aria-label="Previous"
            data-cursor-hover
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setIndex((i) => i + 1)}
            className="rounded-full border border-border p-2 hover:bg-surface dark:hover:bg-card"
            aria-label="Next"
            data-cursor-hover
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </nav>
      </article>
    </ScrollReveal>
  );
}
