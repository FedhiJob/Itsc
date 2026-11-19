# ITSC Frontend — UI/UX Architecture Audit

> **Date:** 2026-07-26  
> **Scope:** `apps/web` — entire frontend codebase  
> **Auditor:** Senior Full-Stack Engineer  
> **Method:** Static code analysis (no runtime inspection)

---

## 1. Design Philosophy

The frontend follows a **clean, corporate, content-forward** design philosophy appropriate for a professional technology training center. The visual language is:

- **Minimal and restrained** — no decorative flourishes, no gradients, no heavy shadows
- **Typography-driven** — content hierarchy is established purely through font size and weight
- **Card-based layouts** — information is organized in bordered, white cards with subtle shadows
- **Government/enterprise tone** — conservative blue (#123a6f) primary, neutral grays, orange accent sparingly used

There is no evidence of a formal design system, brand guidelines, or Figma-driven design tokens. The design decisions appear to have been made ad-hoc during implementation, resulting in a generally clean but **inconsistent** and **incomplete** UI.

---

## 2. Theme System

### Implementation

The theme is implemented via **CSS custom properties** in `globals.css` mapped through Tailwind's `@theme inline` directive (Tailwind CSS v4 syntax).

```css
:root {
  --background: #f8fafc;
  --foreground: #111827;
  --muted: #eef2f7;
  --muted-foreground: #526071;
  --border: #d9e2ec;
  --primary: #123a6f;
  --primary-700: #0d2e59;
  --secondary: #3f3cbb;
  --secondary-700: #302d91;
  --accent: #f97316;
  --success: #0f9f6e;
  --warning: #d97706;
  --error: #dc2626;
}
```

### Issues

| Issue | Severity |
|-------|----------|
| **No dark mode support** — only `:root` variables, no `@media (prefers-color-scheme: dark)` or `class="dark"` strategy | High |
| **No semantic aliases** — `primary-700` and `secondary-700` exist but no `primary-500`, `primary-900` scale | Medium |
| **Missing tokens** — no `--radius`, `--shadow`, `--ring`, `--font-size` scale, `--line-height` tokens | Medium |
| **`--accent` underutilized** — defined as orange (#f97316) but never used in the codebase outside CSS | Low |
| **`--success`, `--warning`, `--error`** defined but never referenced in any component | Low |
| **No CSS variable for `--color-destructive`** — the contact form uses `text-destructive` which doesn't exist in CSS (likely inherited from a shadcn preset that isn't configured) | High |

---

## 3. Color Palette

### Defined Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--background` | `#f8fafc` | Page backgrounds (near-white with subtle blue tint) |
| `--foreground` | `#111827` | All text (near-black) |
| `--muted` | `#eef2f7` | Subtle background fills, hover states |
| `--muted-foreground` | `#526071` | Secondary text, metadata |
| `--border` | `#d9e2ec` | All borders, dividers |
| `--primary` | `#123a6f` | Primary buttons, links, badges, interactive elements |
| `--primary-700` | `#0d2e59` | Button hover state |
| `--secondary` | `#3f3cbb` | Secondary buttons (indigo) |
| `--secondary-700` | `#302d91` | Secondary button hover |
| `--accent` | `#f97316` | Defined but unused |
| `--success` | `#0f9f6e` | Defined but unused |
| `--warning` | `#d97706` | Defined but unused |
| `--error` | `#dc2626` | Defined but unused |

### Palette Analysis

- **Primary blue (#123a6f)** is appropriate for a technology/training institution — conveys trust, professionalism, stability
- **Secondary indigo (#3f3cbb)** clashes slightly with the primary blue — they are adjacent on the color wheel but the indigo is too saturated and creates visual tension
- **The palette lacks a true neutral** — `#f8fafc` (background) and `#eef2f7` (muted) are both blue-tinted, giving the entire site a cool cast
- **No accent color strategy** — orange is defined but orphaned; there's no consistent secondary accent for calls-to-action or highlights

---

## 4. Typography Scale

### Implementation

Typography uses **Geist Sans** (via `next/font/google`) as the sans-serif font and **Geist Mono** for monospace. The entire typography scale is **implicit** — achieved through arbitrary Tailwind classes rather than a defined type scale.

### Observed Scale

| Context | Class | Computed |
|---------|-------|----------|
| Page title (h1) | `text-4xl` → `sm:text-5xl` → `lg:text-6xl` | 36px → 48px → 60px |
| Section heading (h2) | `text-3xl font-bold` | 30px |
| Card heading (h3) | `text-xl font-semibold` | 20px |
| Card heading (h3 alt) | `text-lg font-semibold` | 18px |
| Body text | `text-base leading-7` | 16px |
| Secondary body | `text-sm leading-6` | 14px |
| Small/meta | `text-xs` | 12px |

### Issues

| Issue | Severity |
|-------|----------|
| **No type scale system** — every page reinvents heading sizes independently | High |
| **Inconsistent heading hierarchy** — home page uses `text-4xl` for h1, about page uses same, but h2 sizes vary between `text-2xl`, `text-3xl` depending on page | Medium |
| **Line-height inconsistency** — `leading-8` on home page description, `leading-7` on other pages, `leading-tight` on headings | Medium |
| **No font-weight system** — `font-bold`, `font-semibold`, `font-medium` used arbitrarily; no `font-normal` body definition | Low |
| **No responsive type strategy beyond sm breakpoint** — many headings only have `sm:` overrides | Medium |

---

## 5. Spacing System

### Implementation

Spacing is entirely **ad-hoc** using Tailwind's utility classes. No spacing scale is defined beyond Tailwind's defaults.

### Observed Patterns

| Pattern | Value | Frequency |
|---------|-------|-----------|
| Section padding | `py-16 sm:py-20` | Consistent |
| Card padding | `p-6` | Consistent |
| Grid gaps | `gap-6`, `gap-8`, `gap-12` | Varies |
| Vertical stack | `space-y-4`, `space-y-6`, `space-y-8` | Varies |
| Margin top | `mt-2`, `mt-3`, `mt-4`, `mt-6`, `mt-8`, `mt-10` | Varies |
| Margin between heading and description | `mt-6` (most), `mt-4` (about), `mt-3` (home) | Inconsistent |

### Issues

- **No consistent vertical rhythm** — the space between a heading and its description varies from `mt-3` to `mt-6` across pages
- **No reusable spacing component** — every page manually applies `mt-*` classes
- **No defined section spacing for adjacent sections** — the gap between sections is purely determined by each section's `py-*` padding, which is correct but fragile

---

## 6. Container Widths

### Implementation

The `Container` component in `section.tsx` defines:

```tsx
"mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"
```

### Usage Analysis

| Usage | Location | Width Constraint | Notes |
|-------|----------|-----------------|-------|
| Full-width sections | Home, About, Training, etc. | `Container` component ✅ | Consistent |
| Content-only sections | "Ready to get started?" CTAs | `Container className="max-w-2xl text-center"` ✅ | Properly constrained |
| Header content | `max-w-3xl` in hero sections | `Container className="max-w-3xl text-center"` ❌ | Instead of using Container, they nest another max-w constraint |

### Issues

- **Containers are used correctly** — this is actually a strength. The `Container` component is reused consistently across all pages.
- **Minor:** The `max-w-3xl` text-center pattern is repeated manually on every page instead of being a reusable hero variant
- **Header uses `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`** as inline classes rather than using the Container component

---

## 7. Component Inventory

### Reusable Components (`src/components/`)

| Component | File | Type | Lines | Notes |
|-----------|------|------|-------|-------|
| `Button` | `ui/button.tsx` | UI primitive | 47 | CVA-based, 4 variants, 3 sizes, supports `asChild` |
| `Section` | `ui/section.tsx` | Layout | 6 | Simple wrapper with consistent padding |
| `Container` | `ui/section.tsx` | Layout | 11 | Max-width constraint wrapper |
| `SiteHeader` | `layout/site-header.tsx` | Layout | 50 | Sticky header, nav, mobile hamburger (non-functional) |
| `SiteFooter` | `layout/site-footer.tsx` | Layout | 51 | 3-column footer, nav, contact info |

### Total Component Count

- **Reusable UI components:** 4 (Button, Section, Container, and Button asChild)
- **Layout components:** 2 (SiteHeader, SiteFooter)
- **Page-level components:** 0 (all pages are monolithic page files)
- **Feature components:** 0 (the `features/home/` directory is empty)

### Analysis

The project has **extremely few reusable components** for a 7-page application. Every page is a monolithic file that manually constructs cards, grids, and sections using raw HTML and Tailwind classes.

---

## 8. Reusable Component Inventory

What **should** be extracted into reusable components:

| Candidate Component | Current State | Pages Affected |
|--------------------|---------------|----------------|
| `HeroSection` | Repeated pattern: Section > Container > max-w-3xl > eyebrow > h1 > description | All 7 pages |
| `FeatureCard` / `InfoCard` | Inline card patterns with icon/title/description | Home, About, Corporate Training |
| `ProgramCard` | Inline article with category badge, title, description, metadata | Training Programs |
| `NewsCard` | Inline article with date, category, title, summary | News |
| `CategoryBadge` | Inline `rounded-md bg-primary/10 px-2 py-1 text-primary` | Training Programs, News |
| `CTASection` | Repeated heading + description + 2 buttons pattern | About, Corporate Training |
| `ContactInfoItem` | Repeated icon + label + value pattern | Contact, Footer |
| `ArticleCard` | Shared pattern between news articles and program cards | News, Training Programs |
| `PageHeader` | The "eyebrow text + h1 + description" pattern repeated identically on every page | All 7 pages |

---

## 9. Duplicate Components / Patterns

1. **Contact info display** — The icon + label + value pattern exists in both `SiteFooter` (3 items) and `ContactPage` (3 items), built identically but separately
2. **Section backgrounds** — `bg-muted/30` is applied to alternating sections on every page, but is hardcoded per-section rather than being a Section variant
3. **Card grids** — `grid gap-6 md:grid-cols-2` appears in multiple pages as inline classes
4. **Badge styling** — "AI", "Beginner", category badges use the same pattern `rounded-md bg-primary/10 px-2 py-1 text-primary` duplicated across files
5. **"Ready to get started?" CTA** — Identical CTA patterns in About page and Corporate Training page

---

## 10. Accessibility Audit

### Issues Found

| Issue | Location | WCAG Criterion | Severity |
|-------|----------|----------------|----------|
| **Missing form labels** | Contact page: no `<label>` for select and textarea (labels exist but aren't associated via `htmlFor`/`id` — actually they are, this is correct) | — | — |
| **Contact info missing closing divs** | Contact page lines ~53-71: broken nested div structure causes rendering errors | 4.1.1 | **Critical** |
| **Mobile hamburger button has no menu** | SiteHeader: hamburger button exists but opens nothing | 2.1.1 | High |
| **No skip-to-content link** | Root layout | 2.4.1 | High |
| **No focus-visible on cards** | All card components lack explicit focus styles for keyboard navigation | 2.4.7 | Medium |
| **Nav link focus styles** | Main nav links have `focus-visible:outline` ✅ but only 2px offset | 2.4.7 | Low |
| **Image alt text** | Gallery uses placeholder gradient backgrounds — actual images would need proper alt text | 1.1.1 | Medium |
| **No ARIA landmarks** | Only `aria-label="Main navigation"` and `aria-label="Footer navigation"` exist; no `role="main"`, `role="banner"`, `role="contentinfo"` | 1.3.1 | Low |
| **Color contrast** — primary blue (#123a6f) on white — ratio ~8.5:1 ✅ | — | 1.4.3 | Pass |
| **Muted-foreground (#526071) on background (#f8fafc)** — ratio ~5.2:1 ✅ | — | 1.4.3 | Pass (meets AA for normal text) |
| **No reduced-motion support** — `scroll-behavior: smooth` has no `@media (prefers-reduced-motion)` fallback | globals.css | 2.3.3 | Medium |
| **Button focus indicators** — Button component has `focus-visible:outline-2 focus-visible:outline-offset-2` ✅ | — | — | Pass |

### Summary

Accessibility is **partially addressed** but has **critical issues** (broken contact page HTML) and **significant gaps** (no skip navigation, no mobile menu). Color contrast passes, which is good.

---

## 11. Responsiveness Audit

### Breakpoint Strategy

Uses Tailwind's default breakpoints:
- `sm:` — 640px
- `md:` — 768px
- `lg:` — 1024px

### Responsive Behavior by Page

| Page | Mobile | Tablet | Desktop | Issues |
|------|--------|--------|---------|--------|
| **Home** | Stacked layout ✅ | 2-col grid ✅ | 4-col feature grid ✅ | Good |
| **About** | Single column ✅ | 2-col grid ✅ | 3-col grid ✅ | Good |
| **Training** | Single column ✅ | 2-col grid ✅ | 3-col categories, 2-col programs ✅ | Good |
| **Corporate** | Single column ✅ | 2-col grid ✅ | 2-col grid ✅ | Good |
| **News** | Single column ✅ | Single column ✅ | Single column ✅ | Intentional? No grid at any size |
| **Gallery** | Single column ✅ | 2-col grid ✅ | 3-col grid ✅ | Good |
| **Contact** | Stacked layout ✅ | 2-col layout ✅ | Content/form side-by-side ✅ | Good |
| **Header** | Logo + hamburger ✅ | Logo + hamburger ✅ | Full nav visible ✅ | Hamburger has no menu ❌ |
| **Footer** | Single column stacked ✅ | — | 3-column grid ✅ | Good |

### Issues

| Issue | Severity |
|-------|----------|
| **Mobile hamburger menu is non-functional** — button exists but opens nothing | Critical |
| **News page has no responsive width variation** — articles are full-width on all screen sizes, missing `md:max-w-2xl` or similar constraint | Medium |
| **No responsive typography below `sm` breakpoint** — all responsive type classes start at `sm:`, meaning phones below 640px always get the smallest size | Medium |
| **Home page hero card grid** — 4 items in `sm:grid-cols-2` on mobile becomes 2 columns, which is tight on small phones | Low |

---

## 12. Tailwind Audit

### Tailwind Version

**Tailwind CSS v4** — confirmed by:
- `@import "tailwindcss"` in globals.css (v4 syntax)
- `@theme inline` directive for theme customization
- `@tailwindcss/postcss` as PostCSS plugin in `postcss.config.mjs`

### Tailwind Usage Patterns

| Pattern | Assessment |
|---------|------------|
| **Utility-first usage** | ✅ Consistent — no raw CSS for layout |
| **`@apply` usage** | ✅ None — good practice |
| **Arbitrary values** | Minimal — `text-white/72`, `text-white/60`, `text-white/75` are the only opacity variants |
| **Class ordering** | Inconsistent — no enforced sort order |
| **Negative margins** | None ✅ |
| **`!important`** | None ✅ |

### Issues

| Issue | Severity |
|-------|----------|
| **No class sorting** (no Prettier plugin for Tailwind) — `className` strings are manually ordered, causing readability issues | Medium |
| **Color opacity values inconsistent** — `text-white/72` (footer), `text-white/60`, `text-white/75` — these are arbitrary values with no system behind them | Low |
| **No design token usage** — colors are referenced as `bg-primary`, `text-primary`, etc., which is correct, but the tokens themselves should be more extensive | Low |

---

## 13. shadcn/ui Usage Audit

### Current Status

The project uses **shadcn/ui-style patterns** (CVA-based variants, Slot from Radix) but **does NOT use shadcn/ui** as an installed dependency.

### Evidence

| Pattern | Present? | Notes |
|---------|----------|-------|
| `class-variance-authority` (CVA) | ✅ `button.tsx` | Used correctly |
| `@radix-ui/react-slot` | ✅ `button.tsx` | Used for `asChild` |
| `cn()` utility | ✅ `lib/utils.ts` | Uses `clsx` + `tailwind-merge` |
| shadcn CLI (`npx shadcn`) | ❌ Not configured | No `components.json` |
| shadcn components | ❌ Not installed | Only Button is custom-built |
| Radix primitives (Dialog, Popover, etc.) | ❌ Not installed | No interactive components |

### Assessment

The project is **shadcn/ui-inspired** but not shadcn/ui. The Button component is a faithful implementation of shadcn's Button pattern. However, the project is missing the entire Radix UI ecosystem that makes shadcn/ui powerful — dialogs, dropdowns, popovers, tooltips, sheets, toasts, etc.

---

## 14. Animation Audit

### Current State

Animations are **virtually nonexistent:**

| Animation | Location | Type |
|-----------|----------|------|
| `scroll-behavior: smooth` | `globals.css` | CSS only |
| Button `transition-colors` | Button, nav links, cards | CSS only |
| `hover:shadow-md` on news cards | News page | CSS only |
| `hover:border-primary` on category cards | Training Programs | CSS only |

### Missing

| Missing Animation | Impact |
|-------------------|--------|
| **Page transition** — no layout animation between routes | Low |
| **Staggered card entrance** — cards all appear at once | Medium |
| **Loading states** — no skeleton animations | High (when API is connected) |
| **Hover scale** — no subtle `hover:scale-[1.02]` on cards | Low |
| **Focus ring animation** — no `transition-shadow` on focus | Low |
| **No reduced-motion preference** — no `@media (prefers-reduced-motion)` query | Medium |

---

## 15. UX Problems

### Critical

1. **Contact page is broken** — missing `</div>` tags cause the page to render incorrectly. The contact info section (email, phone, address) and the form section are not properly nested, which means the form may not render at all or renders inside the contact info column.

2. **Mobile navigation is non-functional** — the hamburger button has `aria-label="Open navigation menu"` but does nothing when clicked. Mobile users cannot navigate the site.

3. **Contact form cannot be submitted** — the form has no `onSubmit` handler, no validation, no API integration. Users can fill it out but nothing happens.

### High

4. **No loading states** — when API integration is added, users will see nothing while data loads
5. **No empty states** — "No articles found" or "No programs available" messages don't exist
6. **No error states** — API failures will result in blank pages or thrown errors
7. **Home page content is generic placeholder text** — "Corporate website foundation" as an eyebrow label is meaningless to visitors
8. **News page has no article limit or "Load More"** — hardcoded to 5 articles with no pagination UI
9. **Gallery has no actual images** — all gallery items are gradient placeholders with alt text displayed as text

### Medium

10. **"Ask ITSC" button in header has no functionality** — links to `/contact` instead of triggering an AI chat
11. **Home page "AI Assistant" feature card** promises functionality that doesn't exist
12. **No breadcrumbs** — deep pages (`/training-programs/[slug]`) have no navigation context
13. **No search** — users cannot search training programs or news
14. **Training programs page** — the URL-based category filter (`?category=`) has no JavaScript filtering; categories are linked but no filtering logic exists
15. **Date formatting inconsistency** — News page uses `toLocaleDateString` (client-side), which may cause hydration mismatches with SSR

---

## 16. UI Inconsistencies

| Issue | Location A | Location B | Impact |
|-------|-----------|-----------|--------|
| **Card padding** | Home feature cards: `p-6` | Category cards: `p-5` | Low |
| **Heading spacing** | About: `mt-4` between h1 and description | Home: `mt-6` between h1 and description | Medium |
| **Section background** | Alternating sections use `bg-muted/30` | Some sections use `bg-white` explicitly, others rely on default | Low |
| **Button icons** | "Explore Programs" uses `ArrowRight` AFTER text | Some buttons have icons before text, some after | Low |
| **Font weight on labels** | "Programs" eyebrow label: `font-semibold` | "Updates" eyebrow label: `font-semibold` | Consistent ✅ |
| **Card shadow** | News cards: `shadow-sm` + `hover:shadow-md` | Program cards: `shadow-sm` only | Low |
| **Arrow icon size** | Button arrows: `h-4 w-4` | "Read More" links: `h-3.5 w-3.5` | Low |

---

## 17. Strengths

1. **Consistent layout architecture** — `Section` + `Container` pattern is clean and reused across all pages
2. **Good semantic HTML** — `<article>`, `<nav>`, `<footer>`, `<main>` are used correctly
3. **Proper ARIA attributes** — `aria-hidden="true"` on icons, `aria-label` on navigation
4. **Button component is well-designed** — CVA variants, `asChild` support, proper focus styles, disabled states
5. **Excellent SEO foundation** — metadata, OpenGraph, Twitter cards, sitemap, robots.txt all present
6. **Font loading is optimized** — Geist fonts with `variable` subsets, no CLS impact
7. **Tailwind v4 is properly configured** — `@theme inline` directive, CSS custom properties mapped correctly
8. **No CSS bloat** — no unused `@apply`, no prefixed pseudo-classes, no IE fallbacks
9. **Good color contrast** — Primary and muted-foreground both pass WCAG AA
10. **Responsive layout is functional** — most pages work on mobile through desktop despite the missing hamburger menu

---

## 18. Weaknesses

1. **Too few reusable components** — every page is monolithic, making maintenance expensive
2. **No form system** — Contact page uses raw HTML inputs instead of React Hook Form + Zod
3. **No data-driven UI** — all content is hardcoded, no API integration, no state management
4. **No interactive elements** — zero modals, dropdowns, tooltips, tabs, accordions, toasts
5. **No design system** — type scale, spacing scale, and color tokens are insufficient for a multi-page application
6. **Broken HTML in Contact page** — shows lack of code review process
7. **No tests** — zero component tests, zero E2E tests
8. **No storybook or component documentation**
9. **Shallow accessibility implementation** — passes color contrast but misses fundamental things like skip-to-content
10. **No motion/transition design** — the UI feels static and lacks polish

---

## 19. Recommendations for Modernization

### Phase 1: Fix Critical Issues (Immediate)

1. **Fix Contact page HTML** — properly close all divs and restructure the contact info section
2. **Implement mobile navigation** — build a slide-out sheet/drawer for the hamburger menu
3. **Make the contact form functional** — integrate React Hook Form + Zod validation + TanStack Query for API submission

### Phase 2: Component Library (Next)

4. **Adopt shadcn/ui properly** — run `npx shadcn init` and install core components:
   - `Sheet` (for mobile nav), `Dialog`, `Toast`, `Skeleton`, `Card`, `Input`, `Textarea`, `Select`, `Badge`, `Separator`, `Breadcrumb`
5. **Extract shared page patterns** — create `HeroSection`, `PageHeader`, `FeatureCard`, `CTASection`, `ArticleCard` components
6. **Create a form system** — build reusable `FormField`, `Input`, `Textarea`, `Select` components wrapping React Hook Form

### Phase 3: Design System (Next)

7. **Complete the theme** — add `--radius`, `--shadow`, `--ring`, `--font-size` tokens; define a proper type scale
8. **Add dark mode** — implement `class="dark"` strategy with Tailwind v4
9. **Create a spacing/rhythm utility** — define consistent `stack` (vertical) and `inline` (horizontal) spacing primitives
10. **Standardize card patterns** — create a `Card` component with `CardHeader`, `CardBody`, `CardFooter` sub-components

### Phase 4: Polish (Final)

11. **Add micro-animations** — staggered card entrance, hover transitions, page transitions
12. **Implement loading states** — skeleton components for every data-driven view
13. **Add empty/error states** — consistent pattern for "no data" and "something went wrong"
14. **Accessibility pass** — skip-to-content link, focus management, reduced-motion support, keyboard testing
15. **Add breadcrumbs** — create a `Breadcrumbs` component for deep navigation paths
16. **Install Prettier Tailwind plugin** — enforce consistent class ordering

### Phase 5: Testing (Ongoing)

17. **Set up Storybook** — document all components with interactive stories
18. **Add component tests** — Vitest + Testing Library for critical components
19. **Add E2E tests** — Playwright for critical user flows (contact form, navigation)

---

## 20. Conclusion

The ITSC frontend has a **solid but incomplete** architectural foundation. The layout components (`Section`, `Container`, `Button`) are well-implemented. The SEO foundation is excellent. Color contrast is good.

However, the project has **critical UX issues** (broken contact page, non-functional mobile nav, non-functional contact form), **insufficient component abstraction** (monolithic pages with duplicated patterns), and **no interactive capabilities** (no modals, toasts, drawers, or data-driven UI).

The recommended modernization path is to **fix critical bugs first**, then **adopt shadcn/ui properly** to gain access to production-quality interactive components, then **extract a design system** from the existing pages, and finally **add polish** through animations and accessibility improvements.