-- ============================================================================
-- Migration: 001_initial_schema.sql
-- Description: Core schema tables, triggers, and foreign keys for all personas
-- ============================================================================

-- Function: Automatically update updated_at timestamp on row modification
CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 1. Shared & Settings Tables
-- ----------------------------------------------------------------------------

-- Site Settings (Singleton table: exactly one row enforced with CHECK constraint)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  name TEXT NOT NULL,
  initials TEXT NOT NULL,
  role TEXT NOT NULL,
  tagline TEXT NOT NULL,
  intro TEXT NOT NULL,
  location TEXT NOT NULL,
  analytics TEXT NOT NULL,
  availability TEXT NOT NULL,
  email TEXT NOT NULL,
  resume_url TEXT NOT NULL,
  portrait_url TEXT,
  socials JSONB NOT NULL DEFAULT '{}'::jsonb,
  about_paragraphs TEXT[] NOT NULL DEFAULT '{}'::text[],
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TRIGGER set_timestamp_site_settings
BEFORE UPDATE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

-- ----------------------------------------------------------------------------
-- 2. Engineer Persona Tables
-- ----------------------------------------------------------------------------

-- Projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  tech TEXT[] NOT NULL DEFAULT '{}'::text[],
  live_url TEXT,
  github_url TEXT,
  featured BOOLEAN DEFAULT false NOT NULL,
  thumbnail_url TEXT,
  sort_order INT DEFAULT 0 NOT NULL,
  published BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TRIGGER set_timestamp_projects
BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

-- Project Details (1-to-1 extension for featured case studies)
CREATE TABLE IF NOT EXISTS public.project_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID UNIQUE NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  category_long TEXT NOT NULL,
  problem TEXT NOT NULL,
  solution TEXT NOT NULL,
  contributions TEXT[] NOT NULL DEFAULT '{}'::text[],
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  metrics JSONB NOT NULL DEFAULT '[]'::jsonb,
  tech_stack JSONB NOT NULL DEFAULT '{}'::jsonb,
  gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TRIGGER set_timestamp_project_details
BEFORE UPDATE ON public.project_details
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

-- Services table
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INT DEFAULT 0 NOT NULL,
  published BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TRIGGER set_timestamp_services
BEFORE UPDATE ON public.services
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

-- Experience table
CREATE TABLE IF NOT EXISTS public.experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company TEXT NOT NULL,
  type TEXT NOT NULL,
  range TEXT NOT NULL,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  intro TEXT NOT NULL,
  highlights TEXT[] NOT NULL DEFAULT '{}'::text[],
  sort_order INT DEFAULT 0 NOT NULL,
  published BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TRIGGER set_timestamp_experience
BEFORE UPDATE ON public.experience
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

-- Tech Stack Categories
CREATE TABLE IF NOT EXISTS public.tech_stack_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  sort_order INT DEFAULT 0 NOT NULL,
  published BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TRIGGER set_timestamp_tech_stack_categories
BEFORE UPDATE ON public.tech_stack_categories
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

-- Tech Stack Items
CREATE TABLE IF NOT EXISTS public.tech_stack_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.tech_stack_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INT DEFAULT 0 NOT NULL,
  published BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TRIGGER set_timestamp_tech_stack_items
BEFORE UPDATE ON public.tech_stack_items
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

-- ----------------------------------------------------------------------------
-- 3. Research Persona Tables
-- ----------------------------------------------------------------------------

-- Research Bio (Singleton table: exactly one row)
CREATE TABLE IF NOT EXISTS public.research_bio (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  headline TEXT NOT NULL,
  summary TEXT NOT NULL,
  published BOOLEAN DEFAULT true NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TRIGGER set_timestamp_research_bio
BEFORE UPDATE ON public.research_bio
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

-- Research Interests / Focus Areas
CREATE TABLE IF NOT EXISTS public.research_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INT DEFAULT 0 NOT NULL,
  published BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TRIGGER set_timestamp_research_interests
BEFORE UPDATE ON public.research_interests
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

-- Publications / Papers
CREATE TABLE IF NOT EXISTS public.publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  authors TEXT NOT NULL,
  venue TEXT NOT NULL,
  year TEXT NOT NULL,
  link TEXT,
  abstract TEXT,
  sort_order INT DEFAULT 0 NOT NULL,
  published BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TRIGGER set_timestamp_publications
BEFORE UPDATE ON public.publications
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

-- Research Projects (Ongoing)
CREATE TABLE IF NOT EXISTS public.research_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  status TEXT NOT NULL,
  description TEXT NOT NULL,
  collaborators TEXT,
  sort_order INT DEFAULT 0 NOT NULL,
  published BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TRIGGER set_timestamp_research_projects
BEFORE UPDATE ON public.research_projects
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

-- Lab / Academic Affiliations
CREATE TABLE IF NOT EXISTS public.affiliations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution TEXT NOT NULL,
  role TEXT NOT NULL,
  period TEXT NOT NULL,
  description TEXT,
  sort_order INT DEFAULT 0 NOT NULL,
  published BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TRIGGER set_timestamp_affiliations
BEFORE UPDATE ON public.affiliations
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

-- Relevant Coursework
CREATE TABLE IF NOT EXISTS public.coursework (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  institution TEXT,
  description TEXT,
  sort_order INT DEFAULT 0 NOT NULL,
  published BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TRIGGER set_timestamp_coursework
BEFORE UPDATE ON public.coursework
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

-- ----------------------------------------------------------------------------
-- 4. Off the Clock (Life) Persona Tables
-- ----------------------------------------------------------------------------

-- Life Bio (Singleton table: exactly one row)
CREATE TABLE IF NOT EXISTS public.life_bio (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  headline TEXT NOT NULL,
  greeting TEXT NOT NULL,
  bio TEXT NOT NULL,
  published BOOLEAN DEFAULT true NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TRIGGER set_timestamp_life_bio
BEFORE UPDATE ON public.life_bio
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

-- Hobbies & Interests
CREATE TABLE IF NOT EXISTS public.hobbies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  emoji TEXT,
  description TEXT NOT NULL,
  image_url TEXT,
  sort_order INT DEFAULT 0 NOT NULL,
  published BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TRIGGER set_timestamp_hobbies
BEFORE UPDATE ON public.hobbies
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

-- Photo Gallery
CREATE TABLE IF NOT EXISTS public.photo_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  src TEXT NOT NULL,
  alt TEXT NOT NULL,
  caption TEXT,
  sort_order INT DEFAULT 0 NOT NULL,
  published BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TRIGGER set_timestamp_photo_gallery
BEFORE UPDATE ON public.photo_gallery
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

-- Personal Projects (Non-work)
CREATE TABLE IF NOT EXISTS public.personal_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  link TEXT,
  sort_order INT DEFAULT 0 NOT NULL,
  published BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TRIGGER set_timestamp_personal_projects
BEFORE UPDATE ON public.personal_projects
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();

-- Favorite Things
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  items TEXT[] NOT NULL DEFAULT '{}'::text[],
  sort_order INT DEFAULT 0 NOT NULL,
  published BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TRIGGER set_timestamp_favorites
BEFORE UPDATE ON public.favorites
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();
