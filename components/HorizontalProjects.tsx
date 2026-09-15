import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronRight, Github, ExternalLink } from "lucide-react";
import { projects, projectDetails } from "@/lib/data";
import { Reveal } from "./Reveal";

// Image mapping for projects that have asset screenshots
const projectImages: Record<string, string> = {
  "Look Atlas": "/assets/lookatlas/user_dashboard.png",
  "Climate Tracker Initiative": "/assets/climatetrackerinitiative/esg_audit_ledger.png",
};

export function HorizontalProjects() {
  const featured = projects.filter((p) => p.featured);

  return (
    <section id="projects" className="section bg-bg">
      <div className="container-x">
        {/* Centered bold uppercase section title */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <Reveal>
            <div className="eyebrow mb-3">Featured Work</div>
            <h2 className="section-title">RECENT PROJECTS</h2>
          </Reveal>
        </div>

        {/* Two-column image gallery of project thumbnails styled as app mockups */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
          {featured.map((p, i) => {
            const detail = projectDetails[p.title];
            const screenshot = projectImages[p.title];

            return (
              <Reveal key={p.title} delay={i * 0.12}>
                <article className="group flex flex-col justify-between h-full rounded-[2rem] border border-fg/10 bg-neutral-50/60 dark:bg-neutral-900/40 p-6 sm:p-8 transition-all hover:border-fg/25">
                  {/* Mockup Screen Area (device on surface context with rounded corners) */}
                  <div className="relative w-full aspect-[16/10] overflow-hidden rounded-2xl border border-fg/10 bg-neutral-950/90 shadow-inner flex flex-col mb-6">
                    {/* Device Top Bar */}
                    <div className="h-7 px-4 border-b border-white/10 flex items-center justify-between bg-neutral-900/80">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-red-500/70" />
                        <span className="h-2 w-2 rounded-full bg-amber-500/70" />
                        <span className="h-2 w-2 rounded-full bg-emerald-500/70" />
                      </div>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">
                        {p.title}
                      </span>
                    </div>

                    {/* Content / Screenshot Container */}
                    <div className="relative flex-1 w-full h-full overflow-hidden">
                      {screenshot ? (
                        <Image
                          src={screenshot}
                          alt={p.title}
                          fill
                          className="object-cover object-top filter transition-transform duration-500 group-hover:scale-[1.02]"
                          sizes="(max-width: 1024px) 100vw, 560px"
                        />
                      ) : (
                        <div className="h-full w-full p-6 flex flex-col justify-between bg-gradient-to-br from-neutral-900 to-neutral-950 text-white">
                          <div className="font-mono text-xs text-neutral-400">
                            {p.category}
                          </div>
                          <div>
                            <div className="font-display font-bold uppercase tracking-tight text-2xl text-white">
                              {p.title}
                            </div>
                            <p className="mt-2 text-xs text-neutral-300 line-clamp-3">
                              {p.description}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {p.tech.slice(0, 4).map((t) => (
                              <span
                                key={t}
                                className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-neutral-300"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Metadata and Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <span className="badge text-[10px] uppercase font-mono tracking-wider">
                          {p.category}
                        </span>
                        <span className="font-mono text-xs text-muted">
                          0{i + 1}
                        </span>
                      </div>

                      <h3 className="font-display font-bold uppercase tracking-tight text-2xl text-fg group-hover:opacity-80 transition-opacity">
                        {p.title}
                      </h3>

                      <p className="mt-3 text-xs sm:text-sm text-fg/75 leading-relaxed">
                        {p.description}
                      </p>

                      {/* Tech Chips */}
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {p.tech.map((techItem) => (
                          <span key={techItem} className="chip text-[11px]">
                            {techItem}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Links */}
                    <div className="mt-8 pt-5 border-t border-fg/10 flex flex-wrap items-center gap-3">
                      {p.live && (
                        <a
                          href={p.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary text-xs !px-4 !py-1.5"
                        >
                          <span>Live Site</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      )}

                      {p.github && (
                        <a
                          href={p.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary text-xs !px-4 !py-1.5"
                        >
                          <Github className="h-3.5 w-3.5" />
                          <span>GitHub</span>
                        </a>
                      )}

                      {detail && (
                        <Link
                          href={`/engineer/projects/${p.slug}`}
                          className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-fg/80 hover:text-fg ml-auto py-1"
                        >
                          <span>Case study</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
