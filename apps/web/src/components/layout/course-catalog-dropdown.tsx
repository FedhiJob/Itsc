"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Sparkles
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface NavCourse {
  title: string;
  slug: string;
  code?: string;
  duration?: string;
}

interface NavSubcategory {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
}

interface NavVendor {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  children?: NavSubcategory[];
}

interface CourseCatalogDropdownProps {
  onNavigate?: () => void;
  isMobile?: boolean;
}

export function CourseCatalogDropdown({ onNavigate, isMobile = false }: CourseCatalogDropdownProps) {
  const pathname = usePathname();
  const [vendors, setVendors] = useState<NavVendor[]>([]);
  const [loading, setLoading] = useState(true);

  // Desktop flyout state
  const [isOpen, setIsOpen] = useState(false);
  const [activeVendorSlug, setActiveVendorSlug] = useState<string | null>(null);
  const [activeSubcatSlug, setActiveSubcatSlug] = useState<string | null>(null);
  const [coursesBySubcat, setCoursesBySubcat] = useState<Record<string, NavCourse[]>>({});
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mobile accordion state
  const [mobileExpandedVendor, setMobileExpandedVendor] = useState<string | null>(null);
  const [mobileExpandedSubcat, setMobileExpandedSubcat] = useState<string | null>(null);

  const handleNavClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  // Fetch categories and subcategories
  useEffect(() => {
    let isMounted = true;
    async function loadNavData() {
      try {
        const res = await fetch(`${siteConfig.apiUrl}/training/categories`);
        if (!res.ok) throw new Error("Failed to load navigation categories");
        const json = await res.json();
        const data = json.data ?? [];

        // Filter top-level vendors (parentId == null)
        const vendorList: NavVendor[] = data
          .filter((cat: any) => !cat.parentId)
          .map((v: any) => ({
            id: v.id,
            name: v.name,
            slug: v.slug,
            sortOrder: v.sortOrder ?? 0,
            children: (v.children ?? []).map((ch: any) => ({
              id: ch.id,
              name: ch.name,
              slug: ch.slug,
              sortOrder: ch.sortOrder ?? 0
            }))
          }))
          .sort((a: NavVendor, b: NavVendor) => a.sortOrder - b.sortOrder);

        if (isMounted) {
          setVendors(vendorList);
          const firstVendor = vendorList[0];
          if (firstVendor) {
            setActiveVendorSlug(firstVendor.slug);
            const firstSubcat = firstVendor.children?.[0];
            if (firstSubcat) {
              setActiveSubcatSlug(firstSubcat.slug);
            }
          }
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadNavData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch courses for the active subcategory on demand
  useEffect(() => {
    const subcatSlug = activeSubcatSlug;
    if (!subcatSlug || coursesBySubcat[subcatSlug]) return;

    let isMounted = true;
    const targetSlug: string = subcatSlug;
    async function fetchSubcatCourses() {
      try {
        const res = await fetch(`${siteConfig.apiUrl}/training/programs?category=${targetSlug}&limit=50`);
        if (!res.ok) return;
        const json = await res.json();
        const list: NavCourse[] = (json.data?.programs ?? []).map((p: any) => ({
          title: p.title,
          slug: p.slug,
          code: p.code,
          duration: p.duration
        }));
        if (isMounted) {
          setCoursesBySubcat((prev) => ({ ...prev, [targetSlug]: list }));
        }
      } catch (e) {
        // silent fallback
      }
    }

    fetchSubcatCourses();
    return () => {
      isMounted = false;
    };
  }, [activeSubcatSlug, coursesBySubcat]);

  // Handle desktop hover interactions
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  // Find active items for desktop columns
  const activeVendor = vendors.find((v) => v.slug === activeVendorSlug) ?? vendors[0];
  const activeSubcategories = activeVendor?.children ?? [];
  const currentSubcat = activeSubcategories.find((s) => s.slug === activeSubcatSlug) ?? activeSubcategories[0];
  const activeCourses = currentSubcat ? coursesBySubcat[currentSubcat.slug] ?? [] : [];

  // ==========================================
  // MOBILE ACCORDION NAVIGATION
  // ==========================================
  if (isMobile) {
    return (
      <div className="space-y-1 py-1">
        <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-gray-500">
          Course Catalogue &amp; Tracks
        </div>
        <div className="space-y-1">
          {vendors.map((vendor) => {
            const isVendorOpen = mobileExpandedVendor === vendor.slug;
            const subcats = vendor.children ?? [];

            return (
              <div key={vendor.slug} className="rounded-lg border border-gray-100 bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => setMobileExpandedVendor(isVendorOpen ? null : vendor.slug)}
                  className="flex w-full items-center justify-between px-3.5 py-2.5 text-left text-sm font-semibold text-gray-800 hover:bg-gray-50"
                >
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-brand-gold" />
                    {vendor.name}
                  </span>
                  <ChevronDown
                    aria-hidden="true"
                    className={cn(
                      "h-4 w-4 text-gray-400 transition-transform duration-200",
                      isVendorOpen && "rotate-180 text-brand-gold-700"
                    )}
                  />
                </button>

                {isVendorOpen && (
                  <div className="border-t border-gray-100 bg-gray-50/70 px-3 py-2">
                    <Link
                      href={`/training-programs?category=${vendor.slug}`}
                      onClick={handleNavClick}
                      className="mb-2 flex items-center justify-between rounded px-2.5 py-1.5 text-xs font-semibold text-brand-gold-700 hover:bg-brand-gold/10"
                    >
                      <span>View All {vendor.name} Courses</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>

                    {subcats.length > 0 && (
                      <div className="space-y-1">
                        {subcats.map((subcat) => {
                          const isSubcatOpen = mobileExpandedSubcat === subcat.slug;

                          return (
                            <div key={subcat.slug} className="rounded border border-gray-200/60 bg-white">
                              <button
                                type="button"
                                onClick={() => {
                                  const next = isSubcatOpen ? null : subcat.slug;
                                  setMobileExpandedSubcat(next);
                                  if (next && !coursesBySubcat[next]) {
                                    const nextSlug: string = next;
                                    fetch(`${siteConfig.apiUrl}/training/programs?category=${nextSlug}&limit=50`)
                                      .then((r) => r.json())
                                      .then((j) => {
                                        const list = (j.data?.programs ?? []).map((p: any) => ({
                                          title: p.title,
                                          slug: p.slug,
                                          code: p.code,
                                          duration: p.duration
                                        }));
                                        setCoursesBySubcat((prev) => ({ ...prev, [nextSlug]: list }));
                                      });
                                  }
                                }}
                                className="flex w-full items-center justify-between px-3 py-2 text-xs font-medium text-gray-700 hover:text-brand-ink"
                              >
                                <span>{subcat.name}</span>
                                <ChevronDown
                                  className={cn(
                                    "h-3.5 w-3.5 text-gray-400 transition-transform",
                                    isSubcatOpen && "rotate-180"
                                  )}
                                />
                              </button>

                              {isSubcatOpen && (
                                <div className="border-t border-gray-100 px-3 py-2">
                                  <Link
                                    href={`/training-programs?category=${subcat.slug}`}
                                    onClick={handleNavClick}
                                    className="block pb-1.5 text-xs font-bold text-brand-gold-700 underline"
                                  >
                                    View all in {subcat.name}
                                  </Link>
                                  <ul className="mt-1 space-y-1">
                                    {(coursesBySubcat[subcat.slug] ?? []).slice(0, 10).map((course) => (
                                      <li key={course.slug}>
                                        <Link
                                          href={`/training-programs/${course.slug}`}
                                          onClick={handleNavClick}
                                          className="flex items-center justify-between py-1 text-xs text-gray-600 hover:text-brand-gold-700"
                                        >
                                          <span className="line-clamp-1">{course.title}</span>
                                          {course.duration && (
                                            <span className="shrink-0 text-[10px] text-gray-400">{course.duration}</span>
                                          )}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ==========================================
  // DESKTOP CASCADING FLYOUT NAVIGATION
  // ==========================================
  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href="/training-programs"
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold",
          pathname.startsWith("/training-programs")
            ? "bg-brand-gold/10 font-semibold text-brand-ink"
            : "text-gray-600",
          isOpen && "bg-gray-100 text-gray-900"
        )}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <span>Certifications &amp; Courses</span>
        <ChevronDown
          aria-hidden="true"
          className={cn("h-4 w-4 transition-transform duration-200", isOpen && "rotate-180")}
        />
      </Link>

      {isOpen && (
        <div
          className="absolute left-0 top-full z-50 mt-1 flex w-[880px] rounded-xl border border-gray-200/90 bg-white shadow-2xl backdrop-blur-sm"
          role="menu"
          aria-orientation="vertical"
        >
          {/* Column 1: Top-level Vendors (19 items) */}
          <div className="w-[240px] shrink-0 border-r border-gray-100 bg-gray-50/70 p-2 max-h-[540px] overflow-y-auto">
            <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Technology Vendors
            </div>
            <div className="space-y-0.5">
              {vendors.map((vendor) => {
                const isActive = (activeVendor?.slug ?? "") === vendor.slug;
                return (
                  <button
                    key={vendor.slug}
                    type="button"
                    onMouseEnter={() => {
                      setActiveVendorSlug(vendor.slug);
                      const firstChild = vendor.children?.[0];
                      if (firstChild) {
                        setActiveSubcatSlug(firstChild.slug);
                      } else {
                        setActiveSubcatSlug(null);
                      }
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-semibold transition-all",
                      isActive
                        ? "bg-brand-gold text-brand-ink shadow-xs font-bold"
                        : "text-gray-700 hover:bg-white hover:text-brand-ink"
                    )}
                  >
                    <span className="truncate">{vendor.name}</span>
                    <ChevronRight
                      aria-hidden="true"
                      className={cn("h-3.5 w-3.5 shrink-0 transition-transform", isActive ? "text-brand-ink" : "text-gray-400")}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Column 2: Nested Subcategories / Tracks */}
          <div className="w-[260px] shrink-0 border-r border-gray-100 bg-white p-3 max-h-[540px] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-2">
              <span className="text-xs font-bold text-brand-ink">{activeVendor?.name} Tracks</span>
              <Link
                href={activeVendor?.slug ? `/training-programs?category=${activeVendor.slug}` : "/training-programs"}
                onClick={() => setIsOpen(false)}
                className="text-[11px] font-semibold text-brand-gold-700 hover:underline"
              >
                All Courses &rarr;
              </Link>
            </div>

            {activeSubcategories.length === 0 ? (
              <div className="py-6 text-center text-xs text-gray-400">
                Direct vendor programmes
              </div>
            ) : (
              <div className="space-y-1">
                {activeSubcategories.map((subcat) => {
                  const isSubcatActive = (currentSubcat?.slug ?? "") === subcat.slug;
                  return (
                    <button
                      key={subcat.slug}
                      type="button"
                      onMouseEnter={() => setActiveSubcatSlug(subcat.slug)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors",
                        isSubcatActive
                          ? "bg-gray-100 font-bold text-brand-ink"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <span className="truncate">{subcat.name}</span>
                      <ChevronRight
                        aria-hidden="true"
                        className={cn("h-3.5 w-3.5 shrink-0", isSubcatActive ? "text-brand-ink" : "text-gray-300")}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Column 3: Course Titles, Codes & Direct Links */}
          <div className="flex-1 bg-white p-4 max-h-[540px] flex flex-col">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
              <div>
                <h4 className="text-xs font-bold text-brand-ink">
                  {currentSubcat ? currentSubcat.name : activeVendor?.name}
                </h4>
                <p className="text-[11px] text-gray-500">Documented Certification Courses</p>
              </div>
              {currentSubcat && (
                <Link
                  href={`/training-programs?category=${currentSubcat.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center gap-1 rounded bg-brand-gold/10 px-2 py-1 text-[11px] font-bold text-brand-gold-700 hover:bg-brand-gold/20"
                >
                  <span>Filter Catalogue</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              )}
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-1.5">
              {activeCourses.length === 0 ? (
                <div className="py-8 text-center text-xs text-gray-400">
                  <BookOpen className="mx-auto mb-2 h-6 w-6 text-gray-300" />
                  Loading courses for this track...
                </div>
              ) : (
                activeCourses.map((course) => (
                  <Link
                    key={course.slug}
                    href={`/training-programs/${course.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="group flex items-start justify-between rounded-lg p-2 transition-colors hover:bg-gray-50"
                  >
                    <div className="pr-3">
                      <div className="text-xs font-semibold text-gray-800 group-hover:text-brand-ink line-clamp-1">
                        {course.title}
                      </div>
                      {course.code && (
                        <span className="mt-0.5 inline-block text-[10px] font-mono text-gray-400">
                          Code: {course.code}
                        </span>
                      )}
                    </div>
                    {course.duration && (
                      <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                        {course.duration}
                      </span>
                    )}
                  </Link>
                ))
              )}
            </div>

            <div className="mt-auto border-t border-gray-100 pt-3">
              <Link
                href="/training-programs"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between text-xs font-bold text-brand-gold-700 hover:underline"
              >
                <span>Browse All 260+ Documented Courses &rarr;</span>
                <Sparkles className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

