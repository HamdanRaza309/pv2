import { about as staticAbout, experience as staticExperience, personal, projects as staticProjects } from "@/lib/data";
import { Reveal } from "./Reveal";
// import { Code2, Terminal, Cpu, Layers } from "lucide-react";
import type { SiteSettings, Experience } from "@/lib/supabase/types";

interface AboutProps {
  settings?: SiteSettings;
  totalProjects?: number;
  experience?: Experience[];
}

export function About({ settings, totalProjects: propProjects, experience: propExp }: AboutProps = {}) {
  // Compute stats strictly from real data
  const totalProjects = propProjects ?? staticProjects.length;

  const expList = propExp ?? staticExperience;
  // Calculate actual years active from earliest experience entry
  const earliestYear = Math.min(
    ...expList.map((e) => {
      const match = e.range.match(/\b(20\d{2})\b/);
      return match ? parseInt(match[1], 10) : 2024;
    })
  );
  const yearsActive = Math.max(1, new Date().getFullYear() - (isFinite(earliestYear) ? earliestYear : 2024));

  const paragraphs = settings?.about_paragraphs?.length ? settings.about_paragraphs : staticAbout.paragraphs;
  const leadParagraph = paragraphs[0];
  const bodyParagraphs = paragraphs.slice(1);

  return (
    <section id="about" className="section bg-bg">
      <div className="container-x">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column: Heading & Narrative */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              <Reveal>
                <div className="eyebrow mb-3">01 / About · Vision & Philosophy</div>
                <h2 className="section-title">
                  TURNING IDEAS INTO REALITY.
                </h2>
              </Reveal>

              {/* Editorial Lead Quote */}
              {leadParagraph && (
                <Reveal delay={0.08}>
                  <div className="relative pl-5 border-l-2 border-fg/30 my-6">
                    <p className="text-base sm:text-lg font-serif italic text-fg/90 leading-relaxed">
                      "{leadParagraph}"
                    </p>
                  </div>
                </Reveal>
              )}

              {/* Body Narrative */}
              <div className="space-y-4 text-fg/75 leading-relaxed text-sm sm:text-base font-sans">
                {bodyParagraphs.map((p, i) => (
                  <Reveal key={i} delay={0.12 + i * 0.05}>
                    <p>{p}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Key Metrics */}
          <div className="lg:col-span-5 flex flex-col w-full">
            <Reveal delay={0.15}>
              <div className="bg-card/40 backdrop-blur-sm">

                {/* Header */}
                <div className="flex items-center justify-between pb-5 border-b border-fg/10">
                  <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    Key Track Record
                  </div>

                  <span className="font-mono text-[10px] text-muted uppercase tracking-wider">
                    Metrics
                  </span>
                </div>

                {/* Metrics */}
                <div className="pt-8 space-y-10">

                  {/* Metric 1 */}
                  <div>
                    <span className="block font-display font-bold text-6xl sm:text-7xl text-fg leading-none tracking-tight">
                      {totalProjects}
                    </span>

                    <div className="mt-3 pl-4 border-l-2 border-fg/10">
                      <span className="block font-mono text-[11px] uppercase tracking-[0.16em] text-fg font-semibold">
                        Completed Projects
                      </span>

                      <span className="block mt-1.5 text-xs text-muted leading-relaxed">
                        Production web applications & client software
                      </span>
                    </div>
                  </div>

                  {/* Metric 2 */}
                  <div>
                    <span className="block font-display font-bold text-6xl sm:text-7xl text-fg leading-none tracking-tight">
                      {yearsActive}+
                    </span>

                    <div className="mt-3 pl-4 border-l-2 border-fg/10">
                      <span className="block font-mono text-[11px] uppercase tracking-[0.16em] text-fg font-semibold">
                        Years Active
                      </span>

                      <span className="block mt-1.5 text-xs text-muted leading-relaxed">
                        Full-stack engineering & production builds
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section >
  );
}
