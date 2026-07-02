import { ArrowUp, Facebook, Github, Instagram, Linkedin } from "lucide-react";
import Image from "next/image";
import { personal } from "@/lib/data";
import hamdanPhoto from "@/assets/hamdan.png";
import { CopyrightYear } from "./CopyrightYear";

export function Footer() {
  return (
    <footer className="border-t border-fg/10">
      <div className="container-x py-12">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <a
              href="#top"
              className="flex items-center gap-2 font-mono text-sm"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full border border-fg/20 overflow-hidden">
                <Image
                  src={hamdanPhoto}
                  alt={`${personal.name} profile photo`}
                  className="h-full w-full object-cover"
                />
              </span>
              <span>{personal.name}</span>
            </a>
            <p className="mt-4 text-sm text-muted max-w-xs leading-relaxed">
              {personal.role} · Peshawar, PK · Open to remote.
            </p>
          </div>

          <div>
            <div className="eyebrow mb-4">Navigate</div>
            <nav className="flex flex-col gap-2 text-sm">
              <a href="#about" className="text-fg/70 hover:text-fg transition">
                About
              </a>
              <a href="#stack" className="text-fg/70 hover:text-fg transition">
                Tech Stack
              </a>
              <a
                href="#experience"
                className="text-fg/70 hover:text-fg transition"
              >
                Experience
              </a>
              <a
                href="#projects"
                className="text-fg/70 hover:text-fg transition"
              >
                Projects
              </a>
              <a href="#contact" className="text-fg/70 hover:text-fg transition">
                Contact
              </a>
            </nav>
          </div>

          <div>
            <div className="eyebrow mb-4">Connect</div>
            <div className="flex gap-2">
              <Social
                href={personal.socials.github}
                label="GitHub"
                icon={<Github className="h-4 w-4" />}
              />
              <Social
                href={personal.socials.linkedin}
                label="LinkedIn"
                icon={<Linkedin className="h-4 w-4" />}
              />
              <Social
                href={personal.socials.facebook}
                label="Facebook"
                icon={<Facebook className="h-4 w-4" />}
              />
              <Social
                href={personal.socials.instagram}
                label="Instagram"
                icon={<Instagram className="h-4 w-4" />}
              />
            </div>
            <a
              href={`mailto:${personal.email}`}
              className="mt-4 inline-block text-sm text-fg/70 hover:text-fg transition link-underline"
            >
              {personal.email}
            </a>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-fg/10 flex flex-wrap items-center justify-between gap-4">
          <div className="font-mono text-xs text-muted">
            © <CopyrightYear /> {personal.name}. All rights reserved.
          </div>
          <a
            href="#top"
            className="inline-flex items-center gap-2 font-mono text-xs text-muted hover:text-fg transition"
          >
            Back to top <ArrowUp className="h-3 w-3" />
          </a>
        </div>
      </div>
    </footer>
  );
}

function Social({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-fg/15 hover:bg-fg/5 hover:border-fg/30 transition"
    >
      {icon}
    </a>
  );
}
