import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";
import { getTrainingContent } from "@/lib/api/training";

export const metadata: Metadata = {
  title: "Training Programs",
  description:
    "Explore ITSC's training programs in AI, cloud computing, cybersecurity, and emerging technologies."
};

export default async function TrainingProgramsPage() {
  const { eyebrow, title, intro, categories, programs } = await getTrainingContent();

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
          <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/training-programs?category=${category.slug}`}
                className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-colors hover:border-primary"
              >
                <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {category.description}
                </p>
                <p className="mt-3 text-xs font-medium text-brand-gold">
                  {category.count} program{category.count && category.count > 1 ? "s" : ""}
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-gray-50">
        <Container>
          <h2 className="text-2xl font-bold text-gray-900">Featured Programs</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {programs.map((program) => (
              <article
                key={program.slug}
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-brand-gold">
                  <span className="rounded-md bg-brand-gold/10 px-2 py-1">{program.category.name}</span>
                  {program.level ? (
                    <span className="rounded-md bg-gray-100 px-2 py-1">{program.level}</span>
                  ) : null}
                </div>
                <h3 className="mt-3 text-xl font-semibold text-gray-900">{program.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {program.shortDescription}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
                  {program.duration ? (
                    <span className="inline-flex items-center gap-1">
                      <Clock aria-hidden="true" className="h-3.5 w-3.5" />
                      {program.duration}
                    </span>
                  ) : null}
                  {program.deliveryMode ? (
                    <span className="inline-flex items-center gap-1">
                      <MapPin aria-hidden="true" className="h-3.5 w-3.5" />
                      {program.deliveryMode}
                    </span>
                  ) : null}
                </div>
                <div className="mt-4">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/training-programs/${program.slug}`}>
                      View Details
                      <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}