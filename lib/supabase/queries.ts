import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import * as staticData from "@/lib/data";
import type {
  SiteSettings,
  Project,
  ProjectDetail,
  Service,
  Experience,
  TechStackCategory,
  ResearchBio,
  ResearchInterest,
  Publication,
  ResearchProject,
  Affiliation,
  Coursework,
  LifeBio,
  Hobby,
  PhotoGalleryItem,
  PersonalProject,
  Favorite,
} from "./types";

function getPublicClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;

  if (!url || !key || url.includes("your-project-ref")) {
    return null;
  }

  return createSupabaseClient(url, key, {
    auth: { persistSession: false },
  });
}

// ----------------------------------------------------------------------------
// Shared Site Settings
// ----------------------------------------------------------------------------

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = getPublicClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();

      if (!error && data) {
        if (!data.portrait_url || data.portrait_url.startsWith("/assets/")) {
          data.portrait_url =
            "https://tnpbnridezldixmriner.supabase.co/storage/v1/object/public/portfolio/avatars/hamdan_cutout.png";
        }
        return data as SiteSettings;
      }
    } catch (err) {
      console.warn("Failed to fetch site settings from Supabase, falling back to static data.", err);
    }
  }

  // Safe fallback to static data
  return {
    id: 1,
    name: staticData.personal.name,
    initials: staticData.personal.initials,
    role: staticData.personal.role,
    tagline: staticData.personal.tagline,
    intro: staticData.personal.intro,
    location: staticData.personal.location,
    analytics: staticData.personal.analytics,
    availability: staticData.personal.availability,
    email: staticData.personal.email,
    resume_url: staticData.personal.resume,
    portrait_url:
      "https://tnpbnridezldixmriner.supabase.co/storage/v1/object/public/portfolio/avatars/hamdan_cutout.png",
    socials: staticData.personal.socials,
    about_paragraphs: staticData.about.paragraphs,
  };
}

// ----------------------------------------------------------------------------
// Engineer Content
// ----------------------------------------------------------------------------

export interface EngineerData {
  projects: Project[];
  services: Service[];
  experience: Experience[];
  techStack: TechStackCategory[];
}

export async function getEngineerContent(): Promise<EngineerData> {
  const supabase = getPublicClient();

  if (supabase) {
    try {
      const [projectsRes, servicesRes, expRes, catRes, itemsRes] = await Promise.all([
        supabase.from("projects").select("*").order("sort_order", { ascending: true }),
        supabase.from("services").select("*").order("sort_order", { ascending: true }),
        supabase.from("experience").select("*").order("sort_order", { ascending: true }),
        supabase.from("tech_stack_categories").select("*").order("sort_order", { ascending: true }),
        supabase.from("tech_stack_items").select("*").order("sort_order", { ascending: true }),
      ]);

      if (
        !projectsRes.error &&
        !servicesRes.error &&
        !expRes.error &&
        !catRes.error &&
        projectsRes.data &&
        projectsRes.data.length > 0
      ) {
        const categories = (catRes.data || []) as TechStackCategory[];
        const items = (itemsRes.data || []) as any[];

        const techStackWithItems = categories.map((cat) => ({
          ...cat,
          items: items.filter((item) => item.category_id === cat.id),
        }));

        return {
          projects: projectsRes.data as Project[],
          services: servicesRes.data as Service[],
          experience: expRes.data as Experience[],
          techStack: techStackWithItems,
        };
      }
    } catch (err) {
      console.warn("Failed to fetch engineer content from Supabase, falling back to static data.", err);
    }
  }

  // Safe fallback to static data
  return {
    projects: staticData.projects.map((p, idx) => ({
      id: `static-${idx}`,
      title: p.title,
      slug: p.slug || null,
      category: p.category,
      description: p.description,
      tech: p.tech,
      live_url: p.live,
      github_url: p.github,
      featured: p.featured,
      thumbnail_url: p.slug ? `/assets/${p.slug.replace(/-/g, "")}/user_dashboard.png` : null,
      sort_order: idx + 1,
      published: true,
    })),
    services: staticData.services.map((s, idx) => ({
      id: `static-${idx}`,
      title: s.title,
      description: s.description,
      sort_order: idx + 1,
      published: true,
    })),
    experience: staticData.experience.map((e, idx) => ({
      id: `static-${idx}`,
      company: e.company,
      type: e.type,
      range: e.range,
      title: e.title,
      location: e.location,
      intro: e.intro,
      highlights: e.highlights,
      sort_order: idx + 1,
      published: true,
    })),
    techStack: staticData.techStack.map((cat, idx) => ({
      id: `static-cat-${idx}`,
      category: cat.category,
      sort_order: idx + 1,
      published: true,
      items: cat.items.map((item, itemIdx) => ({
        id: `static-item-${idx}-${itemIdx}`,
        category_id: `static-cat-${idx}`,
        name: item,
        sort_order: itemIdx + 1,
        published: true,
      })),
    })),
  };
}

