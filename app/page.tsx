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
        <Services />
        <Experience />
        <TechStack />
        <HorizontalProjects />
        <MoreBuilds />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
