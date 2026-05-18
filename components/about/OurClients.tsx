import { clients } from "@/data/clients";

export default function OurClients() {
  return (
    <section className="py-20">
      <article className="mx-auto max-w-7xl px-4 lg:px-8">
        <h2 className="mb-12 text-center font-display text-3xl font-bold uppercase text-primary">
          Our Trusted Clients
        </h2>
        <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {clients.map((client) => (
            <li
              key={client.id}
              className="flex aspect-square flex-col items-center justify-center rounded-lg border border-border bg-surface p-4 grayscale transition hover:grayscale-0"
            >
              <span className="mb-2 font-display text-2xl font-bold text-primary/30">
                {client.name.charAt(0)}
              </span>
              <p className="text-center text-xs font-medium text-muted">
                {client.name}
              </p>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
