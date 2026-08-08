import Image from "next/image";
import type { LogoItem } from "@itsc/shared";
import { Container, Section } from "@/components/ui/section";

interface LogoGridProps {
  title?: string;
  logos: LogoItem[];
  className?: string;
}

export function LogoGrid({ title, logos, className }: LogoGridProps) {
  return (
    <Section className={className}>
      <Container>
        {title ? (
          <h2 className="text-center text-2xl font-bold text-gray-900">{title}</h2>
        ) : null}
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {logos.map((logo) => {
            const content = (
              <Image
                src={logo.src}
                alt={logo.alt}
                width={120}
                height={60}
                className="h-12 w-auto object-contain opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
              />
            );

            return logo.href ? (
              <a
                key={`${logo.alt}-${logo.href}`}
                href={logo.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center rounded-lg border border-gray-200 bg-white p-4"
                aria-label={`${logo.alt} (opens in a new tab)`}
              >
                {content}
              </a>
            ) : (
              <div
                key={logo.alt}
                className="flex items-center justify-center rounded-lg border border-gray-200 bg-white p-4"
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