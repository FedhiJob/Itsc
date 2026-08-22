"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Bot, Mail, MapPin, Menu, Phone, X } from "lucide-react";
import { mainNavigation, siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import logo from "../../../public/itsc_logo.png";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile menu is open and close on Escape.
  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="hidden bg-brand-gold text-brand-ink lg:block">
        <div className="mx-auto flex h-9 w-full max-w-7xl items-center justify-between px-6 text-xs font-semibold xl:px-8">
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-1.5"><MapPin aria-hidden="true" className="h-3.5 w-3.5" /> {siteConfig.links.address}</span>
            <a href={`mailto:${siteConfig.links.email}`} className="inline-flex items-center gap-1.5 hover:underline"><Mail aria-hidden="true" className="h-3.5 w-3.5" /> {siteConfig.links.email}</a>
            <a href={`tel:${siteConfig.links.phone}`} className="inline-flex items-center gap-1.5 hover:underline"><Phone aria-hidden="true" className="h-3.5 w-3.5" /> {siteConfig.links.phone}</a>
          </div>
          <span className="uppercase tracking-[0.14em]">Imparting Knowledge, Skills &amp; Attitudes</span>
        </div>
      </div>
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="ITSC home">
          <Image
            src={logo}
            alt="ITSC Technology Support"
            width={150}
            height={58}
            className="h-auto w-auto max-h-12 object-contain"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {mainNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold",
                pathname === item.href ? "bg-brand-gold/10 text-brand-ink" : "text-gray-500"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${siteConfig.links.phone}`}
            className="hidden items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-brand-gold xl:inline-flex"
          >
            <Phone aria-hidden="true" className="h-4 w-4" />
            {siteConfig.links.phone}
          </a>
          <Button
            size="sm"
            className="hidden sm:inline-flex"
            onClick={() => window.dispatchEvent(new CustomEvent("itsc:open-chat"))}
          >
            <Bot aria-hidden="true" className="h-4 w-4" />
            Ask ITSC
          </Button>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 text-gray-900 lg:hidden"
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <Menu aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
      </div>
      </header>

      {/* Mobile slide-out menu.
          Rendered OUTSIDE <header> so the fixed overlay escapes the header's
          z-40 stacking context and truly covers every other element on the page. */}
      {menuOpen ? (
        <div className="fixed inset-0 z-[100] lg:hidden" role="dialog" aria-modal="true" aria-label="Mobile navigation">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 h-full w-full bg-brand-navy/40 backdrop-blur-[2px]"
          />
          <div
            id="mobile-menu"
            className="absolute inset-y-0 right-0 flex w-full max-w-[19rem] flex-col bg-white shadow-2xl"
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-100 px-5">
              <Image
                src={logo}
                alt="ITSC Technology Support"
                width={120}
                height={44}
                className="h-auto w-auto max-h-10 object-contain"
              />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900"
                aria-label="Close navigation menu"
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto space-y-0.5 px-4 py-4" aria-label="Mobile navigation">
              {mainNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={cn(
                    "block rounded-lg px-3 py-2.5 text-[15px] font-medium transition-colors hover:bg-gray-100",
                    pathname === item.href ? "bg-brand-gold/10 text-brand-gold-700" : "text-gray-700"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="shrink-0 space-y-3 border-t border-gray-100 px-5 py-5">
              <a
                href={`tel:${siteConfig.links.phone}`}
                className="flex items-center gap-2.5 text-sm font-medium text-gray-500"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
                  <Phone aria-hidden="true" className="h-4 w-4 text-brand-gold-700" />
                </span>
                {siteConfig.links.phone}
              </a>
              <Button
                className="w-full"
                onClick={() => {
                  setMenuOpen(false);
                  window.dispatchEvent(new CustomEvent("itsc:open-chat"));
                }}
              >
                <Bot aria-hidden="true" className="h-4 w-4" />
                Ask ITSC
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
