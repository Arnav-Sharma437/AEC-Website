"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/data/categories";
import { usePremiumMotion } from "@/components/providers/PremiumExperienceProvider";

interface FlipCategoryCardProps {
  category: Category;
}

export default function FlipCategoryCard({ category }: FlipCategoryCardProps) {
  const enabled = usePremiumMotion();

  if (!enabled) {
    return (
      <Link
        href={`/shop?category=${category.slug}`}
        data-cursor-hover
        className="flex h-full min-h-[220px] flex-col rounded-lg border border-border bg-card p-6 shadow-sm transition hover:border-accent hover:shadow-md"
      >
        <span className="mb-4 text-4xl">{category.icon}</span>
        <h3 className="mb-2 font-display text-lg font-semibold text-primary dark:text-foreground">
          {category.name}
        </h3>
        <p className="mb-4 flex-1 text-sm text-muted">{category.description}</p>
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent">
          View All <ArrowRight className="h-4 w-4" />
        </span>
      </Link>
    );
  }

  return (
    <div className="flip-card h-full min-h-[240px]" data-cursor-hover>
      <div className="flip-card-inner h-full">
        <div className="flip-card-face flip-card-front flex flex-col rounded-lg border border-border bg-card p-6 shadow-sm">
          <span className="mb-4 text-4xl">{category.icon}</span>
          <h3 className="font-display text-lg font-semibold text-primary dark:text-foreground">
            {category.name}
          </h3>
        </div>
        <div className="flip-card-face flip-card-back flex flex-col items-center justify-center rounded-lg border border-accent/40 bg-primary p-6 text-center shadow-lg">
          <p className="mb-6 text-sm leading-relaxed text-white/85">
            {category.description}
          </p>
          <Link
            href={`/shop?category=${category.slug}`}
            className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 font-display text-xs font-semibold uppercase tracking-wide text-primary transition hover:brightness-105"
          >
            View Products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
