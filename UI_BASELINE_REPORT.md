# ITSC Platform — UI Baseline Report

> **Date:** 2026-07-27  
> **Type:** Pre-redesign baseline reference  
> **Sources:** Entire repository codebase + `ITSC_REDESIGN_SPECIFICATION.md` + `UI_COMPLIANCE_AUDIT.md` + `UI_IMPLEMENTATION_PLAN.md` + `LEGACY_BRAND_ANALYSIS.md` + `PRE_IMPLEMENTATION_HEALTH_CHECK.md`  
> **Purpose:** Single source of truth for the current state before redesign implementation begins

---

## 1. Executive Summary

### Overall Project Health

The ITSC platform is a **monorepo with a well-architected backend and a prototype-quality frontend**. The backend (Express + Prisma + PostgreSQL) is feature-complete with auth, training, news, gallery, contact, and health modules — all properly validated, secured, and typed. The frontend (Next.js 15 App Router) has all pages built as static shells but **none are wired to the API, none pass build, and none follow the brand identity**.

### Current Frontend Maturity

| Dimension | Maturity | Assessment |
|-----------|----------|------------|
| Pages implemented | 70% | 7 of ~10 public pages exist; admin portal not started |
| API integration | 0% | All pages use hardcoded static data |
| Brand alignment | 28% | Wrong color palette (blue vs gold), wrong typography (sans-serif vs serif headings) |
| Build status | ❌ Failing | 3 JSX syntax errors block compilation |
| TypeScript | ⚠️ 2 errors | Pre-existing JWT type issues in API (unrelated to frontend) |
| Tests | 0% | No test files anywhere in the project |

### Readiness for Redesign

**The project is architecturally ready but not build-ready.** The monorepo structure, component conventions, and Next.js App Router setup are correct foundations. However, 3 build-blocking JSX errors must be fixed before any work can begin. These are simple missing `</div>` tags totaling ~10 minutes of fixes.

### Major Strengths

1. **Clean monorepo architecture** with proper workspace boundaries (api / web / shared)
2. **Well-structured backend** with feature-based modules, Zod validation, centralized error handling, and proper security
3. **Good SEO foundation** — all pages have metadata, OpenGraph, sitemap, robots.txt, canonical URLs
4. **Consistent Server Component usage** — no unnecessary `'use client'` directives
5. **No inline styles** — all styling uses Tailwind utility classes
6. **No TODOs or FIXMEs** — codebase is clean of temporary code
7. **Tailwind CSS v4 properly configured** with `@theme inline` directive
8. **Button component is well-architected** with CVA variants, Slot support, and proper disabled states
9. **Section + Container pattern is correct** and reused across all pages
10. **No circular dependencies** in the import graph

### Major Weaknesses

