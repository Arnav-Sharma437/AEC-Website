import type { Product } from "@/data/products";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import ProductImage from "./ProductImage";

interface ProductCardProps {
  product: Product;
  /** Grid card for shop & featured sections */
  variant?: "grid";
}

export default function ProductCard({ product, variant = "grid" }: ProductCardProps) {
  if (variant !== "grid") return null;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-lg">
      <figure className="relative aspect-square overflow-hidden bg-slate-100">
        <ProductImage
          src={product.image}
          alt={product.name}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="transition-transform duration-500 group-hover:scale-105"
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
          className="mt-auto w-full text-xs sm:text-sm"
        />
      </section>
    </article>
  );
}
