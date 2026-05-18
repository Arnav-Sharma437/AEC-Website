const stats = [
  { value: "25+", label: "Years Experience" },
  { value: "10,000+", label: "Products" },
  { value: "3", label: "Branches Pan India" },
  { value: "ISO", label: "Certified" },
];

export default function StatsBar() {
  return (
    <section className="bg-primary py-10">
      <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 md:grid-cols-4 lg:px-8">
        {stats.map((stat) => (
          <li key={stat.label} className="text-center">
            <p className="font-display text-3xl font-bold text-accent md:text-4xl">
              {stat.value}
            </p>
            <p className="mt-1 text-sm uppercase tracking-wide text-white/80">
              {stat.label}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
