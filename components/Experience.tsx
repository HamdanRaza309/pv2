import { experience } from "@/lib/data";
import { Reveal } from "./Reveal";

export function Experience() {
  return (
    <section id="experience" className="section bg-bg pb-12 sm:pb-16">
      <div className="container-x">
        <Reveal>
          <div className="eyebrow mb-3">Career · Journey</div>
          <h2 className="section-title">
            EXPERIENCE & SKILLS
          </h2>
          <p className="mt-4 font-mono text-xs uppercase tracking-wider text-muted">
            Part 01 — Work History & Experience
          </p>
        </Reveal>

        {/* Sub-section A: Experience (Job History / Timeline) */}
        <div className="mt-12 border-t border-fg/10">
          {experience.map((job, i) => (
            <article
              key={i}
              className="py-10 border-b border-fg/10 grid lg:grid-cols-12 gap-8 items-start group"
            >
              {/* Left Column: Year Range (Muted) + Location & Type */}
              <div className="lg:col-span-3">
                <div className="font-mono text-xs sm:text-sm text-muted font-normal tracking-wide">
                  {job.range}
                </div>
                <div className="mt-2 text-xs font-mono text-muted/80">
                  {job.location}
                </div>
                <div className="mt-3">
                  <span className="badge text-[10px] tracking-wider uppercase font-mono">
                    {job.type}
                  </span>
                </div>
              </div>

              {/* Center Column: Bold Company & Title */}
              <div className="lg:col-span-4">
                <h3 className="font-display font-bold uppercase tracking-tight text-xl sm:text-2xl text-fg leading-snug">
                  {job.company}
                </h3>
                <div className="mt-1 text-sm font-medium text-fg/80">
                  {job.title}
                </div>
                <p className="mt-4 text-xs sm:text-sm text-fg/70 leading-relaxed">
                  {job.intro}
                </p>
              </div>

              {/* Right Column: Two-column / bulleted list of highlights */}
              <div className="lg:col-span-5">
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted mb-3">
                  Key Achievements & Highlights
                </div>
                <ul className="space-y-2.5">
                  {job.highlights.map((h, j) => (
                    <li key={j} className="flex gap-2.5 text-xs sm:text-sm text-fg/75 leading-relaxed">
                      <span className="text-fg/40 select-none">•</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
