import Link from "next/link";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import { Card, CardBody, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TrainingCardProps {
  title: string;
  slug: string;
  description: string;
  category: string;
  duration?: string;
  level?: string;
  delivery?: string;
}

export function TrainingCard({
  title,
  slug,
  description,
  category,
  duration,
  level,
  delivery
}: TrainingCardProps) {
  return (
    <Card variant="interactive">
      <CardBody>
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-brand-gold">
          <span className="rounded-md bg-brand-gold/10 px-2 py-1">{category}</span>
          {level ? <span className="rounded-md bg-gray-100 px-2 py-1">{level}</span> : null}
        </div>
        <h3 className="mt-3 font-serif text-xl font-bold text-gray-900">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-gray-500">{description}</p>
        {duration || delivery ? (
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
            {duration ? (
              <span className="inline-flex items-center gap-1">
                <Clock aria-hidden="true" className="h-3.5 w-3.5" />
                {duration}
              </span>
            ) : null}
            {delivery ? (
              <span className="inline-flex items-center gap-1">
                <MapPin aria-hidden="true" className="h-3.5 w-3.5" />
                {delivery}
              </span>
            ) : null}
          </div>
        ) : null}
      </CardBody>
      <CardFooter>
        <Button asChild variant="outline" size="sm">
          <Link href={`/training-programs/${slug}`}>
            View Details
            <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}