# ITSC Next-Generation Experience — Responsive Design Audit
**Document ID:** `ITSC_RESPONSIVE_AUDIT.md`  
**Phase:** Phase 1 — Comprehensive UX Audit  
**Project:** Information Technology Support Centre (ITSC) Official Web Platform  
**Target Architecture:** Next.js 15 App Router & Tailwind CSS v4  
**Audit Date:** November 10, 2026  
**Auditor:** Google Antigravity Agent  
**Status:** Completed Phase 1 Deliverable — Awaiting Review & Phase 2 Authorization  

---

## 1. Executive Summary & Viewport Strategy

The ITSC platform was tested across **eight distinct viewport widths** spanning the entire spectrum of consumer mobile devices, tablets, laptops, and ultra-wide desktop monitors:
1. **375px:** Small mobile (iPhone SE, smaller Android devices)
2. **390px:** Standard modern mobile (iPhone 14/15/16, Google Pixel)
3. **430px:** Large modern mobile (iPhone 14/15/16 Pro Max, Galaxy S24 Ultra)
4. **768px:** Tablet portrait (iPad Mini, iPad 10th Gen)
5. **1024px:** Tablet landscape / Compact laptop (iPad Pro, 11-inch laptops)
6. **1280px:** Standard desktop / 13-inch MacBook
7. **1440px:** High-density desktop / 15-inch & 16-inch displays
8. **1920px:** Full HD & ultra-wide desktop monitors

Empirical visual evidence was captured into `docs/responsive-screenshots/` using automated headless Chromium sessions against the production Next.js build.

---

## 2. Viewport-by-Viewport Evaluation

