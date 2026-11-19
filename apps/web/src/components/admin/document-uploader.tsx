"use client";

import { useRef, useState, type DragEvent } from "react";
import { CheckCircle2, FileText, Loader2, Trash2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminApi } from "@/lib/admin/api";

interface DocumentUploaderProps {
  value: string;
  onChange: (url: string) => void;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentUploader({ value, onChange }: DocumentUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileDetails, setFileDetails] = useState<{ name: string; size: string } | null>(null);

  async function upload(file: File | undefined) {
    if (!file) return;

    // Validate size (10 MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10 MB limit. Please select a smaller document.");
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const result = await adminApi.uploadDocument(file);
      onChange(result.url);
      setFileDetails({
        name: file.name,
        size: formatBytes(file.size)
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Document upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      upload(file);
    }
  }

  function handleRemove() {
    onChange("");
    setFileDetails(null);
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`rounded-xl border-2 border-dashed p-4.5 transition-all ${
        isDragging
          ? "border-brand-gold bg-brand-gold/10 ring-2 ring-brand-gold/20"
          : value
          ? "border-emerald-300 bg-emerald-50/20"
          : "border-gray-300 bg-gray-50/60 hover:bg-gray-50"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-48 flex-1">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-colors ${
              value
                ? "bg-emerald-100 text-emerald-800"
                : isDragging
                ? "bg-brand-gold text-brand-ink"
                : "bg-brand-gold/15 text-brand-ink"
            }`}
          >
            {value ? (
              <CheckCircle2 aria-hidden="true" className="h-5 w-5 text-emerald-700" />
            ) : (
              <FileText aria-hidden="true" className="h-5 w-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-gray-900">
                {fileDetails ? fileDetails.name : "Course Outline & Syllabus"}
              </p>
              {value && (
                <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 uppercase tracking-wide">
                  Attached • {fileDetails ? fileDetails.size : "Ready"}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Drag &amp; drop PDF or DOCX here, up to 10 MB.
            </p>
            {value ? (
              <div className="mt-1.5 flex items-center gap-2">
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand-navy hover:text-brand-ink underline"
                >
                  <span>Preview uploaded document</span>
                  <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="itsc-press"
          >
            {uploading ? (
              <>
                <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin text-brand-gold" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <UploadCloud aria-hidden="true" className="h-4 w-4" />
                <span>{value ? "Replace PDF" : "Upload Document"}</span>
              </>
            )}
          </Button>

          {value ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="itsc-press text-gray-500 hover:text-red-700"
            >
              <Trash2 aria-hidden="true" className="h-4 w-4" />
              <span>Remove</span>
            </Button>
          ) : null}
        </div>
      </div>

      {error ? (
        <p role="alert" className="mt-2.5 text-xs font-medium text-red-600 bg-red-50 p-2 rounded-md border border-red-200">
          {error}
        </p>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf,.docx"
        className="hidden"
        onChange={(event) => upload(event.target.files?.[0])}
      />
    </div>
  );
}
