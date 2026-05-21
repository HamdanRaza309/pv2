import { services } from "@/lib/data";

export function Services() {
  return (
    <section id="services" className="section">
      <div className="container-x">
        <div className="flex items-baseline gap-4">
          <span className="section-num-big">04</span>
          <span className="eyebrow">Services</span>
        </div>
        <h2 className="mt-6 font-display font-bold text-3xl sm:text-4xl tracking-tight leading-[1.1] max-w-2xl">
          What I can build for you.
        </h2>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <div key={s.title} className="card group">
              <div className="font-mono text-xs text-muted">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-3 font-display font-bold text-xl tracking-tight group-hover:text-accent transition">
                {s.title}
              </h3>
              <p className="mt-3 text-sm text-fg/70 leading-relaxed">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
