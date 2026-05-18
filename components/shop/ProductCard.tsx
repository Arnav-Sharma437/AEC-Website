import type { Product } from "@/data/products";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import ProductImage from "./ProductImage";

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export default function ProductCard({ product, compact }: ProductCardProps) {
  if (compact) {
    return (
      <article className="overflow-hidden rounded-lg border border-border bg-card shadow-sm transition hover:shadow-md">
        <figure className="relative aspect-square overflow-hidden bg-slate-100">
          <ProductImage src={product.image} alt={product.name} sizes="(max-width: 640px) 50vw, 25vw" />
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
      <figure className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 md:aspect-auto md:min-h-[220px] md:w-2/5">
        <ProductImage
          src={product.image}
          alt={product.name}
          sizes="(max-width: 768px) 100vw, 40vw"
        />
      </figure>
      <section className="flex flex-1 flex-col justify-center p-6">
        <span className="mb-2 inline-block w-fit rounded bg-surface px-2 py-0.5 font-condensed text-xs font-semibold uppercase text-muted">
          {product.category}
        </span>
        <h3 className="mb-2 font-display text-xl font-bold text-primary dark:text-foreground">
          {product.name}
        </h3>
        <p className="mb-4 line-clamp-3 text-sm text-muted">{product.description}</p>
        <p className="mb-4 font-display text-lg font-semibold text-accent">₹ {product.price}</p>
        <WhatsAppButton productName={product.name} category={product.category} />
      </section>
    </article>
  );
}
