const reasons = [
  {
    icon: "🏭",
    title: "25+ Years Experience",
    desc: "Trusted partner since decades in industrial engineering",
  },
  {
    icon: "✅",
    title: "Certified Products",
    desc: "International quality standards and compliance",
  },
  {
    icon: "🚚",
    title: "Pan India Delivery",
    desc: "Kolkata, Hyderabad, and Chennai branches",
  },
  {
    icon: "🤝",
    title: "End-to-End Solutions",
    desc: "Not just a vendor — a long-term engineering partner",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-surface py-20">
      <article className="mx-auto max-w-7xl px-4 lg:px-8">
        <h2 className="mb-12 text-center font-display text-3xl font-bold uppercase text-primary">
          Why Alamdaar Engineering?
        </h2>
        <ul className="grid gap-8 sm:grid-cols-2">
          {reasons.map((item) => (
            <li
              key={item.title}
              className="rounded-lg border border-border bg-white p-8 text-center shadow-sm"
            >
              <span className="mb-4 block text-5xl">{item.icon}</span>
              <h3 className="mb-2 font-display text-xl font-semibold text-primary">
                {item.title}
              </h3>
              <p className="text-muted">{item.desc}</p>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
