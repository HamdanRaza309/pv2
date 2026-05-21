import { about } from "@/lib/data";
import { Reveal } from "./Reveal";

export function About() {
  return (
    <section id="about" className="section">
      <div className="container-x">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <Reveal>
              <div className="flex items-baseline gap-4">
                <span className="section-num-big">01</span>
                <span className="eyebrow">Who I Am</span>
              </div>
              <h2 className="mt-6 font-display font-bold text-3xl sm:text-4xl tracking-tight leading-[1.1]">
                A developer who likes <span className="text-accent">shipping</span>, not just{" "}
                <span className="text-accent">talking</span>.
              </h2>
            </Reveal>
          </div>

          <div className="md:col-span-8 space-y-5 text-fg/80 leading-relaxed text-[17px]">
            {about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={0.05 + i * 0.08}>
                <p>{p}</p>
              </Reveal>
            ))}

            <Reveal delay={0.3}>
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-fg/10 mt-8">
                <Stat label="Years" value="2+" />
                <Stat label="Projects" value="10+" />
                <Stat label="Stack" value="MERN" />
                <Stat label="Based in" value="Peshawar" />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="pt-6">
      <div className="font-display font-bold text-3xl tracking-tight">{value}</div>
      <div className="font-mono text-[11px] uppercase tracking-widest text-muted mt-1">
        {label}
      </div>
    </div>
  );
}
