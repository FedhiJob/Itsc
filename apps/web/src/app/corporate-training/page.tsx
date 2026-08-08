import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";
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
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-gold">{eyebrow}</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
            {title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-500">{intro}</p>
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
          <h2 className="text-2xl font-bold text-gray-900">Why Choose ITSC Corporate Training?</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {benefits.map((benefit) => {
              const Icon = resolveIcon(benefit.icon);
              return (
                <article key={benefit.title} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  {Icon ? <Icon aria-hidden="true" className="h-7 w-7 text-brand-gold" /> : null}
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">{benefit.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-500">{benefit.description}</p>
                </article>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section className="bg-gray-50">
        <Container>
          <h2 className="text-2xl font-bold text-gray-900">Our Corporate Programs</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {services.map((service) => (
              <article key={service.title} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
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
            ))}
          </div>
        </Container>
      </Section>

      <Section>
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