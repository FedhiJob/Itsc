# ITSC Next-Generation Experience — UX Priority Matrix & Issue Register
**Document ID:** `ITSC_UX_PRIORITY_MATRIX.md`  
**Phase:** Phase 1 — Comprehensive UX Audit  
**Project:** Information Technology Support Centre (ITSC) Official Web Platform  
**Target Architecture:** Next.js 15 App Router & Express 5 API  
**Audit Date:** November 10, 2026  
**Auditor:** Google Antigravity Agent  
**Status:** Completed Phase 1 Deliverable — Awaiting Review & Phase 2 Authorization  

---

## 1. Executive Summary

This Priority Matrix consolidates all **32 verified findings** identified across the Route-by-Route Audit, User Journey Testing, Responsive Viewport Analysis, and Micro-Interaction Inspections. Each item is scored by:
- **Severity:** Critical, High, Medium, or Low.
- **User Impact:** Cognitive friction, conversion obstruction, or ergonomic difficulty.
- **Implementation Priority:** P0 (Immediate prerequisite), P1 (Core user journey), P2 (Polishing & micro-interactions), P3 (Subtle enhancements).
- **Phased Resolution Sequence:** Mapping each issue to Master Phases 2 through 5.

---

## 2. Consolidated Master Issue Register

| Issue ID | Scope / Route | Description | Severity | Impact | Priority | Target Phase |
|---|---|---|---|---|---|---|
| **ISSUE-01** | Global Styling | **Color Token Harmonization:** Contrast failure of gold `#febd01` on parchment; discrepancy with spec `#C5A85A`. | High | Readability & WCAG compliance | **P0** | Phase 2 (Foundation) |
| **ISSUE-02** | Global Motion | **Missing Spring Physics:** Abrupt linear CSS transitions across all drawers and menus. | High | Tactile quality & perceived fluidity | **P0** | Phase 2 (Foundation) |
| **INT-A11Y-01** | Global A11y | **Drawer Focus Trapping:** Keyboard tab focus escapes `ChatDrawer` and `MobileNav` into background. | High | Accessibility failure for keyboard users | **P0** | Phase 2 (Foundation) |
| **INT-A11Y-02** | ITSC AI / A11y | **Missing Live Regions:** Incoming AI responses do not announce completion via `aria-live="polite"`. | High | Screen reader users unaware of AI reply | **P0** | Phase 2 (Foundation) |
| **ISSUE-PUB-22** | Header / Nav | **Mega-Menu Density:** 56 categories wrap awkwardly on 1024px-1280px desktop screens. | High | Cognitive overload when discovering courses | **P1** | Phase 2 (Navigation) |
| **INT-MNU-01** | Header / Nav | **Mega-Menu Hover Aim Buffer:** Accidental pointer exit dismisses mega-menu abruptly. | High | Frustrating navigation dismissals | **P1** | Phase 2 (Navigation) |
| **INT-MNU-02** | Mobile Nav | **Mobile Drawer Rigidity:** Missing spring physics and swipe-to-dismiss drag gesture. | High | Sub-par one-handed mobile ergonomics | **P1** | Phase 2 (Navigation) |
| **ISSUE-PUB-05** | Training Catalog | **Mobile Filter Sheet Ergonomics:** Long 56-category list lacks sticky "Apply" / "Reset" bar. | High | Extreme thumb fatigue on mobile browsing | **P1** | Phase 3 (Catalog) |
| **INT-FLT-01** | Training Catalog | **Router Reload Flicker:** Toggling filter checkboxes triggers jarring unmount/remount. | High | Perceived slowness and visual disruption | **P1** | Phase 3 (Catalog) |
| **ISSUE-PUB-09** | Course Detail | **In-Page Outline Viewer Missing:** PDF syllabus is download-only; no in-browser preview. | High | High friction for evaluating syllabus modules | **P1** | Phase 3 (Catalog) |
| **INT-SRC-01** | Global Search | **Absence of Spotlight Search Modal:** Search navigates to full page rather than instant typeahead. | High | Slower course discovery | **P1** | Phase 3 (Discovery) |
| **INT-AI-01** | ITSC AI | **Chat Drawer Linear Motion:** Lack of spring physics and swipe-to-dismiss gesture. | High | Breaks Apple-inspired fluid standard | **P1** | Phase 4 (ITSC AI) |
| **ISSUE-ADM-04** | Admin CMS | **Course Form Modal Complexity:** 15+ fields in single long vertical scroll form. | High | High cognitive burden for administrators | **P1** | Phase 5 (Admin Polish) |
| **RESP-375-01** | Mobile (<375px) | **Header & Banner Compression:** Header + banner occupies >16% of vertical viewport. | Medium | Screen real estate squeezed on small phones | **P2** | Phase 2 (Navigation) |
| **ISSUE-PUB-23** | Global Header | **Header Blur Dynamics:** Header lacks frosted glass blur and shrink-on-scroll. | Medium | Visual polish & content contrast | **P2** | Phase 2 (Navigation) |
| **ISSUE-PUB-02** | Homepage | **Category Pill Overflow:** Category carousel lacks horizontal edge fade masks on mobile. | Medium | Users miss available categories | **P2** | Phase 3 (Discovery) |
| **ISSUE-PUB-10** | Course Detail | **Disjointed Sticky CTA:** No sticky enrollment bar when scrolling long course descriptions. | Medium | Lost conversion opportunity on mobile | **P2** | Phase 3 (Catalog) |
| **INT-DLG-01** | Gallery | **Missing Lightbox Swipe:** Lightbox lacks touch swipe left/right gestures on mobile. | Medium | Unnatural mobile gallery experience | **P2** | Phase 3 (Media) |
| **INT-AI-02** | ITSC AI | **Context Unawareness:** AI suggestions are static and do not adapt to active course/route. | Medium | Missed opportunity for relevant guidance | **P2** | Phase 4 (ITSC AI) |
| **INT-AI-03** | ITSC AI | **Markdown Streaming Jitter:** Auto-scroll jitters during long token streams. | Medium | Visual discomfort during reading | **P2** | Phase 4 (ITSC AI) |
| **INT-BTN-01** | Global UI | **Missing Tactile Press Scale:** Buttons lack `active:scale-98` physical feedback. | Medium | Interface feels flat / non-tactile | **P2** | Phase 2 (Foundation) |
| **INT-FRM-01** | Forms | **Touched vs Dirty Validation:** Error state doesn't resolve live as user types valid input. | Medium | Lingering error state causes user confusion | **P2** | Phase 3 (Forms) |
| **ISSUE-ADM-02** | Admin Dashboard | **Metric Trend Context:** Dashboard displays raw counts without week-over-week deltas. | Medium | Admins cannot assess velocity | **P2** | Phase 5 (Admin) |
| **ISSUE-ADM-05** | Admin CMS | **PDF Upload Dropzone Feedback:** Upload lacks instant thumbnail preview before saving. | Medium | Uncertainty whether correct PDF was selected | **P2** | Phase 5 (Admin) |
| **ISSUE-ADM-07** | Admin Inquiries | **Direct Mailto Reply Action:** Inquiries lack 1-click email response button. | Medium | Extra manual copy-pasting for advisors | **P2** | Phase 5 (Admin) |
| **ISSUE-ADM-09** | Admin Gallery | **Manual Sort Order:** Gallery photos reordered via text inputs rather than drag-and-drop. | Medium | Tedious photo sequence management | **P2** | Phase 5 (Admin) |
| **ISSUE-PUB-04** | Homepage | **Marquee Pause Accessibility:** Partner marquee cannot be paused on hover/focus. | Low | Challenge for screen-magnifier users | **P3** | Phase 3 (Polish) |
| **ISSUE-PUB-14** | About Page | **Static Milestone Timeline:** Timeline lacks progressive scroll reveal animation. | Low | Visual interest opportunity | **P3** | Phase 3 (Polish) |
| **ISSUE-PUB-18** | News | **Reading Progress Bar:** Long news articles lack top reading progress indicator. | Low | Minor reading friction | **P3** | Phase 3 (Polish) |
| **INT-A11Y-03** | Global A11y | **Skip-to-Content Link:** Missing top skip link for keyboard-only users. | Low | Extra tab presses to reach main content | **P3** | Phase 2 (Foundation) |
| **INT-A11Y-04** | Global A11y | **Reduced Motion Support:** CSS keyframes do not respect `prefers-reduced-motion`. | Low | Vestibular disorder comfort | **P3** | Phase 2 (Foundation) |
| **ISSUE-ADM-01** | Admin Login | **Caps Lock Warning:** Password field doesn't warn if Caps Lock is active. | Low | Avoidable failed login attempts | **P3** | Phase 5 (Admin) |

