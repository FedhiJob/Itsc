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
    <div className={cn("mx-auto max-w-3xl", alignClasses, className)}>
      {eyebrow ? (
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-gold">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="mt-2 font-serif text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight tracking-tight text-gray-900">
        {title}
      </h1>
      {description ? (
        <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-gray-500 max-w-2xl mx-auto">
          {description}
        </p>
      ) : null}
    </div>
  );
}

