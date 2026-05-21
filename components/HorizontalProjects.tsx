"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import { projects } from "@/lib/data";

const featured = projects.filter((p) => p.featured);

export function HorizontalProjects() {
  const wrapRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  // Slide horizontally from 0 to ~-(N-1) * 100% as user scrolls
  const slides = featured.length;
  // Distance to translate so the last card aligns to the right edge.
  // Each slide is ~85vw wide on desktop. We translate by (slides-1) * 85vw.
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["0vw", `-${(slides - 1) * 85}vw`]
  );

  return (
    <section
      id="projects"
      ref={wrapRef}
      // section height = number of slides * viewport height (controls scroll length)
      style={{ height: `${slides * 100}vh` }}
      className="relative bg-bg"
    >
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col">
        {/* Top header strip */}
        <div className="container-x pt-24 pb-6 border-b border-fg/10">
          <div className="flex items-baseline gap-4">
            <span className="section-num-big">05</span>
            <span className="eyebrow">Selected Projects</span>
            <span className="ml-auto font-mono text-xs text-muted">
              scroll ↓ · slide →
            </span>
          </div>
          <h2 className="mt-4 font-display font-bold text-2xl sm:text-3xl tracking-tight leading-tight">
            Real things I&apos;ve built and shipped.
          </h2>
        </div>

        {/* Horizontal track */}
        <div className="flex-1 flex items-center overflow-hidden">
          <motion.div style={{ x }} className="flex h-full items-center will-change-transform">
            {featured.map((p, i) => (
              <div
                key={p.title}
                className="w-[85vw] sm:w-[80vw] md:w-[80vw] lg:w-[70vw] xl:w-[60vw] h-full flex items-center px-6 sm:px-12"
              >
                <article className="w-full rounded-3xl border border-fg/15 bg-card p-8 sm:p-12 relative overflow-hidden">
                  <div
                    className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-accent/10 blur-3xl pointer-events-none"
                    aria-hidden
                  />
                  <div className="relative">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="badge">{p.category}</span>
                        <span className="font-mono text-xs text-muted">
                          {String(i + 1).padStart(2, "0")} / {String(slides).padStart(2, "0")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {p.github && (
                          <a
                            href={p.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub"
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-fg/15 hover:bg-fg/5 transition"
                          >
                            <Github className="h-4 w-4" />
                          </a>
                        )}
                        {p.live && (
                          <a
                            href={p.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Live"
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-fg/15 hover:bg-fg/5 transition"
                          >
                            <ArrowUpRight className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>

                    <h3 className="mt-8 font-display font-bold text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.02]">
                      {p.title}
                    </h3>
                    <p className="mt-6 max-w-xl text-fg/75 leading-relaxed text-[15px] sm:text-base">
                      {p.description}
                    </p>

                    <div className="mt-8 flex flex-wrap gap-1.5">
                      {p.tech.map((t) => (
                        <span key={t} className="chip">
                          {t}
                        </span>
                      ))}
                    </div>

                    {(p.live || p.github) && (
                      <a
                        href={p.live || p.github!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-10 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-fg link-underline"
                      >
                        {p.live ? "Visit live" : "View source"}
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </article>
              </div>
            ))}

            {/* trailing spacer so last card sits comfortably */}
            <div className="w-[15vw] shrink-0" />
          </motion.div>
        </div>

        {/* Progress bar */}
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
