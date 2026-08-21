"use client";

import { useEffect, useRef, useState, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Reveal({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn("itsc-reveal", className)} data-revealed={revealed} {...props}>
      {children}
    </div>
  );
}
