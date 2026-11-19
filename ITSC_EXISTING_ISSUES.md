# ITSC Web Platform — Existing Issues, Discrepancies & Friction Log
**Document ID:** `ITSC_EXISTING_ISSUES.md`  
**Phase:** Phase 0 — Project Discovery and Baseline  
**Project:** Information Technology Support Centre (ITSC) Official Web Platform  
**Target Architecture:** Next.js 15 App Router & Express 5 API  
**Audit Date:** November 9, 2026  
**Auditor:** Google Antigravity Agent  
**Status:** Completed Baseline — Awaiting Approval for Phase 1  

---

## 1. Executive Summary

This document logs all observed technical discrepancies, UX friction points, architectural nuances, and accessibility gaps discovered during the Phase 0 baseline audit. Identifying these items prior to Phase 1 ensures focused, surgical remediation without disrupting existing functionality.

---

## 2. Issue Inventory & Severity Matrix

| Issue ID | Category | Severity | Description | Impact | Proposed Remediation Plan |
|---|---|---|---|---|---|
| **ISSUE-01** | Design Tokens | Moderate | **Color Token Discrepancy:** The master specification notes `#C5A85A` (Muted Gold) and `#0F172A` (Slate Ink), whereas `globals.css` currently implements `#febd01` (Vibrant Gold) and `#172033` (Midnight Ink). | Inconsistent color rendering between spec documentation and web CSS tokens. Text on gold backgrounds can fail WCAG contrast. | Harmonize design tokens in Phase 1: Establish high-contrast semantic tokens (`--color-brand-gold`, `--color-brand-gold-accessible`, `--color-brand-ink`). |
| **ISSUE-02** | Animation / Motion | Moderate | **Absence of Motion Framework:** No spring animation library is currently installed in `apps/web`. All transitions rely on static CSS classes (`transition-all duration-300`). | Drawers, modals, and mega-menus feel linear and abrupt rather than organic and fluid. | Introduce a lightweight modern motion solution (e.g. `motion` / Framer Motion) during Phase 1 for fluid physics, swipe gestures, and layout morphing. |
| **ISSUE-03** | Database / Infra | Low (Known) | **Neon Serverless Compute Sleeping:** Direct unpooled database connections (`DIRECT_URL`) timeout when Neon compute suspends. | Cold starts if an unpooled client connection is attempted without pgBouncer. | Verified in `apps/api/src/lib/prisma.ts`: Keep relying strictly on `DATABASE_URL` (pooled pgBouncer connection) which automatically wakes up Neon compute. |
| **ISSUE-04** | UX / Mobile | Moderate | **Mobile Filter Sheet Ergonomics:** On `/training-programs`, the mobile filter drawer requires long vertical scrolling through categories with no pinned action bar. | Users on mobile must scroll to the bottom of the list to apply filters or clear selections. | Implement a sticky bottom action bar ("Apply X Filters", "Reset") pinned to the bottom of the viewport with safe-area padding. |
| **ISSUE-05** | UX / Content | Moderate | **Course Syllabus Preview:** Course outlines are stored in Neon PostgreSQL and streamed via API, but the frontend only offers a download link. | Users must leave the webpage or download a file to view course modules instead of previewing them in-app. | Add an in-page interactive outline viewer modal with native PDF embedding and text fallback in Phase 3. |
| **ISSUE-06** | UX / Desktop | Moderate | **Mega-Menu Category Density:** With 56 active categories, the desktop mega-menu can feel dense and overwhelming on 1024px-1280px viewports. | Visual crowding; multi-line wrapping of long category titles (e.g. *Enterprise Linux Administration*). | Introduce a dual-pane category track selector (Tracks on the left, instant subcategory drill-down on the right) with smooth hover transitions. |
| **ISSUE-07** | Accessibility (a11y) | Moderate | **Missing Drawer Focus Traps:** Neither `ChatDrawer.tsx` nor `MobileNav.tsx` currently trap keyboard focus while open. | Keyboard and screen-reader users can tab through background elements behind the open modal/drawer. | Add focus lock (`focus-trap` or Radix Dialog Primitive container) and bind Escape key with smooth spring close. |
| **ISSUE-08** | Accessibility (a11y) | Low | **Chat Stream Live Announcements:** Incoming ITSC AI responses do not utilize `aria-live="polite"` regions. | Assistive screen readers do not automatically notify users when AI response synthesis completes. | Wrap the chat message feed in an `aria-live="polite"` container with screen-reader friendly status updates. |
| **ISSUE-09** | Performance / Tooling | Low | **Multiple Lockfiles Warning:** Next.js build detects duplicate lockfiles in parent directory paths (`C:\Users\engli\package-lock.json`). | Generates a Next.js build warning: *"Next.js inferred your workspace root, but it may not be correct."* | Configure `outputFileTracingRoot` in `apps/web/next.config.js` to explicitly declare the workspace root path. |

---

## 3. Risk Assessment & Preservation Strategy

1. **Database Preservation:** All 269 courses, 56 categories, and uploaded PDF outline documents are intact in Neon PostgreSQL. No migrations or schema changes are permitted without strict justification.
2. **API Stability:** All Express API endpoints (`/training/*`, `/news/*`, `/gallery/*`, `/inquiries/*`, `/settings/*`, `/chat/*`) are tested and 100% operational. Frontend enhancements will strictly consume existing contracts.
3. **No Unnecessary SDKs:** Do not introduce heavy, bloated dependencies. Any motion or UI library introduced must be minimal, performant, and tree-shakeable.
