import { cn } from "@/lib/utils";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  align?: "center" | "left";
}

export function PageHero({
  eyebrow,
  title,
  description,
  className,
  align = "center"
}: PageHeroProps) {
  const alignClasses = align === "center" ? "text-center" : "text-left";

  return (
    <div className={cn("max-w-3xl", alignClasses, className)}>
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-gold">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-6 text-lg leading-8 text-gray-500">{description}</p>
      ) : null}
    </div>
  );
}