import { ArrowUpRight, Mail } from "lucide-react";
import { personal } from "@/lib/data";
import { Reveal } from "./Reveal";

export function Contact() {
  return (
    <section id="contact" className="section bg-bg">
      <div className="container-x">
        <Reveal>
          <div className="eyebrow mb-3">Initiate · Connect</div>
          <h2 className="section-title">GET IN TOUCH</h2>
        </Reveal>

        <div className="mt-10 rounded-[2.5rem] border border-fg/10 bg-neutral-50/70 dark:bg-neutral-900/40 p-8 sm:p-14 lg:p-16 relative overflow-hidden">
          <div className="relative">
            <h3 className="font-display font-bold uppercase tracking-tight text-3xl sm:text-5xl md:text-6xl leading-[0.95] text-fg max-w-3xl">
              LET&apos;S BUILD SOMETHING <br />
              <span className="font-serif italic normal-case font-normal text-fg/80">
                worth shipping.
              </span>
            </h3>

            <p className="mt-6 max-w-xl text-sm sm:text-base text-fg/75 leading-relaxed">
              Got an idea, a project, or just want to say hi? I&apos;m open to
              freelance work, internships, and collaborations. Drop me a line.
            </p>

            {/* Pill Action Buttons */}
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a href={`mailto:${personal.email}`} className="btn-primary !px-6 !py-3">
                <Mail className="h-4 w-4" />
                <span>{personal.email}</span>
              </a>

              <a
                href={personal.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary !px-5 !py-3"
              >
                <span>LinkedIn</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>

              <a
                href={personal.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary !px-5 !py-3"
              >
                <span>GitHub</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>

              <a
                href={personal.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary !px-5 !py-3"
              >
                <span>Facebook</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>

              <a
                href={personal.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary !px-5 !py-3"
              >
                <span>Instagram</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Status Footer */}
            <div className="mt-12 pt-8 border-t border-fg/10 grid sm:grid-cols-3 gap-6 text-sm">
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
      <div className="mt-1 text-xs sm:text-sm font-medium text-fg/85">
        {value}
      </div>
    </div>
  );
}
