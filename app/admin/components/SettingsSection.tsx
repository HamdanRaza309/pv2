"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "./Toast";
import { ImageUploader } from "./ImageUploader";
import { revalidatePortfolio } from "@/app/admin/actions";
import { Loader2, Save, Plus, Trash2, Eye, EyeOff, Layers } from "lucide-react";
import type { SiteSettings } from "@/lib/supabase/types";

export function SettingsSection() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [togglingAspectId, setTogglingAspectId] = useState<string | null>(null);
  const [settings, setSettings] = useState<Partial<SiteSettings>>({});
  const { toast } = useToast();

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        const isLegacy = !data.portrait_url || data.portrait_url.startsWith("/assets/");
        const resolvedPortrait = isLegacy
          ? "https://tnpbnridezldixmriner.supabase.co/storage/v1/object/public/portfolio/avatars/hamdan_cutout.png"
          : data.portrait_url;

        let parsedSocials = data.socials;
        if (typeof parsedSocials === "string") {
          try {
            parsedSocials = JSON.parse(parsedSocials);
          } catch {}
        }

        const enabledAspects =
          Array.isArray(data.enabled_aspects) && data.enabled_aspects.length > 0
            ? data.enabled_aspects
            : Array.isArray(parsedSocials?.enabled_aspects) && parsedSocials.enabled_aspects.length > 0
            ? parsedSocials.enabled_aspects
            : ["engineer", "research", "life"];

        setSettings({
          ...data,
          portrait_url: resolvedPortrait,
          enabled_aspects: enabledAspects,
        });
      }
    } catch (err: any) {
      console.error("Failed to load settings:", err);
      toast(err.message || "Failed to load site settings", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const toggleAspect = async (aspectId: string) => {
    const current = settings.enabled_aspects || ["engineer", "research", "life"];
    const isEnabled = current.includes(aspectId);
    if (isEnabled && current.length <= 1) {
      toast("At least one portfolio aspect must remain active.", "error");
      return;
    }

    const updated = isEnabled
      ? current.filter((id) => id !== aspectId)
      : [...current, aspectId];

    const updatedSocials = {
      ...(settings.socials || {}),
      enabled_aspects: updated,
    };

    // Optimistic UI update
    setSettings((prev) => ({
      ...prev,
      enabled_aspects: updated,
      socials: updatedSocials,
    }));

    try {
      setTogglingAspectId(aspectId);
      const supabase = createClient();
      const { error } = await supabase
        .from("site_settings")
        .update({
          socials: updatedSocials,
        })
        .eq("id", 1);

      if (error) throw error;

      await revalidatePortfolio();

      const aspectNames: Record<string, string> = {
        engineer: "The Engineer",
        research: "Research",
        life: "Off the Clock",
      };
      toast(
        `${aspectNames[aspectId] || aspectId} is now ${isEnabled ? "hidden" : "visible"} on site!`,
        "success"
      );
    } catch (err: any) {
      console.error("Failed to update aspect visibility:", err);
      toast(err.message || "Failed to update aspect visibility", "error");
      // Revert on failure
      setSettings((prev) => ({
        ...prev,
        enabled_aspects: current,
        socials: {
          ...(prev.socials || {}),
          enabled_aspects: current,
        },
      }));
    } finally {
      setTogglingAspectId(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const supabase = createClient();

      const enabledAspects =
        settings.enabled_aspects && settings.enabled_aspects.length > 0
          ? settings.enabled_aspects
          : ["engineer", "research", "life"];

      const payload = {
        id: 1,
        name: settings.name || "",
        initials: settings.initials || "HR",
        role: settings.role || "",
        tagline: settings.tagline || "",
        intro: settings.intro || "",
        location: settings.location || "",
        analytics: settings.analytics || "",
        availability: settings.availability || "",
        email: settings.email || "",
        resume_url: settings.resume_url || "",
        portrait_url: settings.portrait_url || null,
        socials: {
          ...(settings.socials || {}),
          enabled_aspects: enabledAspects,
        },
        about_paragraphs: settings.about_paragraphs || [],
      };

      const { error } = await supabase
        .from("site_settings")
        .upsert(payload);

      if (error) throw error;

      await revalidatePortfolio();
      toast("Site settings saved successfully!", "success");
    } catch (err: any) {
      console.error("Save error:", err);
      toast(err.message || "Failed to save settings", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleParagraphChange = (index: number, value: string) => {
    const list = [...(settings.about_paragraphs || [])];
    list[index] = value;
    setSettings((prev) => ({ ...prev, about_paragraphs: list }));
  };

  const addParagraph = () => {
    setSettings((prev) => ({
      ...prev,
      about_paragraphs: [...(prev.about_paragraphs || []), ""],
    }));
  };

  const removeParagraph = (index: number) => {
    const list = (settings.about_paragraphs || []).filter((_, i) => i !== index);
    setSettings((prev) => ({ ...prev, about_paragraphs: list }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-neutral-400">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  const activeAspectsCount = (settings.enabled_aspects || ["engineer", "research", "life"]).length;

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white">General & Site Settings</h2>
          <p className="text-sm text-neutral-400">Identity, contact details, bio, and social media links</p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold rounded-xl transition-colors shadow-lg shadow-amber-500/20 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? "Saving..." : "Save Settings"}</span>
        </button>
      </div>

      {/* Portfolio Aspects & Persona Visibility */}
      <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Portfolio Aspects Visibility</h3>
              <p className="text-xs text-neutral-400">
                Choose which personas are publicly visible on your site. If only 1 aspect is enabled, visitors will automatically land on it.
              </p>
            </div>
          </div>
          <div className="text-xs font-medium px-3 py-1 rounded-full bg-neutral-800 text-neutral-300 self-start sm:self-auto border border-neutral-700/50">
            {activeAspectsCount} / 3 Active
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {[
            {
              id: "engineer",
              title: "The Engineer",
              route: "/engineer",
              desc: "Full-stack systems, architecture, and production builds.",
            },
            {
              id: "research",
              title: "Research & Academia",
              route: "/research",
              desc: "NeuroAI, BCI studies, coursework, and publications.",
            },
            {
              id: "life",
              title: "Off the Clock",
              route: "/life",
              desc: "Hobbies, photo gallery, travel, and personal interests.",
            },
          ].map((aspect) => {
            const isVisible = (settings.enabled_aspects || ["engineer", "research", "life"]).includes(aspect.id);
            return (
              <div
                key={aspect.id}
                className={`flex flex-col justify-between p-4 rounded-xl border transition-all duration-200 ${
                  isVisible
                    ? "bg-neutral-800/40 border-neutral-700 shadow-sm"
                    : "bg-neutral-950/40 border-neutral-800/80 opacity-60 hover:opacity-80"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-white">{aspect.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-750">
                      {aspect.route}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">{aspect.desc}</p>
                </div>

                <div className="pt-4 mt-3 border-t border-neutral-800/80 flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                      isVisible
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-neutral-800 text-neutral-400 border border-neutral-700"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isVisible ? "bg-emerald-400 animate-pulse" : "bg-neutral-500"}`} />
                    {isVisible ? "Visible" : "Hidden"}
                  </span>

                  <button
                    type="button"
                    disabled={togglingAspectId === aspect.id}
                    onClick={() => toggleAspect(aspect.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors disabled:opacity-50 ${
                      isVisible
                        ? "bg-neutral-800 hover:bg-neutral-750 text-neutral-200 border border-neutral-700 hover:border-neutral-600"
                        : "bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    }`}
                  >
                    {togglingAspectId === aspect.id ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                        <span>Updating...</span>
                      </>
                    ) : isVisible ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Hide</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Show</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Full Name</label>
          <input
            type="text"
            value={settings.name || ""}
            onChange={(e) => setSettings({ ...settings, name: e.target.value })}
            className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-amber-500 text-sm"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Initials</label>
          <input
            type="text"
            value={settings.initials || ""}
            onChange={(e) => setSettings({ ...settings, initials: e.target.value })}
            className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-amber-500 text-sm"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Professional Role</label>
          <input
            type="text"
            value={settings.role || ""}
            onChange={(e) => setSettings({ ...settings, role: e.target.value })}
            className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-amber-500 text-sm"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Availability Status</label>
          <input
            type="text"
            value={settings.availability || ""}
            onChange={(e) => setSettings({ ...settings, availability: e.target.value })}
            className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-amber-500 text-sm"
            placeholder="Available for work"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Location</label>
          <input
            type="text"
            value={settings.location || ""}
            onChange={(e) => setSettings({ ...settings, location: e.target.value })}
            className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-amber-500 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Email Address</label>
          <input
            type="email"
            value={settings.email || ""}
            onChange={(e) => setSettings({ ...settings, email: e.target.value })}
            className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-amber-500 text-sm"
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Resume / CV URL</label>
          <input
            type="url"
            value={settings.resume_url || ""}
            onChange={(e) => setSettings({ ...settings, resume_url: e.target.value })}
            className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-amber-500 text-sm"
            placeholder="https://drive.google.com/..."
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Hero Tagline</label>
          <input
            type="text"
            value={settings.tagline || ""}
            onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
            className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-amber-500 text-sm"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Hero Short Intro</label>
          <textarea
            rows={3}
            value={settings.intro || ""}
            onChange={(e) => setSettings({ ...settings, intro: e.target.value })}
            className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-amber-500 text-sm resize-y"
          />
        </div>
      </div>

      {/* Portrait Upload */}
      <div className="border-t border-neutral-800 pt-6">
        <ImageUploader
          label="Hero Portrait Cutout Photo"
          value={settings.portrait_url}
          folder="avatars"
          defaultAspectRatio={4 / 5}
          published={(settings.socials as any)?.portrait_visible ?? true}
          onTogglePublished={(visible) => {
            setSettings((prev) => ({
              ...prev,
              socials: {
                ...(prev.socials || {}),
                portrait_visible: visible,
              },
            }));
          }}
          onChange={(url) => setSettings({ ...settings, portrait_url: url })}
          helperText="Upload transparent PNG cutout or photo for hero section (max 5MB)"
        />
      </div>

      {/* Social Links */}
      <div className="border-t border-neutral-800 pt-6 space-y-4">
        <h3 className="text-base font-semibold text-white">Social Profiles</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {["github", "linkedin", "facebook", "instagram"].map((key) => (
            <div key={key} className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">{key}</label>
              <input
                type="url"
                value={settings.socials?.[key] || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socials: { ...settings.socials, [key]: e.target.value },
                  })
                }
                placeholder={`https://${key}.com/...`}
                className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-amber-500 text-xs"
              />
            </div>
          ))}
        </div>
      </div>

      {/* About Paragraphs */}
      <div className="border-t border-neutral-800 pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-white">About Section Paragraphs</h3>
          <button
            type="button"
            onClick={addParagraph}
            className="flex items-center gap-1.5 text-xs text-amber-500 hover:text-amber-400 font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Paragraph</span>
          </button>
        </div>

        <div className="space-y-3">
          {(settings.about_paragraphs || []).map((p, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <textarea
                rows={3}
                value={p}
                onChange={(e) => handleParagraphChange(idx, e.target.value)}
                className="flex-1 px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-amber-500 text-xs leading-relaxed"
                placeholder={`Paragraph ${idx + 1}...`}
              />
              <button
                type="button"
                onClick={() => removeParagraph(idx)}
                className="p-2 text-neutral-500 hover:text-rose-400 transition-colors"
                title="Remove paragraph"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
