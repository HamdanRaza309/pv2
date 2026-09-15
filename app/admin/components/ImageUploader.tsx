"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  X,
  Loader2,
  Crop as CropIcon,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { deleteStorageFile } from "@/lib/supabase/storage";
import { useToast } from "./Toast";
import { ImageCropModal } from "./ImageCropModal";

interface ImageUploaderProps {
  label: string;
  value?: string | null;
  folder?: string;
  defaultAspectRatio?: number; // e.g. 16/10 for projects, 4/5 for portrait, 4/3 for gallery
  onChange: (url: string) => void;
  helperText?: string;
}

export function ImageUploader({
  label,
  value,
  folder = "uploads",
  defaultAspectRatio = 16 / 10,
  onChange,
  helperText = "PNG, JPG, WebP, SVG up to 5MB",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (5MB = 5 * 1024 * 1024 bytes)
    if (file.size > 5242880) {
      toast("Image must be smaller than 5MB", "error");
      return;
    }

    // Validate type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      toast("Only JPG, PNG, WebP, GIF, or SVG images are supported", "error");
      return;
    }

    // Convert to object URL for crop preview
    const objectUrl = URL.createObjectURL(file);
    setImageToCrop(objectUrl);
    setCropModalOpen(true);
  };

  const handleCopyUrl = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    toast("Image URL copied to clipboard", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const openCropForExisting = () => {
    if (!value) return;
    setImageToCrop(value);
    setCropModalOpen(true);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400">
          {label}
        </label>
        {value && (
          <button
            type="button"
            onClick={handleCopyUrl}
            className="text-[11px] font-mono text-neutral-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? "Copied" : "Copy URL"}</span>
          </button>
        )}
      </div>

      {value ? (
        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 space-y-2.5 max-w-sm">
          <div className="relative w-full aspect-[16/10] bg-neutral-900 rounded-lg overflow-hidden flex items-center justify-center group">
            <img
              src={value}
              alt={label}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={openCropForExisting}
                className="px-3 py-1.5 bg-neutral-900/90 hover:bg-neutral-900 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-md border border-white/20"
                title="Crop & adjust this image"
              >
                <CropIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>Crop</span>
              </button>
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 bg-neutral-900/90 hover:bg-neutral-900 text-white rounded-lg shadow-md border border-white/20"
                title="Open in new tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={openCropForExisting}
                className="px-2.5 py-1 text-xs font-medium text-amber-400 hover:bg-amber-500/10 rounded-lg flex items-center gap-1.5 transition-colors border border-amber-500/20"
              >
                <CropIcon className="w-3.5 h-3.5" />
                <span>Crop / Adjust</span>
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 text-xs font-medium text-neutral-300 hover:bg-neutral-800 rounded-lg flex items-center gap-1.5 transition-colors border border-neutral-700/50"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Replace</span>
              </button>
            </div>

            <button
              type="button"
              onClick={async () => {
                if (value) {
                  const supabase = createClient();
                  await deleteStorageFile(supabase, value);
                }
                onChange("");
              }}
              className="p-1.5 text-neutral-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
              title="Remove image and delete from storage"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed border-neutral-800 hover:border-neutral-600 rounded-xl p-6 text-center cursor-pointer transition-colors bg-neutral-950/50 ${
            uploading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center justify-center gap-2 text-neutral-400">
              <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
              <span className="text-xs">Uploading image...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="p-3 bg-neutral-900 rounded-full text-neutral-400">
                <Upload className="w-5 h-5" />
              </div>
              <div className="text-xs font-medium text-neutral-300">
                Click to upload &amp; crop image
              </div>
              <div className="text-[11px] text-neutral-500">{helperText}</div>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp, image/gif, image/svg+xml"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Crop Modal */}
      {cropModalOpen && (
        <ImageCropModal
          isOpen={cropModalOpen}
          imageSrc={imageToCrop}
          folder={folder}
          defaultAspectRatio={defaultAspectRatio}
          onClose={() => {
            setCropModalOpen(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
          }}
          onCropComplete={(newUrl) => {
            onChange(newUrl);
            setCropModalOpen(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
          }}
        />
      )}
    </div>
  );
}
