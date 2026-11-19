"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  FileText,
  Images,
  Inbox,
  LayoutDashboard,
  Loader2,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { getUser } from "@/lib/admin/auth";
import { adminApi } from "@/lib/admin/api";

interface AdminMetrics {
  totalPrograms: number;
  publishedPrograms: number;
  draftPrograms: number;
  totalInquiries: number;
  newInquiries: number;
  totalNews: number;
  publishedNews: number;
  totalAlbums: number;
}

export default function AdminDashboardPage() {
  const user = getUser();
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchMetrics() {
      try {
        const [programsRes, inquiriesRes, newsRes, albumsRes] = await Promise.allSettled([
          adminApi.listPrograms({ limit: 500 }),
          adminApi.listInquiries({ limit: 100 }),
          adminApi.listNews({ limit: 50 }),
          adminApi.listAlbums({ limit: 50 })
        ]);

        const programs = programsRes.status === "fulfilled" ? programsRes.value.programs : [];
        const inquiries = inquiriesRes.status === "fulfilled" ? inquiriesRes.value.inquiries : [];
        const articles = newsRes.status === "fulfilled" ? newsRes.value.articles : [];
        const albums = albumsRes.status === "fulfilled" ? albumsRes.value.albums : [];

        if (isMounted) {
          setMetrics({
            totalPrograms: programs.length,
            publishedPrograms: programs.filter((p) => p.status === "PUBLISHED").length,
            draftPrograms: programs.filter((p) => p.status === "DRAFT").length,
            totalInquiries: inquiries.length,
            newInquiries: inquiries.filter((i) => i.status === "NEW").length,
            totalNews: articles.length,
            publishedNews: articles.filter((a) => a.status === "PUBLISHED").length,
            totalAlbums: albums.length
          });
        }
      } catch (err) {
        console.error("Failed to load dashboard metrics:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchMetrics();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Welcome back{user ? `, ${user.fullName.split(" ")[0]}` : ""}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Real-time control center for training courses, inquiries, news, and media assets.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500 itsc-pulse"></span>
            System Online
          </span>
        </div>
      </div>

      {/* Main Metric Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Training Programs Card */}
        <Link
          href="/admin/training"
          className="itsc-press group flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-xs hover:border-brand-navy/30 hover:shadow-md transition-all"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-gold/15 text-brand-ink">
                <BookOpen aria-hidden="true" className="h-5 w-5" />
              </div>
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 text-gray-400 group-hover:text-brand-gold transition-colors"
              />
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Training Programs
            </p>
            {loading ? (
              <div className="mt-1 h-8 w-16 animate-pulse rounded bg-gray-200" />
            ) : (
              <p className="mt-1 text-3xl font-extrabold text-gray-900">
                {metrics?.totalPrograms ?? 0}
              </p>
            )}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
            <span>{metrics?.publishedPrograms ?? 0} Published</span>
            <span className="font-semibold text-amber-600">{metrics?.draftPrograms ?? 0} Draft</span>
          </div>
        </Link>

        {/* Inquiries Card */}
        <Link
          href="/admin/inquiries"
          className="itsc-press group flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-xs hover:border-brand-navy/30 hover:shadow-md transition-all"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                <Inbox aria-hidden="true" className="h-5 w-5" />
              </div>
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 text-gray-400 group-hover:text-brand-gold transition-colors"
              />
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Student Inquiries
            </p>
            {loading ? (
              <div className="mt-1 h-8 w-16 animate-pulse rounded bg-gray-200" />
            ) : (
              <div className="mt-1 flex items-baseline gap-2">
                <p className="text-3xl font-extrabold text-gray-900">
                  {metrics?.totalInquiries ?? 0}
                </p>
                {(metrics?.newInquiries ?? 0) > 0 && (
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-bold text-red-700">
                    {metrics?.newInquiries} New
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
            <span>
              {(metrics?.newInquiries ?? 0) > 0
                ? "Pending responses"
                : "All inquiries reviewed"}
            </span>
            <span className="font-semibold text-blue-600">Review &rarr;</span>
          </div>
        </Link>

        {/* News & Events Card */}
        <Link
          href="/admin/news"
          className="itsc-press group flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-xs hover:border-brand-navy/30 hover:shadow-md transition-all"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                <FileText aria-hidden="true" className="h-5 w-5" />
              </div>
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 text-gray-400 group-hover:text-brand-gold transition-colors"
              />
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
              News &amp; Events
            </p>
            {loading ? (
              <div className="mt-1 h-8 w-16 animate-pulse rounded bg-gray-200" />
            ) : (
              <p className="mt-1 text-3xl font-extrabold text-gray-900">
                {metrics?.totalNews ?? 0}
              </p>
            )}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
            <span>{metrics?.publishedNews ?? 0} Live articles</span>
            <span className="font-semibold text-emerald-600">Manage &rarr;</span>
          </div>
        </Link>

        {/* Gallery Albums Card */}
        <Link
          href="/admin/gallery"
          className="itsc-press group flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-xs hover:border-brand-navy/30 hover:shadow-md transition-all"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-700">
                <Images aria-hidden="true" className="h-5 w-5" />
              </div>
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 text-gray-400 group-hover:text-brand-gold transition-colors"
              />
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Photo Albums
            </p>
            {loading ? (
              <div className="mt-1 h-8 w-16 animate-pulse rounded bg-gray-200" />
            ) : (
              <p className="mt-1 text-3xl font-extrabold text-gray-900">
                {metrics?.totalAlbums ?? 0}
              </p>
            )}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
            <span>Campus &amp; lab photos</span>
            <span className="font-semibold text-purple-600">View albums &rarr;</span>
          </div>
        </Link>
      </div>

      {/* Operational Highlights Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-brand-gold/15 p-2 text-brand-ink">
              <LayoutDashboard aria-hidden="true" className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Platform Operations Overview</h2>
              <p className="text-xs text-gray-500">Institutional publishing and content management guide.</p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3 pt-4 border-t border-gray-100 text-xs">
          <div className="rounded-lg bg-gray-50 p-3.5 border border-gray-100">
            <p className="font-bold text-gray-900 mb-1">🎓 Course Catalog Management</p>
            <p className="text-gray-500 leading-relaxed">
              Publish international vendor certifications (Microsoft, Cisco, CompTIA, AWS). Segment modules and attach downloadable PDF outlines.
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-3.5 border border-gray-100">
            <p className="font-bold text-gray-900 mb-1">📬 Student Inquiries</p>
            <p className="text-gray-500 leading-relaxed">
              Review submissions from public forms and in-chat inquiries. Respond directly via 1-click email with automatic reference codes.
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-3.5 border border-gray-100">
            <p className="font-bold text-gray-900 mb-1">📸 Facilities &amp; Labs</p>
            <p className="text-gray-500 leading-relaxed">
              Showcase ITSC training labs, classroom facilities, and hands-on hardware testing environments to prospective corporate clients.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
