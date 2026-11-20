import Link from "next/link";
import { ArrowRight, Clock, MapPin, Sparkles } from "lucide-react";
import { ImageContainer } from "@/lib/image";

interface TrainingCardProps {
  title: string;
  slug: string;
  code?: string | undefined;
  description: string;
  category: string;
  duration?: string | undefined;
  level?: string | undefined;
  delivery?: string | undefined;
  image?: { src: string; alt: string } | undefined;
}

export function TrainingCard({
  title,
  slug,
  code,
  description,
  category,
  duration,
  level,
  delivery,
  image
}: TrainingCardProps) {
  return (
    <Link
      href={`/training-programs/${slug}`}
      className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-brand-gold hover:shadow-card cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
      aria-label={`View details for ${title}`}
    >
      {/* Sleek Visual Banner Header */}
      <div className="relative h-24 sm:h-26 overflow-hidden bg-brand-ink shrink-0">
        {image ? (
          <>
            <ImageContainer
              src={image.src}
              alt={image.alt}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/90 via-brand-ink/40 to-transparent" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-brand-navy via-brand-ink to-brand-navy transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgb(254_189_1_/_0.35),transparent_40%)]" />
          </>
        )}

        {/* Brand sparkles accent */}
        <Sparkles
          aria-hidden="true"
          className="absolute bottom-2.5 right-3 h-4 w-4 text-brand-gold/80 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
        />

        {/* Vendor and Exam Code Badges */}
        <div className="absolute top-2.5 left-3 right-3 flex items-center justify-between gap-2">
          <span className="rounded-md bg-white/95 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-ink backdrop-blur-xs shadow-xs">
            {category}
          </span>
          {code ? (
            <span className="rounded-md bg-brand-gold px-2 py-0.5 font-mono text-[10px] font-bold text-brand-ink shadow-xs">
              {code}
            </span>
          ) : null}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4">
        <div>
          <h3 className="font-serif text-sm sm:text-base font-bold text-gray-900 group-hover:text-brand-navy transition-colors line-clamp-2 leading-snug">
            {title}
          </h3>
          <p className="mt-1.5 text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Course Attributes and Action */}
        <div className="mt-3">
          {(duration || level || delivery) ? (
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-gray-500">
              {duration ? (
                <span className="inline-flex items-center gap-1">
                  <Clock aria-hidden="true" className="h-3 w-3 text-brand-gold-accessible" />
                  {duration}
                </span>
              ) : null}
              {level ? (
                <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600">
                  {level}
                </span>
              ) : null}
              {delivery ? (
                <span className="inline-flex items-center gap-1 text-[10px] text-gray-400">
                  <MapPin aria-hidden="true" className="h-3 w-3" />
                  {delivery}
                </span>
              ) : null}
            </div>
          ) : null}

          {/* Action Link Row */}
          <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-brand-navy group-hover:text-brand-gold-700 transition-colors">
            <span>Explore Course</span>
            <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}
