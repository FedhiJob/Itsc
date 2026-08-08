import type { Statistic } from "@itsc/shared";
import { Container, Section } from "@/components/ui/section";

interface StatsSectionProps {
  stats: Statistic[];
  className?: string;
}

export function StatsSection({ stats, className }: StatsSectionProps) {
  return (
    <Section className={className}>
      <Container>
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-serif text-4xl font-bold text-brand-gold sm:text-5xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-medium text-gray-700">{stat.label}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}