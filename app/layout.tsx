import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Syne, Fira_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Syne({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const mono = Fira_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hamdan Raza — Full-Stack Web Developer | Portfolio",
  description:
    "Full-Stack Web Developer based in Peshawar, Pakistan. Building MERN-stack web apps integrated with AI features. React, Next.js, Node.js, MongoDB.",
  keywords: [
    "Hamdan Raza",
    "Full-Stack Developer",
    "MERN Stack",
    "React Developer",
    "Next.js",
    "Peshawar",
    "Pakistan",
  ],
  authors: [{ name: "Hamdan Raza" }],
  openGraph: {
    title: "Hamdan Raza — Full-Stack Web Developer",
    description:
      "MERN-stack full-stack developer based in Peshawar. Building production web apps with React, Node.js and AI integration.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${display.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
