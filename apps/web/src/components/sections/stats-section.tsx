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
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} className="text-center" style={{ transitionDelay: `${index * 80}ms` }}>
              <AnimatedValue value={stat.value} />
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.12em] text-gray-700">{stat.label}</p>
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
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      const tick = (time: number) => {
        if (!start) start = time;
        const progress = Math.min((time - start) / 1100, 1);
        setDisplay(`${Math.round(target * (1 - Math.pow(1 - progress, 3)))}${suffix}`);
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
      observer.disconnect();
    }, { threshold: 0.5 });
    observer.observe(element);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [value]);

  return <p ref={ref} className="font-serif text-4xl font-black text-brand-gold sm:text-5xl">{display}</p>;
}
