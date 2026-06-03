"use client";

import dynamic from "next/dynamic";
import type { Product } from "@/data/products";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import ProductImage from "./ProductImage";
import { usePremiumMotion } from "@/components/providers/PremiumExperienceProvider";

const Tilt = dynamic(() => import("react-parallax-tilt"), { ssr: false });

interface ProductCardProps {
  product: Product;
  variant?: "grid";
  index?: number;
}

function CardContent({ product }: { product: Product }) {
  return (
    <>
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
          {product.category}
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
    </>
  );
}

export default function ProductCard({
  product,
  variant = "grid",
}: ProductCardProps) {
  const premium = usePremiumMotion();

  if (variant !== "grid") return null;

  const articleClass =
    "group flex h-full flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm";

  if (!premium) {
    return (
      <article className={articleClass}>
        <CardContent product={product} />
      </article>
    );
  }

  return (
    <Tilt
      tiltMaxAngleX={15}
      tiltMaxAngleY={15}
      glareEnable
      glareMaxOpacity={0.2}
      scale={1.02}
      transitionSpeed={400}
      className="h-full"
    >
      <article className={articleClass} data-cursor-hover>
        <CardContent product={product} />
      </article>
    </Tilt>
  );
}
