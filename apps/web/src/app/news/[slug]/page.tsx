import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/section";
import { siteConfig } from "@/config/site";
import { getNewsArticle } from "@/lib/api/news";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsArticle(slug);

  if (!article) {
    return { title: "Article Not Found" };
  }

  return {
    title: article.title,
    description: article.summary
  };
}

export default async function NewsArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await getNewsArticle(slug);

  if (!article) {
    notFound();
  }

  return (
    <>
      <Section className="border-b border-gray-200 bg-white">
        <Container>
          <Link
            href="/news"
            className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            Back to News
          </Link>

          <div className="mt-6 max-w-3xl">
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
              {article.author ? (
                <span className="inline-flex items-center gap-1 text-gray-500">
                  <User aria-hidden="true" className="h-3.5 w-3.5" />
                  {article.author}
                </span>
              ) : null}
            </div>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
              {article.title}
            </h1>
            <p className="mt-4 text-lg leading-8 text-gray-500">{article.summary}</p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {article.content.map((paragraph, index) => (
                  <p key={index} className="text-base leading-7 text-gray-500">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Stay informed</h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Get the latest news, program launches, and events from ITSC delivered straight to
                your inbox.
              </p>
              <div className="mt-6 space-y-3">
                <Button asChild className="w-full">
                  <Link href="/contact?subject=newsletter">Subscribe to Updates</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`mailto:${siteConfig.links.email}`}>Contact Us</Link>
                </Button>
              </div>
              <div className="mt-6 border-t border-gray-200 pt-4 text-xs text-gray-500">
                <p>Follow ITSC for the latest updates and community announcements.</p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}