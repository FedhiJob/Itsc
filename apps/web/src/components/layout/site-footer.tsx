"use client";

import Link from "next/link";
import { Facebook, Linkedin, Mail, MapPin, Phone, Twitter, Youtube } from "lucide-react";
import { mainNavigation, siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white text-gray-900">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr] lg:px-8">
        <div>
          <p className="text-lg font-bold">{siteConfig.fullName}</p>
          <p className="mt-2 text-sm italic leading-6 text-gray-500">
            Imparting Knowledge Skills and Attitudes
          </p>
          <p className="mt-3 max-w-md text-sm leading-6 text-gray-500">
            Professional technology training, organizational capacity building, and
            future-ready digital services for individuals and institutions.
          </p>
        </div>

        <nav aria-label="Footer navigation">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Explore</p>
          <div className="mt-4 grid gap-2">
            {mainNavigation.slice(0, 6).map((item) => (
              <Link key={item.href} href={item.href} className="text-sm text-gray-700 hover:text-brand-gold">
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Contact</p>
          <div className="mt-4 grid gap-3 text-sm text-gray-700">
            <p className="flex items-center gap-2">
              <Phone aria-hidden="true" className="h-4 w-4" />
              {siteConfig.links.phone}
            </p>
            <p className="flex items-center gap-2">
              <Mail aria-hidden="true" className="h-4 w-4" />
              {siteConfig.links.email}
            </p>
            <p className="flex items-center gap-2">
              <MapPin aria-hidden="true" className="h-4 w-4" />
              {siteConfig.links.address}
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Follow Us</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="https://facebook.com/ITSC"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow ITSC on Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-gray-50 text-gray-700 transition-colors hover:bg-brand-gold hover:text-gray-900"
            >
              <Facebook aria-hidden="true" className="h-4 w-4" />
            </a>
            <a
              href="https://twitter.com/techItsc"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow ITSC on Twitter"
              className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-gray-50 text-gray-700 transition-colors hover:bg-brand-gold hover:text-gray-900"
            >
              <Twitter aria-hidden="true" className="h-4 w-4" />
            </a>
            <a
              href="https://linkedin.com/company/ITSC"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow ITSC on LinkedIn"
              className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-gray-50 text-gray-700 transition-colors hover:bg-brand-gold hover:text-gray-900"
            >
              <Linkedin aria-hidden="true" className="h-4 w-4" />
            </a>
            <a
              href="https://youtube.com/@ITSC"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Subscribe to ITSC on YouTube"
              className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-gray-50 text-gray-700 transition-colors hover:bg-brand-gold hover:text-gray-900"
            >
              <Youtube aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Subscribe
          </p>
          <p className="mt-1 text-xs leading-5 text-gray-500">
            Stay updated with our latest programs and news.
          </p>
          <form
            className="mt-3 flex gap-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <label htmlFor="footer-email" className="sr-only">Email address</label>
            <input
              id="footer-email"
              type="email"
              required
              placeholder="your@email.com"
              className="min-w-0 flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 placeholder:text-gray-500 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
            />
            <button
              type="submit"
              className="shrink-0 rounded-md bg-brand-gold px-3 py-2 text-xs font-semibold text-gray-900 transition-colors hover:bg-brand-gold-600"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  );
}
