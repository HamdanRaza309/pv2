"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "./Toast";

interface ImageUploaderProps {
  label: string;
  value?: string | null;
  folder?: string;
  onChange: (url: string) => void;
  helperText?: string;
}

export function ImageUploader({
  label,
  value,
  folder = "uploads",
  onChange,
  helperText = "PNG, JPG, WebP, SVG up to 5MB",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    try {
      setUploading(true);
      const supabase = createClient();

      const ext = file.name.split(".").pop();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 20);
      const fileName = `${folder}/${Date.now()}_${sanitizedName}.${ext}`;

      const { data, error } = await supabase.storage
        .from("portfolio")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        throw error;
      }

      const { data: publicData } = supabase.storage
        .from("portfolio")
        .getPublicUrl(data.path);

      onChange(publicData.publicUrl);
      toast("Image uploaded successfully", "success");
    } catch (err: any) {
      console.error("Upload error:", err);
      toast(err.message || "Failed to upload image", "error");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400">
        {label}
      </label>

      {value ? (
        <div className="relative group inline-block rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 p-1">
          <div className="relative w-40 h-28 bg-neutral-900 rounded-lg overflow-hidden flex items-center justify-center">
            {/* If relative path starting with / or external URL */}
            <img
              src={value}
              alt={label}
              className="w-full h-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 p-1 bg-black/80 hover:bg-rose-600 rounded-full text-white transition-colors"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
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
                Click to upload image
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
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  );
}
