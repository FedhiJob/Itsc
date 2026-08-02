import Image from "next/image";
import Link from "next/link";
import { Bot, Menu } from "lucide-react";
import { mainNavigation, siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import logo from "/public/logo.jpg";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="ITSC home">
          <Image
            src={logo}
            alt="ITSC — Information Technology and Solutions Center"
            width={120}
            height={46}
            className="h-auto w-auto max-h-10 object-contain"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {mainNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/contact">
              <Bot aria-hidden="true" className="h-4 w-4" />
              Ask ITSC
            </Link>
          </Button>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 text-gray-900 lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
