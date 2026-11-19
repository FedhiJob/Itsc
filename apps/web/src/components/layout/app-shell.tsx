"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { BottomNav } from "./bottom-nav";
import { SpotlightSearch } from "@/components/features/spotlight-search";

interface AppShellProps {
  children: React.ReactNode;
}

/**
 * Root-level shell that wraps every route.
 *
 * - For public routes it renders the public SiteHeader, BottomNav (mobile thumb bar),
 *   and SiteFooter around <main>.
 * - For /admin routes it renders only the content — the admin section provides
 *   its own layout (sidebar, header) via apps/web/src/app/admin/layout.tsx.
 */
export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <div className="flex min-h-full flex-col">{children}</div>;
  }

  return (
    <div className="flex min-h-full flex-col">
      <a
        href="#main-content"
        className="sr-only fixed left-4 top-4 z-[60] rounded-md bg-brand-gold px-4 py-2 text-sm font-bold text-brand-ink focus:not-sr-only itsc-focus-ring"
      >
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main-content" className="flex-1 pb-16 lg:pb-0">
        {children}
      </main>
      <SiteFooter />
      <BottomNav />
      <SpotlightSearch />
    </div>
  );
}