export async function getProjectBySlug(slug: string): Promise<{
  project: Project | null;
  detail: ProjectDetail | null;
}> {
  const supabase = getPublicClient();

  if (supabase) {
    try {
      const { data: project, error: pError } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (!pError && project) {
        const { data: detail } = await supabase
          .from("project_details")
          .select("*")
          .eq("project_id", project.id)
          .maybeSingle();

        return {
          project: project as Project,
          detail: (detail as ProjectDetail) || null,
        };
      }
    } catch (err) {
      console.warn("Failed to fetch project detail from Supabase, falling back to static data.", err);
    }
  }

  // Safe fallback to static data
  const staticProj = staticData.getProjectBySlug(slug);
  if (!staticProj) return { project: null, detail: null };

  const staticDet = staticData.getProjectDetail(staticProj.title);

  return {
    project: {
      id: "static",
      title: staticProj.title,
      slug: staticProj.slug || null,
      category: staticProj.category,
      description: staticProj.description,
      tech: staticProj.tech,
      live_url: staticProj.live,
      github_url: staticProj.github,
      featured: staticProj.featured,
      thumbnail_url: null,
      sort_order: 1,
      published: true,
    },
    detail: staticDet
      ? {
        project_id: "static",
        category_long: staticDet.categoryLong,
        problem: staticDet.problem,
        solution: staticDet.solution,
        contributions: staticDet.contributions,
        features: staticDet.features,
        metrics: staticDet.metrics,
        tech_stack: staticDet.techStack,
        gallery: staticDet.gallery || [],
      }
      : null,
  };
}

// ----------------------------------------------------------------------------
// Research Content (Never falls back to [DUMMY] dummy static data!)
// ----------------------------------------------------------------------------

export interface ResearchData {
  bio: ResearchBio | null;
  interests: ResearchInterest[];
  publications: Publication[];
  projects: ResearchProject[];
  affiliations: Affiliation[];
  coursework: Coursework[];
}

export async function getResearchContent(): Promise<ResearchData> {
  const supabase = getPublicClient();

  if (supabase) {
    try {
      const [bioRes, intRes, pubRes, projRes, affRes, courseRes] = await Promise.all([
        supabase.from("research_bio").select("*").eq("id", 1).maybeSingle(),
        supabase.from("research_interests").select("*").order("sort_order", { ascending: true }),
        supabase.from("publications").select("*").order("sort_order", { ascending: true }),
        supabase.from("research_projects").select("*").order("sort_order", { ascending: true }),
        supabase.from("affiliations").select("*").order("sort_order", { ascending: true }),
        supabase.from("coursework").select("*").order("sort_order", { ascending: true }),
      ]);

      return {
        bio: (bioRes.data as ResearchBio) || null,
        interests: (intRes.data as ResearchInterest[]) || [],
        publications: (pubRes.data as Publication[]) || [],
        projects: (projRes.data as ResearchProject[]) || [],
        affiliations: (affRes.data as Affiliation[]) || [],
        coursework: (courseRes.data as Coursework[]) || [],
      };
    } catch (err) {
      console.warn("Failed to fetch research content from Supabase.", err);
    }
  }

  // Safe empty fallback: NEVER serves dummy data
  return {
    bio: null,
    interests: [],
    publications: [],
    projects: [],
    affiliations: [],
    coursework: [],
  };
}

// ----------------------------------------------------------------------------
// Off the Clock (Life) Content (Never falls back to [DUMMY] dummy static data!)
// ----------------------------------------------------------------------------

export interface LifeData {
  bio: LifeBio | null;
  hobbies: Hobby[];
  photoGallery: PhotoGalleryItem[];
  personalProjects: PersonalProject[];
  favorites: Favorite[];
}

export async function getLifeContent(): Promise<LifeData> {
  const supabase = getPublicClient();

  if (supabase) {
    try {
      const [bioRes, hobRes, galRes, projRes, favRes] = await Promise.all([
        supabase.from("life_bio").select("*").eq("id", 1).maybeSingle(),
        supabase.from("hobbies").select("*").order("sort_order", { ascending: true }),
        supabase.from("photo_gallery").select("*").order("sort_order", { ascending: true }),
        supabase.from("personal_projects").select("*").order("sort_order", { ascending: true }),
        supabase.from("favorites").select("*").order("sort_order", { ascending: true }),
      ]);

      return {
        bio: (bioRes.data as LifeBio) || null,
        hobbies: (hobRes.data as Hobby[]) || [],
        photoGallery: (galRes.data as PhotoGalleryItem[]) || [],
        personalProjects: (projRes.data as PersonalProject[]) || [],
        favorites: (favRes.data as Favorite[]) || [],
      };
    } catch (err) {
      console.warn("Failed to fetch life content from Supabase.", err);
    }
  }

  // Safe empty fallback: NEVER serves dummy data
  return {
    bio: null,
    hobbies: [],
    photoGallery: [],
    personalProjects: [],
    favorites: [],
  };
}
