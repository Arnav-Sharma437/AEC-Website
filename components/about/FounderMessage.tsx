import AecLogo from "@/components/ui/AecLogo";

export default function FounderMessage() {
  return (
    <section className="py-20">
      <article className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2 lg:px-8">
        <figure className="flex aspect-square items-center justify-center rounded-lg bg-surface p-8 dark:bg-card">
          <AecLogo size="xl" />
        </figure>
        <section>
          <p className="mb-2 font-condensed text-sm font-semibold uppercase tracking-widest text-accent">
            Founder&apos;s Message
          </p>
          <h2 className="mb-2 font-display text-2xl font-bold text-primary dark:text-foreground">
            Mr. Hozefa Yusuf Ali Dhinojwala
          </h2>
          <p className="mb-6 text-muted">
            Founder & Principal Advisor, Alamdaar Engineering Concern
          </p>
          <blockquote className="space-y-4 text-muted leading-relaxed">
            <p>
              When I established Alamdaar Engineering Concern more than 25 years ago,
              it was with a firm belief that quality, reliability, and client trust are
              the cornerstones of a successful engineering business.
            </p>
            <p>
              Over the decades, we have grown from a small trading firm into a
              pan-India engineering solutions provider, serving clients across
              construction, infrastructure, marine, and industrial sectors with
              material handling, scaffolding, rigging, and lifting equipment.
            </p>
            <p>
              Our commitment remains unchanged: to deliver dependable, high-quality
              products backed by exceptional service. Every partnership we build is
              founded on integrity, precision, and a shared vision for project success.
            </p>
          </blockquote>
        </section>
      </article>
    </section>
  );
}
