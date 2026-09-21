import Image from "next/image";
import type { LogoItem } from "@itsc/shared";
import { Container, Section } from "@/components/ui/section";

interface LogoGridProps {
  title?: string;
  eyebrow?: string;
  description?: string;
  logos: LogoItem[];
  className?: string;
}

export function LogoGrid({ title, eyebrow, description, logos, className }: LogoGridProps) {
  return (
    <Section className={className}>
      <Container>
        {title ? (
          <div className="mx-auto max-w-3xl text-center">
            {eyebrow ? <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-gold">{eyebrow}</p> : null}
            <h2 className="mt-3 font-serif text-4xl font-black leading-tight text-brand-ink sm:text-5xl">{title}</h2>
            {description ? <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-gray-500">{description}</p> : null}
          </div>
        ) : null}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6">
          {logos.map((logo) => {
            const content = (
              <Image
                src={logo.src}
                alt={logo.alt}
                width={152}
                height={76}
                sizes="(max-width: 639px) 42vw, (max-width: 1023px) 26vw, (max-width: 1279px) 20vw, 14vw"
                className="h-12 w-full object-contain opacity-70 grayscale transition duration-300 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0 sm:h-14"
              />
            );

            return logo.href ? (
              <a
                key={`${logo.alt}-${logo.href}`}
                href={logo.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-24 items-center justify-center rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-brand-gold/60 hover:shadow-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold sm:min-h-28"
                aria-label={`${logo.alt} (opens in a new tab)`}
              >
                {content}
              </a>
            ) : (
              <div
                key={logo.alt}
                className="group flex min-h-24 items-center justify-center rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:min-h-28"
              >
                {content}
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
