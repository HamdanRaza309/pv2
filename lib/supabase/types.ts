export interface SiteSettings {
  id: number;
  name: string;
  initials: string;
  role: string;
  tagline: string;
  intro: string;
  location: string;
  analytics: string;
  availability: string;
  email: string;
  resume_url: string;
  portrait_url?: string | null;
  socials: {
    github?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    [key: string]: string | undefined;
  };
  about_paragraphs: string[];
  updated_at?: string;
}

export interface Project {
  id: string;
  title: string;
  slug?: string | null;
  category: string;
  description: string;
  tech: string[];
  live_url?: string | null;
  github_url?: string | null;
  live?: string | null;
  github?: string | null;
  featured: boolean;
  thumbnail_url?: string | null;
  sort_order: number;
  published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectDetail {
  id?: string;
  project_id: string;
  category_long: string;
  problem: string;
  solution: string;
  contributions: string[];
  features: { title: string; description: string; icon?: string }[];
  metrics: { value: string; label: string }[];
  tech_stack: {
    frontend?: string[];
    backend?: string[];
    database?: string[];
    cloud?: string[];
  };
  gallery: { src: string; alt: string; caption: string }[];
  created_at?: string;
  updated_at?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  sort_order: number;
  published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Experience {
  id: string;
  company: string;
  type: string;
  range: string;
  title: string;
  location: string;
  intro: string;
  highlights: string[];
  sort_order: number;
  published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TechStackCategory {
  id: string;
  category: string;
  sort_order: number;
  published: boolean;
  items?: TechStackItem[];
  created_at?: string;
  updated_at?: string;
}

export interface TechStackItem {
  id: string;
  category_id: string;
  name: string;
  sort_order: number;
  published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ResearchBio {
  id: number;
  headline: string;
  summary: string;
  published: boolean;
  updated_at?: string;
}

export interface ResearchInterest {
  id: string;
  title: string;
  description: string;
  sort_order: number;
  published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Publication {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: string;
  link?: string | null;
  abstract?: string | null;
  sort_order: number;
  published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ResearchProject {
  id: string;
  title: string;
  status: string;
  description: string;
  collaborators?: string | null;
  sort_order: number;
  published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Affiliation {
  id: string;
  institution: string;
  role: string;
  period: string;
  description?: string | null;
  sort_order: number;
  published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Coursework {
  id: string;
  title: string;
  institution?: string | null;
  description?: string | null;
  sort_order: number;
  published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface LifeBio {
  id: number;
  headline: string;
  greeting: string;
  bio: string;
  published: boolean;
  updated_at?: string;
}

export interface Hobby {
  id: string;
  title: string;
  emoji?: string | null;
  description: string;
  image_url?: string | null;
  sort_order: number;
  published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PhotoGalleryItem {
  id: string;
  src: string;
  alt: string;
  caption?: string | null;
  sort_order: number;
  published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PersonalProject {
  id: string;
  title: string;
  description: string;
  link?: string | null;
  sort_order: number;
  published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Favorite {
  id: string;
  category: string;
  items: string[];
  sort_order: number;
  published: boolean;
  created_at?: string;
  updated_at?: string;
}
