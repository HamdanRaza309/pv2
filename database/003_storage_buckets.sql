-- ============================================================================
-- Migration: 003_storage_buckets.sql
-- Description: Creates portfolio storage bucket with size/MIME limits & policies
-- ============================================================================

-- Create public storage bucket for images with strict limits
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio',
  'portfolio',
  true,
  5242880, -- 5 MB max file size
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']::text[];

-- ----------------------------------------------------------------------------
-- Storage Policies on storage.objects
-- ----------------------------------------------------------------------------

-- Public read access to portfolio bucket items
CREATE POLICY "Public read portfolio assets"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'portfolio');

-- Admin upload access
CREATE POLICY "Admin upload portfolio assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'portfolio' AND public.is_admin()
);

-- Admin update access
CREATE POLICY "Admin update portfolio assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'portfolio' AND public.is_admin()
)
WITH CHECK (
  bucket_id = 'portfolio' AND public.is_admin()
);

-- Admin delete access
CREATE POLICY "Admin delete portfolio assets"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'portfolio' AND public.is_admin()
);
