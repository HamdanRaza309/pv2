"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "./Toast";
import { ImageUploader } from "./ImageUploader";
import { revalidatePortfolio } from "@/app/admin/actions";
import { Loader2, Save, Plus, Trash2 } from "lucide-react";
import type { SiteSettings } from "@/lib/supabase/types";

export function SettingsSection() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
        setSettings({
          ...data,
          portrait_url: resolvedPortrait,
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const supabase = createClient();

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
        socials: settings.socials || {},
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
