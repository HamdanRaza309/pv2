import Image from "next/image";
import { about as staticAbout, experience as staticExperience, personal, projects as staticProjects } from "@/lib/data";
import { Reveal } from "./Reveal";
import type { SiteSettings, Experience } from "@/lib/supabase/types";

const VISION_PORTRAIT =
  "https://tnpbnridezldixmriner.supabase.co/storage/v1/object/public/portfolio/avatars/hamdan_vision_cutout.png";

interface AboutProps {
  settings?: SiteSettings;
  totalProjects?: number;
  experience?: Experience[];
}

export function About({ settings, totalProjects: propProjects, experience: propExp }: AboutProps = {}) {
  // Compute stats strictly from real data
  const totalProjects = propProjects ?? staticProjects.length;

  const expList = propExp ?? staticExperience;
  // Calculate actual years active from earliest experience entry (01/2024)
  const earliestYear = Math.min(
    ...expList.map((e) => {
      const match = e.range.match(/\b(20\d{2})\b/);
      return match ? parseInt(match[1], 10) : 2024;
    })
  );
  const yearsActive = Math.max(1, new Date().getFullYear() - (isFinite(earliestYear) ? earliestYear : 2024));

  const paragraphs = settings?.about_paragraphs?.length ? settings.about_paragraphs : staticAbout.paragraphs;

  return (
    <section id="about" className="section bg-bg">
      <div className="container-x">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Heading, Bio paragraphs, and Stacked Stat Callouts */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <Reveal>
                <div className="eyebrow mb-3">About · Vision</div>
                <h2 className="section-title">
                  TURNING MY VISION
                </h2>
              </Reveal>

              <div className="mt-8 space-y-5 text-fg/80 leading-relaxed text-sm sm:text-base">
                {paragraphs.map((p, i) => (
                  <Reveal key={i} delay={0.05 + i * 0.06}>
                    <p>{p}</p>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Two large stat callouts stacked vertically as in reference design */}
            <div className="mt-14 pt-10 border-t border-fg/10 flex flex-col sm:flex-row lg:flex-col gap-8 sm:gap-16 lg:gap-8">
              <Reveal delay={0.25}>
                <div className="flex flex-col">
                  <span className="font-display font-bold text-6xl sm:text-7xl md:text-8xl tracking-tight text-fg leading-none">
                    {totalProjects}
                  </span>
                  <span className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-muted">
                    Completed Projects
                  </span>
                </div>
              </Reveal>

              <Reveal delay={0.32}>
                <div className="flex flex-col">
                  <span className="font-display font-bold text-6xl sm:text-7xl md:text-8xl tracking-tight text-fg leading-none">
                    {yearsActive}+
                  </span>
                  <span className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-muted">
                    Years Active
                  </span>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Right Column: Distinct Photo Card */}
          <div className="lg:col-span-5">
            <Reveal delay={0.2}>
              <div className="relative w-full aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-fg/10 bg-gradient-to-b from-[#FAF2E7] to-[#F7E5CF] dark:from-neutral-900 dark:to-neutral-950 p-6 sm:p-8 flex items-center justify-center shadow-lg">
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={VISION_PORTRAIT}
                    alt={`${personal.name} portrait`}
                    fill
                    unoptimized={true}
                    className="object-contain object-bottom filter contrast-[1.02]"
                    style={{
                      maskImage: "linear-gradient(to bottom, black 85%, transparent 100%)",
                      WebkitMaskImage: "linear-gradient(to bottom, black 85%, transparent 100%)",
                    }}
                    sizes="(max-width: 1024px) 100vw, 480px"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
