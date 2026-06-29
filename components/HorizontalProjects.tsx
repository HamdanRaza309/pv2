"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, ChevronRight, Github } from "lucide-react";
import Link from "next/link";
import { projects, projectDetails } from "@/lib/data";

const featured = projects.filter((p) => p.featured);

export function HorizontalProjects() {
  const wrapRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  const slides = featured.length;
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["0vw", `-${(slides - 1) * 85}vw`]
  );

  return (
    <section
      id="projects"
      ref={wrapRef}
      style={{ height: `${slides * 100}vh` }}
      className="relative bg-bg"
    >
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col">
        <div className="container-x pt-24 pb-6 border-b border-fg/10">
          <div className="flex items-baseline gap-4">
            <span className="section-num-big">05</span>
            <span className="eyebrow">Selected Projects</span>
            <span className="ml-auto font-mono text-xs text-muted">scroll down · slide right</span>
          </div>
          <h2 className="mt-4 font-display font-bold text-2xl sm:text-3xl tracking-tight leading-tight">
            Real things I&apos;ve built and shipped.
          </h2>
        </div>

        <div className="flex-1 flex items-center overflow-hidden">
          <motion.div style={{ x }} className="flex h-full items-center will-change-transform">
            {featured.map((p, i) => (
              <div
                key={p.title}
                className="w-[85vw] sm:w-[80vw] md:w-[80vw] lg:w-[70vw] xl:w-[60vw] h-full flex items-center px-6 sm:px-12"
              >
                <article className="w-full h-[400px] md:h-[600px] lg:h-[300px] rounded-3xl border border-fg/15 bg-card p-3 sm:px-12 sm:py-4 relative overflow-hidden flex flex-col">
                  <div
                    className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-accent/10 blur-3xl pointer-events-none"
                    aria-hidden
                  />
                  <div className="relative flex flex-col flex-1 min-h-0">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="badge">{p.category}</span>
                        <span className="font-mono text-xs text-muted">
                          {String(i + 1).padStart(2, "0")} / {String(slides).padStart(2, "0")}
                        </span>
                      </div>
                    </div>

                    <h3 className="mt-4 font-display font-bold text-2xl sm:text-3xl md:text-4xl tracking-tight leading-[1.02]">
                      {p.title}
                    </h3>
                    <p className="mt-3 max-w-xl text-fg/75 leading-relaxed text-[15px] sm:text-base line-clamp-3">
                      {p.description}
                    </p>

                    <div className="mt-auto pt-4 flex flex-wrap items-center gap-6">
                      {p.live && (
                        <a
                          href={p.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-fg link-underline"
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
                          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-fg link-underline"
                        >
                          <span>GitHub</span>
                          <Github className="h-3.5 w-3.5" />
                        </a>
                      )}
                      {projectDetails[p.title] && (
                        <Link
                          href={`/projects/${p.slug}`}
                          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-accent hover:text-accent/80 transition group"
                        >
                          <span>Case study</span>
                          <ChevronRight className="h-3.5 w-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              </div>
            ))}

            <div className="w-[15vw] shrink-0" />
          </motion.div>
        </div>

        <div className="container-x pb-6">
          <div className="h-px w-full bg-fg/10 overflow-hidden">
            <motion.div
              style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
              className="h-full bg-accent"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
