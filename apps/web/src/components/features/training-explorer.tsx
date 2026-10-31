"use client";

import { useMemo, useState } from "react";
import { BookOpen, Search, X } from "lucide-react";
import type { TrainingCategory, TrainingProgramSummary } from "@itsc/shared";
import { TrainingCard } from "./training-card";

interface TrainingExplorerProps {
  categories: TrainingCategory[];
  programs: TrainingProgramSummary[];
  initialCategory?: string;
}

export function TrainingExplorer({
  categories,
  programs,
  initialCategory = "all"
}: TrainingExplorerProps) {
  // Separate top-level vendors from child tracks
  const topLevelVendors = useMemo(() => {
    return categories
      .filter((c) => !c.parentId)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }, [categories]);

  // Determine initial vendor and subcat from initialCategory prop
  const { initialVendorSlug, initialSubcatSlug } = useMemo(() => {
    if (!initialCategory || initialCategory === "all") {
      return { initialVendorSlug: "all", initialSubcatSlug: "all" };
    }
    // Check if initialCategory is a top-level vendor
    const isVendor = topLevelVendors.some((v) => v.slug === initialCategory);
    if (isVendor) {
      return { initialVendorSlug: initialCategory, initialSubcatSlug: "all" };
    }
    // Check if it's a child category
    const subcat = categories.find((c) => c.slug === initialCategory);
    if (subcat && subcat.parentId) {
      const parent = topLevelVendors.find((v) => v.id === subcat.parentId);
      if (parent) {
        return { initialVendorSlug: parent.slug, initialSubcatSlug: subcat.slug };
      }
    }
    return { initialVendorSlug: initialCategory, initialSubcatSlug: "all" };
  }, [initialCategory, topLevelVendors, categories]);

  const [selectedVendor, setSelectedVendor] = useState<string>(initialVendorSlug);
  const [selectedSubcat, setSelectedSubcat] = useState<string>(initialSubcatSlug);
  const [searchQuery, setSearchQuery] = useState("");

  // Subcategories belonging to the active vendor
  const currentVendor = useMemo(() => {
    return topLevelVendors.find((v) => v.slug === selectedVendor);
  }, [topLevelVendors, selectedVendor]);

  const vendorSubcategories = useMemo(() => {
    if (!currentVendor) return [];
    return categories
      .filter((c) => c.parentId === currentVendor.id)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }, [categories, currentVendor]);

  // Handle vendor switch
  function handleSelectVendor(slug: string) {
    setSelectedVendor(slug);
    setSelectedSubcat("all");
  }

  // Filter programs based on selected vendor, subcategory, and search query
  const visiblePrograms = useMemo(() => {
    return programs.filter((program) => {
      // Vendor & Subcategory Filter
      if (selectedVendor !== "all") {
        if (selectedSubcat !== "all") {
          if (program.category.slug !== selectedSubcat) return false;
        } else {
          const matchesDirectVendor = program.category.slug === selectedVendor;
          const matchesChildOfVendor =
            currentVendor && program.category.parentId === currentVendor.id;
          if (!matchesDirectVendor && !matchesChildOfVendor) return false;
        }
      }

      // Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = program.title.toLowerCase().includes(q);
        const matchesCode = program.code?.toLowerCase().includes(q) ?? false;
        const matchesDesc = program.shortDescription.toLowerCase().includes(q);
        const matchesCat = program.category.name.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCode && !matchesDesc && !matchesCat) return false;
      }

      return true;
    });
  }, [programs, selectedVendor, selectedSubcat, currentVendor, searchQuery]);

  const hasActiveFilters =
    selectedVendor !== "all" || selectedSubcat !== "all" || searchQuery.trim().length > 0;

  function clearFilters() {
    setSelectedVendor("all");
    setSelectedSubcat("all");
    setSearchQuery("");
  }

  return (
    <div className="space-y-6">
      {/* Search Bar & Stats */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search aria-hidden="true" className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by course code (e.g. AZ-104, SY0-701) or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-sm shadow-xs transition placeholder:text-gray-400 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>
            Showing <strong className="text-gray-900">{visiblePrograms.length}</strong> of{" "}
            <strong>{programs.length}</strong> certification courses
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="font-semibold text-brand-gold-700 hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Row 1: Technology Vendors */}
      <div>
        <div className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
          Vendors &amp; Disciplines
        </div>
        <div
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin"
          aria-label="Filter programs by technology vendor"
        >
          <FilterButton
            active={selectedVendor === "all"}
            onClick={() => handleSelectVendor("all")}
          >
            All Vendors ({programs.length})
          </FilterButton>
          {topLevelVendors.map((vendor) => {
            const count = programs.filter(
              (p) => p.category.slug === vendor.slug || p.category.parentId === vendor.id
            ).length;
            return (
              <FilterButton
                key={vendor.slug}
                active={selectedVendor === vendor.slug}
                onClick={() => handleSelectVendor(vendor.slug)}
              >
                {vendor.name} {count > 0 ? `(${count})` : ""}
              </FilterButton>
            );
          })}
        </div>
      </div>

      {/* Row 2: Nested Subcategories / Tracks (shown when vendor has tracks) */}
      {vendorSubcategories.length > 0 && (
        <div className="rounded-xl border border-brand-gold/20 bg-brand-gold/[0.04] p-3.5">
          <div className="mb-2 text-xs font-bold text-brand-ink">
            {currentVendor?.name} Specialization Tracks
          </div>
          <div className="flex flex-wrap gap-1.5" aria-label="Filter by specialization track">
            <SubFilterButton
              active={selectedSubcat === "all"}
              onClick={() => setSelectedSubcat("all")}
            >
              All {currentVendor?.name}
            </SubFilterButton>
            {vendorSubcategories.map((subcat) => {
              const count = programs.filter((p) => p.category.slug === subcat.slug).length;
              return (
                <SubFilterButton
                  key={subcat.slug}
                  active={selectedSubcat === subcat.slug}
                  onClick={() => setSelectedSubcat(subcat.slug)}
                >
                  {subcat.name} {count > 0 ? `(${count})` : ""}
                </SubFilterButton>
              );
            })}
          </div>
        </div>
      )}

      {/* Course Cards Grid */}
      {visiblePrograms.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visiblePrograms.map((program) => (
            <TrainingCard
              key={program.id}
              title={program.title}
              slug={program.slug}
              code={program.code}
              description={program.shortDescription}
              category={program.category.name}
              duration={program.duration}
              level={program.level}
              delivery={program.deliveryMode}
              image={program.featuredImage}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-gold/10">
            <BookOpen aria-hidden="true" className="h-6 w-6 text-brand-gold-700" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-gray-900">No courses match your filter</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search keywords or switching vendors.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 rounded-lg bg-brand-gold px-4 py-2 text-sm font-bold text-brand-ink hover:bg-brand-gold-400"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}

function FilterButton({
  active,
  children,
  onClick
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 rounded-full px-4 py-2 text-xs sm:text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold ${
        active
          ? "bg-brand-ink text-white shadow-xs"
          : "border border-gray-200 bg-white text-gray-700 hover:border-brand-gold hover:text-brand-ink"
      }`}
    >
      {children}
    </button>
  );
}

function SubFilterButton({
  active,
  children,
  onClick
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
        active
          ? "bg-brand-gold text-brand-ink shadow-xs"
          : "bg-white text-gray-700 hover:bg-white/80 border border-brand-gold/20"
      }`}
    >
      {children}
    </button>
  );
}
