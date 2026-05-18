import type { Product } from "@/data/products";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export default function ProductCard({ product, compact }: ProductCardProps) {
  if (compact) {
    return (
      <article className="overflow-hidden rounded-lg border border-border bg-card shadow-sm transition hover:shadow-md">
        <figure className="aspect-square bg-gradient-to-br from-secondary/20 to-primary/10 flex items-center justify-center">
          <span className="font-display text-4xl font-bold text-primary/20">
            AEC
          </span>
        </figure>
        <section className="p-4">
          <span className="mb-1 inline-block rounded bg-surface px-2 py-0.5 font-condensed text-xs font-semibold uppercase text-muted">
            {product.category}
          </span>
          <h3 className="mb-3 font-display text-base font-semibold text-primary dark:text-foreground">
            {product.name}
          </h3>
          <WhatsAppButton
            productName={product.name}
            category={product.category}
            compact
            className="w-full"
          />
        </section>
      </article>
    );
  }

  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition hover:shadow-md md:flex-row">
      <figure className="flex w-full items-center justify-center bg-gradient-to-br from-secondary/20 to-primary/10 md:w-2/5 md:min-h-[220px]">
        <span className="font-display text-6xl font-bold text-primary/15">
          AEC
        </span>
      </figure>
      <section className="flex flex-1 flex-col justify-center p-6">
        <span className="mb-2 inline-block w-fit rounded bg-surface px-2 py-0.5 font-condensed text-xs font-semibold uppercase text-muted">
          {product.category}
        </span>
        <h3 className="mb-2 font-display text-xl font-bold text-primary dark:text-foreground">
          {product.name}
        </h3>
        <p className="mb-4 line-clamp-3 text-sm text-muted">
          {product.description}
        </p>
        <p className="mb-4 font-display text-lg font-semibold text-accent">
          ₹ {product.price}
        </p>
        <WhatsAppButton
          productName={product.name}
          category={product.category}
        />
      </section>
    </article>
  );
}
