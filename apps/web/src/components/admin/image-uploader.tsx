"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminApi } from "@/lib/admin/api";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  accept?: string;
}

export function ImageUploader({
  value,
  onChange,
  label = "Image",
  accept = "image/jpeg,image/png,image/webp,image/gif,image/avif"
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const result = await adminApi.uploadImage(file);
      onChange(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-4">
        <div className="flex h-24 w-32 shrink-0 items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-gray-50">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="Preview" className="h-full w-full object-cover" />
          ) : (
            <ImagePlus aria-hidden="true" className="h-6 w-6 text-gray-400" />
          )}
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              {uploading ? (
                <>
                  <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <UploadCloud aria-hidden="true" className="h-4 w-4" />
                  Upload {label}
                </>
              )}
            </Button>
            {value ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onChange("")}
              >
                <Trash2 aria-hidden="true" className="h-4 w-4" />
                Remove
              </Button>
            ) : null}
          </div>
          <p className="text-xs text-gray-500">
            JPEG, PNG, WebP, GIF or AVIF. Max 10 MB.
          </p>
          {error ? (
            <p role="alert" className="text-xs text-error">
              {error}
            </p>
          ) : null}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}