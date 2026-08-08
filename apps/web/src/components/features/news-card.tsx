import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { Card, CardBody, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface NewsCardProps {
  title: string;
  slug: string;
  summary: string;
  date: string;
  category: string;
  featuredImage?: {
    src: string;
    alt: string;
  };
}

export function NewsCard({ title, slug, summary, date, category }: NewsCardProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <Card variant="interactive">
      <CardBody>
        <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
          <span className="rounded-md bg-brand-gold/10 px-2 py-1 text-brand-gold">{category}</span>
          <span className="inline-flex items-center gap-1 text-gray-500">
            <Calendar aria-hidden="true" className="h-3.5 w-3.5" />
            {formattedDate}
          </span>
        </div>
        <h3 className="mt-3 font-serif text-xl font-bold text-gray-900">
          <Link href={`/news/${slug}`} className="transition-colors hover:text-brand-gold">
            {title}
          </Link>
        </h3>
        <p className="mt-2 text-sm leading-6 text-gray-500">{summary}</p>
      </CardBody>
      <CardFooter>
        <Button asChild variant="ghost" size="sm" className="px-0">
          <Link href={`/news/${slug}`}>
            Read More
            <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}