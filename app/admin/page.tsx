"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ToastProvider } from "./components/Toast";
import { SettingsSection } from "./components/SettingsSection";
import { EngineerSection } from "./components/EngineerSection";
import { ResearchSection } from "./components/ResearchSection";
import { LifeSection } from "./components/LifeSection";
import {
  Code2,
  BookOpen,
  Coffee,
  Settings,
  LogOut,
  ExternalLink,
  Shield,
  Loader2,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [activePersona, setActivePersona] = useState<
    "settings" | "engineer" | "research" | "life"
  >("engineer");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          router.push("/admin/login");
          return;
        }

        setUser(session.user);
      } catch (err) {
        console.error("Auth check failed:", err);
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-neutral-400">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-amber-500 selection:text-neutral-950">
        {/* Top Navbar */}
        <header className="sticky top-0 z-40 bg-neutral-950/80 border-b border-neutral-800 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-neutral-950 font-bold font-mono text-sm">
                HR
              </div>
              <div>
                <h1 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                  <span>Portfolio CMS</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-neutral-800 text-neutral-400 border border-neutral-700">
                    Admin
                  </span>
                </h1>
                <p className="text-[11px] text-neutral-400 hidden sm:block">
                  {user?.email || "Authenticated Admin"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="/engineer"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors border border-neutral-800"
              >
                <span>View Live Site</span>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
              </a>

              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-300 hover:text-rose-200 hover:bg-rose-950/40 transition-colors border border-rose-900/30"
                title="Sign out of admin"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </header>

        {/* Persona Switcher Bar */}
        <div className="bg-neutral-900/60 border-b border-neutral-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5">
              {[
                { id: "engineer", label: "Engineer", icon: Code2, color: "text-amber-400" },
                { id: "research", label: "Research", icon: BookOpen, color: "text-emerald-400" },
                { id: "life", label: "Off the Clock", icon: Coffee, color: "text-rose-400" },
                { id: "settings", label: "Site Settings", icon: Settings, color: "text-blue-400" },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activePersona === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActivePersona(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all shrink-0 ${
                      isActive
                        ? "bg-neutral-800 text-white shadow-sm border border-neutral-700"
                        : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? tab.color : "text-neutral-500"}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {activePersona === "engineer" && <EngineerSection />}
          {activePersona === "research" && <ResearchSection />}
          {activePersona === "life" && <LifeSection />}
          {activePersona === "settings" && <SettingsSection />}
        </main>
      </div>
    </ToastProvider>
  );
}
