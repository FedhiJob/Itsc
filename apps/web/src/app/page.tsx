import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";
import { StatsSection } from "@/components/sections/stats-section";
import { PartnerMarquee } from "@/components/sections/partner-marquee";
import { HeroCarousel } from "@/components/sections/hero-carousel";
import { Reveal } from "@/components/sections/reveal";
import { TrainingCard } from "@/components/features/training-card";
import { homepageContent } from "@/lib/mock/homepage";
import { getTrainingContent } from "@/lib/api/training";
import { resolveIcon } from "@/lib/icons";

export default async function Home() {
  const { hero, services, stats, partners, missionVision, cta } = homepageContent;
  const { programs } = await getTrainingContent();
  const featured = programs.filter((program) => program.isFeatured);
  const featuredPrograms = (featured.length > 0 ? featured : programs).slice(0, 3);

  return (
    <>
      <HeroCarousel hero={hero} />

      <section className="overflow-hidden bg-brand-ink/[0.04] py-12 sm:py-16">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-gold">Global standards, local impact</p>
            <h2 className="mt-3 font-serif text-4xl font-black leading-tight text-brand-ink sm:text-5xl">Our international partners</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-gray-500">Recognized technology and certification partners that help ITSC deliver trusted learning pathways and assessment services.</p>
          </div>
        </Container>
        <div className="mt-9">
          <PartnerMarquee logos={partners} />
        </div>
      </section>

      <StatsSection stats={stats} className="bg-brand-gold/10" />

      <Section className="bg-white">
        <Container>
          <Reveal className="flex max-w-3xl flex-col gap-4">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-gold">What we offer</p>
            <h2 className="font-serif text-4xl font-black leading-tight text-brand-ink sm:text-5xl">Technology capability for people and organizations.</h2>
            <p className="text-lg leading-8 text-gray-500">Practical services that connect individual ambition with organizational progress.</p>
          </Reveal>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {services.map((item, index) => {
              const Icon = resolveIcon(item.icon);
              return (
                <Reveal key={item.title} style={{ transitionDelay: `${index * 75}ms` }}>
                  <article className="group h-full rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:border-brand-gold/50 hover:bg-white">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gold text-brand-ink transition-transform duration-300 group-hover:scale-110">
                      {Icon ? <Icon aria-hidden="true" className="h-6 w-6" /> : null}
                    </div>
                    <h3 className="mt-6 text-xl font-bold text-brand-ink">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-gray-500">{item.description}</p>
                    <span className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-brand-ink">Discover <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section className="bg-gray-50">
        <Container>
          <Reveal className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-gold">Featured learning</p>
              <h2 className="mt-3 font-serif text-4xl font-black text-brand-ink sm:text-5xl">Explore the programmes shaping tomorrow.</h2>
            </div>
            <Button asChild variant="outline"><Link href="/training-programs">All programs <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link></Button>
          </Reveal>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {featuredPrograms.map((program, index) => (
              <Reveal key={program.id} style={{ transitionDelay: `${index * 100}ms` }}>
                <TrainingCard title={program.title} slug={program.slug} description={program.shortDescription} category={program.category.name} duration={program.duration} level={program.level} delivery={program.deliveryMode} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="overflow-hidden bg-brand-ink text-white">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-gold">Why ITSC</p>
            <h2 className="mt-4 font-serif text-4xl font-black leading-tight sm:text-5xl">Learning with practical focus and lasting impact.</h2>
          </Reveal>
          <Reveal style={{ transitionDelay: "100ms" }}>
            <div className="space-y-5 rounded-2xl border border-white/10 bg-white/6 p-7">
              {[missionVision.mission, missionVision.vision].map((statement, index) => (
                <div key={statement} className="flex gap-3">
                  <CheckCircle2 aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-brand-gold" />
                  <div><p className="text-sm font-bold uppercase tracking-[0.12em] text-brand-gold">{index === 0 ? "Our mission" : "Our vision"}</p><p className="mt-2 leading-7 text-white/72">{statement}</p></div>
                </div>
              ))}
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section className="bg-brand-gold">
        <Container className="text-center">
          <Reveal className="mx-auto max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-ink/70">Take the next step</p>
            <h2 className="mt-3 font-serif text-4xl font-black text-brand-ink sm:text-5xl">{cta.title}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-brand-ink/75">{cta.description}</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild variant="secondary" size="lg"><Link href={cta.primaryCta.href}>{cta.primaryCta.label} <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link></Button>
              {cta.secondaryCta ? <Button asChild variant="outline" size="lg" className="border-brand-ink/25 bg-transparent"><Link href={cta.secondaryCta.href}>{cta.secondaryCta.label}</Link></Button> : null}
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
