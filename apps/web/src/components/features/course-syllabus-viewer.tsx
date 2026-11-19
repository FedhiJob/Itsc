"use client";

import { useState } from "react";
import { Download, FileText, Eye, X, ExternalLink, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CourseSyllabusViewerProps {
  title: string;
  code?: string | null | undefined;
  outlineText?: string | null | undefined;
  outlineFileUrl?: string | null | undefined;
}

export function CourseSyllabusViewer({
  title,
  code,
  outlineText,
  outlineFileUrl
}: CourseSyllabusViewerProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  if (!outlineText && !outlineFileUrl) {
    return null;
  }

  return (
    <section className="mt-10 rounded-2xl border border-brand-gold/25 bg-brand-gold/[0.04] p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-gold/15 pb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-gold-accessible">
            Curriculum &amp; Syllabus
          </p>
          <h3 className="mt-1 text-2xl font-bold text-brand-ink">Course Outline</h3>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {outlineFileUrl && (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewOpen(true)}
                className="itsc-press border-brand-gold/40 bg-white text-brand-ink hover:bg-brand-gold/10"
                aria-label="Preview syllabus in browser"
              >
                <Eye className="mr-1.5 h-4 w-4 text-brand-gold" />
                Preview Syllabus
              </Button>

              <Button
                asChild
                size="sm"
                className="itsc-press bg-brand-ink text-white hover:bg-brand-navy"
              >
                <a href={outlineFileUrl} target="_blank" rel="noopener noreferrer" download>
                  <Download className="mr-1.5 h-4 w-4" />
                  Download PDF
                </a>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Outline Content Body */}
      {outlineText && (
        <div className="mt-6 prose prose-slate max-w-none text-sm leading-7 text-gray-700 whitespace-pre-line">
          {outlineText}
        </div>
      )}

      {/* In-Browser PDF Syllabus Preview Modal (ISSUE-PUB-09) */}
      {isPreviewOpen && outlineFileUrl && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Official Syllabus Preview for ${title}`}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-brand-navy/70 backdrop-blur-md"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div
            className="itsc-popover-enter flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 bg-linear-to-r from-brand-navy to-brand-ink px-5 py-3.5 text-white">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-brand-gold/20 p-2">
                  <FileText className="h-5 w-5 text-brand-gold" />
                </div>
                <div>
                  <h4 className="text-sm font-bold truncate max-w-md">{title}</h4>
                  <p className="text-xs text-gray-300">
                    {code ? `Course Code: ${code} • ` : ""}Official Syllabus Document
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={outlineFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="itsc-press inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Open Fullscreen</span>
                </a>
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(false)}
                  className="itsc-press rounded-full p-2 text-white/80 hover:bg-white/20 hover:text-white"
                  aria-label="Close syllabus preview"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Embedded PDF Viewer */}
            <div className="flex-1 bg-gray-100 relative">
              <iframe
                src={`${outlineFileUrl}#toolbar=1&navpanes=0`}
                className="h-full w-full border-none"
                title={`Syllabus for ${title}`}
              />
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-5 py-3 text-xs text-gray-500">
              <span>Streaming directly from verified ITSC database storage.</span>
              <a
                href={outlineFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="font-bold text-brand-gold-accessible hover:underline inline-flex items-center gap-1"
              >
                <span>Direct Download</span>
                <Download className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
