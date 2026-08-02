import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "News & Events",
  description:
    "Stay informed with the latest news, events, and updates from ITSC — technology training programs, achievements, and community initiatives."
};

const articles = [
  {
    title: "ITSC Launches New AI Training Program",
    summary: "Our comprehensive AI Foundations program is now open for enrollment, covering machine learning, neural networks, and practical AI applications.",
    date: "2024-03-15",
    slug: "ai-training-launch",
    category: "Programs"
  },
  {
    title: "Corporate Training Partnership with Leading Tech Firms",
    summary: "ITSC partners with major technology companies to deliver customized training solutions for enterprise teams.",
    date: "2024-02-28",
    slug: "corporate-partnership-announcement",
    category: "Partnerships"
  },
  {
    title: "Cybersecurity Workshop Series Announced",
    summary: "Register for our upcoming cybersecurity workshop series covering threat detection, incident response, and security best practices.",
    date: "2024-02-10",
    slug: "cybersecurity-workshop-series",
    category: "Events"
  },
  {
    title: "Graduation Ceremony for Fall 2024 Cohort",
    summary: "Congratulations to our graduates who completed intensive training in cloud architecture, full-stack development, and data analytics.",
    date: "2024-01-20",
    slug: "fall-2024-graduation",
    category: "Community"
  },
  {
    title: "ITSC Expands Training Facilities",
    summary: "New state-of-the-art training labs equipped with the latest technology to provide an enhanced hands-on learning experience.",
    date: "2024-01-05",
    slug: "facility-expansion",
    category: "Announcements"
  }
];

export default function NewsPage() {
  return (
    <>
      <Section className="border-b border-gray-200 bg-white">
        <Container className="max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-gold">Updates</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
            News & Events
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-500">
            Stay updated with the latest from ITSC — program launches, events, partnerships,
            and community initiatives.
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="space-y-6">
            {articles.map((article) => (
              <article
                key={article.slug}
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
                  <span className="rounded-md bg-brand-gold/10 px-2 py-1 text-brand-gold">
                    {article.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-gray-500">
                    <Calendar aria-hidden="true" className="h-3.5 w-3.5" />
                    {new Date(article.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </span>
                </div>
                <h2 className="mt-3 text-xl font-semibold text-gray-900">
                  <Link href={`/news/${article.slug}`} className="hover:text-brand-gold transition-colors">
                    {article.title}
                  </Link>
                </h2>
                <p className="mt-2 text-sm leading-6 text-gray-500">{article.summary}</p>
                <div className="mt-4">
                  <Button asChild variant="ghost" size="sm" className="px-0">
                    <Link href={`/news/${article.slug}`}>
                      Read More
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
