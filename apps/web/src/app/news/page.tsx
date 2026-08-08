import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";
import { getNewsContent } from "@/lib/api/news";

export const metadata: Metadata = {
  title: "News & Events",
  description:
    "Stay informed with the latest news, events, and updates from ITSC — technology training programs, achievements, and community initiatives."
};

export default async function NewsPage() {
  const { eyebrow, title, intro, articles } = await getNewsContent();

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