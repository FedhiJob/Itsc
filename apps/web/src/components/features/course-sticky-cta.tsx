"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CourseStickyCtaProps {
  title: string;
  slug: string;
  code?: string | null | undefined;
  duration?: string | null | undefined;
}

export function CourseStickyCta({
  title,
  slug,
  code,
  duration
}: CourseStickyCtaProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      // Show when scrolled down 280px past the initial hero
      if (window.scrollY > 280) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="itsc-popover-enter fixed bottom-16 inset-x-0 z-30 lg:hidden border-t border-brand-gold/20 bg-white/95 px-4 py-2.5 shadow-xl backdrop-blur-md transition-all duration-300"
      aria-label="Quick enrollment actions"
    >
      <div className="mx-auto flex max-w-md items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            {code && (
              <span className="font-mono text-brand-ink bg-brand-gold/20 px-1 py-0.2 rounded">
                {code}
              </span>
            )}
            {duration && <span>• {duration}</span>}
          </div>
          <p className="truncate text-xs font-bold text-gray-900 leading-tight mt-0.5">
            {title}
          </p>
        </div>

        <Button
          asChild
          size="sm"
          className="itsc-press shrink-0 bg-brand-ink text-white hover:bg-brand-navy font-bold text-xs shadow-md"
        >
          <Link
            href={`/contact?subject=enrollment&source=${encodeURIComponent(`/training-programs/${slug}`)}&sourceLabel=${encodeURIComponent(title)}`}
          >
            <span>Enroll</span>
            <ArrowRight className="ml-1 h-3.5 w-3.5 text-brand-gold" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