---

## 3. Implementation Dependencies & Phased Roadmap

```
PHASE 2: Design Foundation & Global Navigation (P0 & P1)
├── Harmonize Color Tokens & Contrast Curves (ISSUE-01)
├── Install & Configure Spring Motion Engine (ISSUE-02)
├── Implement Global Focus Traps & Skip-to-Content (INT-A11Y-01, INT-A11Y-03)
├── Refactor Desktop Mega-Menu with 2-Tier Master/Detail (ISSUE-PUB-22, INT-MNU-01)
├── Refactor MobileNav with Spring Motion & Swipe Gestures (INT-MNU-02, RESP-375-01)
└── Deploy Frosted Glass Blur Header with Scroll Shrink (ISSUE-PUB-23)

PHASE 3: Core Public Journeys, Catalog & Discovery (P1 & P2)
├── Deploy Spotlight Instant Search Modal (Cmd+K) (INT-SRC-01)
├── Implement Optimistic FLIP Course Filtering & Sticky Mobile Bar (ISSUE-PUB-05, INT-FLT-01)
├── Build In-Browser Course Outline Viewer / Syllabus Accordions (ISSUE-PUB-09)
├── Add Sticky Mobile Enrollment CTA on Course Detail (ISSUE-PUB-10)
├── Add Touch Swipes to Gallery Lightbox (INT-DLG-01)
└── Refine Form Micro-Interactions & Live Touch Validation (INT-FRM-01)

PHASE 4: Contextual ITSC AI Assistant (P1 & P2)
├── Upgrade Chat Drawer with Spring Physics & Swipe Down Dismiss (INT-AI-01)
├── Inject Active Page/Course Context into Suggested Prompts (INT-AI-02)
├── Smooth Markdown Streaming Auto-Scroll Throttling (INT-AI-03)
└── Add aria-live="polite" Live Announcements (INT-A11Y-02)

PHASE 5: Administrative Experience & Micro-Polish (P1, P2 & P3)
├── Segment Course Authoring Modal into Multi-Step Tabs (ISSUE-ADM-04)
├── Add PDF Upload Thumbnail Preview & Dropzone Polish (ISSUE-ADM-05)
├── Implement Pre-filled Mailto Action in Inquiry Drawer (ISSUE-ADM-07)
├── Add Trend Delta Indicators to Dashboard Stat Cards (ISSUE-ADM-02)
└── Drag-and-Drop Photo Sorting in Gallery CMS (ISSUE-ADM-09)
```

---

## 4. Architectural Safeguards During Resolution

1. **Strict TypeScript & Clean Architecture:** All new components must maintain zero `any` types and adhere strictly to shared contracts (`@itsc/shared`).
2. **Database Integrity:** No migrations or schema adjustments. Course outlines remain securely in Neon PostgreSQL (`ByteA`), and existing streaming endpoints remain unchanged.
3. **No Redundant Libraries:** Any motion solution introduced must be lightweight, tree-shakeable, and standard for modern Next.js 15 App Router applications.
