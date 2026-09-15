"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "./Toast";
import { ConfirmModal } from "./ConfirmModal";
import { ImageUploader } from "./ImageUploader";
import { revalidatePortfolio } from "@/app/admin/actions";
import { deleteStorageFile } from "@/lib/supabase/storage";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Save,
  X,
  Camera,
} from "lucide-react";
import type {
  LifeBio,
  Hobby,
  PhotoGalleryItem,
  PersonalProject,
  Favorite,
} from "@/lib/supabase/types";

export function LifeSection() {
  const [activeTab, setActiveTab] = useState<
    "bio" | "hobbies" | "gallery" | "projects" | "favorites"
  >("bio");
  const [loading, setLoading] = useState(true);
  const [savingBio, setSavingBio] = useState(false);
  const { toast } = useToast();

  // Data states
  const [bio, setBio] = useState<Partial<LifeBio>>({
    headline: "Off the Clock",
    greeting: "",
    bio: "",
    published: true,
  });
  const [hobbies, setHobbies] = useState<Hobby[]>([]);
  const [gallery, setGallery] = useState<PhotoGalleryItem[]>([]);
  const [projects, setProjects] = useState<PersonalProject[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  // Modals
  const [editingHobby, setEditingHobby] = useState<Partial<Hobby> | null>(null);
  const [editingPhoto, setEditingPhoto] = useState<Partial<PhotoGalleryItem> | null>(null);
  const [editingProject, setEditingProject] = useState<Partial<PersonalProject> | null>(null);
  const [editingFavorite, setEditingFavorite] = useState<Partial<Favorite> | null>(null);

  // Deletions
  const [deleteTarget, setDeleteTarget] = useState<{
    table: string;
    id: string;
    title: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const supabase = createClient();

      const [bioRes, hobRes, galRes, projRes, favRes] = await Promise.all([
        supabase.from("life_bio").select("*").eq("id", 1).maybeSingle(),
        supabase.from("hobbies").select("*").order("sort_order", { ascending: true }),
        supabase.from("photo_gallery").select("*").order("sort_order", { ascending: true }),
        supabase.from("personal_projects").select("*").order("sort_order", { ascending: true }),
        supabase.from("favorites").select("*").order("sort_order", { ascending: true }),
      ]);

      if (bioRes.data) setBio(bioRes.data);
      if (hobRes.data) setHobbies(hobRes.data);
      if (galRes.data) setGallery(galRes.data);
      if (projRes.data) setProjects(projRes.data);
      if (favRes.data) setFavorites(favRes.data);
    } catch (err: any) {
      console.error("Fetch error:", err);
      toast(err.message || "Failed to load Off the Clock data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const supabase = createClient();

      // If deleting from photo_gallery, also remove physical file from Supabase storage
      if (deleteTarget.table === "photo_gallery") {
        const { data: photoData } = await supabase
          .from("photo_gallery")
          .select("src")
          .eq("id", deleteTarget.id)
          .maybeSingle();

        if (photoData?.src) {
          await deleteStorageFile(supabase, photoData.src);
        }
      }

      const { error } = await supabase.from(deleteTarget.table).delete().eq("id", deleteTarget.id);
      if (error) throw error;

      await revalidatePortfolio();
      toast(`Deleted ${deleteTarget.title}`, "success");
      setDeleteTarget(null);
      fetchData();
    } catch (err: any) {
      toast(err.message || "Delete failed", "error");
    } finally {
      setDeleting(false);
    }
  };

  const togglePublish = async (table: string, id: string, current: boolean) => {
    try {
      const supabase = createClient();
      const { error } = await supabase.from(table).update({ published: !current }).eq("id", id);
      if (error) throw error;
      await revalidatePortfolio();
      toast(`Updated status to ${!current ? "Published" : "Draft"}`, "success");
      fetchData();
    } catch (err: any) {
      toast(err.message || "Failed to update status", "error");
    }
  };

  // Save Bio
  const saveBio = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingBio(true);
      const supabase = createClient();
      const payload = {
        id: 1,
        headline: bio.headline || "Off the Clock",
        greeting: bio.greeting || "",
        bio: bio.bio || "",
        published: bio.published ?? true,
      };

      const { error } = await supabase.from("life_bio").upsert(payload);
      if (error) throw error;

      await revalidatePortfolio();
      toast("Bio saved successfully", "success");
    } catch (err: any) {
      toast(err.message || "Failed to save bio", "error");
    } finally {
      setSavingBio(false);
    }
  };

  // Save Hobby
  const saveHobby = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHobby) return;

    try {
      const supabase = createClient();
      const payload = {
        title: editingHobby.title || "",
        emoji: editingHobby.emoji || "✨",
        description: editingHobby.description || "",
        image_url: editingHobby.image_url || null,
        sort_order: editingHobby.sort_order ?? (hobbies.length + 1),
        published: editingHobby.published ?? true,
      };

      if (editingHobby.id) {
        const { error } = await supabase.from("hobbies").update(payload).eq("id", editingHobby.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("hobbies").insert(payload);
        if (error) throw error;
      }

      await revalidatePortfolio();
      toast("Hobby saved", "success");
      setEditingHobby(null);
      fetchData();
    } catch (err: any) {
      toast(err.message || "Failed to save hobby", "error");
    }
  };

  // Save Photo
  const savePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhoto) return;

    try {
      const supabase = createClient();
      const payload = {
        src: editingPhoto.src || "",
        alt: editingPhoto.alt || "",
        caption: editingPhoto.caption || null,
        sort_order: editingPhoto.sort_order ?? (gallery.length + 1),
        published: editingPhoto.published ?? true,
      };

      if (editingPhoto.id) {
        const { error } = await supabase.from("photo_gallery").update(payload).eq("id", editingPhoto.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("photo_gallery").insert(payload);
        if (error) throw error;
      }

      await revalidatePortfolio();
      toast("Photo saved to gallery", "success");
      setEditingPhoto(null);
      fetchData();
    } catch (err: any) {
      toast(err.message || "Failed to save photo", "error");
    }
  };

  // Save Personal Project
  const savePersonalProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      const supabase = createClient();
      const payload = {
        title: editingProject.title || "",
        description: editingProject.description || "",
        link: editingProject.link || null,
        sort_order: editingProject.sort_order ?? (projects.length + 1),
        published: editingProject.published ?? true,
      };

      if (editingProject.id) {
        const { error } = await supabase.from("personal_projects").update(payload).eq("id", editingProject.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("personal_projects").insert(payload);
        if (error) throw error;
      }

      await revalidatePortfolio();
      toast("Personal project saved", "success");
      setEditingProject(null);
      fetchData();
    } catch (err: any) {
      toast(err.message || "Failed to save project", "error");
    }
  };

  // Save Favorite
  const saveFavorite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFavorite) return;

    try {
      const supabase = createClient();
      const payload = {
        category: editingFavorite.category || "",
        items: editingFavorite.items || [],
        sort_order: editingFavorite.sort_order ?? (favorites.length + 1),
        published: editingFavorite.published ?? true,
      };

      if (editingFavorite.id) {
        const { error } = await supabase.from("favorites").update(payload).eq("id", editingFavorite.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("favorites").insert(payload);
        if (error) throw error;
      }

      await revalidatePortfolio();
      toast("Favorite category saved", "success");
      setEditingFavorite(null);
      fetchData();
    } catch (err: any) {
      toast(err.message || "Failed to save favorite", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-neutral-400">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="flex flex-wrap gap-2 border-b border-neutral-800 pb-3">
        {[
          { id: "bio", label: "Informal Bio" },
          { id: "hobbies", label: `Hobbies (${hobbies.length})` },
          { id: "gallery", label: `Photo Gallery (${gallery.length})` },
          { id: "projects", label: `Personal Projects (${projects.length})` },
          { id: "favorites", label: `Favorites (${favorites.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
              activeTab === tab.id
                ? "bg-amber-500 text-neutral-950 font-bold"
                : "text-neutral-400 hover:text-white hover:bg-neutral-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 1. INFORMAL BIO TAB */}
      {/* ========================================================================= */}
      {activeTab === "bio" && (
        <form onSubmit={saveBio} className="space-y-6 max-w-3xl">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Off the Clock Bio</h3>
            <button
              type="submit"
              disabled={savingBio}
              className="flex items-center gap-1.5 px-5 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold rounded-xl text-xs"
            >
              {savingBio ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{savingBio ? "Saving..." : "Save Bio"}</span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-neutral-400">Headline</label>
              <input
                type="text"
                required
                value={bio.headline || ""}
                onChange={(e) => setBio({ ...bio, headline: e.target.value })}
                placeholder="Off the Clock"
                className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-neutral-400">Greeting / Short Intro</label>
              <textarea
                rows={3}
                required
                value={bio.greeting || ""}
                onChange={(e) => setBio({ ...bio, greeting: e.target.value })}
                placeholder="When I'm not shipping code..."
                className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white text-sm leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-neutral-400">Extended Story / Background</label>
              <textarea
                rows={5}
                required
                value={bio.bio || ""}
                onChange={(e) => setBio({ ...bio, bio: e.target.value })}
                placeholder="I grew up in Peshawar..."
                className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white text-sm leading-relaxed"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-300">
              <input
                type="checkbox"
                checked={bio.published ?? true}
                onChange={(e) => setBio({ ...bio, published: e.target.checked })}
                className="rounded bg-neutral-950 border-neutral-800 text-amber-500 focus:ring-0"
              />
              <span>Published (Visible on site)</span>
            </label>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* 2. HOBBIES TAB */}
      {/* ========================================================================= */}
      {activeTab === "hobbies" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Hobbies & Interests</h3>
            <button
              onClick={() =>
                setEditingHobby({
                  title: "",
                  emoji: "📸",
                  description: "",
                  image_url: null,
                  sort_order: hobbies.length + 1,
                  published: true,
                })
              }
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-xs rounded-xl"
            >
              <Plus className="w-4 h-4" />
              <span>Add Hobby</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hobbies.map((h) => (
              <div
                key={h.id}
                className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 space-y-2"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{h.emoji || "✨"}</span>
                    <div>
                      <h4 className="font-semibold text-white text-sm">{h.title}</h4>
                      <span className="text-[10px] font-mono text-neutral-500">Order: {h.sort_order}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => togglePublish("hobbies", h.id, h.published)}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        h.published
                          ? "bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 hover:bg-emerald-900/50"
                          : "bg-neutral-800/80 text-neutral-400 border border-neutral-700/50 hover:bg-neutral-800 hover:text-white"
                      }`}
                      title={h.published ? "Visible on site (click to hide)" : "Hidden from site (click to show)"}
                    >
                      {h.published ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-neutral-400" />}
                      <span>{h.published ? "Visible" : "Hidden"}</span>
                    </button>
                    <button
                      onClick={() => setEditingHobby(h)}
                      className="p-2 rounded-lg text-neutral-400 hover:text-white"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ table: "hobbies", id: h.id, title: h.title })}
                      className="p-2 rounded-lg text-neutral-400 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">{h.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. PHOTO GALLERY TAB */}
      {/* ========================================================================= */}
      {activeTab === "gallery" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Photo Gallery</h3>
            <button
              onClick={() =>
                setEditingPhoto({
                  src: "",
                  alt: "",
                  caption: "",
                  sort_order: gallery.length + 1,
                  published: true,
                })
              }
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-xs rounded-xl"
            >
              <Plus className="w-4 h-4" />
              <span>Add Photo</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {gallery.map((photo) => (
              <div
                key={photo.id}
                className="group relative rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] bg-neutral-950 flex items-center justify-center">
                  {photo.src ? (
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-neutral-500">
                      <Camera className="w-8 h-8 opacity-40" />
                      <span className="text-[10px]">No image uploaded</span>
                    </div>
                  )}
                </div>

                <div className="p-3 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between gap-2">
                  <div className="truncate">
                    <p className="text-xs font-semibold text-white truncate">{photo.alt || "Untitled Photo"}</p>
                    {photo.caption && (
                      <p className="text-[10px] text-neutral-400 truncate">{photo.caption}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => togglePublish("photo_gallery", photo.id, photo.published)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium transition-all ${
                        photo.published
                          ? "bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 hover:bg-emerald-900/50"
                          : "bg-neutral-800/80 text-neutral-400 border border-neutral-700/50 hover:bg-neutral-800 hover:text-white"
                      }`}
                      title={photo.published ? "Visible on site (click to hide)" : "Hidden from site (click to show)"}
                    >
                      {photo.published ? <Eye className="w-3 h-3 text-emerald-400" /> : <EyeOff className="w-3 h-3 text-neutral-400" />}
                      <span>{photo.published ? "Visible" : "Hidden"}</span>
                    </button>
                    <button
                      onClick={() => setEditingPhoto(photo)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-white"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ table: "photo_gallery", id: photo.id, title: photo.alt })}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. PERSONAL PROJECTS TAB */}
      {/* ========================================================================= */}
      {activeTab === "projects" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Personal Non-Work Projects</h3>
            <button
              onClick={() =>
                setEditingProject({
                  title: "",
                  description: "",
                  link: "",
                  sort_order: projects.length + 1,
                  published: true,
                })
              }
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-xs rounded-xl"
            >
              <Plus className="w-4 h-4" />
              <span>Add Personal Project</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {projects.map((p) => (
              <div
                key={p.id}
                className="flex items-start justify-between gap-4 p-4 rounded-xl border border-neutral-800 bg-neutral-900/50"
              >
                <div>
                  <h4 className="font-semibold text-white text-sm">{p.title}</h4>
                  <p className="text-xs text-neutral-400 mt-1">{p.description}</p>
                  {p.link && (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-amber-400 hover:underline mt-1 inline-block font-mono"
                    >
                      {p.link}
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePublish("personal_projects", p.id, p.published)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      p.published
                        ? "bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 hover:bg-emerald-900/50"
                        : "bg-neutral-800/80 text-neutral-400 border border-neutral-700/50 hover:bg-neutral-800 hover:text-white"
                    }`}
                    title={p.published ? "Visible on site (click to hide)" : "Hidden from site (click to show)"}
                  >
                    {p.published ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-neutral-400" />}
                    <span>{p.published ? "Visible" : "Hidden"}</span>
                  </button>
                  <button
                    onClick={() => setEditingProject(p)}
                    className="p-2 rounded-lg text-neutral-400 hover:text-white"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ table: "personal_projects", id: p.id, title: p.title })}
                    className="p-2 rounded-lg text-neutral-400 hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. FAVORITES TAB */}
      {/* ========================================================================= */}
      {activeTab === "favorites" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Favorite Things</h3>
            <button
              onClick={() =>
                setEditingFavorite({
                  category: "",
                  items: [],
                  sort_order: favorites.length + 1,
                  published: true,
                })
              }
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-xs rounded-xl"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {favorites.map((fav) => (
              <div
                key={fav.id}
                className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                  <h4 className="font-semibold text-white text-sm">{fav.category}</h4>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => togglePublish("favorites", fav.id, fav.published)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium transition-all ${
                        fav.published
                          ? "bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 hover:bg-emerald-900/50"
                          : "bg-neutral-800/80 text-neutral-400 border border-neutral-700/50 hover:bg-neutral-800 hover:text-white"
                      }`}
                      title={fav.published ? "Visible on site (click to hide)" : "Hidden from site (click to show)"}
                    >
                      {fav.published ? <Eye className="w-3 h-3 text-emerald-400" /> : <EyeOff className="w-3 h-3 text-neutral-400" />}
                      <span>{fav.published ? "Visible" : "Hidden"}</span>
                    </button>
                    <button
                      onClick={() => setEditingFavorite(fav)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-white"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ table: "favorites", id: fav.id, title: fav.category })}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <ul className="list-disc list-inside space-y-1 text-xs text-neutral-300">
                  {(fav.items || []).map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}

      {/* Hobby Modal */}
      {editingHobby && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 shadow-2xl my-8 space-y-4">
            <h3 className="text-lg font-bold text-white">
              {editingHobby.id ? "Edit Hobby" : "Add Hobby"}
            </h3>
            <form onSubmit={saveHobby} className="space-y-4">
              <div className="grid grid-cols-4 gap-3">
                <div className="space-y-1.5 col-span-1">
                  <label className="text-xs font-semibold uppercase text-neutral-400">Emoji</label>
                  <input
                    type="text"
                    value={editingHobby.emoji || ""}
                    onChange={(e) => setEditingHobby({ ...editingHobby, emoji: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-center text-lg"
                  />
                </div>
                <div className="space-y-1.5 col-span-3">
                  <label className="text-xs font-semibold uppercase text-neutral-400">Title</label>
                  <input
                    type="text"
                    required
                    value={editingHobby.title || ""}
                    onChange={(e) => setEditingHobby({ ...editingHobby, title: e.target.value })}
                    placeholder="Photography, Hiking..."
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-neutral-400">Description</label>
                <textarea
                  rows={3}
                  required
                  value={editingHobby.description || ""}
                  onChange={(e) => setEditingHobby({ ...editingHobby, description: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm"
                />
              </div>

              <div className="pt-1">
                <ImageUploader
                  label="Hobby Photo / Illustration (Optional)"
                  value={editingHobby.image_url || ""}
                  folder="hobbies"
                  onChange={(url) => setEditingHobby({ ...editingHobby, image_url: url })}
                  helperText="Upload or crop hobby photo (1:1 square or 4:3 recommended)"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-300">
                <input
                  type="checkbox"
                  checked={editingHobby.published ?? true}
                  onChange={(e) => setEditingHobby({ ...editingHobby, published: e.target.checked })}
                  className="rounded bg-neutral-950 border-neutral-800 text-amber-500 focus:ring-0"
                />
                <span>Visible on live portfolio (Published)</span>
              </label>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingHobby(null)}
                  className="px-4 py-2 text-sm text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-sm"
                >
                  Save Hobby
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Photo Gallery Modal */}
      {editingPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 shadow-2xl my-8 space-y-4">
            <h3 className="text-lg font-bold text-white">
              {editingPhoto.id ? "Edit Photo" : "Upload Gallery Photo"}
            </h3>
            <form onSubmit={savePhoto} className="space-y-4">
              <ImageUploader
                label="Photo Image"
                value={editingPhoto.src}
                folder="gallery"
                onChange={(url) => setEditingPhoto({ ...editingPhoto, src: url })}
                helperText="Upload photo (max 5MB)"
              />

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-neutral-400">Alt Description</label>
                <input
                  type="text"
                  required
                  value={editingPhoto.alt || ""}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, alt: e.target.value })}
                  placeholder="e.g. Sunset over Swat Valley"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-neutral-400">Caption (optional)</label>
                <input
                  type="text"
                  value={editingPhoto.caption || ""}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, caption: e.target.value })}
                  placeholder="e.g. Golden hour near Kalam, Swat Valley"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-300">
                <input
                  type="checkbox"
                  checked={editingPhoto.published ?? true}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, published: e.target.checked })}
                  className="rounded bg-neutral-950 border-neutral-800 text-amber-500 focus:ring-0"
                />
                <span>Visible on live portfolio (Published)</span>
              </label>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingPhoto(null)}
                  className="px-4 py-2 text-sm text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-sm"
                >
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Personal Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">
              {editingProject.id ? "Edit Personal Project" : "Add Personal Project"}
            </h3>
            <form onSubmit={savePersonalProject} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-neutral-400">Title</label>
                <input
                  type="text"
                  required
                  value={editingProject.title || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  placeholder="Photo Journal, Podcast..."
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-neutral-400">Description</label>
                <textarea
                  rows={3}
                  required
                  value={editingProject.description || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-neutral-400">Link (optional)</label>
                <input
                  type="url"
                  value={editingProject.link || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, link: e.target.value })}
                  placeholder="e.g. https://github.com/..."
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-300">
                <input
                  type="checkbox"
                  checked={editingProject.published ?? true}
                  onChange={(e) => setEditingProject({ ...editingProject, published: e.target.checked })}
                  className="rounded bg-neutral-950 border-neutral-800 text-amber-500 focus:ring-0"
                />
                <span>Visible on live portfolio (Published)</span>
              </label>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 text-sm text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-sm"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Favorite Category Modal */}
      {editingFavorite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">
              {editingFavorite.id ? "Edit Favorites" : "Add Favorite Category"}
            </h3>
            <form onSubmit={saveFavorite} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-neutral-400">Category Name</label>
                <input
                  type="text"
                  required
                  value={editingFavorite.category || ""}
                  onChange={(e) => setEditingFavorite({ ...editingFavorite, category: e.target.value })}
                  placeholder="Books, Music, Podcasts..."
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-neutral-400">
                  Items (one per line)
                </label>
                <textarea
                  rows={4}
                  required
                  value={(editingFavorite.items || []).join("\n")}
                  onChange={(e) =>
                    setEditingFavorite({
                      ...editingFavorite,
                      items: e.target.value.split("\n").filter(Boolean),
                    })
                  }
                  placeholder="Item 1&#10;Item 2&#10;Item 3"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-300">
                <input
                  type="checkbox"
                  checked={editingFavorite.published ?? true}
                  onChange={(e) => setEditingFavorite({ ...editingFavorite, published: e.target.checked })}
                  className="rounded bg-neutral-950 border-neutral-800 text-amber-500 focus:ring-0"
                />
                <span>Visible on live portfolio (Published)</span>
              </label>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingFavorite(null)}
                  className="px-4 py-2 text-sm text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-sm"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reusable Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title={`Delete ${deleteTarget?.title}?`}
        message="Are you sure you want to delete this item? This action cannot be undone."
        isLoading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
