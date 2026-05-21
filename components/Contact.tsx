import { ArrowUpRight, Mail } from "lucide-react";
import { personal } from "@/lib/data";

export function Contact() {
  return (
    <section id="contact" className="section">
      <div className="container-x">
        <div className="flex items-baseline gap-4">
          <span className="section-num-big">06</span>
          <span className="eyebrow">Get in touch</span>
        </div>

        <div className="mt-8 rounded-3xl border border-fg/15 bg-card p-8 sm:p-14 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-accent/15 blur-3xl pointer-events-none" />

          <div className="relative">
            <h2 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.02] max-w-3xl">
              Let&apos;s build something{" "}
              <span className="text-accent">worth shipping</span>.
            </h2>
            <p className="mt-6 max-w-xl text-fg/70 leading-relaxed">
              Got an idea, a project, or just want to say hi? I&apos;m open to
              freelance work, internships, and collaborations. Drop me a line.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a href={`mailto:${personal.email}`} className="btn-primary">
                <Mail className="h-4 w-4" />
                {personal.email}
              </a>
              <a
                href={personal.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                LinkedIn <ArrowUpRight className="h-4 w-4" />
              </a>
              <a
                href={personal.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                GitHub <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-10 pt-8 border-t border-fg/10 grid sm:grid-cols-3 gap-6 text-sm">
              <Item label="Location" value={personal.location} />
              <Item label="Status" value={personal.availability} />
              <Item label="Response time" value="Within 24 hours" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
        {label}
      </div>
      <div className="mt-1 text-fg/85">{value}</div>
    </div>
  );
}
