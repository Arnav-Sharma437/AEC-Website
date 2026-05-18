import Link from "next/link";
import { CATEGORIES } from "@/data/categories";
import { ArrowRight } from "lucide-react";

export default function CategoryGrid() {
  return (
    <section className="bg-surface py-20 dark:bg-background">
      <article className="mx-auto max-w-7xl px-4 lg:px-8">
        <h2 className="mb-12 text-center font-display text-3xl font-bold uppercase text-primary dark:text-foreground md:text-4xl">
          Our Product Range
        </h2>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <li key={cat.slug}>
              <Link
                href={`/shop?category=${cat.slug}`}
                className="group flex h-full flex-col rounded-lg border border-border bg-card p-6 shadow-sm transition hover:border-accent hover:shadow-md"
              >
                <span className="mb-4 text-4xl">{cat.icon}</span>
                <h3 className="mb-2 font-display text-lg font-semibold text-primary group-hover:text-accent dark:text-foreground">
                  {cat.name}
                </h3>
                <p className="mb-4 flex-1 text-sm text-muted">{cat.description}</p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent">
                  View All <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
