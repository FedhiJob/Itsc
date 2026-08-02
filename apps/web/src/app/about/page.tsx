import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Award, BookOpen, Building2, Target, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about the Information Technology and Solutions Center (ITSC) — our mission, vision, and commitment to professional technology training."
};

const values = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "To bridge the technology skills gap by providing accessible, high-quality training programs for students, professionals, organizations, and government institutions."
  },
  {
    icon: Award,
    title: "Our Vision",
    description:
      "To be the leading technology training and solutions center, empowering individuals and organizations to thrive in the digital age."
  },
  {
    icon: Users,
    title: "Who We Serve",
    description:
      "Students seeking practical skills, professionals advancing their careers, organizations building team capabilities, and government institutions driving digital transformation."
  },
  {
    icon: Building2,
    title: "Our Approach",
    description:
      "Hands-on training delivered by experienced instructors, combining theoretical foundations with real-world applications and industry best practices."
  },
  {
    icon: BookOpen,
    title: "Continuous Learning",
    description:
      "We stay current with emerging technologies — AI, cloud computing, cybersecurity — ensuring our training programs remain relevant and impactful."
  }
];

export default function AboutPage() {
  return (
    <>
      <Section className="border-b border-gray-200 bg-white">
        <Container className="max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-gold">About ITSC</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
            Information Technology Support Center
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-500">
            ITSC is a dedicated technology training and solutions provider based in Ethiopia. We
            equip students, professionals, and organizations with practical skills in AI, cloud
            computing, cybersecurity, and emerging technologies.
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {values.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <Icon aria-hidden="true" className="h-8 w-8 text-brand-gold" />
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
          <h2 className="text-3xl font-bold text-gray-900">Ready to get started?</h2>
          <p className="mt-4 text-base leading-7 text-gray-500">
            Explore our training programs or contact us to discuss your learning needs.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/training-programs">
                View Programs
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
