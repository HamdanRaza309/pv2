import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Hamdan Raza — Full-Stack AI Engineer | Portfolio",
  description:
    "Full-Stack AI Engineer based in Peshawar, Pakistan. Building MERN-stack web apps integrated with AI features. React, Next.js, Node.js, MongoDB.",
};

export default function EngineerPage() {
  return (
    <div className="persona-engineer">
      <Cursor />
      <Navbar navItems={nav} />
      <main>
        <Hero />
        <About />
        <Services />
        <Experience />
        <TechStack />
        <HorizontalProjects />
        <MoreBuilds />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
