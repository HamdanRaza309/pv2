import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Extracts the storage file path relative to the 'portfolio' bucket.
 * Returns null if the URL is not hosted in the Supabase portfolio bucket (e.g. local assets in /assets/ or external Unsplash images).
 */
export function extractStoragePath(url?: string | null): string | null {
  if (!url || typeof url !== "string") return null;

  // Supabase public or signed object URL markers
  const bucketMarker = "/storage/v1/object/public/portfolio/";
  const signMarker = "/storage/v1/object/sign/portfolio/";

  let path: string | null = null;
  if (url.includes(bucketMarker)) {
    path = url.split(bucketMarker)[1];
  } else if (url.includes(signMarker)) {
    path = url.split(signMarker)[1];
  } else if (
    !url.startsWith("http://") &&
    !url.startsWith("https://") &&
    !url.startsWith("/") &&
    (url.startsWith("projects/") ||
      url.startsWith("gallery/") ||
      url.startsWith("avatars/") ||
      url.startsWith("hobbies/") ||
      url.startsWith("uploads/"))
  ) {
    // Already a relative path inside the bucket
    path = url;
  }

  if (path) {
    // Strip query parameters if any (e.g. ?t=...)
    path = path.split("?")[0];
    return decodeURIComponent(path);
  }

  return null;
}

/**
 * Deletes a single file from the 'portfolio' bucket if it originates from Supabase Storage.
 * Ignores local static assets or external URLs safely.
 */
export async function deleteStorageFile(
  supabase: SupabaseClient,
  urlOrPath?: string | null
): Promise<boolean> {
  if (!urlOrPath) return false;

  const filePath = extractStoragePath(urlOrPath);
  if (!filePath) return false;

  try {
    const { error } = await supabase.storage.from("portfolio").remove([filePath]);
    if (error) {
      console.error("Failed to delete file from storage:", filePath, error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Storage deletion error:", err);
    return false;
  }
}

/**
 * Deletes multiple files from the 'portfolio' bucket if they originate from Supabase Storage.
 */
export async function deleteStorageFiles(
  supabase: SupabaseClient,
  urlsOrPaths: (string | null | undefined)[]
): Promise<number> {
  const filePaths = urlsOrPaths
    .map((u) => extractStoragePath(u))
    .filter((p): p is string => Boolean(p));

  if (filePaths.length === 0) return 0;

  try {
    const { data, error } = await supabase.storage.from("portfolio").remove(filePaths);
    if (error) {
      console.error("Failed to delete files from storage:", filePaths, error);
      return 0;
    }
    return data?.length || filePaths.length;
  } catch (err) {
    console.error("Storage batch deletion error:", err);
    return 0;
  }
}
