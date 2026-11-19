# ITSC AI Next-Generation Experience — UX Baseline Audit
**Document ID:** `ITSC_UX_BASELINE_AUDIT.md`  
**Phase:** Phase 0 — Project Discovery and Baseline  
**Project:** Information Technology Support Centre (ITSC) Official Web Platform  
**Target Architecture:** Next.js 15 App Router (React 19, Tailwind CSS v4) & Node.js 22 / Express 5 backend  
**Audit Date:** November 9, 2026  
**Auditor:** Google Antigravity Agent  
**Status:** Completed Baseline — Awaiting Approval for Phase 1  

---

## 1. Executive Summary

This UX Baseline Audit evaluates the current state of the Information Technology Support Centre (ITSC) official web platform against the five experience pillars defined in the master engineering specification:
1. **Clarity**
2. **Fluidity**
3. **Intelligence**
4. **Adaptability**
5. **Consistency**

The evaluation investigates page visual hierarchy, typographic scales, color contrast, touch targets, state management, transitions, error feedback, accessibility semantics, and performance baselines across desktop and mobile viewports.

---

## 2. Methodology & Inspection Scope

The audit was conducted via source inspection, static analysis, production Next.js build verification, and automated API/integration testing:
- **Routes Audited:** 15 distinct routes (9 public, 6 admin).
- **Component Scope:** 28 distinct React components in `apps/web/src/components/`.
- **CSS Architecture:** Tailwind CSS v4 (`apps/web/src/app/globals.css`), CSS variables, custom keyframes.
- **Data Layers:** Server-side fetching (`fetch` with caching/tags/no-store), TanStack Query v5 client-side state.

---

## 3. Pillar-by-Pillar Evaluation

### 3.1 Pillar 1: Clarity (Score: 78/100)
- **Strengths:**
  - Clear page titling and hero headers on `/`, `/training-programs`, `/corporate-training`, `/about`, and `/contact`.
  - Mega-menu desktop navigation organizes courses into distinct tracks (Database, Networking, Cloud, Programming, etc.).
  - Course cards display primary metadata: title, code, duration, level badge, and short description.
  - ITSC AI assistant drawer provides an introductory state with pre-populated suggested prompt pills.
- **Weaknesses & Friction Points:**
  - **Mega-menu density:** The desktop mega-menu renders extensive lists of categories without visual indicators for current scroll position or category depth.
  - **Filter feedback:** On `/training-programs`, filtering updates the URL search params, but lacks an immediate count preview before query completion.
  - **Empty search states:** While search handles empty results gracefully, suggested alternatives or spell-tolerant corrections are not yet integrated into the course catalog grid.
  - **Breadcrumbs:** Breadcrumbs exist on detail pages (`/training-programs/[slug]`) but lack structured data (`BreadcrumbList` schema markup) for search engine discovery.

### 3.2 Pillar 2: Fluidity (Score: 68/100)
- **Strengths:**
  - Quick page transitions enabled by Next.js App Router client cache.
  - CSS keyframes for floating elements (`itsc-float`), pulse indicators (`itsc-pulse`), and subtle reveal fades (`itsc-reveal`).
- **Weaknesses & Friction Points:**
  - **Absence of a unified motion library:** No motion library (such as Motion / Framer Motion) is currently installed in `apps/web`. Layout shifts and drawer expansions rely purely on basic CSS transitions (`transition-all duration-300`).
  - **Drawer & Modal transitions:** The ITSC AI drawer (`ChatDrawer.tsx`) uses fixed CSS transform classes (`translate-x-full` to `translate-x-0`). It lacks spring physics, gesture-based dragging on touch devices, or velocity-based swipe-to-dismiss.
  - **Mega-menu opening/closing:** The desktop mega-menu pops into view with opacity and scale transforms without smooth origin coordination.
  - **Skeleton loading states:** While loading spinners exist, full-page skeleton screens matching the exact geometry of cards, hero sections, and category pills are inconsistent across routes.

