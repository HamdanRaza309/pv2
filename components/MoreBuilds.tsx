"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { projects } from "@/lib/data";

const more = projects.filter((p) => !p.featured);

export function MoreBuilds() {
  if (more.length === 0) return null;
  return (
    <section className="section">
      <div className="container-x">
        <div className="flex items-baseline justify-between">
          <span className="eyebrow">More Builds</span>
          <span className="font-mono text-xs text-muted">
            {String(more.length).padStart(2, "0")} projects
          </span>
        </div>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {more.map((p, i) => (
            <motion.a
              key={p.title}
              href={p.github || p.live || "#"}
              target={p.github || p.live ? "_blank" : undefined}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
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
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
