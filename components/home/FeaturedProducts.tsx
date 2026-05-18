import { getFeaturedProducts } from "@/data/products";
import ProductCard from "@/components/shop/ProductCard";

export default function FeaturedProducts() {
  const featured = getFeaturedProducts();

  return (
    <section className="bg-background py-20">
      <article className="mx-auto max-w-7xl px-4 lg:px-8">
        <h2 className="mb-12 text-center font-display text-3xl font-bold uppercase text-primary dark:text-foreground">
          Featured Products
        </h2>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} compact />
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