### 3.3 Pillar 3: Intelligence (Score: 88/100)
- **Strengths:**
  - **ITSC AI (Gemini 2.5 Flash):** Highly capable, resilient backend integration with database grounding, 14 verified edge cases, conversation context memory, and structured course payload returns.
  - **Fallback synthesis:** When external LLM APIs are unreachable or rate-limited, the system synthesizes grounded database answers from verified course records rather than crashing.
  - **Public search indexing:** Full catalog search queries course titles, codes, short descriptions, and category metadata.
- **Weaknesses & Friction Points:**
  - **Omnipresent search:** The global header provides search triggers, but instant typeahead auto-complete with highlighted search hits is not yet active on all subpages.
  - **Contextual AI prompting:** The chat assistant opens with general questions, rather than automatically reading the user's active page context (e.g., suggesting questions about Oracle DBA when browsing an Oracle course).

### 3.4 Pillar 4: Adaptability (Score: 74/100)
- **Strengths:**
  - Mobile bottom navigation bar provides rapid thumb-accessible links to Home, Training, AI Chat, and Contact.
  - Responsive grids shift cleanly from 1 column on mobile (`< 640px`) to 2 columns on tablets (`768px`) and 3-4 columns on desktop (`1024px+`).
- **Weaknesses & Friction Points:**
  - **Mobile header overlap:** On small smartphones (≤375px), the sticky header combined with banner notices can occupy excessive vertical real estate.
  - **Course filter sheet on mobile:** Filter drawer on `/training-programs` requires scrolling past long checkbox lists; lacks sticky action buttons ("Apply 12 Filters", "Clear All") pinned to the viewport bottom.
  - **Touch target sizing:** Several secondary action buttons (e.g., share icons, outline download chips) measure under 44x44 CSS pixels.

### 3.5 Pillar 5: Consistency (Score: 82/100)
- **Strengths:**
  - Cohesive dark/light palette rooted in ITSC corporate navy (`#10253f`), deep ink (`#172033`), warm parchment background (`#f8f7f2`), and gold accents (`#febd01`).
  - Font pairing consistently implemented across root layout: Geist Sans for interface typography, serif Merriweather for editorial headers.
- **Weaknesses & Friction Points:**
  - **Color token discrepancy:** Master engineering specification references `#C5A85A` as Brand Gold and `#0F172A` as Brand Ink, whereas `globals.css` implements `#febd01` (primary gold) and `#172033` (brand ink). Semantic color mapping needs normalization.
  - **Admin UI vs. Public UI:** The admin dashboard uses a distinct, cooler slate gray palette (`#0f172a` and standard Tailwind neutral grays), diverging slightly from the warm institutional aesthetic of the public portal.

---

## 4. Accessibility (a11y) Baseline

| Accessibility Check | Status | Finding / Action Required |
|---|---|---|
| Color Contrast (WCAG AA) | Conditional | Gold text (`#febd01`) on light backgrounds fails 4.5:1 ratio. Must be reserved for dark backgrounds or paired with dark ink text. |
| Keyboard Navigation | Moderate | Focus rings (`focus-visible:ring-2`) are present on buttons and links, but drawer components lack strict focus traps. |
| ARIA Attributes | Moderate | `aria-expanded` and `aria-controls` are present on mobile menu and chat triggers; missing on category accordions. |
| Touch Target Minimums (44x44px) | Needs Polish | Secondary icon buttons and pagination controls on mobile need minimum 44px hit bounds. |
| Screen Reader Live Regions | Basic | AI chat message stream needs `aria-live="polite"` to announce incoming assistant responses to assistive devices. |

---

## 5. Summary Scorecard

```
Clarity:        78/100 [████████░░]
Fluidity:       68/100 [███████░░░]
Intelligence:   88/100 [█████████░]
Adaptability:   74/100 [███████░░░]
Consistency:    82/100 [████████░░]
-----------------------------------
Overall UX Score: 78/100 (Solid baseline; ready for Apple-inspired fluid transformation)
```

---

## 6. Visual Inspection & Baseline Screenshot Inventory

Direct headless browser sessions (Desktop: 1280x900 viewport, Mobile: 390x844 viewport simulating iPhone 14/15/16) were executed against the compiled production build to inspect layout geometry, responsive scaling, and visual baseline fidelity:

