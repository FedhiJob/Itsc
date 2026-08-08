"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  FileText,
  Images,
  Inbox,
  LayoutDashboard
} from "lucide-react";
import { getUser } from "@/lib/admin/auth";

const dashboardCards = [
  {
    title: "Training Programs",
    description: "Manage training categories and programs.",
    href: "/admin/training",
    icon: BookOpen
  },
  {
    title: "News & Events",
    description: "Create and manage news articles and events.",
    href: "/admin/news",
    icon: FileText
  },
  {
    title: "Gallery",
    description: "Manage photo albums and images.",
    href: "/admin/gallery",
    icon: Images
  },
  {
    title: "Inquiries",
    description: "Review and respond to contact inquiries.",
    href: "/admin/inquiries",
    icon: Inbox
  }
] as const;

export default function AdminDashboardPage() {
  const user = getUser();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back{user ? `, ${user.fullName.split(" ")[0]}` : ""}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your website content from the dashboard below.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {dashboardCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="group rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-gold/10">
                  <Icon aria-hidden="true" className="h-5 w-5 text-brand-gold" />
                </div>
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4 text-gray-300 transition-colors group-hover:text-brand-gold"
                />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-gray-900">{card.title}</h2>
              <p className="mt-1 text-sm leading-6 text-gray-500">{card.description}</p>
            </Link>
          );
        })}
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <LayoutDashboard aria-hidden="true" className="h-4 w-4 text-brand-gold" />
          <h2 className="text-lg font-semibold text-gray-900">Getting Started</h2>
        </div>
        <p className="mt-2 text-sm leading-6 text-gray-500">
          The admin portal is the control center for your ITSC website. Use the navigation on the
          left to manage training programs, news articles, gallery albums, and contact inquiries.
          Content you publish here will appear on the public website.
        </p>
      </div>
    </div>
  );
}