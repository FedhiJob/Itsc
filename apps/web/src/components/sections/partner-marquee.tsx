"use client";

import { useState } from "react";
import Image from "next/image";
import { Pause, Play } from "lucide-react";
import type { LogoItem } from "@itsc/shared";

interface PartnerMarqueeProps {
  logos: LogoItem[];
}

/** Continuously moving partner marks with pause on hover/focus and edge fade mask. */
export function PartnerMarquee({ logos }: PartnerMarqueeProps) {
  const [isPaused, setIsPaused] = useState(false);
  const items = [...logos, ...logos];

  return (
    <div className="relative itsc-fade-edge-x group">
      <div
        className="itsc-marquee overflow-hidden py-1"
        aria-label="ITSC international partners"
      >
        <div
          className="itsc-marquee-track flex w-max items-stretch gap-3 pr-3"
          style={{ animationPlayState: isPaused ? "paused" : undefined }}
        >
          {items.map((logo, index) => (
            <a
              key={`${logo.alt}-${index}`}
              href={logo.href ?? undefined}
              target={logo.href ? "_blank" : undefined}
              rel={logo.href ? "noopener noreferrer" : undefined}
              aria-label={logo.href ? `${logo.alt} (opens in a new tab)` : logo.alt}
              className="itsc-press group/item flex h-20 w-36 sm:h-22 sm:w-42 shrink-0 items-center justify-center rounded-2xl border border-brand-ink/10 bg-white px-4 py-3 shadow-xs transition hover:border-brand-gold/70 hover:shadow-card focus-visible:outline-2 focus-visible:outline-brand-gold"
            >
              <Image
                src={logo.src}
                alt=""
                width={152}
                height={76}
                className="h-10 sm:h-12 w-full object-contain transition duration-300 group-hover/item:scale-105"
              />
            </a>
          ))}
        </div>
      </div>

      {/* Accessible Pause/Resume Toggle for Motion Sensitivities (ISSUE-PUB-04) */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity z-10 hidden sm:block">
        <button
          type="button"
          onClick={() => setIsPaused((prev) => !prev)}
          className="itsc-press rounded-full bg-white/90 p-2 text-gray-700 shadow-md backdrop-blur-xs border border-gray-200 hover:text-brand-ink"
          aria-label={isPaused ? "Resume partner marquee" : "Pause partner marquee"}
          title={isPaused ? "Resume animation" : "Pause animation"}
        >
          {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
}
