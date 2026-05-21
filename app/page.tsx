import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { TechStack } from "@/components/TechStack";
import { Experience } from "@/components/Experience";
import { Services } from "@/components/Services";
import { HorizontalProjects } from "@/components/HorizontalProjects";
import { MoreBuilds } from "@/components/MoreBuilds";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Splash } from "@/components/Splash";
import { Cursor } from "@/components/Cursor";

export default function Home() {
  return (
    <>
      <Splash />
      <Cursor />
      <Navbar />
      <main>
        <Hero />
        <About />
        <TechStack />
        <Experience />
        <Services />
        <HorizontalProjects />
        <MoreBuilds />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