1. **Build is broken** — 3 JSX syntax errors (missing closing tags)
2. **Wrong brand colors** — uses blue (#123a6f) instead of gold (#febd01)
3. **Wrong heading typography** — uses Geist Sans instead of Merriweather (serif)
4. **No API integration** — all pages are static shells with hardcoded data
5. **No form system** — contact form is raw HTML with no submit handler
6. **No mobile navigation** — hamburger button does nothing
7. **No reusable Card component** — card patterns are duplicated inline across all pages
8. **No loading/error/empty states** anywhere
9. **4 unused npm packages** — declared but not configured (Axios, TanStack Query, React Hook Form, resolvers)
10. **Critical accessibility gaps** — no skip-to-content, no ARIA landmarks, no reduced motion support

### Estimated Implementation Risk

| Risk | Level | Mitigation |
|------|-------|------------|
| Build-blocking errors | **Low** | 3 simple fixes, < 10 min total |
| Brand color change impact | **Medium** | Affects every button, badge, link, and accent across all files — systematic search/replace needed |
| Typography change impact | **Medium** | Merriweather must be added and applied to all headings across all pages |
| API integration complexity | **High** | Requires configuring Axios + TanStack Query + creating hooks + replacing static data |
| Admin portal effort | **High** | 10+ new files, ~20 hours of work |
| No test coverage | **Medium** | Changes must be manually verified |

**Overall Implementation Risk: Medium**

---

## 2. Repository Snapshot

### Folder Structure

```
Itsc/
├── .gitignore
├── .prettierignore
├── package.json                          # Root workspace config (npm workspaces)
├── package-lock.json
├── README.md                             # Project documentation
├── TODO.md                               # Development progress tracking
│
├── apps/
│   ├── api/                              # Express.js REST API
│   │   ├── .env.example                  # Environment template
│   │   ├── package.json                  # @itsc/api
│   │   ├── tsconfig.json
│   │   ├── prisma/
│   │   │   └── schema.prisma             # Database schema (8 models)
│   │   └── src/
│   │       ├── app.ts                    # Express app setup
│   │       ├── server.ts                 # Server entry + graceful shutdown
│   │       ├── config/
│   │       │   ├── env.ts                # Zod-validated environment
│   │       │   └── cors.ts               # CORS configuration
│   │       ├── lib/
│   │       │   └── prisma.ts             # PrismaClient singleton
│   │       ├── middleware/
│   │       │   ├── error-handler.ts       # Centralized error handling
│   │       │   ├── not-found.ts           # 404 handler
│   │       │   ├── rate-limiters.ts       # 4 rate limiters
│   │       │   └── validate-request.ts    # Zod validation middleware
│   │       ├── modules/
│   │       │   ├── index.ts              # Route aggregator
│   │       │   ├── health/               # GET /api/v1/health
│   │       │   ├── auth/                 # POST login, register, GET me
│   │       │   ├── training/             # Categories + programs CRUD
│   │       │   ├── news/                 # Articles CRUD
│   │       │   ├── gallery/              # Albums + images CRUD
│   │       │   └── contact/              # Inquiries CRUD
│   │       ├── types/                    # Duplicated shared types
│   │       └── utils/
│   │           ├── api-response.ts       # sendSuccess / sendError
│   │           ├── app-error.ts          # AppError class
│   │           └── async-handler.ts      # Async wrapper (unused)
│   │
│   └── web/                              # Next.js 15 frontend
│       ├── .gitignore
│       ├── next.config.ts
│       ├── package.json                  # web
│       ├── postcss.config.mjs
│       ├── tsconfig.json
│       ├── eslint.config.mjs
│       ├── public/
│       │   ├── file.svg                  # Default Next.js assets
│       │   ├── globe.svg
│       │   ├── next.svg
│       │   ├── vercel.svg
│       │   └── window.svg
│       └── src/
│           ├── app/
│           │   ├── globals.css           # Tailwind v4 + CSS custom properties
│           │   ├── layout.tsx            # Root layout (Geist fonts, header, footer)
│           │   ├── page.tsx              # Homepage
│           │   ├── robots.ts             # Dynamic robots.txt
│           │   ├── sitemap.ts            # Dynamic XML sitemap
│           │   ├── about/page.tsx
│           │   ├── contact/page.tsx      # BROKEN HTML
│           │   ├── corporate-training/page.tsx
│           │   ├── gallery/page.tsx      # BROKEN HTML
│           │   ├── news/
│           │   │   └── page.tsx
│           │   └── training-programs/
│           │       ├── page.tsx
│           │       └── [slug]/page.tsx   # BROKEN HTML
│           ├── components/
│           │   ├── layout/
│           │   │   ├── site-header.tsx
│           │   │   └── site-footer.tsx
│           │   └── ui/
│           │       ├── button.tsx
│           │       └── section.tsx       # Section + Container
│           ├── config/
│           │   └── site.ts               # Site config + navigation
│           ├── features/
│           │   └── home/                 # EMPTY directory
│           └── lib/
│               └── utils.ts             # cn() utility
│
├── packages/
│   └── shared/                           # Shared TypeScript contracts
│       ├── package.json                  # @itsc/shared
│       ├── tsconfig.json
│       └── src/
│           ├── index.ts                  # Re-exports
│           ├── api-response.ts           # ApiSuccessResponse, ApiErrorResponse
│           └── content.ts                # Content type aliases
│
└── docs/
    ├── architecture.md                   # Architecture documentation
    └── itsc-doc.pdf                      # Legacy reference document
```

### Workspace Configuration

| Workspace | Path | Package Name | Type |
|-----------|------|-------------|------|
| Root | `./` | `itsc-platform` | Monorepo root |
| API | `apps/api` | `@itsc/api` | Express.js backend |
| Web | `apps/web` | `web` | Next.js frontend |
| Shared | `packages/shared` | `@itsc/shared` | TypeScript types |

### Build Configuration

| Tool | Version | Location | Purpose |
|------|---------|----------|---------|
| TypeScript | ^5.9.3 (root), ^5 (web) | Root + both apps | Type checking |
| Prettier | ^3.6.2 | Root | Code formatting |
| ESLint | ^9 | Web | Linting |
| PostCSS | via next | Web | Tailwind processing |
| tsx | ^4.20.5 | API | Dev server (tsx watch) |

### Key Configuration Files

| File | Purpose | Status |
|------|---------|--------|
| `apps/api/.env.example` | Environment template | ✅ 11 variables documented |
| `apps/web/next.config.ts` | Next.js configuration | ✅ Default config |
| `apps/web/postcss.config.mjs` | PostCSS with Tailwind | ✅ v4 syntax |
| `apps/web/eslint.config.mjs` | ESLint flat config | ✅ Next.js defaults |
| `.prettierignore` | Prettier ignore rules | ✅ Present |
| `apps/api/tsconfig.json` | API TypeScript config | ✅ Strict mode |
| `apps/web/tsconfig.json` | Web TypeScript config | ✅ Strict mode |

### Design-Related Files

| File | Purpose | Lines |
|------|---------|-------|
| `apps/web/src/app/globals.css` | All theme variables + Tailwind setup | 52 |
| `apps/web/src/components/ui/button.tsx` | Button CVA variants | 47 |
| `apps/web/src/components/ui/section.tsx` | Section + Container components | 15 |
| `apps/web/src/components/layout/site-header.tsx` | Header with navigation | 50 |
| `apps/web/src/components/layout/site-footer.tsx` | Footer with links + contact | 51 |
| `apps/web/src/lib/utils.ts` | `cn()` utility | 6 |
| `apps/web/src/config/site.ts` | Site name, nav, links | 23 |

### Public Assets

| Asset | Location | Status |
|-------|----------|--------|
| Logo | `site-header.tsx` | ❌ "IT" text placeholder |
| Favicon | `app/favicon.ico` | ❌ Default Next.js icon |
| Default SVGs | `public/*.svg` | ⚠️ Next.js defaults (file, globe, next, vercel, window) |
| Gallery images | `gallery/page.tsx` | ❌ Placeholder gradients |
| Partner logos | Not present | ❌ Missing |
| Client logos | Not present | ❌ Missing |

### Existing Documentation

| Document | Status | Content |
|----------|--------|---------|
| `README.md` | ✅ Accurate | Setup instructions, workspace structure, baseline principles |
| `TODO.md` | ⚠️ Partially outdated | Lists `/news/[slug]` as "in progress" — should be "not started" |
| `docs/architecture.md` | ✅ Accurate | Stack, workspace boundaries, backend/frontend baselines, feature delivery pattern |
| `docs/itsc-doc.pdf` | Reference | Legacy ITSC documentation |
| `ITSC_REDESIGN_SPECIFICATION.md` | ✅ Created | Design blueprint for the redesign |
| `UI_AUDIT.md` | ✅ Created | Full UI/UX architecture audit |
| `LEGACY_BRAND_ANALYSIS.md` | ✅ Created | Legacy ITSC brand identity analysis |
| `UI_COMPLIANCE_AUDIT.md` | ✅ Created | Compliance comparison (current vs. spec) |
| `UI_IMPLEMENTATION_PLAN.md` | ✅ Created | Engineering execution roadmap |
| `PRE_IMPLEMENTATION_HEALTH_CHECK.md` | ✅ Created | Pre-redesign health audit |

---

## 3. Current Design System Inventory

### Colors

#### Defined CSS Custom Properties

| Variable | Current Value | Spec Value | Compliance | Usage |
|----------|-------------|------------|------------|-------|
| `--background` | `#f8fafc` | `#f8fafc` | ✅ 100% | Page backgrounds |
| `--foreground` | `#111827` | `#0f172a` | ⚠️ 50% | Body text (close but wrong) |
| `--muted` | `#eef2f7` | `#f1f5f9` | ⚠️ 50% | Subtle backgrounds |
| `--muted-foreground` | `#526071` | `#64748b` | ⚠️ 50% | Secondary text |
| `--border` | `#d9e2ec` | `#e2e8f0` | ⚠️ 50% | Borders |
| `--primary` | `#123a6f` | `#febd01` | ❌ 0% | **Wrong color entirely** |
| `--primary-700` | `#0d2e59` | `#e5a800` | ❌ 0% | **Wrong color entirely** |
| `--secondary` | `#3f3cbb` | ❌ Remove | ❌ 0% | Should not exist |
| `--secondary-700` | `#302d91` | ❌ Remove | ❌ 0% | Should not exist |
| `--accent` | `#f97316` | ❌ Remove | ❌ 0% | Should not exist |
| `--success` | `#0f9f6e` | `#0f9f6e` | ✅ 100% | Defined but orphaned |
| `--warning` | `#d97706` | `#d97706` | ✅ 100% | Defined but orphaned |
| `--error` | `#dc2626` | `#dc2626` | ✅ 100% | Defined but orphaned |

#### Miss ing Tokens (Required by Spec)

| Token | Spec Value | Status |
|-------|-----------|--------|
| `--color-brand-gold` | `#febd01` | ❌ Missing |
| `--color-brand-gold-600` | `#e5a800` | ❌ Missing |
| `--color-brand-gold-700` | `#cc9400` | ❌ Missing |
| `--color-brand-gold-50` | `#fffbe6` | ❌ Missing |
| `--color-gray-100` | `#f1f5f9` | ❌ Missing (has `#eef2f7`) |
| `--color-gray-200` | `#e2e8f0` | ❌ Missing (has `#d9e2ec`) |
| `--color-gray-500` | `#64748b` | ❌ Missing (has `#526071`) |
| `--color-gray-700` | `#334155` | ❌ Missing |
| `--color-gray-900` | `#0f172a` | ❌ Missing (has `#111827`) |
| `--color-info` | `#2563eb` | ❌ Missing |

#### Hardcoded Color Opacity Values

| Location | Value | Issue |
|----------|-------|-------|
| `site-footer.tsx` | `text-white/72` | Arbitrary opacity |
| `site-footer.tsx` | `text-white/60` | Arbitrary opacity |
| `site-footer.tsx` | `text-white/75` | Arbitrary opacity |
| `site-footer.tsx` | `border-white/10` | Arbitrary opacity |

### Typography

#### Current Configuration

| Property | Current Value | Source |
|----------|-------------|--------|
| Font (body) | Geist Sans (variable) | `next/font/google` |
| Font (mono) | Geist Mono (variable) | `next/font/google` |
| Font (headings) | **Same as body** (Geist Sans) | No separate heading font |
| Font loading | `display=swap` via `next/font` | Good practice |

#### Observed Type Scale

| Context | Current Classes | Spec Classes | Compliance |
|---------|----------------|--------------|------------|
| Hero h1 | `text-4xl sm:text-5xl lg:text-6xl font-bold` | Same + `font-serif` | 50% |
| Page headings | `text-3xl sm:text-4xl font-bold` | Same + `font-serif` | 50% |
| Section h2 | `text-2xl sm:text-3xl font-bold` | Same + `font-serif` | 50% |
| Card titles | `text-xl font-semibold` | Same + `font-serif` | 50% |
| Body | `text-base leading-7` | `text-base leading-7` | 100% |
| Secondary | `text-sm leading-6` | `text-sm leading-6` | 100% |
| Meta | `text-xs` | `text-xs` | 100% |
| Eyebrow | `text-xs sm:text-sm font-semibold uppercase tracking-wide` | Same + `text-brand-gold` | 80% |

#### Issues

1. **No serif font for headings** — Merriweather is not loaded or configured
2. **No type scale system** — sizes are applied arbitrarily per-page
3. **No `--font-heading` CSS variable** — would make heading font swappable
4. **`text-destructive` referenced** in contact form but not defined in CSS

### Spacing

#### Current Patterns

| Pattern | Value | Consistency |
|---------|-------|-------------|
| Section padding | `py-16 sm:py-20` | ✅ Consistent across all pages |
| Card padding | `p-6` (most), `p-5` (some) | ⚠️ Slightly inconsistent |
| Grid gaps | `gap-4`, `gap-6`, `gap-8`, `gap-12` | ❌ Inconsistent |
| Heading→description | `mt-3`, `mt-4`, `mt-6` | ❌ Inconsistent |
| Element spacing | `mt-2`, `mt-3`, `mt-4`, `mt-6`, `mt-8`, `mt-10` | ❌ No system |

#### Issues

1. **No vertical rhythm system** — each page independently sets margins
2. **`mt-4` vs `mt-6` for heading→description gap** varies between pages
3. **No reusable spacing primitives** beyond Tailwind's defaults

### Shadows

| Level | Current | Spec | Compliance |
|-------|---------|------|------------|
| Card default | `shadow-sm` (most cards) | `shadow-sm` | ✅ |
| Card hover | `hover:shadow-md` (news only) | `hover:shadow-md transition-shadow duration-200` | ⚠️ 30% |
| Dropdown/Menu | Not implemented | `shadow-lg` | N/A |
| Focus ring | `outline-primary` (blue) | `shadow-gold` (#febd01) | ❌ 0% |

### Border Radius

| Level | Current Value | Spec Value | Compliance |
|-------|--------------|------------|------------|
| Cards | `rounded-lg` (implied ~8px) | `rounded-lg` = 0.5rem | ✅ |
| Buttons | `rounded-md` (implied ~6px) | `rounded-md` = 0.5rem | ✅ |
| Badges | `rounded-md` | `rounded-full` | ❌ |
| Inputs | `rounded-md` | `rounded-md` | ✅ |

No border radius tokens are defined in CSS — all values use Tailwind defaults.

### Animations & Transitions

| Animation | Current | Spec |
|-----------|---------|------|
| `scroll-behavior: smooth` | ✅ In globals.css | ✅ Same |
| `prefers-reduced-motion` | ❌ Not implemented | ❌ Same (both need it) |
| Button `transition-colors` | ✅ On Button component | ✅ Add `duration-200` |
| Card `hover:shadow-md` | ⚠️ News cards only | ✅ All interactive cards |
| Page loader | ❌ Not implemented | ❌ Spec says NOT to implement |

### Z-Index

| Level | Current | Purpose |
|-------|---------|---------|
| Header | `z-40` | Sticky header |
| No other z-index values used | — | — |

### Breakpoints

| Breakpoint | Tailwind Default | Usage |
|-----------|------------------|-------|
| `sm:` | 640px | Responsive type, grid columns |
| `md:` | 768px | Grid column changes |
| `lg:` | 1024px | Grid column changes, nav visibility |
| `xl:` | 1280px | Not used |

### Icons

| Library | Current | Spec |
|---------|---------|------|
| Lucide React | ✅ Used for all icons | ✅ Same |
| Icon sizes | `h-4 w-4`, `h-5 w-5`, `h-6 w-6` | ✅ Same |
| Icon colors | `text-primary` (blue) | ❌ Should be `text-brand-gold` |

### Containers

| Container | Current Width | Usage |
|-----------|--------------|-------|
| Default | `max-w-7xl` | All page content |
| Narrow | `max-w-3xl` | Hero text, CTA sections |
| Prose | Not used | — |

**Spec requires:** `max-w-7xl` (default), `max-w-3xl` (narrow), `max-w-prose` (article body)

### Grid Utilities

| Pattern | Current | Usage |
|---------|---------|-------|
| 2 cols | `grid grid-cols-1 md:grid-cols-2` | Features, text+image |
| 3 cols | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` | Card grids |
| 4 cols | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` | Homepage features |

---

## 4. Component Inventory

### Reusable Components

| # | Component | Location | Purpose | Pages Using | Dependencies | Spec Compliance | Reuse | Redesign | Risk |
|---|-----------|----------|---------|-------------|-------------|----------------|-------|----------|------|
| 1 | `Button` | `ui/button.tsx` | CVA-based button with 4 variants, 3 sizes, `asChild` | **All pages** | `@radix-ui/react-slot`, `class-variance-authority`, `cn()` | 44% | ✅ Keep | Update variants (gold primary) | **High** |
| 2 | `Section` | `ui/section.tsx` | Consistent section padding wrapper | **All pages** | `cn()` | 100% | ✅ Keep | Add variant support (bg, narrow) | **Low** |
| 3 | `Container` | `ui/section.tsx` | Max-width content wrapper | **All pages** | `cn()` | 100% | ✅ Keep | Add narrow/prose variants | **Low** |
| 4 | `SiteHeader` | `layout/site-header.tsx` | Sticky header with nav, logo, CTAs | **All pages** | `next/link`, `lucide-react`, `Button` | 15% | ✅ Keep | Major updates (logo, mobile, colors) | **High** |
| 5 | `SiteFooter` | `layout/site-footer.tsx` | Footer with links, contact, copyright | **All pages** | `next/link`, `lucide-react` | 28% | ✅ Keep | Add social, tagline, subscribe | **Medium** |
| 6 | `cn()` | `lib/utils.ts` | Class name merging utility | All components | `clsx`, `tailwind-merge` | 100% | ✅ Keep | None | **Low** |

### Components That Should Exist (Missing)

| Component | Spec Reference | Why Missing | Impact |
|-----------|---------------|-------------|--------|
| `Card` | shadcn-style card with sub-components | Not created | All card patterns are duplicated inline |
| `PageHero` | Gold eyebrow + serif h1 + description | Not created | Hero pattern duplicated on every page |
| `NewsCard` | Gold badge, serif title, hover shadow | Not created | News article rendering is inline |
| `TrainingCard` | Gold badge, metadata, outline button | Not created | Training program rendering is inline |
| `StatsSection` | Gold numbers in responsive grid | Not created | Stats not present at all |
| `LogoGrid` | Grayscale-to-color partner/client logos | Not created | Partner/client logos not present |
| `ContactInfo` | Gold icons with contact details | Not created | Contact info duplicated in header + footer |
| `Input` | Form input with gold focus ring | Not created | Contact form uses raw HTML |
| `Textarea` | Form textarea with gold focus ring | Not created | Contact form uses raw HTML |
| `Select` | Form select with gold focus ring | Not created | Contact form uses raw HTML |
| `FormField` | React Hook Form wrapper | Not created | No form system exists |
| `Skeleton` | Loading placeholder | Not created | No loading states exist |

### Inline Patterns (Should Be Components)

| Pattern | Files | Lines | Spec Compliance |
|---------|-------|-------|----------------|
| Hero section (eyebrow + h1 + p) | 7 page files | ~10 each | 25% (wrong colors, wrong font) |
| Category badge | 3 page files | ~3 each | 0% (blue instead of gold) |
| Card grid | 4 page files | ~1 each | 30% (inconsistent shadows, no hover) |
| CTA section | 2 page files | ~12 each | 50% (pattern works but wrong colors) |
| Contact info item | 2 files (header + footer) | ~6 each | 20% (blue icons, no component) |

---

## 5. Page Inventory

| # | Route | Purpose | Shared Components | Unique Components | Missing Components | UI Quality | Redesign Complexity | Dependency Level | Est. Effort |
|---|-------|---------|------------------|-------------------|-------------------|------------|---------------------|-----------------|-------------|
| 1 | `/` (Home) | First impression, trust building, navigation | `Section`, `Container`, `Button`, `SiteHeader`, `SiteFooter` | Hero section, feature cards (inline) | `PageHero`, `StatsSection`, `LogoGrid`, `Card`, CTA section | ★★☆☆☆ | **High** | Phase 2 (all components) | 2.5 hours |
| 2 | `/about` | Mission, vision, values | `Section`, `Container`, `Button` | Value cards (inline) | `PageHero`, `Card` (featured), `StatsSection`, `LogoGrid` | ★★★☆☆ | **Medium** | Phase 2 (Card, PageHero) | 45 min |
| 3 | `/training-programs` | Course catalog, filtering | `Section`, `Container`, `Button` | Category cards, program cards (inline) | `PageHero`, `TrainingCard`, CategoryFilter, Pagination | ★★★☆☆ | **High** | Phase 2 (TrainingCard, PageHero) | 1 hour |
| 4 | `/training-programs/[slug]` | Program detail | `Section`, `Container`, `Button` | Detail layout, objectives list, sidebar | `PageHero`, structured layout components | ★★★☆☆ | **Medium** | Phase 2 (PageHero) | 1 hour |
| 5 | `/corporate-training` | B2B services | `Section`, `Container`, `Button` | Benefit cards, service cards (inline) | `PageHero`, `LogoGrid` | ★★★☆☆ | **Medium** | Phase 2 (PageHero, LogoGrid) | 30 min |
| 6 | `/news` | News listing | `Section`, `Container`, `Button` | Article cards (inline) | `PageHero`, `NewsCard`, Pagination | ★★☆☆☆ | **Low** | Phase 2 (NewsCard, PageHero) | 30 min |
| 7 | `/news/[slug]` | Article detail | ❌ Not implemented | — | Everything | N/A | **Medium** | Phase 2 (PageHero) | 30 min |
| 8 | `/gallery` | Photo album display | `Section`, `Container` | Album cards, image grid (inline) | `PageHero`, lightbox, image optimization | ★★☆☆☆ | **Medium** | Phase 2 (PageHero) | 1 hour |
| 9 | `/contact` | Lead generation | `Section`, `Container` | Contact info (broken HTML), raw form | `PageHero`, `ContactInfo`, `Input`, `Textarea`, `Select`, `FormField` | ★☆☆☆☆ | **High** | Phase 2 (all form components) | 2 hours |
| 10 | `/admin/*` | Content management | ❌ Not built | — | Everything | N/A | **Very High** | Phase 2 (form components) | 20 hours |
| 11 | `/robots.txt` | SEO | — | Dynamic robots | — | ✅ Complete | N/A | None | Already done |
| 12 | `/sitemap.xml` | SEO | — | Dynamic sitemap | — | ✅ Complete | N/A | None | Already done |

### Page Quality Scores (1-5)

| Page | Layout | Typography | Colors | Responsiveness | Content | Overall |
|------|--------|-----------|--------|----------------|---------|---------|
| Home | 4 | 2 | 1 | 3 | 2 | **2.4** |
| About | 4 | 2 | 1 | 4 | 3 | **2.8** |
| Training | 4 | 2 | 1 | 4 | 3 | **2.8** |
| Training/[slug] | 3 | 2 | 1 | 3 | 3 | **2.4** |
| Corporate | 4 | 2 | 1 | 4 | 3 | **2.8** |
| News | 3 | 2 | 1 | 3 | 2 | **2.2** |
| Gallery | 3 | 2 | 1 | 3 | 1 | **2.0** |
| Contact | 1 | 2 | 1 | 2 | 1 | **1.4** |

**Scale:** 1 = Broken, 2 = Poor, 3 = Acceptable, 4 = Good, 5 = Excellent

---

## 6. Shared Component Dependency Graph

```
Button (44% compliant)
  ├── Homepage (hero + features + navigation)
  ├── About (CTA section)
  ├── Training Programs (program cards + navigation)
  ├── Training/[slug] (enroll + email CTAs)
  ├── Corporate Training (hero + CTA)
  ├── News (navigation)
  ├── Gallery (navigation)
  ├── Contact (submit button + navigation)
  └── ALL pages via SiteHeader

Section + Container (100% compliant)
  ├── ALL pages (every section)

SiteHeader (15% compliant)
  └── ALL pages (every page)

SiteFooter (28% compliant)
  └── ALL pages (every page)

cn() utility (100% compliant)
  └── ALL components

  [MISSING] Card (0% compliant)
    ├── Should be used by: Homepage (features), About (values), Training (programs), News (articles), Gallery (albums), Corporate (benefits)
    └── Currently: Inline patterns in 4+ page files

  [MISSING] PageHero (0% compliant)
    ├── Should be used by: ALL 7+ public pages
    └── Currently: Inline pattern duplicated across 7 page files

  [MISSING] StatsSection (0% compliant)
    ├── Should be used by: Homepage, About
    └── Currently: Not present

  [MISSING] LogoGrid (0% compliant)
    ├── Should be used by: Homepage, About, Corporate Training
    └── Currently: Not present

  [MISSING] Form Components (0% compliant)
    ├── Should be used by: Contact page, Admin portal
    └── Currently: Raw HTML in Contact; not built for Admin
```

### Impact Analysis

| Component | Impact | Redesign Priority |
|-----------|--------|-------------------|
| Button | **Highest** — affects every page, every interactive element | **Phase 1** (must be first) |
| SiteHeader | **Highest** — affects every page, first thing users see | **Phase 2** |
| SiteFooter | **High** — affects every page | **Phase 2** |
| Card | **High** — would replace inline patterns across 4+ pages | **Phase 2** |
| PageHero | **High** — would replace duplicate patterns across 7 pages | **Phase 2** |
| StatsSection | **Medium** — used on 2 pages | **Phase 2** |
| LogoGrid | **Medium** — used on 3 pages | **Phase 2** |
| Form Components | **Medium** — used on 2+ pages | **Phase 2** |

### Recommended Redesign Order

1. **Button first** — all pages depend on it
2. **Card + PageHero second** — eliminate the most duplicated patterns
3. **Section/Container variants** — low risk, quick win
4. **Navigation + Footer** — high visibility, medium effort
5. **StatsSection + LogoGrid** — new components, no regression risk
6. **Form components** — prerequisite for Contact + Admin

---

## 7. File Impact Analysis

### High-Risk Files

Files that affect **every page** or are **shared across the entire application**.

| File | Risk | Why |
|------|------|-----|
| `apps/web/src/app/globals.css` | **High** | Changing color tokens here affects every component and page. One mistake can break the entire visual system. |
| `apps/web/src/app/layout.tsx` | **High** | Adding Merriweather font here affects all pages. Layout changes affect header/footer on every page. |
| `apps/web/src/components/ui/button.tsx` | **High** | Every page uses buttons. Variant changes must be visually verified on every page. |
| `apps/web/src/components/layout/site-header.tsx` | **High** | Present on every page. Logo, navigation, and mobile menu changes affect the entire user experience. |
| `apps/web/src/components/layout/site-footer.tsx` | **Medium** | Present on every page. Changes are less risky than header (footer is not interactive). |

### Medium-Risk Files

Files that affect **multiple pages** but not all.

| File | Pages Affected | Why |
|------|---------------|-----|
| `apps/web/src/app/page.tsx` | 1 | Homepage — most complex page, many sections |
| `apps/web/src/app/contact/page.tsx` | 1 | Contact page — broken HTML, form implementation |
| `apps/web/src/app/training-programs/[slug]/page.tsx` | 1 | Detail page — broken HTML |
| `apps/web/src/app/gallery/page.tsx` | 1 | Gallery — broken HTML |
| All 7 page files | 7 | Global color search/replace (text-primary → text-brand-gold, etc.) |

### Low-Risk Files

Files that affect **only themselves** and have **no dependencies**.

| File | Pages | Why Low Risk |
|------|-------|-------------|
| `apps/web/src/config/site.ts` | All (indirect) | Data-only config, no visual impact |
| `apps/web/src/lib/utils.ts` | All components | Utility function, no visual impact |
| `apps/web/src/app/robots.ts` | 1 | SEO only, no visual impact |
| `apps/web/src/app/sitemap.ts` | 1 | SEO only, no visual impact |
| New component files | 0 (new) | Creating new files has no regression risk |

### Isolated Files

These files can be modified with **zero risk of affecting other pages**.

| File | Reason |
|------|--------|
| `apps/web/src/app/about/page.tsx` | Standalone page |
| `apps/web/src/app/corporate-training/page.tsx` | Standalone page |
| `apps/web/src/app/news/page.tsx` | Standalone page |
| `apps/web/src/app/contact/page.tsx` | Standalone page |
| `apps/web/src/app/gallery/page.tsx` | Standalone page |
| `apps/web/src/app/training-programs/page.tsx` | Standalone page |
| `apps/web/src/app/training-programs/[slug]/page.tsx` | Standalone page |

---

## 8. Technical Debt Analysis

### Duplicated Code

| Issue | Location(s) | Lines | Severity | Fix |
|-------|------------|-------|----------|-----|
| `getParam()` function | 4 controller files (training, news, gallery, contact) | ~8 each | **Medium** | Extract to shared utility |
| Hero section pattern | 7 page files | ~10 each | **Medium** | Create PageHero component |
| Category badge styling | 3 page files | ~3 each | **Low** | Create Badge component |
| Contact info pattern | Header + footer | ~6 each | **Low** | Create ContactInfo component |

### Duplicated UI

| Pattern | Files | Lines | Severity | Fix |
|---------|-------|-------|----------|-----|
| Card-like containers | 4+ page files | varies | **High** | Create Card component |
| CTA sections | About + Corporate | ~12 each | **Low** | Create CTASection component |
| Grid declarations | 4 page files | ~1 each | **Low** | Use consistent grid patterns |

### Dead Code

| Item | Location | Lines | Severity |
|------|----------|-------|----------|
| Empty `features/home/` directory | `apps/web/src/features/home/` | 0 files | **Low** |
| `asyncHandler` utility (unused) | `apps/api/src/utils/async-handler.ts` | 9 | **Low** |
| Duplicate type declarations | `apps/api/src/types/` | varies | **Low** |

### Placeholder Content

| Content | Location | Severity |
|---------|----------|----------|
| "IT" text logo | `site-header.tsx` | **Medium** |
| Gradient placeholder images | `gallery/page.tsx` | **Low** |
| Fake article data | `news/page.tsx` | **Low** (temporary) |
| Fake program data | `training-programs/page.tsx` | **Low** (temporary) |
| Fake category data | `training-programs/page.tsx` | **Low** (temporary) |

### Fake/Hardcoded Data

| Data | Location | Will be replaced by |
|------|----------|-------------------|
| 5 hardcoded news articles | `news/page.tsx` | API data |
| 6 hardcoded program categories | `training-programs/page.tsx` | API data |
| 6 hardcoded programs | `training-programs/page.tsx` | API data |
| 6 hardcoded program details | `training-programs/[slug]/page.tsx` | API data |
| 3 hardcoded gallery albums | `gallery/page.tsx` | API data |
| 4 hardcoded feature items | `page.tsx` | Will be replaced with real content |
| 4 hardcoded service benefits | `corporate-training/page.tsx` | API data (or CMS) |

### Style Inconsistencies

| Issue | Severity | Location |
|-------|----------|----------|
| Cards use different padding (p-5 vs p-6) | **Low** | Training categories vs. others |
| Heading→description gap varies (mt-4 vs mt-6) | **Low** | Across page files |
| Section background alternating (bg-muted/30) | **Low** | Some sections, not others |
| Badge rounding (rounded-md vs rounded-full) | **Low** | Category badges |

### Architectural Inconsistencies

| Issue | Severity |
|-------|----------|
| Controllers use `as` type assertions bypassing Zod validation | **Medium** |
| `validateRequest` middleware validates but controllers don't use the validated result | **Medium** |
| API has `asyncHandler` utility but controllers use raw try/catch | **Low** |
| Duplicate types in `apps/api/src/types/` vs `packages/shared/` | **Low** |

---

## 9. Refactoring Risk Assessment

### Possible Regressions by Phase

#### Phase 0: Quick Wins

| Change | Risk | Regression | Mitigation |
|--------|------|-----------|------------|
| Fix gallery `</div>` | **Low** | Gallery renders without images | Verify page renders |
| Fix contact `</div>` | **Medium** | Contact info layout shifts | Verify all contact info displays |
| Fix training slug `</div>` | **Low** | Detail page layout shifts | Verify page renders |
| Add Merriweather font | **Low** | CLS if font-display not set | Use `font-display: swap` |
| Replace "IT" logo | **Low** | Broken image if path wrong | Verify image loads |
| Add tagline to footer | **Low** | Footer height changes | Verify responsive layout |
| Add social icons | **Low** | Broken links | Verify URLs |

#### Phase 1: Brand Foundation

| Change | Risk | Regression | Mitigation |
|--------|------|-----------|------------|
| Change color tokens | **High** | Every colored element changes appearance | Visual audit of every page |
| Change Button variants | **High** | Every button changes color | Check all variant usages |
| Global search/replace colors | **High** | Missed replacements, wrong replacements | Build + visual verification |

#### Phase 2: Component Library

| Change | Risk | Regression | Mitigation |
|--------|------|-----------|------------|
| Create Card component | **Low** | New component, no existing usage affected | Verify new component renders |
| Replace inline cards with Card | **Medium** | Visual differences between old and new | Side-by-side comparison |
| Create PageHero | **Low** | New component | Verify renders correctly |
| Replace heroes with PageHero | **Medium** | Spacing or typography differences | Visual comparison |
| Create form components | **Low** | New components | Verify focus, validation, states |
| Update SiteHeader | **Medium** | Mobile nav, logo, button changes | Verify on all viewports |
| Update SiteFooter | **Low** | Layout, content changes | Verify responsive |

#### Phase 3-4: Pages

| Change | Risk | Regression | Mitigation |
|--------|------|-----------|------------|
| Homepage rebuild | **Medium** | Content reorganized, sections added | Verify all sections render |
| Individual page updates | **Low** | Each page is standalone | Verify each page independently |

### Mitigation Strategies

1. **Build after every change** — never proceed without a passing build
2. **Visual verification checklist** — after each phase, manually verify every page
3. **Responsive verification** — check mobile, tablet, desktop after layout changes
4. **Component isolation** — build new components in isolation before integrating into pages
5. **Incremental replacement** — replace inline patterns one page at a time, not all at once
6. **Color change audit** — after global search/replace, visually scan every page for missed references
7. **No `!important`** — never use `!important` as it will mask regressions
8. **Commit frequently** — small, atomic commits make regression detection easier

---

## 10. Brand Compliance Baseline

This section establishes the **starting point** for tracking redesign progress.

### Color Compliance

| Requirement | Current | Baseline |
|-------------|---------|----------|
| Gold (#febd01) as primary | ❌ Blue (#123a6f) | **0%** |
| Gray-900 as text color | ❌ #111827 (close but wrong) | **50%** |
| Gray-500 as secondary text | ❌ #526071 (close but wrong) | **50%** |
| Gray-100 as muted bg | ❌ #eef2f7 (close but wrong) | **50%** |
| Gray-200 as border | ❌ #d9e2ec (close but wrong) | **50%** |
| No blue/indigo/orange tokens | ❌ All three present | **0%** |
| Design tokens for radius/shadows | ❌ Not defined | **0%** |
| **Color Baseline** | | **28%** |

### Typography Compliance

| Requirement | Current | Baseline |
|-------------|---------|----------|
| Headings use Merriweather (serif) | ❌ Geist Sans | **0%** |
| Body uses Geist Sans | ✅ Geist Sans | **100%** |
| No justified text | ✅ Left-aligned | **100%** |
| Heading hierarchy (one h1) | ⚠️ Inconsistent | **50%** |
| **Typography Baseline** | | **42%** |

### Spacing Compliance

| Requirement | Current | Baseline |
|-------------|---------|----------|
| Section padding consistent | ✅ py-16 sm:py-20 | **100%** |
| Vertical rhythm system | ❌ Arbitrary mt-* values | **0%** |
| Consistent heading→description gap | ❌ mt-4 vs mt-6 | **0%** |
| **Spacing Baseline** | | **33%** |

### Layout Compliance

| Requirement | Current | Baseline |
|-------------|---------|----------|
| Container component used | ✅ On all pages | **100%** |
| Grid patterns consistent | ✅ Mostly | **75%** |
| No inline styles | ✅ None | **100%** |
| **Layout Baseline** | | **92%** |

### Component Compliance

| Component | Baseline | Target |
|-----------|----------|--------|
| Button | 44% | 100% |
| Card | 8% | 100% |
| Hero | 11% | 100% |
| Forms | 0% | 100% |
| Stats | 0% | 100% |
| LogoGrid | 0% | 100% |
| News Cards | 26% | 100% |
| Training Cards | 33% | 100% |
| Contact Section | 8% | 100% |
| Navigation | 15% | 100% |
| Footer | 28% | 100% |
| **Components Baseline** | **11%** | |

### Navigation Compliance

| Requirement | Current | Baseline |
|-------------|---------|----------|
| Real logo image | ❌ Text placeholder | **0%** |
| Mobile sheet/menu | ❌ Non-functional hamburger | **0%** |
| Gold accent on active nav | ❌ Not implemented | **0%** |
| Phone in header | ❌ Not displayed | **0%** |
| **Navigation Baseline** | | **15%** |

### Page Compliance

| Page | Baseline |
|------|----------|
| Homepage | 4% |
| About | 25% |
| Training Programs | 14% |
| Corporate Training | 37% |
| News | 22% |
| Gallery | 11% |
| Contact | 9% |
| **Pages Baseline** | **14%** |

### Overall Brand Compliance Baseline

| Category | Weight | Baseline |
|----------|--------|----------|
| Color | 25% | 28% |
| Typography | 20% | 42% |
| Spacing | 10% | 33% |
| Layout | 10% | 92% |
| Components | 25% | 11% |
| Navigation | 5% | 15% |
| Pages | 5% | 14% |
| **Overall Compliance** | **100%** | **28%** |

---

## 11. Recommended Execution Order

The safest implementation order is determined by **dependencies**, not by page priority.

### Phase 0: Quick Wins (No Dependencies)

**Why first:** These tasks have zero dependencies and fix the broken build. They must be done before anything else.

```
1. Fix gallery/page.tsx (missing </div>)
2. Fix contact/page.tsx (missing </div>)
3. Fix training-programs/[slug]/page.tsx (missing </div>)
4. Add Merriweather font (independent of other changes)
5. Replace "IT" logo with real logo (independent)
6. Add tagline + social icons to footer (independent)
```

**Verification:** Build passes, all pages render, Merriweather loads.

### Phase 1: Brand Foundation (Prerequisite for Everything)

**Why first:** Every component and page depends on the correct color tokens and button variants. Changing colors later would require revisiting every file.

```
1. Update globals.css color tokens (gold replaces blue)
2. Update Button component variants (gold primary)
3. Global search/replace color references (text-primary → text-brand-gold)
```

**Verification:** Build passes, buttons are gold, no blue references remain.

### Phase 2: Shared Components (Prerequisite for Pages)

**Why second:** Building components before pages means pages can be rebuilt quickly using the new components. Building pages first would mean rebuilding them again when components are created.

```
1. Card component (foundation for all card-based layouts)
2. PageHero component (replaces duplicate hero patterns)
3. StatsSection component (new — no regression risk)
4. LogoGrid component (new — no regression risk)
5. NewsCard component (uses Card)
6. TrainingCard component (uses Card)
7. ContactInfo component (used by Contact + Footer)
8. Form components (Input, Textarea, Select, FormField)
9. SiteHeader update (uses new colors + logo)
10. SiteFooter update (uses new colors + ContactInfo)
```

**Verification:** All new components render correctly in isolation.

### Phase 3: Homepage (Most Important Page)

**Why third:** The homepage is the most important page and benefits most from new components. It should be rebuilt first to validate the component library.

```
1. Homepage hero (full-width, gold accent, serif heading)
2. StatsSection (import from Phase 2)
3. Services overview (uses Card)
4. Partner logos (uses LogoGrid)
5. Mission & Vision (uses Card featured variant)
6. Client logos (uses LogoGrid)
7. CTA section
```

**Verification:** Homepage matches spec, build passes, responsive.

### Phase 4: Remaining Pages (Isolated Work)

**Why fourth:** Each page can be updated independently. Order by business value.

```
1. About page (uses PageHero + Card + StatsSection + LogoGrid)
2. Corporate Training (uses PageHero + LogoGrid)
3. Training Programs (uses PageHero + TrainingCard + filter)
4. News page (uses PageHero + NewsCard)
5. Gallery page (uses PageHero + lightbox)
6. Contact page (uses PageHero + ContactInfo + Form components)
```

**Verification:** Each page individually verified after update.

### Phase 5: Admin Portal (Large Independent Effort)

**Why fifth:** Admin portal is a complete new feature. It depends on Phase 1 (colors) and Phase 2 (form components) but is otherwise independent.

```
1. Admin layout (sidebar + header)
2. Admin login page
3. Admin dashboard
4. CRUD pages (Training, News, Gallery, Inquiries)
```

### Phase 6: AI Assistant (Independent)

**Why sixth:** Depends on Phase 1 (colors) and backend AI service. Independent of all other frontend work.

```
1. Chat bubble component
2. Chat dialog with interface
```

### Phase 7: Accessibility (Must Be Last)

**Why last:** Accessibility changes affect the entire application. Doing them last ensures all pages and components are in their final state.

```
1. Skip-to-content link
2. ARIA landmarks
3. Reduced motion support
4. Focus indicators audit
5. Heading hierarchy audit
```

### Phase 8: Performance & Polish (Must Be Last)

**Why last:** Performance optimization is the final step before launch.

```
1. TanStack Query + Axios configuration
2. Image optimization
3. Micro-animations
4. Loading/empty/error states
```

---

## 12. Regression Prevention Strategy

### Phase 0 — Quick Wins

**After implementation, test:**

- [ ] Build passes (`npm run build --workspace=web`)
- [ ] Gallery page renders without errors
- [ ] Contact page renders without errors (contact info + form visible)
- [ ] Training/[slug] page renders without errors
- [ ] Merriweather font loads on all pages
- [ ] Logo image displays in header
- [ ] Tagline displays in footer
- [ ] Social media icons render in footer (links correct)
- [ ] Homepage unaffected

### Phase 1 — Brand Foundation

**After implementation, test:**

- [ ] Build passes
- [ ] `bg-brand-gold` renders gold (#febd01)
- [ ] `text-brand-gold` renders gold text
- [ ] Primary button is gold with dark text
- [ ] Secondary button is dark with white text
- [ ] Outline button hover fills with gold
- [ ] No blue (#123a6f) visible anywhere
- [ ] No indigo (#3f3cbb) visible anywhere
- [ ] All 7 pages visually verified for correct colors
- [ ] All badges use gold background
- [ ] All links use gold color
- [ ] All borders use gray-200

### Phase 2 — Shared Components

**After implementation, test:**

- [ ] Build passes
- [ ] Card renders with correct default styling
- [ ] Card featured variant shows gold top border
- [ ] Card interactive variant shows hover shadow
- [ ] PageHero renders with gold eyebrow + serif heading
- [ ] StatsSection renders with gold numbers
- [ ] LogoGrid renders with grayscale→color on hover
- [ ] NewsCard renders with gold badge + serif title
- [ ] TrainingCard renders with gold badge + metadata
- [ ] ContactInfo renders with gold icons
- [ ] Input has gold focus ring
- [ ] Textarea has gold focus ring
- [ ] Select has gold focus ring
- [ ] Error state shows red border
- [ ] Header logo displays correctly
- [ ] Mobile hamburger opens sheet
- [ ] Footer shows tagline + social icons

### Phase 3 — Homepage

**After implementation, test:**

- [ ] Build passes
- [ ] Hero is full-width with gold accent
- [ ] Headline uses serif font
- [ ] "Explore Programs" button is gold primary
- [ ] Stats section renders with gold numbers
- [ ] 5 service cards render with gold icons
- [ ] Partner logos render (grayscale, color on hover)
- [ ] Mission/vision section renders with gold left border
- [ ] Client logos render
- [ ] CTA section renders with 2 buttons
- [ ] Responsive on mobile (everything stacks)
- [ ] No horizontal scroll

### Phase 4 — Remaining Pages

**After implementation, test (each page):**

- [ ] Build passes
- [ ] PageHero renders with correct eyebrow + serif heading
- [ ] Color scheme matches rest of site
- [ ] Typography consistent with spec
- [ ] Responsive on mobile
- [ ] No horizontal scroll
- [ ] Links work correctly
- [ ] Contact form submits (when implemented)
- [ ] Form shows success message
- [ ] Form shows error on validation failure

### Phase 5-6 — Admin + AI

**After implementation, test:**

- [ ] Build passes
- [ ] Admin login works
- [ ] Admin sidebar navigation works
- [ ] CRUD operations work (create, read, update, delete)
- [ ] AI chat bubble appears
- [ ] Chat dialog opens/closes
- [ ] Messages send and receive

### Phase 7 — Accessibility

**After implementation, test:**

- [ ] Build passes
- [ ] Skip-to-content link is first tabbable element
- [ ] ARIA landmarks present (banner, navigation, main, contentinfo)
- [ ] No animations play when "reduce motion" enabled
- [ ] All interactive elements have visible focus indicators
- [ ] Each page has exactly one h1
- [ ] Heading hierarchy is sequential (h1→h2→h3)

### Phase 8 — Performance

**After implementation, test:**

- [ ] Build passes
- [ ] All images use Next.js Image component
- [ ] No layout shift from images
- [ ] Loading skeletons display during data fetch
- [ ] Empty states display when no data
- [ ] Error states display with retry on API failure

---

## 13. Success Metrics

### Metric Tracking Table

| Metric | Current (Baseline) | Phase 1 Target | Phase 2 Target | Phase 3-4 Target | Phase 5-8 Target |
|--------|-------------------|----------------|----------------|-------------------|-------------------|
| **Build status** | ❌ Failing | ✅ Passing | ✅ Passing | ✅ Passing | ✅ Passing |
| **Color compliance** | 28% | 85% | 90% | 95% | 100% |
| **Typography compliance** | 42% | 70% | 80% | 90% | 100% |
| **Component compliance** | 11% | 44% (Button) | 70% | 85% | 100% |
| **Page compliance** | 14% | 20% | 30% | 70% | 90% |
| **Navigation compliance** | 15% | 15% | 60% | 80% | 100% |
| **Accessibility score** | 30% | 30% | 35% | 40% | 85% |
| **Responsiveness** | 62% | 65% | 75% | 85% | 95% |
| **Build errors** | 3 | 0 | 0 | 0 | 0 |
| **Brand gold visible** | ❌ No | ✅ Buttons | ✅ Multiple | ✅ Everywhere | ✅ Everywhere |

### How We Will Know Nothing Broke

| Signal | Method |
|--------|--------|
| Build passes | `npm run build --workspace=web` |
| Lint passes | `npm run lint --workspace=web` |
| Pages render | Visual verification of all 7 pages |
| Responsive layout | Check mobile (375px), tablet (768px), desktop (1280px) |
| Links work | Click all navigation links, CTAs, and footer links |
| Contact form submits | Fill out and submit form, verify success message |
| Colors consistent | Visual scan for any remaining blue/indigo |
| Typography consistent | Visual scan for sans-serif headings (should be serif) |

### How We Will Know Brand Consistency Improved

| Signal | Method |
|--------|--------|
| Gold is now the primary brand color | Visual scan of all pages |
| Headings use serif font | Inspect any heading element |
| Tagline is present | Check footer |
| Partner logos are visible | Check homepage |
| Client logos are visible | Check homepage and corporate training |
| Stats are displayed | Check homepage |
| The site looks like ITSC | Compare with legacy ITSC website |

### How We Will Know Compliance Increased

| Metric | Start | End | Measurement |
|--------|-------|-----|-------------|
| Color compliance | 28% | 100% | Count of correct tokens / total tokens |
| Typography compliance | 42% | 100% | Count of correct fonts / total font usages |
| Component compliance | 11% | 100% | Components matching spec / total components |
| Page compliance | 14% | 100% | Pages matching spec / total pages |
| Overall | 28% | 100% | Weighted average of all categories |

### How We Will Know Technical Debt Decreased

| Metric | Start | End | Measurement |
|--------|-------|-----|-------------|
| Duplicated patterns | 5+ | 0 | Count of inline patterns that should be components |
| Build errors | 3 | 0 | `npm run build` exit code |
| Unused packages | 4 | 0 | Count of declared-but-unused packages |
| Empty directories | 1 | 0 | `features/home/` should be populated or removed |
| Static data pages | 7 | 0 | Pages using hardcoded data instead of API |

---

## 14. Redesign Readiness Score

### Score Breakdown

| Category | Weight | Score | Justification |
|----------|--------|-------|---------------|
| **Repository Health** | 10% | 75% | Clean monorepo, good structure, no circular dependencies, but failing build |
| **Design System** | 15% | 30% | Wrong colors, missing typography, no tokens, inconsistent spacing |
| **Architecture** | 15% | 80% | Clean component patterns, proper Server Components, good folder organization |
| **Components** | 15% | 15% | Only 6 reusable components exist; Card, Hero, Stats, Forms all missing |
| **Pages** | 10% | 30% | All pages exist as shells but none are build-ready or brand-compliant |
| **Accessibility** | 10% | 25% | Critical HTML issues, no skip-to-content, no ARIA, no reduced motion |
| **Performance** | 5% | 60% | Good architecture, no optimization yet, no images |
| **Maintainability** | 10% | 55% | Clean code but duplicated patterns, unused packages, no tests |
| **Brand Compliance** | 10% | 25% | Wrong colors completely, wrong typography, missing brand elements |

### Weighted Score

| Category | Weight | Score | Weighted |
|----------|--------|-------|----------|
| Repository Health | 10% | 75% | 7.5 |
| Design System | 15% | 30% | 4.5 |
| Architecture | 15% | 80% | 12.0 |
| Components | 15% | 15% | 2.3 |
| Pages | 10% | 30% | 3.0 |
| Accessibility | 10% | 25% | 2.5 |
| Performance | 5% | 60% | 3.0 |
| Maintainability | 10% | 55% | 5.5 |
| Brand Compliance | 10% | 25% | 2.5 |
| **Overall Readiness** | **100%** | | **42.8%** |

### Redesign Readiness Score: **43/100**

### Assessment

**Not ready for redesign implementation in the current state.**

The project has **solid architecture (80%)** and **reasonable repository health (75%)**, but **critically low brand compliance (25%)**, **component readiness (15%)**, and **accessibility (25%)**. The **failing build** is the immediate blocker.

### What Must Happen Before Starting the Redesign

1. **Fix 3 build-blocking JSX errors** (~10 minutes) — this raises the build from ❌ to ✅
2. **Decide on brand direction** — the gold color scheme is the most critical decision; do not start implementation until gold (#febd01) vs. blue (#123a6f) is resolved

### What the Redesign Will Achieve

| Phase | Readiness After | Cumulative |
|-------|----------------|------------|
| After Phase 0 (Quick Wins) | 48% | +5% |
| After Phase 1 (Brand Foundation) | 62% | +19% |
| After Phase 2 (Components) | 72% | +29% |
| After Phase 3-4 (Pages) | 82% | +39% |
| After Phase 5-8 (Admin + AI + A11y + Perf) | 95% | +52% |

**Target after all phases: 95% readiness**

---

*End of UI Baseline Report. This document serves as the authoritative reference for the current state of the ITSC frontend before redesign implementation begins. All future work should reference this document to measure progress and prevent regressions.*