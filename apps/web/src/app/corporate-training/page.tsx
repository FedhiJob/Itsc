import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, ClipboardCheck, HeadphonesIcon, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Corporate Training",
description:
    "ITSC provides customized corporate training programs for organizations and government institutions in AI, cloud, cybersecurity, and more."
} as const;

const benefits = [
  {
    icon: Users,
    title: "Tailored Programs",
    description:
      "We design training programs aligned with your organization's specific goals, industry requirements, and team skill levels."
  },
  {
    icon: ClipboardCheck,
    title: "Structured Curriculum",
    description:
      "Our proven methodology combines theoretical foundations with hands-on labs, real-world projects, and assessment-driven learning."
  },
  {
    icon: Building2,
    title: "On-Site & Remote",
    description:
      "Choose between on-site training at your premises, remote virtual sessions, or a blended approach that fits your team's schedule."
  },
  {
    icon: HeadphonesIcon,
    title: "Ongoing Support",
    description:
      "Post-training support, materials access, and follow-up consultations ensure lasting impact and skill retention."
  }
];

const services = [
  {
    title: "AI & Machine Learning",
    description: "Custom programs covering AI strategy, model development, MLOps, and responsible AI implementation.",
    areas: ["Strategy workshops", "Hands-on model building", "AI governance", "Team upskilling"]
  },
  {
    title: "Cloud Transformation",
    description: "Cloud adoption strategies, architecture design, migration planning, and DevOps enablement.",
    areas: ["Cloud readiness assessment", "Migration planning", "Architecture workshops", "DevOps pipeline setup"]
  },
  {
    title: "Cybersecurity Readiness",
    description: "Security awareness programs, incident response training, and compliance preparation.",
    areas: ["Security assessments", "Incident response drills", "Compliance training", "SOC team development"]
  },
  {
    title: "Digital Leadership",
    description: "Executive programs on digital transformation, technology strategy, and innovation management.",
    areas: ["Executive workshops", "Digital strategy", "Change management", "Innovation labs"]
  }
];

export default function CorporateTrainingPage() {
  return (
    <>
      <Section className="border-b border-gray-200 bg-white">
        <Container className="max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-gold">Corporate</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
            Corporate Training Programs
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-500">
            Empower your team with customized technology training. ITSC partners with organizations
            and government institutions to build workforce capabilities in emerging technologies.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/contact?subject=corporate-training">
                Request a Consultation
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
              const Icon = benefit.icon;
              return (
                <article key={benefit.title} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <Icon aria-hidden="true" className="h-7 w-7 text-brand-gold" />
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
          <h2 className="text-3xl font-bold text-gray-900">Ready to transform your team?</h2>
          <p className="mt-4 text-base leading-7 text-gray-500">
            Contact us to discuss your organization&apos;s training needs and get a customized proposal.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/contact?subject=corporate-training">
                Get in Touch
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/training-programs">View All Programs</Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
