"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { BookOpen, Search, X, SlidersHorizontal, Check } from "lucide-react";
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
    const isVendor = topLevelVendors.some((v) => v.slug === initialCategory);
    if (isVendor) {
      return { initialVendorSlug: initialCategory, initialSubcatSlug: "all" };
    }
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
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Touch swipe-down-to-dismiss tracking for mobile filter sheet
  const [filterDragY, setFilterDragY] = useState(0);
  const [isFilterDragging, setIsFilterDragging] = useState(false);
  const filterTouchStartYRef = useRef<number | null>(null);

  const handleFilterTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      filterTouchStartYRef.current = touch.clientY;
      setIsFilterDragging(true);
    }
  };

  const handleFilterTouchMove = (e: React.TouchEvent) => {
    if (filterTouchStartYRef.current === null) return;
    const touch = e.touches[0];
    if (!touch) return;
    const deltaY = touch.clientY - filterTouchStartYRef.current;
    if (deltaY > 0) {
      setFilterDragY(deltaY);
    }
  };

  const handleFilterTouchEnd = () => {
    if (filterDragY > 60) {
      setMobileFilterOpen(false);
    }
    setFilterDragY(0);
    setIsFilterDragging(false);
    filterTouchStartYRef.current = null;
  };

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

  // Lock body scroll when mobile filter is open
  useEffect(() => {
    if (mobileFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileFilterOpen]);

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
      {/* Search Bar & Mobile Filter Trigger */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
              className="itsc-press absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Mobile filter sheet button */}
        <div className="flex items-center justify-between gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="itsc-press inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-700 shadow-xs hover:border-brand-gold"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-brand-gold" />
            <span>Filter Categories</span>
            {selectedVendor !== "all" && (
              <span className="rounded-full bg-brand-gold px-1.5 py-0.2 text-[10px] text-brand-ink font-bold">
                1
              </span>
            )}
          </button>

          <span className="text-xs text-gray-500">
            <strong className="text-gray-900">{visiblePrograms.length}</strong> courses
          </span>
        </div>

        {/* Desktop counts & clear */}
        <div className="hidden md:flex items-center gap-3 text-xs text-gray-500">
          <span>
            Showing <strong className="text-gray-900">{visiblePrograms.length}</strong> of{" "}
            <strong>{programs.length}</strong> certification courses
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="itsc-press font-semibold text-brand-gold-accessible hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Row 1: Technology Vendors with horizontal fade mask */}
      <div className="hidden md:block">
        <div className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
          Vendors &amp; Disciplines
        </div>
        <div className="relative itsc-fade-edge-x">
          <div
            className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin px-2"
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
      </div>

      {/* Row 2: Nested Subcategories / Tracks (shown when vendor has tracks on desktop) */}
      {vendorSubcategories.length > 0 && (
        <div className="hidden md:block rounded-xl border border-brand-gold/20 bg-brand-gold/[0.04] p-3.5">
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

      {/* Mobile Filter Sheet (ISSUE-PUB-05 with sticky apply/reset footer and touch sliding gestures) */}
      {mobileFilterOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filter courses by vendor and category"
          className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40 backdrop-blur-[2px] md:hidden"
          onClick={() => setMobileFilterOpen(false)}
        >
          <div
            onTouchStart={handleFilterTouchStart}
            onTouchMove={handleFilterTouchMove}
            onTouchEnd={handleFilterTouchEnd}
            style={{
              transform: filterDragY > 0 ? `translateY(${filterDragY}px)` : undefined,
              transition: isFilterDragging ? "none" : "transform 260ms cubic-bezier(0.16, 1, 0.3, 1)"
            }}
            className="itsc-sheet-enter flex max-h-[85vh] flex-col rounded-t-3xl bg-white shadow-2xl overscroll-contain"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grab handle for touch sliding */}
            <div className="flex justify-center pt-3 pb-1 cursor-grab touch-none">
              <div className="h-1.5 w-12 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors" />
            </div>

            {/* Sheet Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">Filter Courses</h3>
                <p className="text-xs text-gray-500">
                  {visiblePrograms.length} courses match selection
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="itsc-press rounded-full p-2 text-gray-400 hover:bg-gray-100 cursor-pointer"
                aria-label="Close filter drawer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Categories List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">
                  Select Technology Vendor
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectVendor("all")}
                    className={`itsc-press flex items-center justify-between rounded-xl border p-2.5 text-xs text-left font-semibold ${
                      selectedVendor === "all"
                        ? "border-brand-ink bg-brand-ink text-white"
                        : "border-gray-200 bg-gray-50/50 text-gray-700"
                    }`}
                  >
                    <span>All Vendors</span>
                    {selectedVendor === "all" && <Check className="h-3.5 w-3.5 text-brand-gold" />}
                  </button>

                  {topLevelVendors.map((vendor) => {
                    const count = programs.filter(
                      (p) => p.category.slug === vendor.slug || p.category.parentId === vendor.id
                    ).length;
                    const isSelected = selectedVendor === vendor.slug;
                    return (
                      <button
                        key={vendor.slug}
                        type="button"
                        onClick={() => handleSelectVendor(vendor.slug)}
                        className={`itsc-press flex items-center justify-between rounded-xl border p-2.5 text-xs text-left font-semibold ${
                          isSelected
                            ? "border-brand-ink bg-brand-ink text-white"
                            : "border-gray-200 bg-gray-50/50 text-gray-700"
                        }`}
                      >
                        <span className="truncate pr-1">{vendor.name}</span>
                        <span className={`text-[10px] ${isSelected ? "text-brand-gold" : "text-gray-400"}`}>
                          ({count})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Specialization Tracks if active */}
              {vendorSubcategories.length > 0 && (
                <div className="rounded-2xl border border-brand-gold/20 bg-brand-gold/[0.04] p-3.5">
                  <div className="text-xs font-bold text-brand-ink mb-2">
                    {currentVendor?.name} Specialization Tracks
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedSubcat("all")}
                      className={`itsc-press rounded-lg px-3 py-1.5 text-xs font-semibold ${
                        selectedSubcat === "all"
                          ? "bg-brand-gold text-brand-ink shadow-xs"
                          : "border border-brand-gold/20 bg-white text-gray-700"
                      }`}
                    >
                      All Tracks
                    </button>
                    {vendorSubcategories.map((subcat) => {
                      const count = programs.filter((p) => p.category.slug === subcat.slug).length;
                      const isSelected = selectedSubcat === subcat.slug;
                      return (
                        <button
                          key={subcat.slug}
                          type="button"
                          onClick={() => setSelectedSubcat(subcat.slug)}
                          className={`itsc-press rounded-lg px-3 py-1.5 text-xs font-semibold ${
                            isSelected
                              ? "bg-brand-gold text-brand-ink shadow-xs"
                              : "border border-brand-gold/20 bg-white text-gray-700"
                          }`}
                        >
                          {subcat.name} ({count})
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Action Footer (ISSUE-PUB-05 resolution) */}
            <div className="sticky bottom-0 border-t border-gray-100 bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] flex gap-3">
              <button
                type="button"
                onClick={clearFilters}
                className="itsc-press flex-1 rounded-xl border border-gray-200 py-3 text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                Reset All
              </button>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="itsc-press flex-[2] rounded-xl bg-brand-ink py-3 text-xs font-bold text-white shadow-md hover:bg-brand-navy"
              >
                Show {visiblePrograms.length} Courses
              </button>
            </div>
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
            <BookOpen aria-hidden="true" className="h-6 w-6 text-brand-gold-accessible" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-gray-900">No courses match your filter</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search keywords or switching vendors.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="itsc-press mt-4 rounded-lg bg-brand-gold px-4 py-2 text-sm font-bold text-brand-ink hover:bg-brand-gold-400"
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
      className={`itsc-press shrink-0 rounded-full px-4 py-2 text-xs sm:text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold ${
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
      className={`itsc-press rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
        active
          ? "bg-brand-gold text-brand-ink shadow-xs"
          : "bg-white text-gray-700 hover:bg-white/80 border border-brand-gold/20"
      }`}
    >
      {children}
    </button>
  );
}
