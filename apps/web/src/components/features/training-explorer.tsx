"use client";

import { useMemo, useState } from "react";
import type { TrainingCategory, TrainingProgramSummary } from "@itsc/shared";
import { TrainingCard } from "./training-card";

interface TrainingExplorerProps {
  categories: TrainingCategory[];
  programs: TrainingProgramSummary[];
}

export function TrainingExplorer({ categories, programs }: TrainingExplorerProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const visiblePrograms = useMemo(
    () => selectedCategory === "all" ? programs : programs.filter((program) => program.category.slug === selectedCategory),
    [programs, selectedCategory]
  );

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-3" aria-label="Filter programmes by category">
        <FilterButton active={selectedCategory === "all"} onClick={() => setSelectedCategory("all")}>All programs</FilterButton>
        {categories.map((category) => (
          <FilterButton key={category.slug} active={selectedCategory === category.slug} onClick={() => setSelectedCategory(category.slug)}>{category.name}</FilterButton>
        ))}
      </div>
      {visiblePrograms.length ? (
        <div className="mt-7 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visiblePrograms.map((program) => <TrainingCard key={program.id} title={program.title} slug={program.slug} description={program.shortDescription} category={program.category.name} duration={program.duration} level={program.level} delivery={program.deliveryMode} />)}
        </div>
      ) : (
        <div className="mt-7 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center text-gray-500">No programs are currently available in this category.</div>
      )}
    </div>
  );
}

function FilterButton({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return <button type="button" onClick={onClick} aria-pressed={active} className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold ${active ? "bg-brand-ink text-white" : "border border-gray-200 bg-white text-gray-700 hover:border-brand-gold hover:text-brand-ink"}`}>{children}</button>;
}
