import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";
import { homepageContent } from "@/lib/mock/homepage";
import { resolveIcon } from "@/lib/icons";

export default function Home() {
  const { hero, services } = homepageContent;

  return (
    <>
      <Section className="overflow-hidden bg-white py-20 sm:py-24">
        <Container className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="inline-flex rounded-md bg-gray-100 px-3 py-1 text-sm font-semibold text-brand-gold">
              {hero.eyebrow}
            </p>
            <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight tracking-normal text-gray-900 sm:text-5xl lg:text-6xl">
              {hero.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-500">
              {hero.subtitle}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href={hero.primaryCta.href}>
                  {hero.primaryCta.label}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </Button>
              {hero.secondaryCta ? (
                <Button asChild variant="outline" size="lg">
                  <Link href={hero.secondaryCta.href}>{hero.secondaryCta.label}</Link>
                </Button>
              ) : null}
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              {hero.highlights?.map((item) => (
                <div key={item.label} className="rounded-md border border-gray-200 bg-white p-5">
                  <p className="text-sm font-semibold text-brand-gold">{item.label}</p>
                  <p className="mt-2 text-sm leading-6 text-gray-500">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-gold">
              Version 1.0 focus
            </p>
            <h2 className="mt-3 text-3xl font-bold text-gray-900">
              A corporate website that can grow into a larger platform.
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-500">
              The first release prioritizes public content, admin-managed updates, secure
              authentication, SEO, performance, and an isolated AI assistant module.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {services.map((item) => {
              const Icon = resolveIcon(item.icon);
              return (
                <article key={item.title} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  {Icon ? <Icon aria-hidden="true" className="h-6 w-6 text-brand-gold" /> : null}
                  <h3 className="mt-5 text-lg font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-500">{item.description}</p>
                </article>
              );
            })}
          </div>
        </Container>
      </Section>
    </>
  );
}