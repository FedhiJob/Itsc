"use client";

import { useEffect, useState, useRef } from "react";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryImage } from "@itsc/shared";
import { siteConfig } from "@/config/site";

interface GalleryGridProps {
  images: GalleryImage[];
}

function imageUrl(src: string): string {
  if (!src.startsWith("/uploads/")) return src;
  return `${siteConfig.apiUrl.replace(/\/api\/v1$/, "")}${src}`;
}

export function GalleryGrid({ images }: GalleryGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const touchStartXRef = useRef<number | null>(null);

  const selected = selectedIndex !== null ? images[selectedIndex] : null;

  function showNext() {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % images.length);
  }

  function showPrev() {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
  }

  // Keyboard navigation
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (selectedIndex === null) return;
      if (event.key === "Escape") setSelectedIndex(null);
      else if (event.key === "ArrowRight") showNext();
      else if (event.key === "ArrowLeft") showPrev();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [selectedIndex, images.length]);

  // Touch swipe support (INT-DLG-01)
  function handleTouchStart(e: React.TouchEvent) {
    touchStartXRef.current = e.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartXRef.current === null) return;
    const endX = e.changedTouches[0]?.clientX;
    if (endX === undefined) return;
    const deltaX = endX - touchStartXRef.current;
    touchStartXRef.current = null;

    if (deltaX > 45) {
      // Swiped right -> Previous image
      showPrev();
    } else if (deltaX < -45) {
      // Swiped left -> Next image
      showNext();
    }
  }

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => image.src && setSelectedIndex(index)}
            disabled={!image.src}
            className="itsc-press group relative aspect-[4/3] overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 text-left shadow-card transition duration-300 hover:-translate-y-1 hover:border-brand-gold/60 disabled:cursor-default disabled:hover:translate-y-0"
          >
            {image.src ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl(image.src)}
                  alt={image.alt}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-brand-ink/80 via-brand-ink/0 to-transparent p-5 opacity-0 transition group-hover:opacity-100">
                  <span className="max-w-[80%] text-sm font-semibold text-white">
                    {image.caption ?? image.alt}
                  </span>
                  <ZoomIn aria-hidden="true" className="h-5 w-5 text-brand-gold" />
                </span>
              </>
            ) : (
              <span className="flex h-full items-center justify-center bg-[linear-gradient(135deg,#10253f,#172033)] px-5 text-center text-sm font-semibold text-white/70">
                {image.alt || `Gallery image ${index + 1}`}
              </span>
            )}
          </button>
        ))}
      </div>

      {selected?.src && selectedIndex !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selected.alt}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-brand-navy/90 backdrop-blur-md p-4 select-none"
          onClick={() => setSelectedIndex(null)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="itsc-popover-enter relative flex flex-col items-center max-h-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Top controls */}
            <div className="w-full flex items-center justify-between pb-3 text-white/80 text-xs">
              <span className="font-mono bg-white/10 px-2.5 py-1 rounded-full">
                {selectedIndex + 1} / {images.length}
              </span>

              <button
                type="button"
                onClick={() => setSelectedIndex(null)}
                className="itsc-press inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30"
                aria-label="Close image lightbox"
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>

            {/* Main Image with Navigation Arrows */}
            <div className="relative flex items-center justify-center">
              {/* Previous Button */}
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={showPrev}
                  className="itsc-press absolute left-2 sm:-left-12 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white shadow-lg backdrop-blur-xs hover:bg-white/30"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              )}

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl(selected.src)}
                alt={selected.alt}
                className="max-h-[76vh] max-w-full rounded-2xl object-contain shadow-2xl"
              />

              {/* Next Button */}
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={showNext}
                  className="itsc-press absolute right-2 sm:-right-12 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white shadow-lg backdrop-blur-xs hover:bg-white/30"
                  aria-label="Next photo"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              )}
            </div>

            {selected.caption ? (
              <p className="mt-3 text-center text-sm font-medium text-white/90 max-w-lg">
                {selected.caption}
              </p>
            ) : null}

            <p className="mt-1 text-center text-[11px] text-white/50 hidden sm:block">
              Use &larr; / &rarr; arrow keys or swipe to browse photos • ESC to close
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
