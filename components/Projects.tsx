import { ArrowUpRight, Github } from "lucide-react";
import { projects } from "@/lib/data";

export function Projects() {
  const featured = projects.filter((p) => p.featured);
  const more = projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="section">
      <div className="container-x">
        <div className="flex items-baseline gap-4">
          <span className="section-num-big">05</span>
          <span className="eyebrow">Selected Projects</span>
        </div>
        <h2 className="mt-6 font-display font-bold text-3xl sm:text-4xl tracking-tight leading-[1.1] max-w-2xl">
          Real things I&apos;ve built and shipped.
        </h2>

        <div className="mt-12 grid md:grid-cols-2 gap-5">
          {featured.map((p) => (
            <article key={p.title} className="card group flex flex-col">
              <div className="flex items-start justify-between gap-4">
                <span className="badge">{p.category}</span>
                <div className="flex items-center gap-2">
                  {p.github && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${p.title} GitHub`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-fg/15 hover:bg-fg/5 transition"
                    >
                      <Github className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {p.live && (
                    <a
                      href={p.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${p.title} live`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-fg/15 hover:bg-fg/5 transition"
                    >
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>

              <h3 className="mt-5 font-display font-bold text-2xl tracking-tight group-hover:text-accent transition">
                {p.title}
              </h3>
              <p className="mt-3 text-sm text-fg/70 leading-relaxed flex-1">
                {p.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-1.5">
                {p.tech.map((t) => (
                  <span key={t} className="chip text-[11px]">
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        {more.length > 0 && (
          <div className="mt-12">
            <h3 className="eyebrow mb-5">More Builds</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {more.map((p) => (
                <a
                  key={p.title}
                  href={p.github || p.live || "#"}
                  target={p.github || p.live ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="card !p-5 group block"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
                      {p.category}
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 transition" />
                  </div>
                  <h4 className="mt-3 font-display font-bold text-lg tracking-tight group-hover:text-accent transition">
                    {p.title}
                  </h4>
                  <p className="mt-2 text-xs text-fg/60 leading-relaxed line-clamp-3">
                    {p.description}
                  </p>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
