import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";
import { aboutContent } from "@/lib/mock/about";
import { resolveIcon } from "@/lib/icons";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about ITSC Technology Support — our mission, vision, and commitment to professional technology training."
};

export default function AboutPage() {
  const { eyebrow, title, intro, values, cta } = aboutContent;

  return (
    <>
      <Section className="border-b border-gray-200 bg-white">
        <Container className="max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-gold">{eyebrow}</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
            {title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-500">{intro}</p>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {values.map((item) => {
              const Icon = resolveIcon(item.icon);
              return (
                <article
                  key={item.title}
                  className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
                >
                  {Icon ? <Icon aria-hidden="true" className="h-8 w-8 text-brand-gold" /> : null}
                  <h2 className="mt-4 text-xl font-semibold text-gray-900">{item.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section className="bg-gray-50">
        <Container className="max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-gray-900">{cta.title}</h2>
          <p className="mt-4 text-base leading-7 text-gray-500">{cta.description}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href={cta.primaryCta.href}>
                {cta.primaryCta.label}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </Button>
            {cta.secondaryCta ? (
              <Button asChild variant="outline" size="lg">
                <Link href={cta.secondaryCta.href}>{cta.secondaryCta.label}</Link>
              </Button>
            ) : null}
          </div>
        </Container>
      </Section>
    </>
  );
}