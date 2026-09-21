import Image from "next/image";
import type { LogoItem } from "@itsc/shared";

interface PartnerMarqueeProps {
  logos: LogoItem[];
}

/** Continuously moving partner marks; duplicated items create a seamless leftward loop. */
export function PartnerMarquee({ logos }: PartnerMarqueeProps) {
  const items = [...logos, ...logos];

  return (
    <div className="itsc-marquee overflow-hidden" aria-label="ITSC international partners">
      <div className="itsc-marquee-track flex w-max items-stretch gap-3 pr-3">
        {items.map((logo, index) => (
          <a
            key={`${logo.alt}-${index}`}
            href={logo.href ?? undefined}
            target={logo.href ? "_blank" : undefined}
            rel={logo.href ? "noopener noreferrer" : undefined}
            aria-label={logo.href ? `${logo.alt} (opens in a new tab)` : logo.alt}
            className="group flex h-22 w-40 shrink-0 items-center justify-center rounded-2xl border border-brand-ink/10 bg-white px-5 py-4 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-gold/70 hover:shadow-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold sm:h-24 sm:w-44"
          >
            <Image
              src={logo.src}
              alt=""
              width={152}
              height={76}
              className="h-12 w-full object-contain transition duration-300 group-hover:scale-105 sm:h-14"
            />
          </a>
        ))}
      </div>
    </div>
  );
}
