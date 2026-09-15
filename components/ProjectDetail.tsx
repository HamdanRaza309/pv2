import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Compass,
  Cpu,
  Github,
  Layers,
  Sparkles,
} from "lucide-react";
import { type ProjectDetail as ProjectDetailType } from "@/lib/data";
import { ThemeToggle } from "./ThemeToggle";
import { Footer } from "./Footer";

function getIcon(iconName?: string) {
  const className = "h-5 w-5 text-accent";
  switch (iconName) {
    case "Sparkles":
      return <Sparkles className={className} />;
    case "Cpu":
      return <Cpu className={className} />;
    case "Layers":
      return <Layers className={className} />;
    case "Compass":
      return <Compass className={className} />;
    default:
      return <Sparkles className={className} />;
  }
}

export interface NavProject {
  title: string;
  slug: string;
}

export function ProjectDetail({
  detail,
  project,
  prevProject = null,
  nextProject = null,
  currentIndex = 0,
  totalCount = 4,
}: {
  detail: Omit<ProjectDetailType, "gallery"> & {
    gallery?: { src: string; alt: string; caption?: string; published?: boolean }[];
  };
  project: { title: string; live: string | null; github: string | null; slug?: string };
  prevProject?: NavProject | null;
  nextProject?: NavProject | null;
  currentIndex?: number;
  totalCount?: number;
}) {
  return (
    <div className="bg-bg text-fg min-h-screen flex flex-col justify-between relative">
      {/* Sticky Top Bar: 'Back to Work' button with margin from top */}
      <div className="fixed top-5 sm:top-6 inset-x-0 z-40 px-4 sm:px-8 pointer-events-none">
        <div className="container-x flex items-center justify-between">
          <Link
            href="/engineer#projects"
            className="pointer-events-auto inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider px-4 py-2 sm:px-4.5 sm:py-2.5 rounded-full border border-white/20 bg-neutral-900/85 hover:bg-neutral-900 backdrop-blur-md text-white shadow-lg transition active:scale-[0.98] group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Work</span>
          </Link>

          <div className="pointer-events-auto rounded-full backdrop-blur-md bg-neutral-900/80 border border-white/20 p-0.5 shadow-lg">
            <ThemeToggle />
          </div>
        </div>
      </div>

      <main className="flex-1">
        {/* Hero Header */}
        <div className="relative bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 text-neutral-100 pt-24 sm:pt-28 pb-16 sm:pb-24 border-b border-white/10">
          <div className="container-x relative z-10">
            <div className="max-w-4xl">
              <span className="badge border-white/15 bg-white/5 text-neutral-400 mb-4 inline-block">
                {detail.categoryLong}
              </span>
              <h1 className="font-display font-bold text-4xl sm:text-6xl md:text-7xl tracking-tight leading-[1.05] text-white">
                {project.title}
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-neutral-300 leading-relaxed max-w-3xl">
                {detail.solution}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-white text-neutral-900 px-5 py-2.5 text-sm font-medium hover:bg-neutral-100 transition"
                  >
                    <span>Visit live site</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium hover:bg-white/5 transition text-white"
                  >
                    <span>View source</span>
                    <Github className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="absolute top-1/4 right-1/4 w-[300px] sm:w-[500px] h-[300px] bg-accent/15 rounded-full blur-[100px] pointer-events-none" />
        </div>

        {/* Content sections */}
        <div className="py-16 sm:py-24 space-y-16 sm:space-y-24 container-x pb-32 sm:pb-40">
          <div className="grid md:grid-cols-2 gap-12 sm:gap-16">
            <div>
              <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight">The Problem</h2>
              <p className="mt-4 text-fg/80 leading-relaxed text-[15px] sm:text-base whitespace-pre-line">
                {detail.problem}
              </p>
            </div>
            <div>
              <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight">The Solution</h2>
              <p className="mt-4 text-fg/80 leading-relaxed text-[15px] sm:text-base whitespace-pre-line">
                {detail.solution}
              </p>
            </div>
          </div>

          <hr className="border-fg/10" />

          <div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight mb-8">My Contribution</h2>
            <ul className="grid sm:grid-cols-2 gap-4">
              {detail.contributions.map((c, idx) => (
                <li
                  key={idx}
                  className="flex gap-3.5 p-4 rounded-xl border border-fg/10 bg-card hover:border-fg/20 transition"
                >
                  <span className="text-accent font-bold mt-0.5 flex-shrink-0">
                    <Check className="h-5 w-5" />
                  </span>
                  <span className="text-fg/85 text-sm sm:text-[15px] leading-relaxed">{c}</span>
                </li>
              ))}
            </ul>
          </div>

          <hr className="border-fg/10" />

          {detail.gallery && detail.gallery.filter((item) => item && item.src && (item as any).published !== false).length > 0 && (
            <>
              <div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight mb-8 text-center">
                  Gallery
                </h2>
                <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-6">
                  {detail.gallery
                    .filter((item) => item && item.src && (item as any).published !== false)
                    .map((item, idx) => (
                      <div
                        key={idx}
                        className="group rounded-2xl overflow-hidden border border-fg/10 bg-card shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                      >
                        <div>
                          <Image
                            src={item.src}
                            alt={item.alt || "Project screenshot"}
                            width={700}
                            height={400}
                            unoptimized={typeof item.src === "string" && item.src.startsWith("http")}
                            className="w-full h-auto rounded-2xl"
                          />
                        </div>
                        <div className="px-2 pb-5">
                          <h3 className="font-display text-lg font-semibold text-fg">{item.alt}</h3>
                          {item.caption && <p className="mt-2 text-sm text-muted">{item.caption}</p>}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <hr className="border-fg/10" />
            </>
          )}

          <div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight mb-8 text-center">
              Key Features
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {detail.features.map((f, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl border border-fg/10 bg-card hover:shadow-md transition duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 rounded-lg bg-fg/5 text-accent flex-shrink-0">
                      {getIcon(f.icon)}
                    </div>
                    <h3 className="font-display font-bold text-lg text-fg">{f.title}</h3>
                  </div>
                  <p className="text-fg/75 text-sm sm:text-[15px] leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-fg/10" />

          <div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight mb-8 text-center">
              Impact & Metrics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {detail.metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="bg-card p-6 sm:p-8 rounded-2xl border border-fg/10 text-center hover:border-fg/25 transition duration-300"
                >
                  <div className="text-3xl sm:text-4xl font-display font-bold text-accent mb-2">{m.value}</div>
                  <div className="text-xs sm:text-sm font-medium text-muted uppercase tracking-wider">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-fg/10" />

          <div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight mb-8">Technology Stack</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(detail.techStack).map(([category, items]) => (
                <div key={category} className="p-5 rounded-xl border border-fg/10 bg-card">
                  <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-4">{category}</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {items?.map((item) => (
                      <span key={item} className="chip font-sans text-xs">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-fg/10" />

          {/* CTA Banner without duplicate back button */}
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden border border-white/10">
            <div className="relative z-10 max-w-xl mx-auto">
              <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight mb-4 text-white">
                Have a similar project?
              </h2>
              <p className="text-neutral-400 text-sm sm:text-base mb-8 leading-relaxed">
                I help startups and teams architect and build production-grade Web Applications with AI
                features that scale. Let&apos;s discuss your idea.
              </p>
              <div className="flex justify-center">
                <a
                  href="mailto:hamdanraza309@gmail.com"
                  className="inline-flex items-center gap-2 rounded-full bg-white text-neutral-900 px-6 py-3 text-sm font-semibold hover:bg-neutral-100 transition"
                >
                  Start a conversation
                </a>
              </div>
            </div>
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(var(--accent),0.1)_0%,transparent_70%)] pointer-events-none" />
          </div>
        </div>
      </main>

      {/* Sticky Floating Bottom Navigation Bar with current project title in center */}
      <aside
        aria-label="Case Study Navigation"
        className="fixed bottom-6 sm:bottom-8 inset-x-0 z-40 px-4 pointer-events-none"
      >
        <div className="max-w-3xl sm:max-w-4xl mx-auto pointer-events-auto rounded-full border border-fg/15 bg-bg/90 dark:bg-neutral-900/90 backdrop-blur-xl shadow-2xl shadow-black/10 dark:shadow-black/50 px-4 sm:px-6 py-2.5 sm:py-3 transition-all">
          <div className="flex items-center justify-between gap-3 sm:gap-6">
            {/* Prev */}
            {prevProject ? (
              <Link
                href={`/engineer/projects/${prevProject.slug}`}
                className="group flex items-center gap-2 sm:gap-2.5 text-left hover:opacity-80 transition min-w-0 flex-1"
                title={`Previous Case Study: ${prevProject.title}`}
              >
                <div className="h-9 w-9 rounded-full border border-fg/15 flex items-center justify-center shrink-0 group-hover:border-fg/40 group-hover:bg-fg/5 transition">
                  <ChevronLeft className="h-4 w-4 text-fg" />
                </div>
                <div className="hidden md:block min-w-0">
                  <div className="font-mono text-[9px] uppercase tracking-widest text-muted">
                    Prev
                  </div>
                  <div className="font-display font-bold text-xs text-fg truncate max-w-[130px] lg:max-w-[180px]">
                    {prevProject.title}
                  </div>
                </div>
                <span className="md:hidden font-mono text-xs uppercase tracking-wider text-fg font-medium">
                  Prev
                </span>
              </Link>
            ) : (
              <div className="flex-1" />
            )}

            {/* Center: Current Project Title + Counter */}
            <div className="flex flex-col items-center justify-center text-center px-2 min-w-0 max-w-[180px] sm:max-w-xs md:max-w-md shrink-0">
              <span className="font-mono text-[9px] uppercase tracking-widest text-muted">
                {String(currentIndex + 1).padStart(2, "0")} / {String(totalCount).padStart(2, "0")}
              </span>
              <div className="font-display font-bold uppercase tracking-tight text-xs sm:text-sm md:text-base text-fg truncate max-w-[160px] sm:max-w-[240px] md:max-w-[320px]">
                {project.title}
              </div>
            </div>

            {/* Next */}
            {nextProject ? (
              <Link
                href={`/engineer/projects/${nextProject.slug}`}
                className="group flex items-center justify-end gap-2 sm:gap-2.5 text-right hover:opacity-80 transition min-w-0 flex-1"
                title={`Next Case Study: ${nextProject.title}`}
              >
                <span className="md:hidden font-mono text-xs uppercase tracking-wider text-fg font-medium">
                  Next
                </span>
                <div className="hidden md:block min-w-0">
                  <div className="font-mono text-[9px] uppercase tracking-widest text-muted">
                    Next
                  </div>
                  <div className="font-display font-bold text-xs text-fg truncate max-w-[130px] lg:max-w-[180px]">
                    {nextProject.title}
                  </div>
                </div>
                <div className="h-9 w-9 rounded-full bg-fg text-bg flex items-center justify-center shrink-0 group-hover:opacity-90 transition">
                  <ChevronRight className="h-4 w-4" />
                </div>
              </Link>
            ) : (
              <div className="flex-1" />
            )}
          </div>
        </div>
      </aside>

      <Footer />
    </div>
  );
}
