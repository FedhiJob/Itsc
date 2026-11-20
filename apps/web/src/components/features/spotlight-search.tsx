"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, X, BookOpen, Layers, ArrowRight, CornerDownLeft, Sparkles, Clock } from "lucide-react";
import { Loading } from "@/components/ui/loading";

interface SearchCategory {
  id: string;
  name: string;
  slug: string;
  count: number;
}

interface SearchProgram {
  id: string;
  title: string;
  slug: string;
  code: string | null;
  category: string;
  categorySlug: string;
  duration: string | null;
  level: string | null;
}

interface SearchData {
  categories: SearchCategory[];
  programs: SearchProgram[];
}

const POPULAR_SEARCHES = [
  "Cisco CCNA",
  "CompTIA Security+",
  "Microsoft Azure",
  "SQL Database",
  "Python Development",
  "Cybersecurity",
];

export function SpotlightSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [data, setData] = useState<SearchData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Load search index on first open or prefetch
  useEffect(() => {
    if (!isOpen || data) return;
    let isMounted = true;
    setIsLoading(true);

    fetch("/api/search")
      .then((res) => res.json())
      .then((json: SearchData) => {
        if (isMounted) {
          setData(json);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Spotlight search load error:", err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, data]);

  // Listen to keyboard shortcuts & custom event
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    }

    function handleCustomOpen() {
      setIsOpen(true);
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("itsc:open-search", handleCustomOpen);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("itsc:open-search", handleCustomOpen);
    };
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Filtered results
  const filteredResults = useMemo(() => {
    if (!data) return { categories: [], programs: [] };
    const q = query.trim().toLowerCase();
    if (!q) return { categories: [], programs: [] };

    const matchingCategories = data.categories
      .filter((c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q))
      .slice(0, 4);

    const matchingPrograms = data.programs
      .filter((p) => {
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesCode = p.code?.toLowerCase().includes(q) ?? false;
        const matchesCat = p.category.toLowerCase().includes(q);
        return matchesTitle || matchesCode || matchesCat;
      })
      .slice(0, 12);

    return {
      categories: matchingCategories,
      programs: matchingPrograms,
    };
  }, [data, query]);

  // Flattened items for keyboard navigation
  const allNavItems = useMemo(() => {
    const items: Array<{ type: "category" | "program"; url: string; title: string }> = [];
    filteredResults.categories.forEach((cat) => {
      items.push({
        type: "category",
        url: `/training-programs?category=${cat.slug}`,
        title: cat.name,
      });
    });
    filteredResults.programs.forEach((prog) => {
      items.push({
        type: "program",
        url: `/training-programs/${prog.slug}`,
        title: prog.title,
      });
    });
    return items;
  }, [filteredResults]);

  // Handle arrow keys and Enter
  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (allNavItems.length > 0) {
        setSelectedIndex((prev) => (prev + 1) % allNavItems.length);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (allNavItems.length > 0) {
        setSelectedIndex((prev) => (prev - 1 + allNavItems.length) % allNavItems.length);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (allNavItems.length > 0 && allNavItems[selectedIndex]) {
        navigateAndClose(allNavItems[selectedIndex].url);
      } else if (query.trim()) {
        navigateAndClose(`/training-programs?search=${encodeURIComponent(query.trim())}`);
      }
    }
  }

  function navigateAndClose(url: string) {
    setIsOpen(false);
    router.push(url);
  }

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Spotlight search for courses and certifications"
      className="fixed inset-0 z-50 flex items-start justify-center pt-14 sm:pt-20 px-4 bg-brand-navy/60 backdrop-blur-md transition-opacity duration-200"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="itsc-popover-enter w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/10 focus-visible:outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-gray-200/90 px-4 py-3.5 bg-gray-50/50">
          <Search aria-hidden="true" className="h-5 w-5 text-brand-gold shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
            placeholder="Search courses by title, exam code (e.g. AZ-104, CCNA) or topic..."
            className="flex-1 bg-transparent text-sm sm:text-base text-gray-900 placeholder:text-gray-400 focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSelectedIndex(0);
                inputRef.current?.focus();
              }}
              className="itsc-press rounded-md p-1 text-gray-400 hover:text-gray-600"
              aria-label="Clear query"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-1 rounded bg-gray-200/80 px-2 py-0.5 text-[11px] font-semibold text-gray-600">
              ESC
            </kbd>
          )}
        </div>

        {/* Results Container */}
        <div ref={listRef} className="max-h-[60vh] overflow-y-auto p-4 space-y-4 overscroll-contain">
          {isLoading && !data ? (
            <Loading variant="inline" text="Loading certification index..." />
          ) : query.trim() ? (
            allNavItems.length > 0 ? (
              <div className="space-y-4">
                {/* Categories Section */}
                {filteredResults.categories.length > 0 && (
                  <div>
                    <div className="mb-2 flex items-center gap-1.5 px-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                      <Layers className="h-3.5 w-3.5" />
                      <span>Disciplines &amp; Categories</span>
                    </div>
                    <div className="space-y-1">
                      {filteredResults.categories.map((cat, idx) => {
                        const isSelected = selectedIndex === idx;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => navigateAndClose(`/training-programs?category=${cat.slug}`)}
                            onMouseEnter={() => setSelectedIndex(idx)}
                            className={`itsc-press w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                              isSelected
                                ? "bg-brand-gold/15 text-brand-ink font-semibold"
                                : "text-gray-700 hover:bg-gray-100/80"
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-brand-gold" />
                              <span>{cat.name}</span>
                            </span>
                            <span className="text-xs text-gray-400 font-normal">
                              Browse track &rarr;
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Programs Section */}
                {filteredResults.programs.length > 0 && (
                  <div>
                    <div className="mb-2 flex items-center gap-1.5 px-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>Certification Programs ({filteredResults.programs.length})</span>
                    </div>
                    <div className="space-y-1.5">
                      {filteredResults.programs.map((prog, pIdx) => {
                        const itemIndex = filteredResults.categories.length + pIdx;
                        const isSelected = selectedIndex === itemIndex;
                        return (
                          <button
                            key={prog.id}
                            type="button"
                            onClick={() => navigateAndClose(`/training-programs/${prog.slug}`)}
                            onMouseEnter={() => setSelectedIndex(itemIndex)}
                            className={`itsc-press w-full flex items-start justify-between rounded-xl p-3 text-left transition-colors ${
                              isSelected
                                ? "bg-brand-navy text-white shadow-xs"
                                : "bg-gray-50/60 hover:bg-gray-100 text-gray-800"
                            }`}
                          >
                            <div className="flex-1 min-w-0 pr-3">
                              <div className="flex flex-wrap items-center gap-1.5 mb-1">
                                {prog.code && (
                                  <span
                                    className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                      isSelected ? "bg-brand-gold text-brand-ink" : "bg-brand-ink/10 text-brand-ink"
                                    }`}
                                  >
                                    {prog.code}
                                  </span>
                                )}
                                <span
                                  className={`text-[11px] font-medium px-1.5 py-0.5 rounded ${
                                    isSelected ? "bg-white/20 text-white" : "bg-gray-200/70 text-gray-700"
                                  }`}
                                >
                                  {prog.category}
                                </span>
                                {prog.level && (
                                  <span
                                    className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                                      isSelected ? "bg-white/10 text-gray-200" : "bg-gray-100 text-gray-600"
                                    }`}
                                  >
                                    {prog.level}
                                  </span>
                                )}
                              </div>
                              <h4 className="text-sm font-semibold truncate leading-snug">
                                {prog.title}
                              </h4>
                            </div>
                            <div className="shrink-0 flex items-center gap-2 self-center">
                              {prog.duration && (
                                <span className={`text-[11px] flex items-center gap-1 ${isSelected ? "text-gray-300" : "text-gray-400"}`}>
                                  <Clock className="h-3 w-3" />
                                  {prog.duration}
                                </span>
                              )}
                              <ArrowRight
                                className={`h-4 w-4 transition-transform ${
                                  isSelected ? "translate-x-0.5 text-brand-gold" : "text-gray-300"
                                }`}
                              />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-10 text-center">
                <BookOpen className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                <p className="text-sm font-medium text-gray-900">
                  No courses match &ldquo;{query}&rdquo;
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Try searching with standard exam codes (e.g. 20764, AZ-900, CCNA) or broader terms.
                </p>
              </div>
            )
          ) : (
            <div>
              <div className="mb-2.5 flex items-center gap-1.5 px-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                <Sparkles className="h-3.5 w-3.5 text-brand-gold" />
                <span>Popular Searches</span>
              </div>
              <div className="flex flex-wrap gap-2 px-1">
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setQuery(term);
                      inputRef.current?.focus();
                    }}
                    className="itsc-press rounded-full border border-gray-200 bg-gray-50/80 px-3.5 py-1.5 text-xs font-medium text-gray-700 transition hover:border-brand-gold hover:bg-brand-gold/10 hover:text-brand-ink"
                  >
                    {term}
                  </button>
                ))}
              </div>

              <div className="mt-6 border-t border-gray-100 pt-4 px-2">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Need tailored guidance?</span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      window.dispatchEvent(new CustomEvent("itsc:open-chat"));
                    }}
                    className="font-bold text-brand-gold-accessible hover:underline inline-flex items-center gap-1"
                  >
                    <span>Ask ITSC AI</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/60 px-4 py-2 text-[11px] text-gray-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded bg-white border border-gray-200 px-1 py-0.5 text-[10px] font-semibold text-gray-600 shadow-xs">
                &uarr;
              </kbd>
              <kbd className="rounded bg-white border border-gray-200 px-1 py-0.5 text-[10px] font-semibold text-gray-600 shadow-xs">
                &darr;
              </kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded bg-white border border-gray-200 px-1.5 py-0.5 text-[10px] font-semibold text-gray-600 shadow-xs inline-flex items-center">
                <CornerDownLeft className="h-2.5 w-2.5" />
              </kbd>
              <span>to select</span>
            </span>
          </div>
          <span>Official ITSC Catalog</span>
        </div>
      </div>
    </div>
  );
}
