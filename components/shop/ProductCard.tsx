"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Product } from "@/data/products";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import ProductImage from "./ProductImage";
import { DURATION, EASE_OUT, fadeUp, transition } from "@/lib/motion";

interface ProductCardProps {
  product: Product;
  /** Grid card for shop & featured sections */
  variant?: "grid";
  /** Stagger index for scroll-in delay (0.1s per card) */
  index?: number;
}

export default function ProductCard({
  product,
  variant = "grid",
  index = 0,
}: ProductCardProps) {
  const reduced = useReducedMotion();

  if (variant !== "grid") return null;

  return (
    <motion.article
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm"
      initial={reduced ? false : fadeUp.hidden}
      whileInView={reduced ? undefined : fadeUp.visible}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        ...transition(reduced, DURATION.medium),
        delay: reduced ? 0 : index * 0.1,
        ease: EASE_OUT,
      }}
      whileHover={
        reduced
          ? undefined
          : {
              y: -5,
              boxShadow:
                "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
            }
      }
    >
      <figure className="relative aspect-square overflow-hidden bg-slate-100">
        <ProductImage
          src={product.image}
          alt={product.name}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </figure>
      <section className="flex flex-1 flex-col p-3 sm:p-4">
        <span className="mb-2 inline-block w-fit max-w-full truncate rounded-md bg-surface px-2 py-0.5 font-condensed text-[10px] font-semibold uppercase tracking-wide text-muted sm:text-xs">
          {product.subCategory}
        </span>
        <h3 className="mb-2 line-clamp-2 flex-1 font-display text-sm font-semibold leading-snug text-primary dark:text-foreground sm:text-base">
          {product.name}
        </h3>
        <p className="mb-3 font-display text-base font-bold text-accent sm:text-lg">
          ₹ {product.price}
        </p>
        <WhatsAppButton
          productName={product.name}
          category={product.category}
          compact
          className="mt-auto w-full text-xs transition-colors duration-300 ease-out sm:text-sm"
        />
      </section>
    </motion.article>
  );
}
