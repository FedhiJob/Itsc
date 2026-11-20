"use client";

import { useEffect, useRef, useState } from "react";
import type { Statistic } from "@itsc/shared";
import { Container, Section } from "@/components/ui/section";
import { Reveal } from "./reveal";

interface StatsSectionProps {
  stats: Statistic[];
  className?: string;
}

export function StatsSection({ stats, className }: StatsSectionProps) {
  return (
    <Section className={className}>
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {stats.map((stat, index) => (
            <Reveal
              key={stat.label}
              className="h-full"
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <div className="group relative flex h-full min-h-[168px] flex-col justify-center items-center text-center rounded-2xl border border-gray-200/80 bg-white p-7 sm:p-8 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-brand-gold/60 hover:shadow-card overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <AnimatedValue value={stat.value} />
                <p className="mt-3 text-xs sm:text-sm font-bold uppercase tracking-[0.1em] text-brand-navy leading-snug">
                  {stat.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

function AnimatedValue({ value }: { value: string }) {
  const [display, setDisplay] = useState(value);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const element = ref.current;
    const match = /^(\d+)(.*)$/.exec(value);
    if (!element || !match) return;
    const target = Number(match[1]);
    const suffix = match[2] ?? "";
    let frame = 0;
    let start = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        const tick = (time: number) => {
          if (!start) start = time;
          const progress = Math.min((time - start) / 1100, 1);
          setDisplay(`${Math.round(target * (1 - Math.pow(1 - progress, 3)))}${suffix}`);
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.5 }
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <p
      ref={ref}
      className="font-serif text-4xl sm:text-5xl font-black text-brand-gold tracking-tight"
    >
      {display}
    </p>
  );
}
