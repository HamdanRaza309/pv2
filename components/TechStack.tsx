import { techStack } from "@/lib/data";

export function TechStack() {
  return (
    <section id="stack" className="section">
      <div className="container-x">
        <div className="flex items-baseline gap-4">
          <span className="section-num-big">02</span>
          <span className="eyebrow">Tech Stack</span>
        </div>
        <h2 className="mt-6 font-display font-bold text-3xl sm:text-4xl tracking-tight leading-[1.1] max-w-2xl">
          Tools I reach for to build, ship, and maintain.
        </h2>

        <div className="mt-12 grid sm:grid-cols-2 gap-5">
          {techStack.map((group) => (
            <div key={group.category} className="card">
              <div className="flex items-baseline justify-between">
                <h3 className="font-display font-bold text-xl">{group.category}</h3>
                <span className="font-mono text-xs text-muted">
                  {String(group.items.length).padStart(2, "0")}
                </span>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span key={item} className="chip">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
