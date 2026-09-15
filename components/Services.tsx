import { services as staticServices } from "@/lib/data";
import { Reveal } from "./Reveal";
import type { Service } from "@/lib/supabase/types";

interface ServicesProps {
  services?: Service[];
}

export function Services({ services: propServices }: ServicesProps = {}) {
  const list = propServices && propServices.length > 0 ? propServices : staticServices;

  return (
    <section id="services" className="section bg-bg">
      <div className="container-x">
        <Reveal>
          <div className="eyebrow mb-3">Services · Capabilities</div>
          <h2 className="section-title">
            I CAN HELP YOU WITH
          </h2>
        </Reveal>

        {/* Editorial grid of numbered items with thin numerals and subtle vertical dividers */}
        <div className="mt-14 border-y border-fg/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((s, i) => {
            const num = String(i + 1).padStart(2, "0");
            return (
              <div
                key={s.title}
                className="p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 border-fg/10 sm:[&:not(:nth-child(2n))]:border-r lg:[&:not(:nth-child(4n))]:border-r group transition-colors hover:bg-fg/[0.02]"
              >
                <div>
                  {/* Light thin serif/mono numeral */}
                  <span className="font-serif italic text-3xl sm:text-4xl text-fg/30 font-light block">
                    {num}
                  </span>

                  {/* Short bold service title */}
                  <h3 className="mt-6 font-display font-bold uppercase tracking-tight text-base sm:text-lg text-fg leading-snug group-hover:opacity-80 transition-opacity">
                    {s.title}
                  </h3>

                  {/* Verbatim description */}
                  <p className="mt-3 text-xs sm:text-sm text-fg/70 leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
