"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

interface AppShellProps {
  children: React.ReactNode;
}

/**
 * Root-level shell that wraps every route.
 *
 * - For public routes it renders the public SiteHeader + SiteFooter around <main>.
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
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}