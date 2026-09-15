"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "./Toast";
import { ConfirmModal } from "./ConfirmModal";
import { ImageUploader } from "./ImageUploader";
import { revalidatePortfolio } from "@/app/admin/actions";
import { deleteStorageFile, deleteStorageFiles } from "@/lib/supabase/storage";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  BookOpen,
  Eye,
  EyeOff,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  X,
  Check,
} from "lucide-react";
import type {
  Project,
  ProjectDetail,
  Service,
  Experience,
  TechStackCategory,
  TechStackItem,
} from "@/lib/supabase/types";

export function EngineerSection() {
  const [activeTab, setActiveTab] = useState<"projects" | "services" | "experience" | "techStack">("projects");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Data states
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [categories, setCategories] = useState<TechStackCategory[]>([]);

  // Modals
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [editingDetail, setEditingDetail] = useState<{ projectId: string; projectTitle: string; detail: Partial<ProjectDetail> } | null>(null);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [editingExperience, setEditingExperience] = useState<Partial<Experience> | null>(null);
  const [editingCategory, setEditingCategory] = useState<Partial<TechStackCategory> | null>(null);
  const [editingItem, setEditingItem] = useState<{ categoryId: string; item: Partial<TechStackItem> } | null>(null);

  // Deletions
  const [deleteTarget, setDeleteTarget] = useState<{
    table: string;
    id: string;
    title: string;
    isCaseStudy?: boolean;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const supabase = createClient();

      const [projRes, servRes, expRes, catRes, itemRes] = await Promise.all([
        supabase.from("projects").select("*").order("sort_order", { ascending: true }),
        supabase.from("services").select("*").order("sort_order", { ascending: true }),
        supabase.from("experience").select("*").order("sort_order", { ascending: true }),
        supabase.from("tech_stack_categories").select("*").order("sort_order", { ascending: true }),
        supabase.from("tech_stack_items").select("*").order("sort_order", { ascending: true }),
      ]);

      if (projRes.data) setProjects(projRes.data);
      if (servRes.data) setServices(servRes.data);
      if (expRes.data) setExperience(expRes.data);

      if (catRes.data) {
        const cats = catRes.data as TechStackCategory[];
        const items = (itemRes.data || []) as TechStackItem[];
        setCategories(
          cats.map((c) => ({
            ...c,
            items: items.filter((i) => i.category_id === c.id),
          }))
        );
      }
    } catch (err: any) {
      console.error("Fetch error:", err);
      toast(err.message || "Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Generic delete handler
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const supabase = createClient();

      if (deleteTarget.isCaseStudy || deleteTarget.table === "project_details") {
        // Fetch all gallery images for this case study to remove from storage
        const { data: detailData } = await supabase
          .from("project_details")
          .select("gallery")
          .eq("project_id", deleteTarget.id)
          .maybeSingle();

        if (detailData?.gallery && Array.isArray(detailData.gallery)) {
          await deleteStorageFiles(
            supabase,
            detailData.gallery.map((g: any) => g?.src)
          );
        }

        const { error } = await supabase
          .from("project_details")
          .delete()
          .eq("project_id", deleteTarget.id);
        if (error) throw error;

        if (editingDetail?.projectId === deleteTarget.id) {
          setEditingDetail(null);
        }
        await revalidatePortfolio();
        toast(`Deleted case study for ${deleteTarget.title}`, "success");
        setDeleteTarget(null);
        fetchData();
        return;
      }

      // If deleting a project, first remove thumbnail and case study images from storage
      if (deleteTarget.table === "projects") {
        const [{ data: projData }, { data: detailData }] = await Promise.all([
          supabase.from("projects").select("thumbnail_url").eq("id", deleteTarget.id).maybeSingle(),
          supabase.from("project_details").select("gallery").eq("project_id", deleteTarget.id).maybeSingle(),
        ]);

        const filesToDelete: string[] = [];
        if (projData?.thumbnail_url) filesToDelete.push(projData.thumbnail_url);
        if (detailData?.gallery && Array.isArray(detailData.gallery)) {
          detailData.gallery.forEach((g: any) => {
            if (g?.src) filesToDelete.push(g.src);
          });
        }

        if (filesToDelete.length > 0) {
          await deleteStorageFiles(supabase, filesToDelete);
        }

        await supabase.from("project_details").delete().eq("project_id", deleteTarget.id);
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

  // Toggle publish
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

  // Save Project
  const saveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      const supabase = createClient();
      const payload = {
        title: editingProject.title || "",
        slug: editingProject.slug || null,
        category: editingProject.category || "",
        description: editingProject.description || "",
        tech: editingProject.tech || [],
        live_url: editingProject.live_url || null,
        github_url: editingProject.github_url || null,
        featured: editingProject.featured ?? false,
        thumbnail_url: editingProject.thumbnail_url || null,
        sort_order: editingProject.sort_order ?? (projects.length + 1),
        published: editingProject.published ?? true,
      };

      if (editingProject.id) {
        const { error } = await supabase.from("projects").update(payload).eq("id", editingProject.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("projects").insert(payload);
        if (error) throw error;
      }

      await revalidatePortfolio();
      toast("Project saved successfully", "success");
      setEditingProject(null);
      fetchData();
    } catch (err: any) {
      toast(err.message || "Failed to save project", "error");
    }
  };

  // Open Case Study Editor
  const openDetailEditor = async (project: Project) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("project_details")
        .select("*")
        .eq("project_id", project.id)
        .maybeSingle();

      if (error) throw error;

      setEditingDetail({
        projectId: project.id,
        projectTitle: project.title,
        detail: data || {
          project_id: project.id,
          category_long: project.category,
          problem: "",
          solution: "",
          contributions: [],
          features: [],
          metrics: [],
          tech_stack: { frontend: [], backend: [], database: [], cloud: [] },
          gallery: [],
        },
      });
    } catch (err: any) {
      toast(err.message || "Failed to load case study", "error");
    }
  };

  // Save Case Study (Project Details)
  const saveDetail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDetail) return;

    try {
      const supabase = createClient();

      // Clean up gallery: remove items without any image src
      const cleanGallery = (editingDetail.detail.gallery || [])
        .filter((item) => item && typeof item.src === "string" && item.src.trim() !== "")
        .map((item) => ({
          src: item.src.trim(),
          alt: item.alt?.trim() || "Project screenshot",
          caption: item.caption?.trim() || "",
          published: item.published ?? true,
        }));

      // Clean up metrics: remove empty metrics
      const cleanMetrics = (editingDetail.detail.metrics || [])
        .filter((m) => m && (m.value?.trim() || m.label?.trim()))
        .map((m) => ({
          value: m.value?.trim() || "",
          label: m.label?.trim() || "",
        }));

      // Clean up features
      const cleanFeatures = (editingDetail.detail.features || [])
        .filter((f) => f && (f.title?.trim() || f.description?.trim()))
        .map((f) => ({
          title: f.title?.trim() || "",
          description: f.description?.trim() || "",
          icon: f.icon || "Sparkles",
        }));

      const payload = {
        project_id: editingDetail.projectId,
        category_long: editingDetail.detail.category_long || "",
        problem: editingDetail.detail.problem || "",
        solution: editingDetail.detail.solution || "",
        contributions: (editingDetail.detail.contributions || []).filter((c) => Boolean(c?.trim())),
        features: cleanFeatures,
        metrics: cleanMetrics,
        tech_stack: editingDetail.detail.tech_stack || {},
        gallery: cleanGallery,
      };

      const { error } = await supabase
        .from("project_details")
        .upsert(payload, { onConflict: "project_id" });

      if (error) throw error;

      await revalidatePortfolio();
      toast("Case study details saved successfully", "success");
      setEditingDetail(null);
    } catch (err: any) {
      toast(err.message || "Failed to save case study", "error");
    }
  };

  // Delete Gallery Photo from state, database, and Supabase Storage
  const deleteGalleryPhoto = async (idx: number) => {
    if (!editingDetail) return;
    const photo = (editingDetail.detail.gallery || [])[idx];
    if (!photo) return;

    try {
      const supabase = createClient();

      // 1. Delete physical asset from Supabase Storage so it is removed from Media & Assets tab
      if (photo.src) {
        await deleteStorageFile(supabase, photo.src);
      }

      // 2. Remove from local modal state
      const updatedGallery = (editingDetail.detail.gallery || []).filter((_, i) => i !== idx);
      setEditingDetail({
        ...editingDetail,
        detail: { ...editingDetail.detail, gallery: updatedGallery },
      });

      // 3. Persist updated gallery immediately to Supabase if case study exists
      const cleanGallery = updatedGallery
        .filter((item) => item && typeof item.src === "string" && item.src.trim() !== "")
        .map((item) => ({
          src: item.src.trim(),
          alt: item.alt?.trim() || "Project screenshot",
          caption: item.caption?.trim() || "",
          published: item.published ?? true,
        }));

      await supabase
        .from("project_details")
        .update({ gallery: cleanGallery })
        .eq("project_id", editingDetail.projectId);

      await revalidatePortfolio();
      toast("Photo deleted from case study and storage", "success");
    } catch (err: any) {
      toast(err.message || "Failed to delete photo", "error");
    }
  };

  // Save Service
  const saveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    try {
      const supabase = createClient();
      const payload = {
        title: editingService.title || "",
        description: editingService.description || "",
        sort_order: editingService.sort_order ?? (services.length + 1),
        published: editingService.published ?? true,
      };

      if (editingService.id) {
        const { error } = await supabase.from("services").update(payload).eq("id", editingService.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("services").insert(payload);
        if (error) throw error;
      }

      await revalidatePortfolio();
      toast("Service saved", "success");
      setEditingService(null);
      fetchData();
    } catch (err: any) {
      toast(err.message || "Failed to save service", "error");
    }
  };

  // Save Experience
  const saveExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExperience) return;

    try {
      const supabase = createClient();
      const payload = {
        company: editingExperience.company || "",
        type: editingExperience.type || "",
        range: editingExperience.range || "",
        title: editingExperience.title || "",
        location: editingExperience.location || "",
        intro: editingExperience.intro || "",
        highlights: editingExperience.highlights || [],
        sort_order: editingExperience.sort_order ?? (experience.length + 1),
        published: editingExperience.published ?? true,
      };

      if (editingExperience.id) {
        const { error } = await supabase.from("experience").update(payload).eq("id", editingExperience.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("experience").insert(payload);
        if (error) throw error;
      }

      await revalidatePortfolio();
      toast("Experience entry saved", "success");
      setEditingExperience(null);
      fetchData();
    } catch (err: any) {
      toast(err.message || "Failed to save experience", "error");
    }
  };

  // Save Tech Category
  const saveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    try {
      const supabase = createClient();
      const payload = {
        category: editingCategory.category || "",
        sort_order: editingCategory.sort_order ?? (categories.length + 1),
        published: editingCategory.published ?? true,
      };

      if (editingCategory.id) {
        const { error } = await supabase.from("tech_stack_categories").update(payload).eq("id", editingCategory.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("tech_stack_categories").insert(payload);
        if (error) throw error;
      }

      await revalidatePortfolio();
      toast("Category saved", "success");
      setEditingCategory(null);
      fetchData();
    } catch (err: any) {
      toast(err.message || "Failed to save category", "error");
    }
  };

  // Save Tech Item
  const saveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      const supabase = createClient();
      const payload = {
        category_id: editingItem.categoryId,
        name: editingItem.item.name || "",
        sort_order: editingItem.item.sort_order ?? 1,
        published: editingItem.item.published ?? true,
      };

      if (editingItem.item.id) {
        const { error } = await supabase.from("tech_stack_items").update(payload).eq("id", editingItem.item.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("tech_stack_items").insert(payload);
        if (error) throw error;
      }

      await revalidatePortfolio();
      toast("Tech item saved", "success");
      setEditingItem(null);
      fetchData();
    } catch (err: any) {
      toast(err.message || "Failed to save tech item", "error");
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
          { id: "projects", label: `Projects (${projects.length})` },
          { id: "services", label: `Services (${services.length})` },
          { id: "experience", label: `Experience (${experience.length})` },
          { id: "techStack", label: `Tech Stack (${categories.length} categories)` },
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
      {/* 1. PROJECTS TAB */}
      {/* ========================================================================= */}
      {activeTab === "projects" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Portfolio Projects</h3>
            <button
              onClick={() =>
                setEditingProject({
                  title: "",
                  slug: "",
                  category: "Full-Stack & AI",
                  description: "",
                  tech: [],
                  live_url: "",
                  github_url: "",
                  featured: true,
                  thumbnail_url: "",
                  sort_order: projects.length + 1,
                  published: true,
                })
              }
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-xs rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Project</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {projects.map((p) => (
              <div
                key={p.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 hover:border-neutral-700 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {p.thumbnail_url ? (
                    <img
                      src={p.thumbnail_url}
                      alt={p.title}
                      className="w-16 h-12 rounded-lg object-cover bg-neutral-950 shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-12 rounded-lg bg-neutral-800 flex items-center justify-center text-xs font-mono text-neutral-500 shrink-0">
                      No Img
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-white text-sm">{p.title}</h4>
                      {p.featured && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          Featured
                        </span>
                      )}
                      {p.slug && (
                        <span className="text-[11px] font-mono text-neutral-500">
                          /{p.slug}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1">{p.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => togglePublish("projects", p.id, p.published)}
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

                  {p.slug && (
                    <button
                      onClick={() => openDetailEditor(p)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs transition-colors"
                      title="Edit or manage detailed case study page"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                      <span>Case Study</span>
                    </button>
                  )}

                  <button
                    onClick={() => setEditingProject(p)}
                    className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                    title="Edit project"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setDeleteTarget({ table: "projects", id: p.id, title: p.title })}
                    className="p-2 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                    title="Delete project"
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
      {/* 2. SERVICES TAB */}
      {/* ========================================================================= */}
      {activeTab === "services" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Services Offered</h3>
            <button
              onClick={() =>
                setEditingService({
                  title: "",
                  description: "",
                  sort_order: services.length + 1,
                  published: true,
                })
              }
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-xs rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Service</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {services.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between gap-4 p-4 rounded-xl border border-neutral-800 bg-neutral-900/50"
              >
                <div>
                  <h4 className="font-semibold text-white text-sm">{s.title}</h4>
                  <p className="text-xs text-neutral-400 mt-1">{s.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePublish("services", s.id, s.published)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      s.published
                        ? "bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 hover:bg-emerald-900/50"
                        : "bg-neutral-800/80 text-neutral-400 border border-neutral-700/50 hover:bg-neutral-800 hover:text-white"
                    }`}
                    title={s.published ? "Visible on site (click to hide)" : "Hidden from site (click to show)"}
                  >
                    {s.published ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-neutral-400" />}
                    <span>{s.published ? "Visible" : "Hidden"}</span>
                  </button>
                  <button
                    onClick={() => setEditingService(s)}
                    className="p-2 rounded-lg text-neutral-400 hover:text-white"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ table: "services", id: s.id, title: s.title })}
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
      {/* 3. EXPERIENCE TAB */}
      {/* ========================================================================= */}
      {activeTab === "experience" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Experience Timeline</h3>
            <button
              onClick={() =>
                setEditingExperience({
                  company: "",
                  type: "Full Time",
                  range: "2024 – Present",
                  title: "",
                  location: "",
                  intro: "",
                  highlights: [],
                  sort_order: experience.length + 1,
                  published: true,
                })
              }
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-xs rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Experience</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {experience.map((e) => (
              <div
                key={e.id}
                className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-white text-sm">{e.title}</h4>
                      <span className="text-xs text-amber-400 font-mono">@{e.company}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-neutral-800 text-neutral-400 font-mono">
                        {e.range}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-1">{e.intro}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => togglePublish("experience", e.id, e.published)}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        e.published
                          ? "bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 hover:bg-emerald-900/50"
                          : "bg-neutral-800/80 text-neutral-400 border border-neutral-700/50 hover:bg-neutral-800 hover:text-white"
                      }`}
                      title={e.published ? "Visible on site (click to hide)" : "Hidden from site (click to show)"}
                    >
                      {e.published ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-neutral-400" />}
                      <span>{e.published ? "Visible" : "Hidden"}</span>
                    </button>
                    <button
                      onClick={() => setEditingExperience(e)}
                      className="p-2 rounded-lg text-neutral-400 hover:text-white"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ table: "experience", id: e.id, title: e.company })}
                      className="p-2 rounded-lg text-neutral-400 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {e.highlights && e.highlights.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 text-xs text-neutral-400 pl-2">
                    {e.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. TECH STACK TAB */}
      {/* ========================================================================= */}
      {activeTab === "techStack" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Tech Stack Categories</h3>
            <button
              onClick={() =>
                setEditingCategory({
                  category: "",
                  sort_order: categories.length + 1,
                  published: true,
                })
              }
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-xs rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-sm">{cat.category}</span>
                    <span className="text-[10px] font-mono text-neutral-500">
                      ({cat.items?.length || 0} items)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => togglePublish("tech_stack_categories", cat.id, cat.published)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium transition-all ${
                        cat.published
                          ? "bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 hover:bg-emerald-900/50"
                          : "bg-neutral-800/80 text-neutral-400 border border-neutral-700/50 hover:bg-neutral-800 hover:text-white"
                      }`}
                      title={cat.published ? "Category is visible (click to hide)" : "Category is hidden (click to show)"}
                    >
                      {cat.published ? <Eye className="w-3 h-3 text-emerald-400" /> : <EyeOff className="w-3 h-3 text-neutral-400" />}
                      <span>{cat.published ? "Visible" : "Hidden"}</span>
                    </button>
                    <button
                      onClick={() =>
                        setEditingItem({
                          categoryId: cat.id,
                          item: { name: "", sort_order: (cat.items?.length || 0) + 1, published: true },
                        })
                      }
                      className="p-1.5 text-xs text-amber-400 hover:text-amber-300"
                      title="Add item"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingCategory(cat)}
                      className="p-1.5 text-xs text-neutral-400 hover:text-white"
                      title="Edit category"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ table: "tech_stack_categories", id: cat.id, title: cat.category })}
                      className="p-1.5 text-xs text-neutral-400 hover:text-rose-400"
                      title="Delete category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(cat.items || []).map((item) => (
                    <span
                      key={item.id}
                      className={`group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs border transition-all ${
                        item.published
                          ? "bg-neutral-800 text-neutral-200 border-neutral-700/50"
                          : "bg-neutral-950 text-neutral-500 border-dashed border-neutral-800 opacity-60"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => togglePublish("tech_stack_items", item.id, item.published)}
                        title={item.published ? "Click to hide item" : "Click to show item"}
                        className="hover:text-amber-400"
                      >
                        {item.published ? (
                          <Eye className="w-3 h-3 text-emerald-400/80" />
                        ) : (
                          <EyeOff className="w-3 h-3 text-neutral-500" />
                        )}
                      </button>
                      <span className={item.published ? "" : "line-through"}>{item.name}</span>
                      <button
                        onClick={() => setDeleteTarget({ table: "tech_stack_items", id: item.id, title: item.name })}
                        className="opacity-40 group-hover:opacity-100 hover:text-rose-400 ml-0.5"
                        title="Delete item"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Project Create / Edit */}
      {/* ========================================================================= */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl my-8 space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-lg font-bold text-white">
                {editingProject.id ? "Edit Project" : "Create New Project"}
              </h3>
              <button
                onClick={() => setEditingProject(null)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={saveProject} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold uppercase text-neutral-400">Title</label>
                  <input
                    type="text"
                    required
                    value={editingProject.title || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-neutral-400">Slug (URL)</label>
                  <input
                    type="text"
                    value={editingProject.slug || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                    placeholder="e.g. look-atlas"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-neutral-400">Category</label>
                  <input
                    type="text"
                    required
                    value={editingProject.category || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    placeholder="Full-Stack · AI"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold uppercase text-neutral-400">Description</label>
                  <textarea
                    rows={3}
                    required
                    value={editingProject.description || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold uppercase text-neutral-400">
                    Tech Stack (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={(editingProject.tech || []).join(", ")}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        tech: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                      })
                    }
                    placeholder="React, TypeScript, Node.js, Supabase"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-neutral-400">Live URL</label>
                  <input
                    type="url"
                    value={editingProject.live_url || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, live_url: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-neutral-400">GitHub URL</label>
                  <input
                    type="url"
                    value={editingProject.github_url || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, github_url: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-neutral-400">Sort Order</label>
                  <input
                    type="number"
                    value={editingProject.sort_order ?? 0}
                    onChange={(e) => setEditingProject({ ...editingProject, sort_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm"
                  />
                </div>

                <div className="flex items-center gap-6 sm:col-span-2 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-300">
                    <input
                      type="checkbox"
                      checked={editingProject.featured ?? false}
                      onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                      className="rounded bg-neutral-950 border-neutral-800 text-amber-500 focus:ring-0"
                    />
                    <span>Featured Case Study</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-300">
                    <input
                      type="checkbox"
                      checked={editingProject.published ?? true}
                      onChange={(e) => setEditingProject({ ...editingProject, published: e.target.checked })}
                      className="rounded bg-neutral-950 border-neutral-800 text-amber-500 focus:ring-0"
                    />
                    <span>Published</span>
                  </label>
                </div>

                <div className="sm:col-span-2 pt-2">
                  <ImageUploader
                    label="Project Thumbnail / Screenshot"
                    value={editingProject.thumbnail_url}
                    folder="projects"
                    onChange={(url) => setEditingProject({ ...editingProject, thumbnail_url: url })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 text-sm text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-sm"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Case Study / Project Details Editor */}
      {/* ========================================================================= */}
      {editingDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl my-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Case Study: {editingDetail.projectTitle}
                </h3>
                <p className="text-xs text-neutral-400">Detailed breakdown, metrics, and architecture</p>
              </div>
              <button
                onClick={() => setEditingDetail(null)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={saveDetail} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-neutral-400">Problem Statement</label>
                <textarea
                  rows={3}
                  value={editingDetail.detail.problem || ""}
                  onChange={(e) =>
                    setEditingDetail({
                      ...editingDetail,
                      detail: { ...editingDetail.detail, problem: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm"
                  placeholder="Describe the challenge/pain point..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-neutral-400">Solution Delivered</label>
                <textarea
                  rows={3}
                  value={editingDetail.detail.solution || ""}
                  onChange={(e) =>
                    setEditingDetail({
                      ...editingDetail,
                      detail: { ...editingDetail.detail, solution: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm"
                  placeholder="Describe your architectural solution..."
                />
              </div>

              {/* Key Contributions */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-neutral-400">
                  Key Contributions (one per line)
                </label>
                <textarea
                  rows={4}
                  value={(editingDetail.detail.contributions || []).join("\n")}
                  onChange={(e) =>
                    setEditingDetail({
                      ...editingDetail,
                      detail: {
                        ...editingDetail.detail,
                        contributions: e.target.value.split("\n").filter(Boolean),
                      },
                    })
                  }
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs font-mono"
                  placeholder="Architected pipeline...&#10;Built endpoints...&#10;Implemented Stripe..."
                />
              </div>

              {/* Metrics */}
              <div className="space-y-3 border-t border-neutral-800 pt-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase text-neutral-400">
                    Impact Metrics (Value & Label)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const list = [...(editingDetail.detail.metrics || []), { value: "", label: "" }];
                      setEditingDetail({
                        ...editingDetail,
                        detail: { ...editingDetail.detail, metrics: list },
                      });
                    }}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
                  >
                    + Add Metric
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(editingDetail.detail.metrics || []).map((m, idx) => (
                    <div key={`metric-${idx}`} className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl space-y-2 relative group">
                      <button
                        type="button"
                        onClick={() => {
                          const list = (editingDetail.detail.metrics || []).filter((_, i) => i !== idx);
                          setEditingDetail({
                            ...editingDetail,
                            detail: { ...editingDetail.detail, metrics: list },
                          });
                          toast("Metric removed. Click Save Case Study to apply changes.", "info");
                        }}
                        className="absolute top-2 right-2 text-neutral-500 hover:text-rose-400 p-1 transition-colors"
                        title="Delete this metric"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="text"
                        value={m.value}
                        onChange={(e) => {
                          const list = [...(editingDetail.detail.metrics || [])];
                          list[idx] = { ...list[idx], value: e.target.value };
                          setEditingDetail({
                            ...editingDetail,
                            detail: { ...editingDetail.detail, metrics: list },
                          });
                        }}
                        placeholder="e.g. 99.9%"
                        className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white text-xs font-bold"
                      />
                      <input
                        type="text"
                        value={m.label}
                        onChange={(e) => {
                          const list = [...(editingDetail.detail.metrics || [])];
                          list[idx] = { ...list[idx], label: e.target.value };
                          setEditingDetail({
                            ...editingDetail,
                            detail: { ...editingDetail.detail, metrics: list },
                          });
                        }}
                        placeholder="e.g. Pipeline Uptime"
                        className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white text-xs"
                      />
                    </div>
                  ))}
                  {(editingDetail.detail.metrics || []).length === 0 && (
                    <p className="text-xs text-neutral-400 italic py-1 sm:col-span-3">
                      No impact metrics added yet. Click &quot;+ Add Metric&quot; to add numbers/stats.
                    </p>
                  )}
                </div>
              </div>

              {/* Key Features */}
              <div className="space-y-3 border-t border-neutral-800 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-semibold uppercase text-neutral-400">
                      Key Features
                    </label>
                    <p className="text-[11px] text-neutral-400">
                      Core architecture components and features
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const list = [
                        ...(editingDetail.detail.features || []),
                        { title: "", description: "", icon: "Sparkles" },
                      ];
                      setEditingDetail({
                        ...editingDetail,
                        detail: { ...editingDetail.detail, features: list },
                      });
                    }}
                    className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-medium bg-neutral-900 border border-neutral-800 px-2.5 py-1 rounded-lg"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Feature</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(editingDetail.detail.features || []).map((f, idx) => (
                    <div
                      key={`feature-${idx}`}
                      className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl space-y-2 relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-neutral-400">Feature #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const list = (editingDetail.detail.features || []).filter((_, i) => i !== idx);
                            setEditingDetail({
                              ...editingDetail,
                              detail: { ...editingDetail.detail, features: list },
                            });
                            toast("Feature removed. Click Save Case Study to apply changes.", "info");
                          }}
                          className="flex items-center gap-1 text-neutral-500 hover:text-rose-400 text-xs px-2 py-0.5 rounded transition-colors"
                          title="Delete Feature"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="sm:col-span-2">
                          <input
                            type="text"
                            value={f.title}
                            onChange={(e) => {
                              const list = [...(editingDetail.detail.features || [])];
                              list[idx] = { ...list[idx], title: e.target.value };
                              setEditingDetail({
                                ...editingDetail,
                                detail: { ...editingDetail.detail, features: list },
                              });
                            }}
                            placeholder="Feature Title (e.g. Multi-Provider AI)"
                            className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white text-xs font-semibold"
                          />
                        </div>
                        <div>
                          <select
                            value={f.icon || "Sparkles"}
                            onChange={(e) => {
                              const list = [...(editingDetail.detail.features || [])];
                              list[idx] = { ...list[idx], icon: e.target.value };
                              setEditingDetail({
                                ...editingDetail,
                                detail: { ...editingDetail.detail, features: list },
                              });
                            }}
                            className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-300 text-xs"
                          >
                            <option value="Sparkles">Sparkles (AI)</option>
                            <option value="Cpu">Cpu (Compute)</option>
                            <option value="Layers">Layers (Integration)</option>
                            <option value="Compass">Compass (Architecture)</option>
                          </select>
                        </div>
                      </div>
                      <textarea
                        rows={2}
                        value={f.description}
                        onChange={(e) => {
                          const list = [...(editingDetail.detail.features || [])];
                          list[idx] = { ...list[idx], description: e.target.value };
                          setEditingDetail({
                            ...editingDetail,
                            detail: { ...editingDetail.detail, features: list },
                          });
                        }}
                        placeholder="Feature description and technical implementation details..."
                        className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white text-xs"
                      />
                    </div>
                  ))}
                  {(editingDetail.detail.features || []).length === 0 && (
                    <p className="text-xs text-neutral-400 italic py-1">
                      No key features added yet. Click &quot;Add Feature&quot; to describe architecture blocks.
                    </p>
                  )}
                </div>
              </div>

              {/* Case Study Gallery Photos */}
              <div className="space-y-3 pt-2 border-t border-neutral-800">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-semibold uppercase text-neutral-400">
                      Gallery Images & Screenshots
                    </label>
                    <p className="text-[11px] text-neutral-400">
                      Upload, crop, and caption screenshots or architecture diagrams for the case study
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const list = [...(editingDetail.detail.gallery || []), { src: "", alt: "", caption: "", published: true }];
                      setEditingDetail({
                        ...editingDetail,
                        detail: { ...editingDetail.detail, gallery: list },
                      });
                    }}
                    className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-medium bg-neutral-900 border border-neutral-800 px-2.5 py-1 rounded-lg"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Photo</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {(editingDetail.detail.gallery || []).map((item, idx) => (
                    <div
                      key={`photo-${idx}-${item.src || "new"}`}
                      className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-neutral-400">Photo #{idx + 1}</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const list = [...(editingDetail.detail.gallery || [])];
                              list[idx] = { ...list[idx], published: !(item.published ?? true) };
                              setEditingDetail({
                                ...editingDetail,
                                detail: { ...editingDetail.detail, gallery: list },
                              });
                            }}
                            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border transition-colors ${
                              (item.published ?? true)
                                ? "text-emerald-400 bg-emerald-950/40 border-emerald-800/40 hover:bg-emerald-900/50"
                                : "text-neutral-500 bg-neutral-900 border-neutral-800 hover:text-white"
                            }`}
                            title={(item.published ?? true) ? "Click to hide photo" : "Click to show photo"}
                          >
                            {(item.published ?? true) ? (
                              <Eye className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <EyeOff className="w-3 h-3 text-neutral-400" />
                            )}
                            <span>{(item.published ?? true) ? "Visible" : "Hidden"}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteGalleryPhoto(idx)}
                            className="flex items-center gap-1 px-2.5 py-1 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-rose-900/40 rounded-lg transition-colors font-medium"
                            title="Delete this photo from case study and storage"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Photo</span>
                          </button>
                        </div>
                      </div>

                      <ImageUploader
                        label="Screenshot / Diagram"
                        value={item.src}
                        folder="projects"
                        onChange={async (url) => {
                          const list = [...(editingDetail.detail.gallery || [])];
                          // If replacing with a new image and old image was from Supabase Storage, delete old asset
                          if (url && item.src && item.src !== url) {
                            const supabase = createClient();
                            await deleteStorageFile(supabase, item.src);
                          }
                          list[idx] = { ...list[idx], src: url };
                          setEditingDetail({
                            ...editingDetail,
                            detail: { ...editingDetail.detail, gallery: list },
                          });
                        }}
                        helperText="Upload new image or crop/adjust current image (16:10 / 16:9 recommended)"
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] uppercase font-semibold text-neutral-400">Alt Title</label>
                          <input
                            type="text"
                            value={item.alt || ""}
                            onChange={(e) => {
                              const list = [...(editingDetail.detail.gallery || [])];
                              list[idx] = { ...list[idx], alt: e.target.value };
                              setEditingDetail({
                                ...editingDetail,
                                detail: { ...editingDetail.detail, gallery: list },
                              });
                            }}
                            placeholder="e.g. User Dashboard"
                            className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-semibold text-neutral-400">Caption / Description</label>
                          <input
                            type="text"
                            value={item.caption || ""}
                            onChange={(e) => {
                              const list = [...(editingDetail.detail.gallery || [])];
                              list[idx] = { ...list[idx], caption: e.target.value };
                              setEditingDetail({
                                ...editingDetail,
                                detail: { ...editingDetail.detail, gallery: list },
                              });
                            }}
                            placeholder="e.g. Personalized analytics and review management"
                            className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {(editingDetail.detail.gallery || []).length === 0 && (
                    <p className="text-xs text-neutral-400 italic py-2">
                      No gallery photos added yet. Click &quot;Add Photo&quot; to upload case study visuals.
                    </p>
                  )}
                </div>
              </div>

              {/* Case Study Modal Footer */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() =>
                    setDeleteTarget({
                      table: "project_details",
                      id: editingDetail.projectId,
                      title: `Case Study for "${editingDetail.projectTitle}"`,
                      isCaseStudy: true,
                    })
                  }
                  className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 hover:text-rose-300 border border-rose-800/40 rounded-xl text-xs font-semibold transition-colors"
                  title="Delete this entire case study page from the database"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Case Study</span>
                </button>

                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingDetail(null)}
                    className="px-4 py-2 text-sm text-neutral-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-sm shadow-md transition-all active:scale-95"
                  >
                    Save Case Study
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Service Create / Edit */}
      {/* ========================================================================= */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">
              {editingService.id ? "Edit Service" : "Add Service"}
            </h3>
            <form onSubmit={saveService} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-neutral-400">Title</label>
                <input
                  type="text"
                  required
                  value={editingService.title || ""}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-neutral-400">Description</label>
                <textarea
                  rows={3}
                  required
                  value={editingService.description || ""}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-neutral-400">Sort Order</label>
                <input
                  type="number"
                  value={editingService.sort_order ?? 0}
                  onChange={(e) => setEditingService({ ...editingService, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-300">
                <input
                  type="checkbox"
                  checked={editingService.published ?? true}
                  onChange={(e) => setEditingService({ ...editingService, published: e.target.checked })}
                  className="rounded bg-neutral-950 border-neutral-800 text-amber-500 focus:ring-0"
                />
                <span>Visible on live portfolio (Published)</span>
              </label>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 text-sm text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-sm"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Experience Create / Edit */}
      {/* ========================================================================= */}
      {editingExperience && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl my-8 space-y-4">
            <h3 className="text-lg font-bold text-white">
              {editingExperience.id ? "Edit Experience" : "Add Experience"}
            </h3>
            <form onSubmit={saveExperience} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-neutral-400">Company</label>
                  <input
                    type="text"
                    required
                    value={editingExperience.company || ""}
                    onChange={(e) => setEditingExperience({ ...editingExperience, company: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-neutral-400">Job Title / Role</label>
                  <input
                    type="text"
                    required
                    value={editingExperience.title || ""}
                    onChange={(e) => setEditingExperience({ ...editingExperience, title: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-neutral-400">Period / Range</label>
                  <input
                    type="text"
                    required
                    value={editingExperience.range || ""}
                    onChange={(e) => setEditingExperience({ ...editingExperience, range: e.target.value })}
                    placeholder="07/2024 – Present"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-neutral-400">Location</label>
                  <input
                    type="text"
                    value={editingExperience.location || ""}
                    onChange={(e) => setEditingExperience({ ...editingExperience, location: e.target.value })}
                    placeholder="Peshawar, PK / Remote"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold uppercase text-neutral-400">Intro</label>
                  <textarea
                    rows={2}
                    value={editingExperience.intro || ""}
                    onChange={(e) => setEditingExperience({ ...editingExperience, intro: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold uppercase text-neutral-400">
                    Highlights (one per line)
                  </label>
                  <textarea
                    rows={4}
                    value={(editingExperience.highlights || []).join("\n")}
                    onChange={(e) =>
                      setEditingExperience({
                        ...editingExperience,
                        highlights: e.target.value.split("\n").filter(Boolean),
                      })
                    }
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs font-mono"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-300">
                <input
                  type="checkbox"
                  checked={editingExperience.published ?? true}
                  onChange={(e) => setEditingExperience({ ...editingExperience, published: e.target.checked })}
                  className="rounded bg-neutral-950 border-neutral-800 text-amber-500 focus:ring-0"
                />
                <span>Visible on live portfolio (Published)</span>
              </label>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingExperience(null)}
                  className="px-4 py-2 text-sm text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-sm"
                >
                  Save Experience
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Category Create / Edit */}
      {/* ========================================================================= */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">
              {editingCategory.id ? "Edit Category" : "Add Tech Category"}
            </h3>
            <form onSubmit={saveCategory} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-neutral-400">Category Name</label>
                <input
                  type="text"
                  required
                  value={editingCategory.category || ""}
                  onChange={(e) => setEditingCategory({ ...editingCategory, category: e.target.value })}
                  placeholder="e.g. Frontend Development"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-neutral-400">Sort Order</label>
                <input
                  type="number"
                  value={editingCategory.sort_order ?? 0}
                  onChange={(e) => setEditingCategory({ ...editingCategory, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-300">
                <input
                  type="checkbox"
                  checked={editingCategory.published ?? true}
                  onChange={(e) => setEditingCategory({ ...editingCategory, published: e.target.checked })}
                  className="rounded bg-neutral-950 border-neutral-800 text-amber-500 focus:ring-0"
                />
                <span>Visible on live portfolio (Published)</span>
              </label>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
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

      {/* ========================================================================= */}
      {/* MODAL: Tech Item Add */}
      {/* ========================================================================= */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Add Tech Item</h3>
            <form onSubmit={saveItem} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-neutral-400">Technology Name</label>
                <input
                  type="text"
                  required
                  value={editingItem.item.name || ""}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      item: { ...editingItem.item, name: e.target.value },
                    })
                  }
                  placeholder="e.g. Next.js, PostgreSQL"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-300">
                <input
                  type="checkbox"
                  checked={editingItem.item.published ?? true}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      item: { ...editingItem.item, published: e.target.checked },
                    })
                  }
                  className="rounded bg-neutral-950 border-neutral-800 text-amber-500 focus:ring-0"
                />
                <span>Visible on live portfolio (Published)</span>
              </label>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 text-sm text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-sm"
                >
                  Add Item
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
        message={
          deleteTarget?.isCaseStudy
            ? "Are you sure you want to delete this case study? This will remove all detailed breakdown, architecture, metrics, and gallery photos from the database while keeping the main project card intact."
            : "Are you sure you want to delete this item? This action cannot be undone."
        }
        confirmLabel={deleteTarget?.isCaseStudy ? "Delete Case Study" : "Delete"}
        isLoading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
