import Link from "next/link";
import { ArrowRight, Clock, MapPin, Sparkles } from "lucide-react";
import { Card, CardBody, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TrainingCardProps {
  title: string;
  slug: string;
  description: string;
  category: string;
  duration?: string | undefined;
  level?: string | undefined;
  delivery?: string | undefined;
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
    <Card variant="interactive" className="group h-full overflow-hidden border-gray-200 shadow-card transition duration-300 hover:-translate-y-1 hover:border-brand-gold/50">
      <div className="relative h-32 overflow-hidden bg-brand-ink">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgb(254_189_1_/_0.82),transparent_22%),linear-gradient(135deg,#10253f,#172033)] transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-[linear-gradient(125deg,transparent_25%,rgb(255_255_255_/_0.1)_25.5%,transparent_26%,transparent_48%,rgb(255_255_255_/_0.08)_48.5%,transparent_49%)]" />
        <Sparkles aria-hidden="true" className="absolute bottom-5 right-5 h-7 w-7 text-brand-gold" />
      </div>
      <CardBody className="pt-6">
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
      <CardFooter className="transition-colors group-hover:bg-brand-gold/10">
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
