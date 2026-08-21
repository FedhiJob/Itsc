"use client";

import { useEffect, useState } from "react";
import { X, ZoomIn } from "lucide-react";
import type { GalleryImage } from "@itsc/shared";
import { siteConfig } from "@/config/site";

interface GalleryGridProps { images: GalleryImage[]; }

function imageUrl(src: string): string {
  if (!src.startsWith("/uploads/")) return src;
  return `${siteConfig.apiUrl.replace(/\/api\/v1$/, "")}${src}`;
}

export function GalleryGrid({ images }: GalleryGridProps) {
  const [selected, setSelected] = useState<GalleryImage | null>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setSelected(null); };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return <>
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((image, index) => (
        <button key={image.id} type="button" onClick={() => image.src && setSelected(image)} disabled={!image.src} className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 text-left shadow-card transition duration-300 hover:-translate-y-1 hover:border-brand-gold/60 disabled:cursor-default disabled:hover:translate-y-0">
          {image.src ? <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl(image.src)} alt={image.alt} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            <span className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-brand-ink/80 via-brand-ink/0 to-transparent p-5 opacity-0 transition group-hover:opacity-100"><span className="max-w-[80%] text-sm font-semibold text-white">{image.caption ?? image.alt}</span><ZoomIn aria-hidden="true" className="h-5 w-5 text-brand-gold" /></span>
          </> : <span className="flex h-full items-center justify-center bg-[linear-gradient(135deg,#10253f,#172033)] px-5 text-center text-sm font-semibold text-white/70">{image.alt || `Gallery image ${index + 1}`}</span>}
        </button>
      ))}
    </div>
    {selected?.src ? <div role="dialog" aria-modal="true" aria-label={selected.alt} className="fixed inset-0 z-[70] flex items-center justify-center bg-brand-ink/90 p-4" onClick={() => setSelected(null)}>
      <div className="relative max-h-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl(selected.src)} alt={selected.alt} className="max-h-[82vh] max-w-full rounded-xl object-contain" />
        <button type="button" onClick={() => setSelected(null)} className="absolute -right-2 -top-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-ink shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold" aria-label="Close image"><X aria-hidden="true" className="h-5 w-5" /></button>
        {selected.caption ? <p className="mt-3 text-center text-sm text-white/80">{selected.caption}</p> : null}
      </div>
    </div> : null}
  </>;
}
