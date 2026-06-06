"use client";

import { useState } from "react";
import type { Product } from "@/data/products";
import FeaturedMarqueeCard from "@/components/home/FeaturedMarqueeCard";

interface FeaturedMarqueeRowProps {
  title: string;
  products: Product[];
  direction: "left" | "right";
}

export default function FeaturedMarqueeRow({
  title,
  products,
  direction,
}: FeaturedMarqueeRowProps) {
  const [paused, setPaused] = useState(false);

  if (products.length === 0) return null;

  const loop = [...products, ...products];
  const animationClass =
    direction === "left" ? "animate-marquee-left" : "animate-marquee-right";

  return (
    <div>
      <h3 className="mb-4 font-display text-base font-semibold uppercase tracking-wide text-primary dark:text-foreground sm:text-lg">
        {title}
      </h3>
      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        <div
          className={`flex w-max gap-4 ${animationClass} motion-reduce:animate-none`}
          style={{ animationPlayState: paused ? "paused" : "running" }}
        >
          {loop.map((product, index) => (
            <div
              key={`${product.id}-${index}`}
              className="w-[220px] shrink-0 sm:w-[240px] md:w-[260px] lg:w-[280px]"
            >
              <FeaturedMarqueeCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
