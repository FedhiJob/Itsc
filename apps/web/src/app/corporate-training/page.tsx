import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/sections/reveal";
import { corporateTrainingContent } from "@/lib/mock/corporate-training";
import { resolveIcon } from "@/lib/icons";

export const metadata: Metadata = {
  title: "Corporate Training",
  description:
    "ITSC provides customized corporate training programs for organizations and government institutions in AI, cloud, cybersecurity, and more."
} as const;

export default function CorporateTrainingPage() {
  const { eyebrow, title, intro, primaryCta, benefits, services, cta } = corporateTrainingContent;

  return (
    <>
      <Section className="border-b border-gray-200 bg-white">
        <Container className="max-w-3xl text-center">
          <PageHero eyebrow={eyebrow} title={title} description={intro} />
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href={primaryCta.href}>
                {primaryCta.label}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Reveal><p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-gold">Built for teams</p><h2 className="mt-3 font-serif text-3xl font-black text-brand-ink sm:text-4xl">Why choose ITSC corporate training?</h2></Reveal>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {benefits.map((benefit, index) => {
              const Icon = resolveIcon(benefit.icon);
              return (
                <Reveal key={benefit.title} style={{ transitionDelay: `${index * 100}ms` }}><article className="group h-full rounded-2xl border border-gray-200 bg-white p-7 shadow-card transition duration-300 hover:-translate-y-1 hover:border-brand-gold/50">
                  {Icon ? <Icon aria-hidden="true" className="h-7 w-7 text-brand-gold" /> : null}
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">{benefit.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-500">{benefit.description}</p>
                </article>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section className="bg-gray-50">
        <Container>
          <Reveal><p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-gold">Flexible delivery</p><h2 className="mt-3 font-serif text-3xl font-black text-brand-ink sm:text-4xl">Our corporate programs</h2></Reveal>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {services.map((service, index) => (
              <Reveal key={service.title} style={{ transitionDelay: `${index * 100}ms` }}><article className="h-full rounded-2xl border border-gray-200 bg-white p-7 shadow-card transition duration-300 hover:-translate-y-1 hover:border-brand-gold/50">
                <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">{service.description}</p>
                <ul className="mt-4 space-y-1.5">
                  {service.areas.map((area) => (
                    <li key={area} className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold" />
                      {area}
                    </li>
                  ))}
                </ul>
              </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-brand-gold/10">
        <Container className="max-w-2xl text-center">
          <Reveal><h2 className="font-serif text-3xl font-black text-brand-ink">{cta.title}</h2>
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
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