### 2.1 Viewport: 375px (Small Mobile — e.g. iPhone SE)
- **Screenshot Evidence:**
  - [`docs/responsive-screenshots/home-375px.png`](file:///c:/Users/engli/Documents/GitHub/Itsc/docs/responsive-screenshots/home-375px.png) (284 KB)
  - [`docs/responsive-screenshots/training-375px.png`](file:///c:/Users/engli/Documents/GitHub/Itsc/docs/responsive-screenshots/training-375px.png) (52 KB)
- **Observed Behavior:**
  - Layout successfully collapses to a single column.
  - Persistent bottom thumb navigation bar (`BottomNav.tsx`) is anchored to the bottom.
  - Header displays compact logo, search trigger icon, and hamburger menu button.
- **Specific Responsive Friction Points:**
  - `RESP-375-01 (High):` **Header & Notice Banner Compression.** On viewports <= 375px width, the sticky top header combined with any announcement notice occupies over 110px of vertical height (~16% of total screen height), compressing the visible hero area.
  - `RESP-375-02 (Medium):` **Category Pill Padding.** Category pill buttons have large horizontal padding (`px-4 py-2`), which allows only 2 to 2.5 visible pills at 375px before cutoff, without a visual fade mask to signal overflow.
  - `RESP-375-03 (Medium):` **Card Code Badge Wrapping.** On `/training-programs`, course codes with long identifiers (e.g. `ORA-DBA-19C-ADV`) wrap to two lines inside the card header, displacing the level badge.

---

### 2.2 Viewport: 390px (Standard Modern Mobile — e.g. iPhone 14/15/16)
- **Screenshot Evidence:**
  - [`docs/responsive-screenshots/home-390px.png`](file:///c:/Users/engli/Documents/GitHub/Itsc/docs/responsive-screenshots/home-390px.png) (342 KB)
- **Observed Behavior:**
  - Clean typographic hierarchy in hero section.
  - Course cards stack vertically with appropriate gutters (`gap-4`).
  - ITSC AI floating launcher FAB is positioned at `bottom-20 right-4`, avoiding overlap with the bottom navigation bar.
- **Specific Responsive Friction Points:**
  - `RESP-390-01 (Medium):` **Course Filter Trigger Sheet.** The "Filter Courses" button sits above the catalog list, but once scrolled down, the user cannot easily change filters without scrolling all the way back to the top. Needs a sticky floating filter pill or bar.

---

### 2.3 Viewport: 430px (Large Modern Mobile — e.g. iPhone 14/15/16 Pro Max)
- **Screenshot Evidence:**
  - [`docs/responsive-screenshots/home-430px.png`](file:///c:/Users/engli/Documents/GitHub/Itsc/docs/responsive-screenshots/home-430px.png) (389 KB)
- **Observed Behavior:**
  - Generous horizontal breathing room for card metadata chips.
  - Forms on `/contact` and `/corporate-training` display full-width inputs with comfortable touch bounds.
- **Specific Responsive Friction Points:**
  - `RESP-430-01 (Low):` **Hero Search Field Width.** Search input on large mobile screens stretches to full width (`430px - padding`), creating an unnecessarily wide text field that feels sparse without internal quick-action icons.

---

### 2.4 Viewport: 768px (Tablet Portrait — e.g. iPad)
- **Screenshot Evidence:**
  - [`docs/responsive-screenshots/home-768px.png`](file:///c:/Users/engli/Documents/GitHub/Itsc/docs/responsive-screenshots/home-768px.png) (597 KB)
  - [`docs/responsive-screenshots/training-768px.png`](file:///c:/Users/engli/Documents/GitHub/Itsc/docs/responsive-screenshots/training-768px.png) (143 KB)
- **Observed Behavior:**
  - Grid switches from 1 column to a 2-column layout (`grid-cols-2`).
  - Bottom navigation bar hides (`md:hidden`), transitioning navigation to the top header bar.
- **Specific Responsive Friction Points:**
  - `RESP-768-01 (High):` **Catalog Filter Sidebar Displacement.** At 768px, `/training-programs` hides the desktop sidebar filter, relying on the mobile filter button, but places cards in a 2-column grid. The transition between mobile drawer and desktop sidebar feels unoptimized at this exact breakpoint.
  - `RESP-768-02 (Medium):` **Hero CTA Button Stretching.** In the homepage hero, the two CTA buttons stretch wide horizontally, leaving awkward whitespace between the text and icon.

---

### 2.5 Viewport: 1024px (Tablet Landscape / Small Laptop)
- **Screenshot Evidence:**
  - [`docs/responsive-screenshots/home-1024px.png`](file:///c:/Users/engli/Documents/GitHub/Itsc/docs/responsive-screenshots/home-1024px.png) (747 KB)
  - [`docs/responsive-screenshots/training-1024px.png`](file:///c:/Users/engli/Documents/GitHub/Itsc/docs/responsive-screenshots/training-1024px.png) (94 KB)
- **Observed Behavior:**
  - Full desktop navigation activates in the header, including the Mega-Menu trigger.
  - Catalog sidebar appears on the left (`w-64`), with course cards on the right.
- **Specific Responsive Friction Points:**
  - `RESP-1024-01 (High):` **Mega-Menu Column Wrapping.** With 56 categories arranged in multi-column layouts, the mega-menu can overflow the bottom of 1024x768 screens or wrap long category names onto 3 lines.
  - `RESP-1024-02 (Medium):` **Catalog Card Compression.** With a 256px sidebar at 1024px width, the remaining content area (~720px) squeezes 2-column course cards, occasionally truncating course title lines prematurely.

---

### 2.6 Viewport: 1280px (Standard Desktop — e.g. 13" MacBook)
- **Screenshot Evidence:**
  - [`docs/responsive-screenshots/home-1280px.png`](file:///c:/Users/engli/Documents/GitHub/Itsc/docs/responsive-screenshots/home-1280px.png) (909 KB)
- **Observed Behavior:**
  - Optimal 3-column card grid in training catalog.
  - Balanced typography with generous whitespace and well-proportioned margins (`max-w-7xl mx-auto`).
  - Clear visual rhythm between section headers and feature cards.
- **Specific Responsive Friction Points:**
  - `RESP-1280-01 (Low):` **Header Action Button Spacing.** The gap between the search icon, AI assistant launcher, and "Contact Us" CTA button is slightly cramped (`gap-2`), occasionally causing visual clutter.

---

### 2.7 Viewport: 1440px (High-Density Desktop — e.g. 15"/16" Displays)
- **Screenshot Evidence:**
  - [`docs/responsive-screenshots/home-1440px.png`](file:///c:/Users/engli/Documents/GitHub/Itsc/docs/responsive-screenshots/home-1440px.png) (1.13 MB)
  - [`docs/responsive-screenshots/training-1440px.png`](file:///c:/Users/engli/Documents/GitHub/Itsc/docs/responsive-screenshots/training-1440px.png) (162 KB)
- **Observed Behavior:**
  - Container constraint (`max-w-7xl`) centers content cleanly.
  - Card hover micro-animations feel responsive.
- **Specific Responsive Friction Points:**
  - `RESP-1440-01 (Low):` **Whitespace Margins.** Margins on the left and right of the 1280px container exceed 80px each, which looks clean, but could support a richer 4-column catalog layout.

---

### 2.8 Viewport: 1920px (Ultra-Wide Desktop)
- **Screenshot Evidence:**
  - [`docs/responsive-screenshots/home-1920px.png`](file:///c:/Users/engli/Documents/GitHub/Itsc/docs/responsive-screenshots/home-1920px.png) (1.48 MB)
- **Observed Behavior:**
  - Content remains anchored within the centered container without stretching out of proportion.
  - Background parchment color (`#f8f7f2`) extends seamlessly to screen edges.
- **Specific Responsive Friction Points:**
  - `RESP-1920-01 (Low):` **Mega-Menu Width Containment.** When opened on a 1920px monitor, the mega-menu is constrained to the 1280px center, leaving wide empty peripheral spaces.

---

## 3. Responsive Scorecard & Key Recommendations

| Viewport | Device Class | Usability Rating | Primary Remediation Target |
|---|---|---|---|
| **375px** | Small Mobile | **70/100** | Optimize header height; add horizontal scroll masks; fix badge wrapping. |
| **390px** | Standard Mobile | **78/100** | Add sticky mobile filter bar; refine bottom thumb touch targets. |
| **430px** | Large Mobile | **82/100** | Balance search field proportions; optimize card padding. |
| **768px** | Tablet Portrait | **72/100** | Harmonize filter sidebar vs. drawer breakpoint; balance hero CTA widths. |
| **1024px** | Tablet Landscape | **75/100** | Modernize mega-menu into a 2-tier master/detail track navigation. |
| **1280px** | Standard Desktop | **88/100** | Refine header action button spacing; add subtle frosted glass blur. |
| **1440px** | Large Desktop | **90/100** | Optional 4-column course card grid mode. |
| **1920px** | Ultra-Wide | **88/100** | Polish background transitions and mega-menu positioning. |
