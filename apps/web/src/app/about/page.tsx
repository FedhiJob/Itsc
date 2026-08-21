import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/sections/reveal";
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
          <PageHero eyebrow={eyebrow} title={title} description={intro} />
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {values.map((item, index) => {
              const Icon = resolveIcon(item.icon);
              return (
                <Reveal key={item.title} style={{ transitionDelay: `${index * 90}ms` }}>
                <article className="group h-full rounded-2xl border border-gray-200 bg-white p-7 shadow-card transition duration-300 hover:-translate-y-1 hover:border-brand-gold/50">
                  {Icon ? <Icon aria-hidden="true" className="h-8 w-8 text-brand-gold" /> : null}
                  <h2 className="mt-5 text-xl font-bold text-brand-ink">{item.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    {item.description}
                  </p>
                </article>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section className="bg-brand-ink text-white">
        <Container className="max-w-2xl text-center">
          <Reveal>
          <h2 className="font-serif text-3xl font-black">{cta.title}</h2>
          <p className="mt-4 text-base leading-7 text-white/72">{cta.description}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href={cta.primaryCta.href}>
                {cta.primaryCta.label}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </Button>
            {cta.secondaryCta ? (
                <Button asChild variant="outline" size="lg" className="border-white/25 bg-transparent text-white hover:bg-white hover:text-brand-ink">
                <Link href={cta.secondaryCta.href}>{cta.secondaryCta.label}</Link>
              </Button>
            ) : null}
          </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
