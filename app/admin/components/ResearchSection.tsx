"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "./Toast";
import { ConfirmModal } from "./ConfirmModal";
import { revalidatePortfolio } from "@/app/admin/actions";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Save,
  X,
} from "lucide-react";
import type {
  ResearchBio,
  ResearchInterest,
  Publication,
  ResearchProject,
  Affiliation,
  Coursework,
} from "@/lib/supabase/types";

export function ResearchSection() {
  const [activeTab, setActiveTab] = useState<
    "bio" | "interests" | "publications" | "projects" | "affiliations" | "coursework"
  >("bio");
  const [loading, setLoading] = useState(true);
  const [savingBio, setSavingBio] = useState(false);
  const { toast } = useToast();

  // Data states
  const [bio, setBio] = useState<Partial<ResearchBio>>({
    headline: "",
    summary: "",
    published: true,
  });
  const [interests, setInterests] = useState<ResearchInterest[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [affiliations, setAffiliations] = useState<Affiliation[]>([]);
  const [coursework, setCoursework] = useState<Coursework[]>([]);

  // Modals
  const [editingInterest, setEditingInterest] = useState<Partial<ResearchInterest> | null>(null);
  const [editingPublication, setEditingPublication] = useState<Partial<Publication> | null>(null);
  const [editingProject, setEditingProject] = useState<Partial<ResearchProject> | null>(null);
  const [editingAffiliation, setEditingAffiliation] = useState<Partial<Affiliation> | null>(null);
  const [editingCoursework, setEditingCoursework] = useState<Partial<Coursework> | null>(null);

  // Delete modal
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

      const [bioRes, intRes, pubRes, projRes, affRes, courseRes] = await Promise.all([
        supabase.from("research_bio").select("*").eq("id", 1).maybeSingle(),
        supabase.from("research_interests").select("*").order("sort_order", { ascending: true }),
        supabase.from("publications").select("*").order("sort_order", { ascending: true }),
        supabase.from("research_projects").select("*").order("sort_order", { ascending: true }),
        supabase.from("affiliations").select("*").order("sort_order", { ascending: true }),
        supabase.from("coursework").select("*").order("sort_order", { ascending: true }),
      ]);

      if (bioRes.data) setBio(bioRes.data);
      if (intRes.data) setInterests(intRes.data);
      if (pubRes.data) setPublications(pubRes.data);
      if (projRes.data) setProjects(projRes.data);
      if (affRes.data) setAffiliations(affRes.data);
      if (courseRes.data) setCoursework(courseRes.data);
    } catch (err: any) {
      console.error("Fetch error:", err);
      toast(err.message || "Failed to load research data", "error");
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
        headline: bio.headline || "",
        summary: bio.summary || "",
        published: bio.published ?? true,
      };

      const { error } = await supabase.from("research_bio").upsert(payload);
      if (error) throw error;

      await revalidatePortfolio();
      toast("Research bio saved", "success");
    } catch (err: any) {
      toast(err.message || "Failed to save bio", "error");
    } finally {
      setSavingBio(false);
    }
  };

  // Save Interest
  const saveInterest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInterest) return;

    try {
      const supabase = createClient();
      const payload = {
        title: editingInterest.title || "",
        description: editingInterest.description || "",
        sort_order: editingInterest.sort_order ?? (interests.length + 1),
        published: editingInterest.published ?? true,
      };

      if (editingInterest.id) {
        const { error } = await supabase.from("research_interests").update(payload).eq("id", editingInterest.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("research_interests").insert(payload);
        if (error) throw error;
      }

      await revalidatePortfolio();
      toast("Interest saved", "success");
      setEditingInterest(null);
      fetchData();
    } catch (err: any) {
      toast(err.message || "Failed to save", "error");
    }
  };

  // Save Publication
  const savePublication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPublication) return;

    try {
      const supabase = createClient();
      const payload = {
        title: editingPublication.title || "",
        authors: editingPublication.authors || "",
        venue: editingPublication.venue || "",
        year: editingPublication.year || "",
        link: editingPublication.link || null,
        abstract: editingPublication.abstract || null,
        sort_order: editingPublication.sort_order ?? (publications.length + 1),
        published: editingPublication.published ?? true,
      };

      if (editingPublication.id) {
        const { error } = await supabase.from("publications").update(payload).eq("id", editingPublication.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("publications").insert(payload);
        if (error) throw error;
      }

      await revalidatePortfolio();
      toast("Publication saved", "success");
      setEditingPublication(null);
      fetchData();
    } catch (err: any) {
      toast(err.message || "Failed to save", "error");
    }
  };

  // Save Research Project
  const saveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      const supabase = createClient();
      const payload = {
        title: editingProject.title || "",
        status: editingProject.status || "In Progress",
        description: editingProject.description || "",
        collaborators: editingProject.collaborators || null,
        sort_order: editingProject.sort_order ?? (projects.length + 1),
        published: editingProject.published ?? true,
      };

      if (editingProject.id) {
        const { error } = await supabase.from("research_projects").update(payload).eq("id", editingProject.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("research_projects").insert(payload);
        if (error) throw error;
      }

      await revalidatePortfolio();
      toast("Project saved", "success");
      setEditingProject(null);
      fetchData();
    } catch (err: any) {
      toast(err.message || "Failed to save", "error");
    }
  };

  // Save Affiliation
  const saveAffiliation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAffiliation) return;

    try {
      const supabase = createClient();
      const payload = {
        institution: editingAffiliation.institution || "",
        role: editingAffiliation.role || "",
        period: editingAffiliation.period || "",
        description: editingAffiliation.description || null,
        sort_order: editingAffiliation.sort_order ?? (affiliations.length + 1),
        published: editingAffiliation.published ?? true,
      };

      if (editingAffiliation.id) {
        const { error } = await supabase.from("affiliations").update(payload).eq("id", editingAffiliation.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("affiliations").insert(payload);
        if (error) throw error;
      }

      await revalidatePortfolio();
      toast("Affiliation saved", "success");
      setEditingAffiliation(null);
      fetchData();
    } catch (err: any) {
      toast(err.message || "Failed to save", "error");
    }
  };

  // Save Coursework
  const saveCoursework = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCoursework) return;

    try {
      const supabase = createClient();
      const payload = {
        title: editingCoursework.title || "",
        institution: editingCoursework.institution || null,
        description: editingCoursework.description || null,
        sort_order: editingCoursework.sort_order ?? (coursework.length + 1),
        published: editingCoursework.published ?? true,
      };

      if (editingCoursework.id) {
        const { error } = await supabase.from("coursework").update(payload).eq("id", editingCoursework.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("coursework").insert(payload);
        if (error) throw error;
      }

      await revalidatePortfolio();
      toast("Coursework saved", "success");
      setEditingCoursework(null);
      fetchData();
    } catch (err: any) {
      toast(err.message || "Failed to save", "error");
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
          { id: "bio", label: "Research Bio" },
          { id: "interests", label: `Interests (${interests.length})` },
          { id: "publications", label: `Publications (${publications.length})` },
          { id: "projects", label: `Projects (${projects.length})` },
          { id: "affiliations", label: `Affiliations (${affiliations.length})` },
          { id: "coursework", label: `Coursework (${coursework.length})` },
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
      {/* 1. RESEARCH BIO TAB */}
      {/* ========================================================================= */}
      {activeTab === "bio" && (
        <form onSubmit={saveBio} className="space-y-6 max-w-3xl">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Research Page Header & Bio</h3>
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
                placeholder="e.g. Researcher & Aspiring Neuroscientist"
                className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-neutral-400">Research Summary</label>
              <textarea
                rows={5}
                required
                value={bio.summary || ""}
                onChange={(e) => setBio({ ...bio, summary: e.target.value })}
                placeholder="I explore the intersection of machine learning and neuroscience..."
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
      {/* 2. RESEARCH INTERESTS TAB */}
      {/* ========================================================================= */}
      {activeTab === "interests" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Research Focus Areas</h3>
            <button
              onClick={() =>
                setEditingInterest({
                  title: "",
                  description: "",
                  sort_order: interests.length + 1,
                  published: true,
                })
              }
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-xs rounded-xl"
            >
              <Plus className="w-4 h-4" />
              <span>Add Interest</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {interests.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 p-4 rounded-xl border border-neutral-800 bg-neutral-900/50"
              >
                <div>
                  <h4 className="font-semibold text-white text-sm">{item.title}</h4>
                  <p className="text-xs text-neutral-400 mt-1">{item.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePublish("research_interests", item.id, item.published)}
                    className={`p-2 rounded-lg text-xs ${item.published ? "text-emerald-400" : "text-neutral-500"}`}
                  >
                    {item.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setEditingInterest(item)}
                    className="p-2 rounded-lg text-neutral-400 hover:text-white"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ table: "research_interests", id: item.id, title: item.title })}
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
      {/* 3. PUBLICATIONS TAB */}
      {/* ========================================================================= */}
      {activeTab === "publications" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Publications & Papers</h3>
            <button
              onClick={() =>
                setEditingPublication({
                  title: "",
                  authors: "Hamdan Raza",
                  venue: "",
                  year: new Date().getFullYear().toString(),
                  link: "",
                  abstract: "",
                  sort_order: publications.length + 1,
                  published: true,
                })
              }
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-xs rounded-xl"
            >
              <Plus className="w-4 h-4" />
              <span>Add Publication</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {publications.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 space-y-2"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-white text-sm leading-snug">{p.title}</h4>
                    <p className="text-xs text-neutral-400 mt-1">{p.authors}</p>
                    <p className="text-xs text-amber-400/90 font-mono mt-0.5">
                      {p.venue} · {p.year}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => togglePublish("publications", p.id, p.published)}
                      className={`p-2 rounded-lg text-xs ${p.published ? "text-emerald-400" : "text-neutral-500"}`}
                    >
                      {p.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => setEditingPublication(p)}
                      className="p-2 rounded-lg text-neutral-400 hover:text-white"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ table: "publications", id: p.id, title: p.title })}
                      className="p-2 rounded-lg text-neutral-400 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {p.abstract && (
                  <p className="text-xs text-neutral-400/80 italic line-clamp-2 pt-1 border-t border-neutral-800/60">
                    "{p.abstract}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. RESEARCH PROJECTS TAB */}
      {/* ========================================================================= */}
      {activeTab === "projects" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Ongoing Research Projects</h3>
            <button
              onClick={() =>
                setEditingProject({
                  title: "",
                  status: "In Progress",
                  description: "",
                  collaborators: "",
                  sort_order: projects.length + 1,
                  published: true,
                })
              }
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-xs rounded-xl"
            >
              <Plus className="w-4 h-4" />
              <span>Add Project</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {projects.map((p) => (
              <div
                key={p.id}
                className="flex items-start justify-between gap-4 p-4 rounded-xl border border-neutral-800 bg-neutral-900/50"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-white text-sm">{p.title}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-neutral-800 text-amber-400 font-mono">
                      {p.status}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1">{p.description}</p>
                  {p.collaborators && (
                    <p className="text-[11px] text-neutral-500 font-mono mt-1">
                      Collaborators: {p.collaborators}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePublish("research_projects", p.id, p.published)}
                    className={`p-2 rounded-lg text-xs ${p.published ? "text-emerald-400" : "text-neutral-500"}`}
                  >
                    {p.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setEditingProject(p)}
                    className="p-2 rounded-lg text-neutral-400 hover:text-white"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ table: "research_projects", id: p.id, title: p.title })}
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
      {/* 5. AFFILIATIONS TAB */}
      {/* ========================================================================= */}
      {activeTab === "affiliations" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Lab & Academic Affiliations</h3>
            <button
              onClick={() =>
                setEditingAffiliation({
                  institution: "",
                  role: "",
                  period: "2024 – Present",
                  description: "",
                  sort_order: affiliations.length + 1,
                  published: true,
                })
              }
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-xs rounded-xl"
            >
              <Plus className="w-4 h-4" />
              <span>Add Affiliation</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {affiliations.map((a) => (
              <div
                key={a.id}
                className="flex items-start justify-between gap-4 p-4 rounded-xl border border-neutral-800 bg-neutral-900/50"
              >
                <div>
                  <h4 className="font-semibold text-white text-sm">{a.institution}</h4>
                  <p className="text-xs text-amber-400 font-mono mt-0.5">
                    {a.role} ({a.period})
                  </p>
                  {a.description && <p className="text-xs text-neutral-400 mt-1">{a.description}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePublish("affiliations", a.id, a.published)}
                    className={`p-2 rounded-lg text-xs ${a.published ? "text-emerald-400" : "text-neutral-500"}`}
                  >
                    {a.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setEditingAffiliation(a)}
                    className="p-2 rounded-lg text-neutral-400 hover:text-white"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ table: "affiliations", id: a.id, title: a.institution })}
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
      {/* 6. COURSEWORK TAB */}
      {/* ========================================================================= */}
      {activeTab === "coursework" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Relevant Coursework</h3>
            <button
              onClick={() =>
                setEditingCoursework({
                  title: "",
                  institution: "",
                  description: "",
                  sort_order: coursework.length + 1,
                  published: true,
                })
              }
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-xs rounded-xl"
            >
              <Plus className="w-4 h-4" />
              <span>Add Course</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {coursework.map((c) => (
              <div
                key={c.id}
                className="flex items-start justify-between gap-4 p-4 rounded-xl border border-neutral-800 bg-neutral-900/50"
              >
                <div>
                  <h4 className="font-semibold text-white text-sm">{c.title}</h4>
                  {c.institution && <p className="text-xs text-amber-400 font-mono mt-0.5">{c.institution}</p>}
                  {c.description && <p className="text-xs text-neutral-400 mt-1">{c.description}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePublish("coursework", c.id, c.published)}
                    className={`p-2 rounded-lg text-xs ${c.published ? "text-emerald-400" : "text-neutral-500"}`}
                  >
                    {c.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setEditingCoursework(c)}
                    className="p-2 rounded-lg text-neutral-400 hover:text-white"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ table: "coursework", id: c.id, title: c.title })}
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
      {/* MODALS */}
      {/* ========================================================================= */}

      {/* Interest Modal */}
      {editingInterest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">
              {editingInterest.id ? "Edit Interest" : "Add Interest"}
            </h3>
            <form onSubmit={saveInterest} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-neutral-400">Title</label>
                <input
                  type="text"
                  required
                  value={editingInterest.title || ""}
                  onChange={(e) => setEditingInterest({ ...editingInterest, title: e.target.value })}
                  placeholder="e.g. NeuroAI, Brain-Computer Interfaces"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-neutral-400">Description</label>
                <textarea
                  rows={3}
                  required
                  value={editingInterest.description || ""}
                  onChange={(e) => setEditingInterest({ ...editingInterest, description: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingInterest(null)}
                  className="px-4 py-2 text-sm text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-sm"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Publication Modal */}
      {editingPublication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl my-8 space-y-4">
            <h3 className="text-lg font-bold text-white">
              {editingPublication.id ? "Edit Publication" : "Add Publication"}
            </h3>
            <form onSubmit={savePublication} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-neutral-400">Paper Title</label>
                <input
                  type="text"
                  required
                  value={editingPublication.title || ""}
                  onChange={(e) => setEditingPublication({ ...editingPublication, title: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-neutral-400">Authors</label>
                <input
                  type="text"
                  required
                  value={editingPublication.authors || ""}
                  onChange={(e) => setEditingPublication({ ...editingPublication, authors: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-neutral-400">Venue / Journal</label>
                  <input
                    type="text"
                    required
                    value={editingPublication.venue || ""}
                    onChange={(e) => setEditingPublication({ ...editingPublication, venue: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-neutral-400">Year</label>
                  <input
                    type="text"
                    required
                    value={editingPublication.year || ""}
                    onChange={(e) => setEditingPublication({ ...editingPublication, year: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-neutral-400">Link (optional)</label>
                <input
                  type="url"
                  value={editingPublication.link || ""}
                  onChange={(e) => setEditingPublication({ ...editingPublication, link: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-neutral-400">Abstract (optional)</label>
                <textarea
                  rows={3}
                  value={editingPublication.abstract || ""}
                  onChange={(e) => setEditingPublication({ ...editingPublication, abstract: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingPublication(null)}
                  className="px-4 py-2 text-sm text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-sm"
                >
                  Save Publication
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Research Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">
              {editingProject.id ? "Edit Research Project" : "Add Research Project"}
            </h3>
            <form onSubmit={saveProject} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-neutral-400">Project Title</label>
                <input
                  type="text"
                  required
                  value={editingProject.title || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-neutral-400">Status</label>
                <input
                  type="text"
                  required
                  value={editingProject.status || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value })}
                  placeholder="In Progress, Writing Phase, Completed"
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
                <label className="text-xs font-semibold uppercase text-neutral-400">Collaborators (optional)</label>
                <input
                  type="text"
                  value={editingProject.collaborators || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, collaborators: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm"
                />
              </div>
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

      {/* Affiliation Modal */}
      {editingAffiliation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">
              {editingAffiliation.id ? "Edit Affiliation" : "Add Affiliation"}
            </h3>
            <form onSubmit={saveAffiliation} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-neutral-400">Institution / Lab</label>
                <input
                  type="text"
                  required
                  value={editingAffiliation.institution || ""}
                  onChange={(e) => setEditingAffiliation({ ...editingAffiliation, institution: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-neutral-400">Role</label>
                  <input
                    type="text"
                    required
                    value={editingAffiliation.role || ""}
                    onChange={(e) => setEditingAffiliation({ ...editingAffiliation, role: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-neutral-400">Period</label>
                  <input
                    type="text"
                    required
                    value={editingAffiliation.period || ""}
                    onChange={(e) => setEditingAffiliation({ ...editingAffiliation, period: e.target.value })}
                    placeholder="2024 – Present"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-neutral-400">Description (optional)</label>
                <textarea
                  rows={2}
                  value={editingAffiliation.description || ""}
                  onChange={(e) => setEditingAffiliation({ ...editingAffiliation, description: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingAffiliation(null)}
                  className="px-4 py-2 text-sm text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-sm"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Coursework Modal */}
      {editingCoursework && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">
              {editingCoursework.id ? "Edit Coursework" : "Add Coursework"}
            </h3>
            <form onSubmit={saveCoursework} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-neutral-400">Course / Topic Title</label>
                <input
                  type="text"
                  required
                  value={editingCoursework.title || ""}
                  onChange={(e) => setEditingCoursework({ ...editingCoursework, title: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-neutral-400">Institution / Platform</label>
                <input
                  type="text"
                  value={editingCoursework.institution || ""}
                  onChange={(e) => setEditingCoursework({ ...editingCoursework, institution: e.target.value })}
                  placeholder="e.g. NUST / Coursera"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-neutral-400">Description (optional)</label>
                <textarea
                  rows={2}
                  value={editingCoursework.description || ""}
                  onChange={(e) => setEditingCoursework({ ...editingCoursework, description: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-sm"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCoursework(null)}
                  className="px-4 py-2 text-sm text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-sm"
                >
                  Save
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
