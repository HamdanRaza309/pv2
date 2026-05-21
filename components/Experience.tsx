import { experience } from "@/lib/data";

export function Experience() {
  return (
    <section id="experience" className="section">
      <div className="container-x">
        <div className="flex items-baseline gap-4">
          <span className="section-num-big">03</span>
          <span className="eyebrow">Experience</span>
        </div>
        <h2 className="mt-6 font-display font-bold text-3xl sm:text-4xl tracking-tight leading-[1.1] max-w-2xl">
          Where I&apos;ve been writing and shipping code.
        </h2>

        <div className="mt-16 divide-y divide-fg/10">
          {experience.map((job, i) => (
            <article
              key={i}
              className="py-10 first:pt-0 grid md:grid-cols-12 gap-6 group"
            >
              <div className="md:col-span-4">
                <div className="font-mono text-xs text-muted">{job.range}</div>
                <div className="mt-3 font-display font-bold text-xl tracking-tight">
                  {job.company}
                </div>
                <div className="mt-1 text-sm text-muted">{job.location}</div>
                <span className="mt-3 inline-block badge">{job.type}</span>
              </div>

              <div className="md:col-span-8">
                <h3 className="font-display font-bold text-2xl sm:text-3xl tracking-tight leading-tight group-hover:text-accent transition">
                  {job.title}
                </h3>
                <p className="mt-4 text-fg/75 leading-relaxed">{job.intro}</p>

                <div className="mt-6">
                  <div className="eyebrow mb-3">Highlights</div>
                  <ul className="space-y-2">
                    {job.highlights.map((h, j) => (
                      <li key={j} className="flex gap-3 text-[15px] text-fg/80">
                        <span className="font-mono text-accent mt-0.5 shrink-0">
                          ›
                        </span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
