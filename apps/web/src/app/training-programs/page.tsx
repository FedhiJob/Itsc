import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, GraduationCap, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Training Programs",
  description:
    "Explore ITSC's training programs in AI, cloud computing, cybersecurity, and emerging technologies."
};

const categories = [
  {
    name: "Artificial Intelligence",
    slug: "artificial-intelligence",
    description:
      "Machine learning, deep learning, NLP, computer vision, and AI application development.",
    count: 6
  },
  {
    name: "Cloud Computing",
    slug: "cloud-computing",
    description:
      "AWS, Azure, Google Cloud, DevOps, containerization, and cloud architecture.",
    count: 5
  },
  {
    name: "Cybersecurity",
    slug: "cybersecurity",
    description:
      "Network security, ethical hacking, incident response, compliance, and risk management.",
    count: 4
  },
  {
    name: "Software Development",
    slug: "software-development",
    description:
      "Full-stack development, mobile apps, API design, testing, and agile methodologies.",
    count: 5
  },
  {
    name: "Data Science",
    slug: "data-science",
    description:
      "Data analysis, visualization, big data tools, statistical modeling, and business intelligence.",
    count: 3
  },
  {
    name: "IT Management",
    slug: "it-management",
    description:
      "Project management, ITIL, service delivery, governance, and digital transformation leadership.",
    count: 3
  }
];

const programs = [
  {
    title: "AI Foundations",
    category: "Artificial Intelligence",
    slug: "ai-foundations",
    duration: "6 weeks",
    level: "Beginner",
    delivery: "Online",
    description:
      "Understand core AI concepts, neural networks, and build your first machine learning models."
  },
  {
    title: "Cloud Architect Professional",
    category: "Cloud Computing",
    slug: "cloud-architect-professional",
    duration: "8 weeks",
    level: "Advanced",
    delivery: "Hybrid",
    description:
      "Design and implement scalable cloud solutions using AWS, Azure, and GCP."
  },
  {
    title: "Cybersecurity Essentials",
    category: "Cybersecurity",
    slug: "cybersecurity-essentials",
    duration: "6 weeks",
    level: "Intermediate",
    delivery: "Online",
    description:
      "Learn fundamental security principles, threat detection, and defensive strategies."
  },
  {
    title: "Full-Stack Web Development",
    category: "Software Development",
    slug: "full-stack-web-development",
    duration: "12 weeks",
    level: "Beginner to Intermediate",
    delivery: "In-Person",
    description:
      "Build modern web applications from frontend to backend using industry-standard tools."
  },
  {
    title: "Data Analytics with Python",
    category: "Data Science",
    slug: "data-analytics-python",
    duration: "4 weeks",
    level: "Beginner",
    delivery: "Online",
    description:
      "Master data manipulation, visualization, and analysis using Python and its ecosystem."
  },
  {
    title: "IT Service Management (ITIL 4)",
    category: "IT Management",
    slug: "itil-4-foundation",
    duration: "3 weeks",
    level: "Beginner",
    delivery: "Online",
    description:
      "Get certified in ITIL 4 and learn best practices for IT service delivery."
  }
];

export default function TrainingProgramsPage() {
  return (
    <>
      <Section className="border-b border-gray-200 bg-white">
        <Container className="max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-gold">Programs</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
            Training Programs
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-500">
            Discover practical, hands-on training across technology domains. Our programs are
            designed for students, professionals, and teams.
          </p>
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
                  {category.count} program{category.count > 1 ? "s" : ""}
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
                  <span className="rounded-md bg-brand-gold/10 px-2 py-1">{program.category}</span>
                  <span className="rounded-md bg-gray-100 px-2 py-1">{program.level}</span>
                </div>
                <h3 className="mt-3 text-xl font-semibold text-gray-900">{program.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {program.description}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <Clock aria-hidden="true" className="h-3.5 w-3.5" />
                    {program.duration}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin aria-hidden="true" className="h-3.5 w-3.5" />
                    {program.delivery}
                  </span>
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
