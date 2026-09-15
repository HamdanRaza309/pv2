import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { Experience } from "@/components/Experience";
import { TechStack } from "@/components/TechStack";
import { HorizontalProjects } from "@/components/HorizontalProjects";
import { MoreBuilds } from "@/components/MoreBuilds";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Cursor } from "@/components/Cursor";
import { nav } from "@/lib/data";
import { getEngineerContent, getSiteSettings } from "@/lib/supabase/queries";

export const revalidate = 3600; // Cache with on-demand revalidation via revalidatePath

export const metadata: Metadata = {
  title: "Hamdan Raza — Full-Stack AI Engineer | Portfolio",
  description:
    "Full-Stack AI Engineer based in Peshawar, Pakistan. Building MERN-stack web apps integrated with AI features. React, Next.js, Node.js, MongoDB.",
};

export default async function EngineerPage() {
  const [settings, engineerData] = await Promise.all([
    getSiteSettings(),
    getEngineerContent(),
  ]);

  const enabledAspects = settings.enabled_aspects || ["engineer", "research", "life"];
  if (!enabledAspects.includes("engineer")) {
    const fallback = enabledAspects[0] === "life" ? "/life" : `/${enabledAspects[0]}`;
    redirect(fallback || "/");
  }

  return (
    <div className="persona-engineer">
      <Cursor />
      <Navbar navItems={nav} enabledAspects={enabledAspects} />
      <main>
        <Hero settings={settings} />
        <About
          settings={settings}
          totalProjects={engineerData.projects.length}
          experience={engineerData.experience}
        />
        <Services services={engineerData.services} />
        <Experience experience={engineerData.experience} />
        <TechStack techStack={engineerData.techStack} />
        <HorizontalProjects projects={engineerData.projects} />
        <MoreBuilds projects={engineerData.projects} />
        <Contact settings={settings} />
      </main>
      <Footer settings={settings} />
    </div>
  );
}
