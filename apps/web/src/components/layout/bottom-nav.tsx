"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Bot, Briefcase, Home, PhoneCall } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();

  // Hide on admin portal routes
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      label: "Courses",
      href: "/training-programs",
      icon: BookOpen,
      isActive: pathname.startsWith("/training-programs"),
    },
    {
      label: "Corporate",
      href: "/corporate-training",
      icon: Briefcase,
      isActive: pathname === "/corporate-training",
    },
    {
      label: "ITSC AI",
      isAction: true,
      icon: Bot,
      onClick: () => window.dispatchEvent(new CustomEvent("itsc:open-chat")),
    },
    {
      label: "Contact",
      href: "/contact",
      icon: PhoneCall,
      isActive: pathname === "/contact",
    },
  ];

  return (
    <nav
      className="itsc-glass-nav fixed bottom-0 inset-x-0 z-30 lg:hidden border-t border-gray-200/80 shadow-lg pb-[env(safe-area-inset-bottom,0.25rem)]"
      aria-label="Mobile quick thumb navigation"
    >
      <div className="mx-auto flex h-14 max-w-md items-center justify-around px-2">
        {navItems.map((item, idx) => {
          const Icon = item.icon;

          if (item.isAction) {
            return (
              <button
                key={item.label}
                type="button"
                onClick={item.onClick}
                className="itsc-press relative -top-2 flex flex-col items-center justify-center"
                aria-label="Open ITSC AI Assistant"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-gold text-brand-ink shadow-md border-2 border-white ring-2 ring-brand-gold/30">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="mt-0.5 text-[10px] font-bold text-brand-ink">
                  {item.label}
                </span>
              </button>
            );
          }

          const active = item.isActive;

          return (
            <Link
              key={item.label}
              href={item.href!}
              className={cn(
                "itsc-press flex flex-1 flex-col items-center justify-center py-1 text-center transition-colors",
                active ? "text-brand-ink font-bold" : "text-gray-500 hover:text-gray-900"
              )}
              aria-current={active ? "page" : undefined}
            >
              <span className="relative inline-flex items-center justify-center">
                <Icon className={cn("h-5 w-5 transition-transform", active && "scale-110 text-brand-ink")} />
                {active && (
                  <span className="absolute -bottom-1 h-1 w-4 rounded-full bg-brand-gold" />
                )}
              </span>
              <span className="mt-1 text-[10px] font-medium leading-none">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
