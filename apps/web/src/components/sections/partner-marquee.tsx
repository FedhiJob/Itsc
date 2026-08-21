import type { LogoItem } from "@itsc/shared";

interface PartnerMarqueeProps {
  logos: LogoItem[];
}

/** Text-first partner strip until approved partner logo files are added to the media library. */
export function PartnerMarquee({ logos }: PartnerMarqueeProps) {
  const items = [...logos, ...logos];

  return (
    <div className="itsc-marquee overflow-hidden border-y border-white/10 py-5" aria-label="ITSC international partners">
      <div className="itsc-marquee-track flex w-max items-center gap-3 pr-3">
        {items.map((logo, index) => (
          <span
            key={`${logo.alt}-${index}`}
            className="flex h-12 items-center rounded-full border border-white/15 bg-white/7 px-5 text-sm font-bold tracking-wide text-white/85"
          >
            {logo.alt}
          </span>
        ))}
      </div>
    </div>
  );
}
