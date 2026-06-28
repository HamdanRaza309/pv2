import { notFound } from "next/navigation";
import { projects, getProjectBySlug, getProjectDetail } from "@/lib/data";
import { ProjectDetail } from "@/components/ProjectDetail";

export function generateStaticParams() {
  return projects
    .filter((p) => p.featured && p.slug)
    .map((p) => ({ slug: p.slug! }));
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = getProjectBySlug(params.slug);
  if (!project) notFound();

  const detail = getProjectDetail(project.title);
  if (!detail) notFound();

  return <ProjectDetail detail={detail} project={project} />;
}
