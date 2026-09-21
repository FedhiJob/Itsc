// Server-safe helpers shared by public pages.

import { siteConfig } from "@/config/site";

/** Resolve an image src to an absolute URL (handles local /uploads/ fallback). */
export function resolveImageUrl(src: string): string {
  if (!src.startsWith("/uploads/")) return src;
  return `${siteConfig.apiUrl.replace(/\/api\/v1$/, "")}${src}`;
}

interface ImageContainerProps {
  src: string;
  alt: string;
  className?: string;
}

/**
 * Consistent image container used across cards and detail heroes.
 * Renders the uploaded image with object-cover inside a fixed-size frame.
 */
export function ImageContainer({ src, alt, className = "" }: ImageContainerProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolveImageUrl(src)}
      alt={alt}
      loading="lazy"
      className={`h-full w-full object-cover ${className}`}
    />
  );
}