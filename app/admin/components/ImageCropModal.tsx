"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Check,
  X,
  Loader2,
  Crop as CropIcon,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "./Toast";

export interface ImageCropModalProps {
  isOpen: boolean;
  imageSrc: string; // Blob URL or image URL
  fileName?: string;
  folder?: string;
  defaultAspectRatio?: number; // e.g. 16/10, 4/3, 1, 4/5, or 0 for free
  onClose: () => void;
  onCropComplete: (publicUrl: string) => void;
}

const ASPECT_RATIOS = [
  { label: "Free", value: 0 },
  { label: "16:10 (Projects)", value: 16 / 10 },
  { label: "16:9 (Landscape)", value: 16 / 9 },
  { label: "4:3 (Gallery)", value: 4 / 3 },
  { label: "1:1 (Square)", value: 1 },
  { label: "4:5 (Portrait)", value: 4 / 5 },
];

export function ImageCropModal({
  isOpen,
  imageSrc,
  fileName = "image",
  folder = "uploads",
  defaultAspectRatio = 16 / 10,
  onClose,
  onCropComplete,
}: ImageCropModalProps) {
  const [aspectRatio, setAspectRatio] = useState<number>(defaultAspectRatio);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [uploading, setUploading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const { toast } = useToast();

  // Reset controls when a new image opens
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setRotation(0);
      setOffset({ x: 0, y: 0 });
      setAspectRatio(defaultAspectRatio);
    }
  }, [isOpen, imageSrc, defaultAspectRatio]);

  // Drag pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Touch handlers for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: touch.clientX - offset.x, y: touch.clientY - offset.y });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    setOffset({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Perform crop on HTML5 Canvas and upload to Supabase Storage
  const handleConfirmCrop = async () => {
    if (!imgRef.current || !containerRef.current) return;

    try {
      setUploading(true);
      const img = imgRef.current;
      const container = containerRef.current;

      // Crop box bounds inside container
      const containerRect = container.getBoundingClientRect();

      let cropWidth = containerRect.width * 0.85;
      let cropHeight = containerRect.height * 0.85;

      if (aspectRatio > 0) {
        if (cropWidth / cropHeight > aspectRatio) {
          cropWidth = cropHeight * aspectRatio;
        } else {
          cropHeight = cropWidth / aspectRatio;
        }
      }

      // Create offscreen canvas for rendering high-res result
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(cropWidth * 2); // 2x retina sharpness
      canvas.height = Math.round(cropHeight * 2);
      const ctx = canvas.getContext("2d");

      if (!ctx) throw new Error("Could not create canvas context");

      // Fill transparent or dark background for non-square crops
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Translate context to center of crop canvas
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);

      // Render image factoring in zoom and offset
      const scale = (img.naturalWidth / img.width) * (canvas.width / cropWidth);
      const drawWidth = img.width * zoom * (canvas.width / cropWidth);
      const drawHeight = img.height * zoom * (canvas.height / cropHeight);

      const drawX = offset.x * (canvas.width / cropWidth) - drawWidth / 2;
      const drawY = offset.y * (canvas.height / cropHeight) - drawHeight / 2;

      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

      // Convert canvas to Blob
      const blob: Blob = await new Promise((resolve, reject) => {
        canvas.toBlob(
          (b) => {
            if (b) resolve(b);
            else reject(new Error("Canvas to Blob conversion failed"));
          },
          "image/webp",
          0.92
        );
      });

      // Upload to Supabase Storage
      const supabase = createClient();
      const sanitized = fileName.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 20);
      const uploadPath = `${folder}/${Date.now()}_${sanitized}_cropped.webp`;

      const { data, error } = await supabase.storage
        .from("portfolio")
        .upload(uploadPath, blob, {
          contentType: "image/webp",
          cacheControl: "3600",
          upsert: true,
        });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from("portfolio")
        .getPublicUrl(data.path);

      toast("Image cropped and uploaded successfully!", "success");
      onCropComplete(publicUrlData.publicUrl);
      onClose();
    } catch (err: any) {
      console.error("Crop error:", err);
      toast(err.message || "Failed to crop and upload image", "error");
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-4xl w-full h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <CropIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Crop &amp; Adjust Image</h3>
              <p className="text-xs text-neutral-400">Drag to reposition, zoom, rotate, and choose aspect ratio</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={uploading}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Aspect Ratio Toolbar */}
        <div className="px-5 py-2.5 bg-neutral-950 border-b border-neutral-800/80 flex items-center gap-2 overflow-x-auto shrink-0">
          <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 mr-1">
            Preset:
          </span>
          {ASPECT_RATIOS.map((ratio) => (
            <button
              key={ratio.label}
              type="button"
              onClick={() => setAspectRatio(ratio.value)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                aspectRatio === ratio.value
                  ? "bg-amber-500 text-neutral-950 font-bold"
                  : "bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800"
              }`}
            >
              {ratio.label}
            </button>
          ))}
        </div>

        {/* Interactive Viewport Area */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative flex-1 bg-neutral-950/90 overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
        >
          {/* Grid Overlay inside crop mask */}
          <div
            className="pointer-events-none absolute z-20 border-2 border-amber-500/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.7)] rounded-lg flex flex-col justify-between"
            style={{
              width: aspectRatio > 0 ? "min(80%, 80vh)" : "85%",
              aspectRatio: aspectRatio > 0 ? `${aspectRatio}` : "auto",
              height: aspectRatio > 0 ? "auto" : "85%",
            }}
          >
            {/* Rule of thirds lines */}
            <div className="w-full h-full grid grid-cols-3 grid-rows-3 pointer-events-none">
              <div className="border-r border-b border-white/20" />
              <div className="border-r border-b border-white/20" />
              <div className="border-b border-white/20" />
              <div className="border-r border-b border-white/20" />
              <div className="border-r border-b border-white/20" />
              <div className="border-b border-white/20" />
              <div className="border-r border-white/20" />
              <div className="border-r border-white/20" />
              <div />
            </div>
          </div>

          {/* Draggable & Scalable Image */}
          <img
            ref={imgRef}
            src={imageSrc}
            alt="To crop"
            crossOrigin="anonymous"
            draggable={false}
            className="max-w-none transition-transform duration-75 pointer-events-none"
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom}) rotate(${rotation}deg)`,
            }}
          />
        </div>

        {/* Bottom Controls Bar */}
        <div className="px-5 py-4 border-t border-neutral-800 bg-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-6 w-full sm:w-auto">
            {/* Zoom Slider */}
            <div className="flex items-center gap-2.5 flex-1 sm:w-64">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
                className="text-neutral-400 hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(3, z + 0.1))}
                className="text-neutral-400 hover:text-white"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono text-neutral-400 w-10 text-right">
                {Math.round(zoom * 100)}%
              </span>
            </div>

            {/* Rotate Button */}
            <button
              type="button"
              onClick={() => setRotation((r) => (r + 90) % 360)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors border border-neutral-800"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Rotate 90°</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmCrop}
              disabled={uploading}
              className="flex items-center gap-2 px-5 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading Cropped...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Apply &amp; Upload</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
