import { techStack } from "@/lib/data";
import { Reveal } from "./Reveal";

export function TechStack() {
  return (
    <section id="stack" className="section bg-bg pt-0 sm:pt-4">
      <div className="container-x">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-wider text-muted">
            Part 02 — Technical Skills & Architecture
          </p>
        </Reveal>

        {/* Sub-section B: Tech Stack (Skills/Tools Table Layout) */}
        <div className="mt-8 border-t border-fg/10">
          {techStack.map((group, i) => (
            <div
              key={group.category}
              className="py-8 border-b border-fg/10 grid lg:grid-cols-12 gap-6 items-start group hover:bg-fg/[0.01] transition-colors"
            >
              {/* Left Column: Number / Category Index */}
              <div className="lg:col-span-3">
                <span className="font-serif italic text-2xl text-fg/30 font-light">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted mt-1">
                  {group.items.length} Technologies
                </div>
              </div>

              {/* Center Column: Bold Category Title */}
              <div className="lg:col-span-4">
                <h3 className="font-display font-bold uppercase tracking-tight text-lg sm:text-xl text-fg leading-snug">
                  {group.category}
                </h3>
              </div>

              {/* Right Column: Two-column list of related tool names with bullet points */}
              <div className="lg:col-span-5">
                <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-xs sm:text-sm text-fg/80"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-fg/40 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
