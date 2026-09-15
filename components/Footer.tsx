import { ArrowUp, Facebook, Github, Instagram, Linkedin } from "lucide-react";
import { personal } from "@/lib/data";
import { CopyrightYear } from "./CopyrightYear";
import type { SiteSettings } from "@/lib/supabase/types";

interface FooterProps {
  settings?: SiteSettings;
}

export function Footer({ settings }: FooterProps = {}) {
  const profile = settings || {
    name: personal.name,
    role: personal.role,
    location: personal.location,
    email: personal.email,
    socials: personal.socials,
  };

  return (
    <footer className="bg-bg">
      <div className="container-x py-16 sm:py-20">
        <div className="grid md:grid-cols-12 gap-10 items-start">
          {/* Brand Info */}
          <div className="md:col-span-5">
            <a
              href="/"
              className="inline-block transition-opacity hover:opacity-80"
            >
              <span className="font-serif italic text-3xl font-medium text-fg">
                {profile.name.split(" ")[0]}.
              </span>
            </a>
            <p className="mt-4 text-xs sm:text-sm text-muted max-w-sm leading-relaxed">
              {profile.role} · {profile.location.split(",")[0]}, PK · Open to remote work.
            </p>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3">
            <div className="eyebrow mb-4">Navigation</div>
            <nav className="flex flex-col gap-2.5 text-xs sm:text-sm">
              <a href="#about" className="text-fg/70 hover:text-fg transition-colors">
                About
              </a>
              <a href="#services" className="text-fg/70 hover:text-fg transition-colors">
                Services
              </a>
              <a href="#experience" className="text-fg/70 hover:text-fg transition-colors">
                Experience
              </a>
              <a href="#stack" className="text-fg/70 hover:text-fg transition-colors">
                Tech Stack
              </a>
              <a href="#projects" className="text-fg/70 hover:text-fg transition-colors">
                Recent Projects
              </a>
              <a href="#contact" className="text-fg/70 hover:text-fg transition-colors">
                Contact
              </a>
            </nav>
          </div>

          {/* Socials & Email */}
          <div className="md:col-span-4">
            <div className="eyebrow mb-4">Connect</div>
            <div className="flex gap-2">
              {profile.socials?.github && (
                <Social
                  href={profile.socials.github}
                  label="GitHub"
                  icon={<Github className="h-4 w-4" />}
                />
              )}
              {profile.socials?.linkedin && (
                <Social
                  href={profile.socials.linkedin}
                  label="LinkedIn"
                  icon={<Linkedin className="h-4 w-4" />}
                />
              )}
              {profile.socials?.facebook && (
                <Social
                  href={profile.socials.facebook}
                  label="Facebook"
                  icon={<Facebook className="h-4 w-4" />}
                />
              )}
              {profile.socials?.instagram && (
                <Social
                  href={profile.socials.instagram}
                  label="Instagram"
                  icon={<Instagram className="h-4 w-4" />}
                />
              )}
            </div>
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="mt-6 inline-block font-mono text-xs text-fg/80 hover:text-fg transition-colors link-underline"
              >
                {profile.email}
              </a>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-fg/10 flex flex-wrap items-center justify-between gap-4">
          <div className="font-mono text-xs text-muted">
            © <CopyrightYear /> {profile.name}. All rights reserved.
          </div>
          <a
            href="#top"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-muted hover:text-fg transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="h-3.5 w-3.5" />
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
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-fg/15 text-fg/80 hover:text-fg hover:border-fg/40 hover:bg-fg/5 transition-all"
    >
      {icon}
    </a>
  );
}
