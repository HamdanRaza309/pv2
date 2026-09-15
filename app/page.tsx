import type { Metadata } from "next";
import { Splash } from "@/components/Splash";
import { GatePage } from "@/components/GatePage";

export const metadata: Metadata = {
  title: "Hamdan Raza — Engineer · Researcher · Human",
  description:
    "Three sides of Hamdan Raza: Full-Stack AI Engineer, NeuroAI Researcher, and the person behind the code. Choose your perspective.",
};

export default function Home() {
  return (
    <>
      <Splash />
      <GatePage />
    </>
  );
}
