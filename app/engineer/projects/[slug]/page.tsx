import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects as staticProjects } from "@/lib/data";
import { getProjectBySlug, getEngineerContent } from "@/lib/supabase/queries";
import { ProjectDetail } from "@/components/ProjectDetail";

export const revalidate = 3600;

export async function generateStaticParams() {
  const { projects } = await getEngineerContent();
  const source = projects.length > 0 ? projects : staticProjects;

  return source
    .filter((p) => p.featured && p.slug)
    .map((p) => ({ slug: p.slug! }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { project } = await getProjectBySlug(params.slug);
  if (!project) return { title: "Project Not Found | Hamdan Raza" };

  return {
    title: `${project.title} — Case Study | Hamdan Raza`,
    description: project.description,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const { project, detail } = await getProjectBySlug(params.slug);
  if (!project || !detail) notFound();

  const { projects } = await getEngineerContent();
  const featured = projects.filter((p) => p.featured && p.slug);
  const currentIndex = featured.findIndex((p) => p.slug === project.slug);

  const prevIndex = (currentIndex - 1 + featured.length) % (featured.length || 1);
  const nextIndex = (currentIndex + 1) % (featured.length || 1);

  const prevProject =
    featured.length > 1
      ? {
          title: featured[prevIndex].title,
          slug: featured[prevIndex].slug!,
        }
      : null;

  const nextProject =
    featured.length > 1
      ? {
          title: featured[nextIndex].title,
          slug: featured[nextIndex].slug!,
        }
      : null;

  // Adapt snake_case fields from DB to camelCase expected by ProjectDetail component
  const adaptedDetail = {
    categoryLong: (detail as any).category_long || (detail as any).categoryLong || project.category,
    problem: detail.problem,
    solution: detail.solution,
    contributions: detail.contributions || [],
    features: detail.features || [],
    metrics: detail.metrics || [],
    techStack: (detail as any).tech_stack || (detail as any).techStack || {},
    gallery: detail.gallery || [],
  };

  const adaptedProject = {
    title: project.title,
    live: project.live_url || (project as any).live || null,
    github: project.github_url || (project as any).github || null,
    slug: project.slug || undefined,
  };

  return (
    <ProjectDetail
      detail={adaptedDetail}
      project={adaptedProject}
      prevProject={prevProject}
      nextProject={nextProject}
      currentIndex={currentIndex >= 0 ? currentIndex : 0}
      totalCount={featured.length}
    />
  );
}
