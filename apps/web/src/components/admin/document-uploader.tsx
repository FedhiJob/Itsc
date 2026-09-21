"use client";

import { useRef, useState } from "react";
import { FileText, Loader2, Trash2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminApi } from "@/lib/admin/api";

interface DocumentUploaderProps {
  value: string;
  onChange: (url: string) => void;
}

export function DocumentUploader({ value, onChange }: DocumentUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const result = await adminApi.uploadDocument(file);
      onChange(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Document upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand-gold/15 text-brand-ink">
          <FileText aria-hidden="true" className="h-5 w-5" />
        </div>
        <div className="min-w-48 flex-1">
          <p className="text-sm font-medium text-gray-900">Course outline document</p>
          <p className="text-xs text-gray-500">PDF or DOCX, up to 10 MB.</p>
          {value ? <a href={value} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-xs font-medium text-brand-gold hover:text-brand-gold-600">View uploaded document</a> : null}
        </div>
        <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => inputRef.current?.click()}>
          {uploading ? <><Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> Uploading...</> : <><UploadCloud aria-hidden="true" className="h-4 w-4" /> {value ? "Replace" : "Upload"}</>}
        </Button>
        {value ? <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")}><Trash2 aria-hidden="true" className="h-4 w-4" /> Remove</Button> : null}
      </div>
      {error ? <p role="alert" className="mt-2 text-xs text-error">{error}</p> : null}
      <input ref={inputRef} type="file" accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf,.docx" className="hidden" onChange={(event) => upload(event.target.files?.[0])} />
    </div>
  );
}
