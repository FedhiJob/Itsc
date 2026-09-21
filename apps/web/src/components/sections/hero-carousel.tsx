"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { HomepageContent } from "@itsc/shared";
import { Button } from "@/components/ui/button";

type HeroContent = HomepageContent["hero"];

interface Slide {
  src: string;
  alt: string;
  eyebrow: string;
  title: string;
  description: string;
}

const slides: Slide[] = [
  {
    src: "/carousel/image-0.jpg",
    alt: "ITSC Technology Support visual identity with connected technology imagery",
    eyebrow: "ITSC Technology Support",
    title: "Build the skills that move technology forward.",
    description: "Practical technology training, certification, and enterprise support for ambitious professionals and organizations."
  },
  {
    src: "/carousel/image-1.jpg",
    alt: "Instructor leading a technology training session at ITSC",
    eyebrow: "Practical learning",
    title: "Learn from practice. Lead with confidence.",
    description: "Instructor-led training environments that connect technical knowledge with the work professionals do every day."
  },
  {
    src: "/carousel/image-2.jpg",
    alt: "Technology professionals collaborating with advanced digital tools",
    eyebrow: "Corporate capability",
    title: "Build capability for what comes next.",
    description: "Custom technology learning and advisory support that helps organizations develop teams ready for change."
  },
  {
    src: "/carousel/image-3.jpg",
    alt: "Digital illustration representing training and professional development",
    eyebrow: "Career-ready training",
    title: "Training designed for real progress.",
    description: "Internationally aligned pathways, hands-on learning, and certification preparation for meaningful advancement."
  },
  {
    src: "/carousel/image-4.jpg",
    alt: "Digital illustration representing professional skills development",
    eyebrow: "Professional growth",
    title: "Skills that create opportunity.",
    description: "From foundational technology knowledge to specialist expertise, ITSC helps learners and teams move forward."
  }
];

const AUTO_ADVANCE_MS = 7000;

export function HeroCarousel({ hero }: { hero: HeroContent }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotionPreference = () => setReduceMotion(media.matches);
    syncMotionPreference();
    media.addEventListener("change", syncMotionPreference);
    return () => media.removeEventListener("change", syncMotionPreference);
  }, []);

  useEffect(() => {
    if (isPaused || reduceMotion) return;
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(interval);
  }, [isPaused, reduceMotion]);

  const goTo = (index: number) => setActiveIndex((index + slides.length) % slides.length);
  const activeSlide = slides[activeIndex];
  if (!activeSlide) return null;

  return (
    <section
      className="relative isolate min-h-[38rem] overflow-hidden bg-brand-navy text-white sm:min-h-[42rem] lg:min-h-[46rem]"
      aria-roledescription="carousel"
      aria-label="ITSC highlights"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
      }}
      onTouchStart={(event) => {
        touchStartX.current = event.changedTouches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        const startX = touchStartX.current;
        const endX = event.changedTouches[0]?.clientX;
        touchStartX.current = null;
        if (startX === null || endX === undefined || Math.abs(endX - startX) < 50) return;
        goTo(activeIndex + (endX < startX ? 1 : -1));
      }}
    >
      {slides.map((slide, index) => (
        <div
          key={slide.src}
          aria-hidden={index !== activeIndex}
          className={`absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${index === activeIndex ? "opacity-100" : "pointer-events-none opacity-0"}`}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(10_25_45_/_0.92)_0%,rgb(16_37_63_/_0.8)_35%,rgb(16_37_63_/_0.34)_68%,rgb(16_37_63_/_0.56)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgb(10_25_45_/_0.55),transparent_42%)]" />

      <div className="relative mx-auto flex min-h-[38rem] max-w-7xl items-center px-5 py-24 sm:min-h-[42rem] sm:px-8 lg:min-h-[46rem] lg:px-12">
        <div className="max-w-3xl">
          <p className="inline-flex rounded-full border border-brand-gold/50 bg-brand-gold/12 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-brand-gold">
            {activeSlide.eyebrow}
          </p>
          <h1 className="mt-6 font-serif text-5xl font-black leading-[1.04] tracking-tight text-white sm:text-6xl lg:text-7xl">
            {activeIndex === 0 ? hero.title : activeSlide.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/84 sm:text-xl">
            {activeIndex === 0 ? hero.subtitle : activeSlide.description}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href={hero.primaryCta.href}>
                {hero.primaryCta.label}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </Button>
            {hero.secondaryCta ? (
              <Button asChild variant="outline" size="lg" className="border-white/35 bg-white/10 text-white hover:border-brand-gold hover:bg-brand-gold hover:text-brand-ink">
                <Link href={hero.secondaryCta.href}>{hero.secondaryCta.label}</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 mx-auto flex max-w-7xl items-end justify-between gap-5 px-5 pb-7 sm:px-8 lg:px-12 lg:pb-9">
        <div className="flex items-center gap-2" role="tablist" aria-label="Choose a hero slide">
          {slides.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`Show slide ${index + 1}: ${slide.title}`}
              onClick={() => goTo(index)}
              className={`h-2.5 rounded-full transition-all focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold ${index === activeIndex ? "w-9 bg-brand-gold" : "w-2.5 bg-white/55 hover:bg-white"}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => goTo(activeIndex - 1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-brand-ink/35 text-white backdrop-blur transition hover:border-brand-gold hover:bg-brand-gold hover:text-brand-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold" aria-label="Previous slide">
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => setIsPaused((paused) => !paused)} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-brand-ink/35 text-white backdrop-blur transition hover:border-brand-gold hover:bg-brand-gold hover:text-brand-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold" aria-label={isPaused || reduceMotion ? "Play carousel" : "Pause carousel"}>
            {isPaused || reduceMotion ? <Play aria-hidden="true" className="h-4 w-4" /> : <Pause aria-hidden="true" className="h-4 w-4" />}
          </button>
          <button type="button" onClick={() => goTo(activeIndex + 1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-brand-ink/35 text-white backdrop-blur transition hover:border-brand-gold hover:bg-brand-gold hover:text-brand-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold" aria-label="Next slide">
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
