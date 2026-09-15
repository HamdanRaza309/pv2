"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Upload,
  Crop as CropIcon,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  Loader2,
  Image as ImageIcon,
  Folder,
  RefreshCw,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "./Toast";
import { ConfirmModal } from "./ConfirmModal";
import { ImageCropModal } from "./ImageCropModal";

interface StorageFile {
  name: string;
  id?: string | null;
  updated_at?: string | null;
  created_at?: string | null;
  last_accessed_at?: string | null;
  metadata?: Record<string, any> | null;
  folder: string;
  publicUrl: string;
}

const FOLDERS = ["all", "projects", "gallery", "avatars", "hobbies", "uploads"];

export function MediaLibrary() {
  const [selectedFolder, setSelectedFolder] = useState<string>("all");
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Crop modal state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<{ src: string; name: string; folder: string } | null>(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<StorageFile | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const allFiles: StorageFile[] = [];

      const foldersToQuery =
        selectedFolder === "all"
          ? ["projects", "gallery", "avatars", "hobbies", "uploads", ""]
          : [selectedFolder];

      for (const f of foldersToQuery) {
        const { data, error } = await supabase.storage
          .from("portfolio")
          .list(f, {
            limit: 100,
            sortBy: { column: "created_at", order: "desc" },
          });

        if (!error && data) {
          data
            .filter((item) => item.name !== ".emptyFolderPlaceholder")
            .forEach((item) => {
              const fullPath = f ? `${f}/${item.name}` : item.name;
              const { data: publicUrlData } = supabase.storage
                .from("portfolio")
                .getPublicUrl(fullPath);

              allFiles.push({
                ...item,
                folder: f || "root",
                publicUrl: publicUrlData.publicUrl,
              });
            });
        }
      }

      setFiles(allFiles);
    } catch (err: any) {
      console.error("Failed to load storage files:", err);
      toast(err.message || "Failed to load media files", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [selectedFolder]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5242880) {
      toast("Image must be smaller than 5MB", "error");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const targetFolder = selectedFolder === "all" ? "uploads" : selectedFolder;
    setImageToCrop({ src: objectUrl, name: file.name, folder: targetFolder });
    setCropModalOpen(true);
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    toast("Image URL copied to clipboard!", "success");
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const supabase = createClient();
      const filePath =
        deleteTarget.folder !== "root"
          ? `${deleteTarget.folder}/${deleteTarget.name}`
          : deleteTarget.name;

      const { error } = await supabase.storage.from("portfolio").remove([filePath]);
      if (error) throw error;

      toast("File deleted from storage", "success");
      setDeleteTarget(null);
      fetchFiles();
    } catch (err: any) {
      toast(err.message || "Failed to delete file", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Media &amp; Asset Library</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-neutral-800 text-neutral-400">
              {files.length} items
            </span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Upload, crop, preview, and manage images anywhere on your site
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchFiles}
            className="p-2 rounded-xl border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
            title="Refresh assets"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Upload New Image</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp, image/gif, image/svg+xml"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Folder Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {FOLDERS.map((folder) => (
          <button
            key={folder}
            onClick={() => setSelectedFolder(folder)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium capitalize transition-colors flex items-center gap-1.5 shrink-0 ${
              selectedFolder === folder
                ? "bg-neutral-800 text-amber-400 border border-amber-500/30"
                : "text-neutral-400 hover:text-white hover:bg-neutral-900 border border-transparent"
            }`}
          >
            <Folder className="w-3.5 h-3.5" />
            <span>{folder}</span>
          </button>
        ))}
      </div>

      {/* Grid of Images */}
      {loading ? (
        <div className="flex items-center justify-center py-24 text-neutral-400">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        </div>
      ) : files.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-800 bg-neutral-950/40 p-12 text-center">
          <div className="inline-flex p-4 rounded-full bg-neutral-900 text-neutral-500 mb-3">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h4 className="text-sm font-semibold text-white">No images in this folder</h4>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            Click &ldquo;Upload New Image&rdquo; above to crop and add photos to your Supabase storage.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {files.map((file) => {
            const isCopied = copiedUrl === file.publicUrl;
            return (
              <div
                key={file.name + file.folder}
                className="group relative rounded-xl border border-neutral-800 bg-neutral-900/60 hover:border-neutral-700 transition-all overflow-hidden flex flex-col justify-between"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-neutral-950 overflow-hidden flex items-center justify-center">
                  <img
                    src={file.publicUrl}
                    alt={file.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                    <button
                      type="button"
                      onClick={() =>
                        setImageToCrop({
                          src: file.publicUrl,
                          name: file.name,
                          folder: file.folder === "root" ? "uploads" : file.folder,
                        })
                      }
                      className="p-2 bg-neutral-900/90 hover:bg-neutral-900 text-white rounded-lg border border-white/20 text-xs flex items-center gap-1"
                      title="Crop & adjust"
                    >
                      <CropIcon className="w-3.5 h-3.5 text-amber-400" />
                    </button>
                    <a
                      href={file.publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-neutral-900/90 hover:bg-neutral-900 text-white rounded-lg border border-white/20"
                      title="Open full image"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Info & Actions */}
                <div className="p-2.5 space-y-2">
                  <div className="truncate">
                    <p className="text-xs font-semibold text-white truncate" title={file.name}>
                      {file.name}
                    </p>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                      {file.folder}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-1 pt-1 border-t border-neutral-800/60">
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(file.publicUrl)}
                      className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
                      title="Copy Public URL"
                    >
                      {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{isCopied ? "Copied" : "Copy URL"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteTarget(file)}
                      className="p-1 text-neutral-500 hover:text-rose-400 transition-colors rounded"
                      title="Delete from storage"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Crop Modal */}
      {imageToCrop && (
        <ImageCropModal
          isOpen={true}
          imageSrc={imageToCrop.src}
          fileName={imageToCrop.name}
          folder={imageToCrop.folder}
          onClose={() => {
            setImageToCrop(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
          }}
          onCropComplete={() => {
            setImageToCrop(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            fetchFiles();
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Image from Storage?"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? Any component referencing this URL will no longer be able to load it.`}
        isLoading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
