"use client";

import { ArrowUpRight, Github } from "lucide-react";
import { motion } from "framer-motion";
import { projects } from "@/lib/data";

const more = projects.filter((p) => !p.featured);

export function MoreBuilds() {
  if (more.length === 0) return null;

  return (
    <section className="section bg-bg pt-0 sm:pt-4">
      <div className="container-x">
        <div className="flex items-baseline justify-between border-b border-fg/10 pb-4">
          <div className="eyebrow">Archive · Additional Builds</div>
          <span className="font-mono text-xs text-muted">
            {String(more.length).padStart(2, "0")} Projects
          </span>
        </div>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {more.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex flex-col justify-between rounded-2xl border border-fg/10 bg-neutral-50/50 dark:bg-neutral-900/30 p-6 group transition-all hover:border-fg/25"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="badge text-[9px] uppercase font-mono tracking-wider !px-2.5 !py-0.5">
                    {p.category}
                  </span>
                  <span className="font-mono text-[10px] text-muted">
                    0{i + 1}
                  </span>
                </div>

                <h4 className="mt-4 font-display font-bold uppercase tracking-tight text-lg text-fg group-hover:opacity-80 transition-opacity">
                  {p.title}
                </h4>

                <p className="mt-2 text-xs text-fg/70 leading-relaxed line-clamp-3">
                  {p.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-1">
                  {p.tech.map((t) => (
                    <span key={t} className="chip text-[10px] !px-2 !py-0.5">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-fg/10 flex items-center gap-3">
                {p.live && (
                  <a
                    href={p.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-fg hover:opacity-70 transition-opacity"
                  >
                    <span>Demo</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                )}
                {p.github && (
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-fg/75 hover:text-fg transition-colors ml-auto"
                  >
                    <Github className="h-3 w-3" />
                    <span>Source</span>
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
