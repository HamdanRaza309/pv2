import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Splash } from "@/components/Splash";
import { GatePage } from "@/components/GatePage";
import { getSiteSettings } from "@/lib/supabase/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Hamdan Raza — Engineer · Researcher · Human",
  description:
    "Three sides of Hamdan Raza: Full-Stack AI Engineer, NeuroAI Researcher, and the person behind the code. Choose your perspective.",
};

export default async function Home() {
  const settings = await getSiteSettings();
  const enabledAspects = settings.enabled_aspects || ["engineer", "research", "life"];

  // If only 1 aspect is enabled, directly redirect visitors to that aspect
  if (enabledAspects.length === 1) {
    const single = enabledAspects[0];
    const targetRoute = single === "life" ? "/life" : `/${single}`;
    redirect(targetRoute);
  }

  return (
    <>
      <Splash />
      <GatePage enabledAspects={enabledAspects} />
    </>
  );
}
