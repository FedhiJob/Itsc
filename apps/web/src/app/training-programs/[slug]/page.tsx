import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Download, GraduationCap, MapPin, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";
import { siteConfig } from "@/config/site";
import { getTrainingProgram } from "@/lib/api/training";
import { ImageContainer } from "@/lib/image";
import { CourseSyllabusViewer } from "@/components/features/course-syllabus-viewer";
import { CourseStickyCta } from "@/components/features/course-sticky-cta";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const program = await getTrainingProgram(slug);

  if (!program) {
    return { title: "Program Not Found" };
  }

  return {
    title: program.title,
    description: program.shortDescription
  };
}

export default async function TrainingProgramDetailPage({ params }: Props) {
  const { slug } = await params;
  const program = await getTrainingProgram(slug);

  if (!program) {
    notFound();
  }

  return (
    <>
      <Section className="border-b border-gray-200 bg-white">
        <Container>
          <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-gray-500">
            <Link
              href="/training-programs"
              className="inline-flex items-center gap-1 hover:text-gray-900"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              All Programs
            </Link>
            <span>/</span>
            <Link
              href={`/training-programs?category=${program.category.slug}`}
              className="text-brand-gold-700 hover:text-brand-ink"
            >
              {program.category.name}
            </Link>
          </div>

          <div className="mt-6 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
              {program.code ? (
                <span className="rounded-md bg-brand-ink px-2.5 py-1 font-mono text-xs font-bold text-brand-gold">
                  Code: {program.code}
                </span>
              ) : null}
              <span className="rounded-md bg-brand-gold/10 px-2.5 py-1 text-brand-ink">
                {program.category.name}
              </span>
              {program.level ? (
                <span className="rounded-md bg-gray-100 px-2.5 py-1 text-gray-700">
                  {program.level}
                </span>
              ) : null}
            </div>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
              {program.title}
            </h1>
            <p className="mt-4 text-lg leading-8 text-gray-500">{program.shortDescription}</p>
          </div>

          <div className="mt-8 flex flex-wrap gap-6">
            {program.duration ? (
              <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                <Clock aria-hidden="true" className="h-4 w-4" />
                <span>Duration: <strong className="text-gray-900">{program.duration}</strong></span>
              </div>
            ) : null}
            {program.deliveryMode ? (
              <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                <MapPin aria-hidden="true" className="h-4 w-4" />
                <span>Delivery: <strong className="text-gray-900">{program.deliveryMode}</strong></span>
              </div>
            ) : null}
            {program.level ? (
              <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                <GraduationCap aria-hidden="true" className="h-4 w-4" />
                <span>Level: <strong className="text-gray-900">{program.level}</strong></span>
              </div>
            ) : null}
          </div>
          {program.featuredImage ? (
            <div className="relative mt-10 aspect-[16/7] overflow-hidden rounded-2xl bg-brand-ink shadow-card">
              <ImageContainer src={program.featuredImage.src} alt={program.featuredImage.alt} />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_45%,rgb(16_37_63_/_0.35))]" />
            </div>
          ) : null}
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900">About This Program</h2>
              <p className="mt-4 text-base leading-7 text-gray-500 whitespace-pre-line">
                {program.fullDescription}
              </p>

              {program.objectives && program.objectives.length > 0 ? (
                <>
                  <h3 className="mt-10 text-xl font-semibold text-gray-900">Learning Objectives</h3>
                  <ul className="mt-4 space-y-3">
                    {program.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm leading-6 text-gray-600">
                        <Target aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}

              {program.prerequisites && program.prerequisites.length > 0 ? (
                <>
                  <h3 className="mt-10 text-xl font-semibold text-gray-900">Prerequisites</h3>
                  <ul className="mt-4 space-y-2">
                    {program.prerequisites.map((prereq, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm leading-6 text-gray-600">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold" />
                        <span>{prereq}</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}

              <CourseSyllabusViewer
                title={program.title}
                code={program.code}
                outlineText={program.outlineText}
                outlineFileUrl={program.outlineFileUrl}
              />
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Ready to enroll?</h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Contact us to learn more about upcoming cohorts, pricing, and group enrollment options.
              </p>
              <div className="mt-6 space-y-3">
                <Button asChild className="w-full">
                  <Link href={`/contact?subject=enrollment&source=${encodeURIComponent(`/training-programs/${program.slug}`)}&sourceLabel=${encodeURIComponent(program.title)}`}>
                    Get in touch
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`mailto:${siteConfig.links.email}`}>
                    Email Us
                  </Link>
                </Button>
              </div>
              <div className="mt-6 border-t border-gray-200 pt-4 text-xs text-gray-500">
                <p className="flex items-center gap-1">
                  <Calendar aria-hidden="true" className="h-3.5 w-3.5" />
                  Flexible scheduling available
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <CourseStickyCta
        title={program.title}
        slug={program.slug}
        code={program.code}
        duration={program.duration}
      />
    </>
  );
}