| Screenshot Asset | Target Route | Viewport | Verified Geometry & Visual Observations |
|---|---|---|---|
| `docs/baseline-screenshots/desktop-home.png` | `/` (Home) | 1280x900 | Hero typography hierarchy displays properly; gold badges render crisply; desktop mega-menu trigger visible; floating vectors anchored. |
| `docs/baseline-screenshots/mobile-home.png` | `/` (Home) | 390x844 | Single-column responsive layout active; sticky bottom thumb bar anchored; category pill carousel horizontally scrollable; hero search field accessible. |
| `docs/baseline-screenshots/desktop-training.png` | `/training-programs` | 1280x900 | 3-column course grid rendered; sidebar facet filter populated with category check-groups; level chips display clean contrast. |
| `docs/baseline-screenshots/mobile-training.png` | `/training-programs` | 390x844 | 1-column course stream active; filter trigger sheet button visible; pagination bar accessible at page base. |
| `docs/baseline-screenshots/desktop-corporate.png` | `/corporate-training` | 1280x900 | Institutional training delivery modes grid rendered; corporate consultation form layout balanced. |
| `docs/baseline-screenshots/mobile-corporate.png` | `/corporate-training` | 390x844 | Stacked form fields with full-width submit CTA; delivery comparison cards stacked cleanly. |
| `docs/baseline-screenshots/desktop-about.png` | `/about` | 1280x900 | Leadership cards and institutional mission sections aligned with editorial serif typography. |
| `docs/baseline-screenshots/mobile-about.png` | `/about` | 390x844 | Stacked leadership cards; milestone badges maintain readable text without truncation. |
| `docs/baseline-screenshots/desktop-contact.png` | `/contact` | 1280x900 | Two-column split: left contact information cards, right interactive inquiry form with embedded map below. |
| `docs/baseline-screenshots/mobile-contact.png` | `/contact` | 390x844 | Stacked contact cards; tap-to-call and email buttons measure above 44px hit bounds. |
| `docs/baseline-screenshots/desktop-admin-login.png` | `/admin/login` | 1280x900 | Centered branded login card; dark backdrop with gold accent button and password visibility toggle. |

---

## 7. Explicit Verification Boundaries & Limitations

In compliance with the Phase 0 strict restrictions:
- **Production Third-Party Analytics:** `NOT VERIFIED` (No live third-party trackers or production tag managers inspected in local sandbox).
- **Physical Touch-Screen Gestures (Haptics / Hardware Momentum):** `NOT VERIFIED` (Emulated via synthetic mobile viewports; real iOS Safari WebKit hardware gesture test required on physical hardware during Phase 2/3).
- **Live Render Production API Latency:** `NOT VERIFIED` in offline environment; live endpoints (`https://itsc.onrender.com/api/v1`) were verified through baseline test suites, but transient public network jitter is not simulated.
- **Admin Authenticated Deep State Session Persistence:** `VERIFIED VIA INTEGRATION TESTS` (`auth-rbac.test.ts`), but visual screenshot of `/admin/training` modal with real PDF file drag-and-drop requires active authenticated user session in live browser.

---

## 8. Recommendations for Master Phase 1 - 5 Implementation

1. **Phase 1 (Design Foundation & Design Tokens):**
   - Unify and lock design tokens (`colors`, `spacing`, `radii`, `motion`, `elevation`).
   - Standardize gold accent contrast curves for AA/AAA compliance.
   - Introduce modern spring-based animation infrastructure.
2. **Phase 2 (Navigation & Global Layout):**
   - Refactor Desktop Mega-Menu and Mobile Drawer into fluid, gesture-friendly, spring-animated navigation with zero layout shift.
   - Implement persistent, blur-backed glass header (`backdrop-blur-md`).
3. **Phase 3 (Core User Journeys & Course Catalog):**
   - Add instantaneous client-side filter feedback, animated card reordering, and sticky mobile filter sheets.
   - Elevate course detail pages with interactive outline previews and syllabus accordions.
4. **Phase 4 (ITSC AI Contextual Enhancement):**
   - Inject page-aware suggested prompts into the chat assistant.
   - Add spring physics, swipe-to-dismiss, and accessibility live regions to the chat drawer.
5. **Phase 5 (Performance, A11y & Micro-Interactions):**
   - Comprehensive focus traps, keyboard navigation audits, and Lighthouse 95+ optimization.
