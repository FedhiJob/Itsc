import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/section";
import { PageHero } from "@/components/ui/page-hero";
import { TrainingExplorer } from "@/components/features/training-explorer";
import { getTrainingContent } from "@/lib/api/training";

export const metadata: Metadata = {
  title: "Training Programs",
  description:
    "Explore ITSC's training programs in AI, cloud computing, cybersecurity, and emerging technologies."
};

export default async function TrainingProgramsPage() {
  const { eyebrow, title, intro, categories, programs } = await getTrainingContent();

  return (
    <>
      <Section className="border-b border-gray-200 bg-white">
        <Container className="max-w-3xl text-center">
          <PageHero eyebrow={eyebrow} title={title} description={intro} />
        </Container>
      </Section>

      <Section className="bg-gray-50">
        <Container>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-gold">Find the right path</p>
          <h2 className="mt-3 font-serif text-3xl font-black text-brand-ink sm:text-4xl">Explore by discipline.</h2>
          <p className="mt-3 max-w-2xl leading-7 text-gray-500">Filter our current programmes by the technology area that matters most to you.</p>
          <div className="mt-8"><TrainingExplorer categories={categories} programs={programs} /></div>
        </Container>
      </Section>
    </>
  );
}
