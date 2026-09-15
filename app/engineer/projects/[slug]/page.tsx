import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects, getProjectBySlug, getProjectDetail, projectDetails } from "@/lib/data";
import { ProjectDetail } from "@/components/ProjectDetail";

export function generateStaticParams() {
  return projects
    .filter((p) => p.featured && p.slug)
    .map((p) => ({ slug: p.slug! }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = getProjectBySlug(params.slug);
  if (!project) return { title: "Project Not Found | Hamdan Raza" };

  return {
    title: `${project.title} — Case Study | Hamdan Raza`,
    description: project.description,
  };
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = getProjectBySlug(params.slug);
  if (!project) notFound();

  const detail = getProjectDetail(project.title);
  if (!detail) notFound();

  // Filter all featured projects that have a slug and detail page
  const featured = projects.filter(
    (p) => p.featured && p.slug && projectDetails[p.title]
  );
  const currentIndex = featured.findIndex((p) => p.slug === project.slug);

  // Compute prev and next featured project (cyclic navigation across all featured works)
  const prevIndex = (currentIndex - 1 + featured.length) % featured.length;
  const nextIndex = (currentIndex + 1) % featured.length;

  const prevProject = featured.length > 1 ? {
    title: featured[prevIndex].title,
    slug: featured[prevIndex].slug!,
  } : null;

  const nextProject = featured.length > 1 ? {
    title: featured[nextIndex].title,
    slug: featured[nextIndex].slug!,
  } : null;

  return (
    <ProjectDetail
      detail={detail}
      project={project}
      prevProject={prevProject}
      nextProject={nextProject}
      currentIndex={currentIndex >= 0 ? currentIndex : 0}
      totalCount={featured.length}
    />
  );
}
