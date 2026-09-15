-- ============================================================================
-- Migration: 002_security_and_rls.sql
-- Description: Admin identification, Security Definer function, and strict RLS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Admin Users Table & Admin Check Function
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Function: Check whether current auth.uid() belongs to verified admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid()
  );
$$;

-- ----------------------------------------------------------------------------
-- 2. Enable Row Level Security (RLS) on ALL tables
-- ----------------------------------------------------------------------------

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tech_stack_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tech_stack_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_bio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coursework ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.life_bio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hobbies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- 3. RLS Policies: admin_users
-- ----------------------------------------------------------------------------

CREATE POLICY "Admin view admin_users"
ON public.admin_users FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admin manage admin_users"
ON public.admin_users FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- 4. RLS Policies: site_settings
-- ----------------------------------------------------------------------------

CREATE POLICY "Public can view site settings"
ON public.site_settings FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admin insert site settings"
ON public.site_settings FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admin update site settings"
ON public.site_settings FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admin delete site settings"
ON public.site_settings FOR DELETE
TO authenticated
USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- 5. RLS Policies: project_details (inherits visibility from parent project)
-- ----------------------------------------------------------------------------

CREATE POLICY "Public can view details of published projects"
ON public.project_details FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = project_details.project_id
      AND projects.published = true
  )
);

CREATE POLICY "Admin can view all project details"
ON public.project_details FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admin insert project details"
ON public.project_details FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admin update project details"
ON public.project_details FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admin delete project details"
ON public.project_details FOR DELETE
TO authenticated
USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- 6. Helper Macro / Explicit Policies for Standard Published Tables
-- ----------------------------------------------------------------------------

-- Helper: Function to register standard public-read / admin-write policies
DO $$
DECLARE
  tbl TEXT;
  tables TEXT[] := ARRAY[
    'projects',
    'services',
    'experience',
    'tech_stack_categories',
    'tech_stack_items',
    'research_bio',
    'research_interests',
    'publications',
    'research_projects',
    'affiliations',
    'coursework',
    'life_bio',
    'hobbies',
    'photo_gallery',
    'personal_projects',
    'favorites'
  ];
BEGIN
  FOREACH tbl IN ARRAY tables LOOP
    -- 1. Public can only select published rows
    EXECUTE format('
      CREATE POLICY "Public view published %I"
      ON public.%I FOR SELECT
      TO anon, authenticated
      USING (published = true);
    ', tbl, tbl);

    -- 2. Admin can select all rows (including drafts)
    EXECUTE format('
      CREATE POLICY "Admin view all %I"
      ON public.%I FOR SELECT
      TO authenticated
      USING (public.is_admin());
    ', tbl, tbl);

    -- 3. Admin insert
    EXECUTE format('
      CREATE POLICY "Admin insert %I"
      ON public.%I FOR INSERT
      TO authenticated
      WITH CHECK (public.is_admin());
    ', tbl, tbl);

    -- 4. Admin update
    EXECUTE format('
      CREATE POLICY "Admin update %I"
      ON public.%I FOR UPDATE
      TO authenticated
      USING (public.is_admin())
      WITH CHECK (public.is_admin());
    ', tbl, tbl);

    -- 5. Admin delete
    EXECUTE format('
      CREATE POLICY "Admin delete %I"
      ON public.%I FOR DELETE
      TO authenticated
      USING (public.is_admin());
    ', tbl, tbl);
  END LOOP;
END;
$$;
