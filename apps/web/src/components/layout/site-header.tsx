"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Bot, Mail, MapPin, Menu, Phone, Search, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import logo from "../../../public/itsc_logo.png";
import { cn } from "@/lib/utils";
import { CourseCatalogDropdown } from "./course-catalog-dropdown";

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Touch swipe-to-dismiss tracking for mobile drawer
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      touchStartXRef.current = touch.clientX;
      touchStartYRef.current = touch.clientY;
      setIsDragging(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touch = e.touches[0];
    if (!touch) return;
    const deltaX = touch.clientX - touchStartXRef.current;
    const deltaY = Math.abs(touch.clientY - (touchStartYRef.current ?? touch.clientY));

    // If predominantly horizontal swiping to the right
    if (deltaX > 0 && deltaX > deltaY) {
      setDragOffsetX(deltaX);
    }
  };

  const handleTouchEnd = () => {
    if (dragOffsetX > 55) {
      setMenuOpen(false);
    }
    setDragOffsetX(0);
    setIsDragging(false);
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  // Shrink-on-scroll listener for desktop & mobile
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 16);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll and trap keyboard focus inside the drawer while open
  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const previousActive = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus the first interactive element inside menu when opened
    const timer = setTimeout(() => {
      if (drawerRef.current) {
        const firstFocusable = drawerRef.current.querySelector<HTMLElement>('button, a, input');
        firstFocusable?.focus();
      }
    }, 50);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        return;
      }

      // Keyboard Focus Trap inside the mobile drawer
      if (event.key === "Tab" && drawerRef.current) {
        const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const focusables = Array.from(
          drawerRef.current.querySelectorAll<HTMLElement>(focusableSelectors)
        ).filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);

        if (focusables.length === 0) return;

        const firstElement = focusables[0];
        const lastElement = focusables[focusables.length - 1];

        if (!firstElement || !lastElement) return;

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
          }
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", onKeyDown);
      if (previousActive && typeof previousActive.focus === "function") {
        previousActive.focus();
      }
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 border-b border-gray-200/80 transition-all duration-300",
          scrolled
            ? "itsc-glass-nav shadow-xs bg-white/90"
            : "bg-white/95 backdrop-blur shadow-xs"
        )}
      >
        {/* Top Institutional Contact & Credential Bar (Collapses smoothly on scroll) */}
        <div
          className={cn(
            "hidden bg-brand-gold text-brand-ink lg:block overflow-hidden transition-all duration-300",
            scrolled ? "max-h-0 opacity-0" : "max-h-9 opacity-100"
          )}
        >
          <div className="mx-auto flex h-9 w-full max-w-7xl items-center justify-between px-6 text-xs font-semibold xl:px-8">
            <div className="flex items-center gap-6">
              <span className="inline-flex items-center gap-1.5">
                <MapPin aria-hidden="true" className="h-3.5 w-3.5" /> {siteConfig.links.address}
              </span>
              <a href={`mailto:${siteConfig.links.email}`} className="inline-flex items-center gap-1.5 hover:underline">
                <Mail aria-hidden="true" className="h-3.5 w-3.5" /> {siteConfig.links.email}
              </a>
              <a href={`tel:${siteConfig.links.phone}`} className="inline-flex items-center gap-1.5 hover:underline">
                <Phone aria-hidden="true" className="h-3.5 w-3.5" /> {siteConfig.links.phone}
              </a>
            </div>
            <span className="uppercase tracking-[0.14em]">Pioneering IT Excellence in Ethiopia Since 1999</span>
          </div>
        </div>

        {/* Main Navbar */}
        <div
          className={cn(
            "mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 transition-all duration-300",
            scrolled ? "h-14" : "h-16"
          )}
        >
          <Link href="/" className="flex items-center gap-3 itsc-press" aria-label="ITSC home">
            <Image
              src={logo}
              alt="ITSC"
              width={140}
              height={54}
              className={cn(
                "h-auto w-auto object-contain transition-all duration-300",
                scrolled ? "max-h-10" : "max-h-12"
              )}
              priority
            />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
            <Link
              href="/"
              aria-current={pathname === "/" ? "page" : undefined}
              className={cn(
                "itsc-press rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold",
                pathname === "/" ? "bg-brand-gold/15 text-brand-ink font-semibold" : "text-gray-600"
              )}
            >
              Home
            </Link>

            <Link
              href="/about"
              aria-current={pathname === "/about" ? "page" : undefined}
              className={cn(
                "itsc-press rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold",
                pathname === "/about" ? "bg-brand-gold/15 text-brand-ink font-semibold" : "text-gray-600"
              )}
            >
              About
            </Link>

            {/* Dynamic Multi-level Cascading Course Catalog Navigation */}
            <CourseCatalogDropdown />

            <Link
              href="/corporate-training"
              aria-current={pathname === "/corporate-training" ? "page" : undefined}
              className={cn(
                "itsc-press rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold",
                pathname === "/corporate-training" ? "bg-brand-gold/15 text-brand-ink font-semibold" : "text-gray-600"
              )}
            >
              Corporate Training
            </Link>

            <Link
              href="/news"
              aria-current={pathname.startsWith("/news") ? "page" : undefined}
              className={cn(
                "itsc-press rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold",
                pathname.startsWith("/news") ? "bg-brand-gold/15 text-brand-ink font-semibold" : "text-gray-600"
              )}
            >
              News &amp; Events
            </Link>

            <Link
              href="/gallery"
              aria-current={pathname === "/gallery" ? "page" : undefined}
              className={cn(
                "itsc-press rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold",
                pathname === "/gallery" ? "bg-brand-gold/15 text-brand-ink font-semibold" : "text-gray-600"
              )}
            >
              Gallery
            </Link>

            <Link
              href="/contact"
              aria-current={pathname === "/contact" ? "page" : undefined}
              className={cn(
                "itsc-press rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold",
                pathname === "/contact" ? "bg-brand-gold/15 text-brand-ink font-semibold" : "text-gray-600"
              )}
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-2.5">
            {/* Quick Spotlight Search Trigger */}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("itsc:open-search"))}
              className="itsc-press inline-flex items-center gap-1.5 h-9 rounded-lg border border-gray-200/80 px-2.5 text-xs text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-brand-gold"
              aria-label="Search training courses (Cmd+K)"
              title="Search training courses (Cmd+K)"
            >
              <Search aria-hidden="true" className="h-4 w-4" />
              <span className="hidden md:inline text-xs text-gray-500 font-normal">Search...</span>
              <kbd className="hidden md:inline-flex items-center rounded bg-gray-100 border border-gray-200 px-1 py-0.5 text-[10px] font-mono text-gray-500">
                ⌘K
              </kbd>
            </button>

            <a
              href={`tel:${siteConfig.links.phone}`}
              className="itsc-press hidden items-center gap-1.5 text-xs font-semibold text-gray-600 transition-colors hover:text-brand-gold-700 xl:inline-flex"
            >
              <Phone aria-hidden="true" className="h-3.5 w-3.5 text-brand-gold-700" />
              {siteConfig.links.phone}
            </a>

            <Button
              size="sm"
              className="hidden sm:inline-flex shadow-xs"
              onClick={() => window.dispatchEvent(new CustomEvent("itsc:open-chat"))}
              aria-label="Open ITSC AI assistant"
            >
              <Bot aria-hidden="true" className="h-4 w-4" />
              <span>ITSC AI</span>
            </Button>

            <button
              ref={triggerRef}
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="itsc-press inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200/80 text-gray-900 transition-colors hover:bg-gray-100 lg:hidden focus-visible:outline-2 focus-visible:outline-brand-gold cursor-pointer"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              {menuOpen ? (
                <X aria-hidden="true" className="h-5 w-5 text-brand-navy" />
              ) : (
                <Menu aria-hidden="true" className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Out Drawer with Touch Swipe & Click Everywhere */}
      {menuOpen ? (
        <div
          className="fixed inset-0 z-[100] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          {/* Backdrop scrim - click anywhere on the exposed page to dismiss */}
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 h-full w-full bg-brand-navy/40 backdrop-blur-[2px] transition-opacity duration-200 cursor-pointer"
          />

          {/* Drawer container:
              - Sized to w-[82vw] max-w-[315px] so it NEVER covers the whole page (leaves 18%-25% screen visible on the left)
              - Touch swipe right to dismiss
              - Smooth spring transform
          */}
          <div
            id="mobile-menu"
            ref={drawerRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              transform: dragOffsetX > 0 ? `translateX(${dragOffsetX}px)` : undefined,
              transition: isDragging ? "none" : "transform 260ms cubic-bezier(0.16, 1, 0.3, 1)"
            }}
            className="itsc-drawer-enter absolute inset-y-0 right-0 flex w-[82vw] max-w-[315px] flex-col bg-white shadow-2xl rounded-l-3xl border-l border-gray-100 overscroll-contain pb-[env(safe-area-inset-bottom,1.5rem)]"
          >
            {/* Grab handle indicator on the left edge */}
            <div className="absolute left-1.5 top-1/2 -translate-y-1/2 h-12 w-1 rounded-full bg-gray-300 opacity-70 pointer-events-none" />

            <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-100 px-5">
              <Image
                src={logo}
                alt="ITSC"
                width={120}
                height={44}
                className="h-auto w-auto max-h-9 object-contain"
              />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="itsc-press inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-brand-gold cursor-pointer"
                aria-label="Close navigation menu"
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto space-y-1 px-4 py-4" aria-label="Mobile navigation links">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setTimeout(() => window.dispatchEvent(new CustomEvent("itsc:open-search")), 150);
                }}
                className="itsc-press w-full mb-3 flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50/80 px-3.5 py-2.5 text-xs text-gray-500 hover:bg-gray-100 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-brand-gold" />
                  <span>Search 260+ courses...</span>
                </span>
                <kbd className="rounded bg-white border border-gray-200 px-1.5 py-0.5 text-[10px] font-mono text-gray-500">
                  ⌘K
                </kbd>
              </button>

              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "itsc-press block rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors hover:bg-gray-100",
                  pathname === "/" ? "bg-brand-gold/15 font-bold text-brand-ink" : "text-gray-700"
                )}
              >
                Home
              </Link>

              <Link
                href="/about"
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "itsc-press block rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors hover:bg-gray-100",
                  pathname === "/about" ? "bg-brand-gold/15 font-bold text-brand-ink" : "text-gray-700"
                )}
              >
                About
              </Link>

              {/* Mobile Catalogue Accordion */}
              <div className="my-2 border-y border-gray-100 py-2">
                <CourseCatalogDropdown isMobile={true} onNavigate={() => setMenuOpen(false)} />
              </div>

              <Link
                href="/corporate-training"
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "itsc-press block rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors hover:bg-gray-100",
                  pathname === "/corporate-training" ? "bg-brand-gold/15 font-bold text-brand-ink" : "text-gray-700"
                )}
              >
                Corporate Training
              </Link>

              <Link
                href="/news"
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "itsc-press block rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors hover:bg-gray-100",
                  pathname.startsWith("/news") ? "bg-brand-gold/15 font-bold text-brand-ink" : "text-gray-700"
                )}
              >
                News &amp; Events
              </Link>

              <Link
                href="/gallery"
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "itsc-press block rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors hover:bg-gray-100",
                  pathname === "/gallery" ? "bg-brand-gold/15 font-bold text-brand-ink" : "text-gray-700"
                )}
              >
                Gallery
              </Link>

              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "itsc-press block rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors hover:bg-gray-100",
                  pathname === "/contact" ? "bg-brand-gold/15 font-bold text-brand-ink" : "text-gray-700"
                )}
              >
                Contact
              </Link>
            </nav>

            <div className="shrink-0 space-y-3 border-t border-gray-100 px-5 py-4 bg-gray-50/50">
              <a
                href={`tel:${siteConfig.links.phone}`}
                className="itsc-press flex items-center gap-2.5 text-sm font-medium text-gray-600"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-gray-200">
                  <Phone aria-hidden="true" className="h-4 w-4 text-brand-gold-accessible" />
                </span>
                <span>{siteConfig.links.phone}</span>
              </a>
              <Button
                className="w-full shadow-xs"
                onClick={() => {
                  setMenuOpen(false);
                  window.dispatchEvent(new CustomEvent("itsc:open-chat"));
                }}
              >
                <Bot aria-hidden="true" className="h-4 w-4" />
                <span>Launch ITSC AI Assistant</span>
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
