# ITSC Next-Generation Experience — Comprehensive UX Audit
**Document ID:** `ITSC_COMPREHENSIVE_UX_AUDIT.md`  
**Phase:** Phase 1 — Comprehensive UX Audit  
**Project:** Information Technology Support Centre (ITSC) Official Web Platform  
**Target Architecture:** Next.js 15 App Router (React 19, Tailwind CSS v4) & Express 5 API  
**Audit Date:** November 10, 2026  
**Auditor:** Google Antigravity Agent  
**Status:** Completed Phase 1 Deliverable — Awaiting Review & Phase 2 Authorization  

---

## 1. Executive Summary & Experience Vision

This Comprehensive UX Audit delivers an exhaustive, evidence-based evaluation of the entire Information Technology Support Centre (ITSC) digital platform. Following the approval of Phase 0, this audit identifies usability friction, interaction weaknesses, visual density issues, accessibility gaps, and opportunities to realize the **ITSC Next-Generation Experience**.

### The Interaction Vision: Institutional Excellence with Apple-Inspired Fluidity
The target experience takes architectural inspiration from the interaction philosophy of modern Apple interfaces:
- **Effortless and intuitive:** Zero cognitive friction; visual hierarchy guides the eye naturally.
- **Immediately responsive:** Micro-interactions (hover, press-scale, focus rings) provide instant tactile feedback.
- **Consistent across routes:** Shared design tokens, radii, elevations, and layout constraints unify all public and admin views.
- **Context-aware intelligence:** ITSC AI understands the user's active page and course context, offering relevant prompts.
- **Fluid transitions:** Drawers, modals, and menus enter and exit with natural spring physics rather than abrupt linear CSS cuts.
- **Mobile-first adaptability:** Optimized for one-handed thumb interaction with sticky bottom controls and safe-area padding.

---

## 2. Route-by-Route UX Audit: Public Portal

### 2.1 Route: `/` (Homepage)
- **Primary Function:** Institutional front door, value proposition communication, category spotlight, and course search entry point.
- **Observed Strengths:**
  - Clear visual hero with dual CTA ("Explore Programs" and "Corporate Training").
  - Category pill carousel allows rapid exploration of core training domains.
  - Featured course section highlights top vendor-certified certifications (Oracle, Cisco, Red Hat).
  - Live ITSC AI launcher FAB positioned persistently in the lower-right corner.
- **Identified Usability & Interaction Weaknesses:**
  - `ISSUE-PUB-01 (High):` **Hero Search Disconnection.** The search bar in the hero navigates abruptly to `/training-programs?q=...` via a full page reload rather than opening an instant typeahead spotlight modal.
  - `ISSUE-PUB-02 (Medium):` **Category Pill Overflow on Mobile.** Category pills scroll horizontally, but lack subtle fade masks at viewport edges, giving the false illusion that only 3 categories exist unless the user accidentally swipes.
  - `ISSUE-PUB-03 (Medium):` **Static Floating Badges.** Floating badge elements in the hero use static CSS animations that do not react to mouse position or device tilt.
  - `ISSUE-PUB-04 (Low):` **Accreditation Marquee Pause.** The vendor partner marquee (`itsc-marquee`) does not automatically pause when hovered or focused, posing accessibility challenges for screen-magnifier users.

---

### 2.2 Route: `/training-programs` (Course Catalog)
- **Primary Function:** Comprehensive searchable catalog across 269 courses and 56 categories.
- **Observed Strengths:**
  - Faceted sidebar with category checkboxes, difficulty level pills, and duration filters.
  - Active search input with query-param synchronization.
  - Card layout presents title, course code, duration chip, level badge, and brief description.
- **Identified Usability & Interaction Weaknesses:**
  - `ISSUE-PUB-05 (High):` **Mobile Filter Ergonomics.** On viewports < 768px, opening the filter drawer displays a long list of 56 categories. Users must scroll through dozens of items without a sticky bottom bar ("Apply X Filters" / "Reset"), creating significant thumb fatigue.
  - `ISSUE-PUB-06 (High):` **No Instant Filter Feedback.** Toggling a category checkbox triggers a full router re-fetch. Cards disappear and reappear abruptly without smooth FLIP-style layout animation or optimistic count updates.
  - `ISSUE-PUB-07 (Medium):` **Search Query Empty State.** When a search query yields 0 results, the empty state displays a basic generic message without suggesting alternate spellings or showing related popular courses.
  - `ISSUE-PUB-08 (Low):` **Card Touch Target Size.** The "View Syllabus" link inside the course card has an effective click area of under 40x32px, requiring precision tapping on mobile screens.

---

### 2.3 Route: `/training-programs/[slug]` (Course Detail)
- **Primary Function:** Deep-dive syllabus evaluation, prerequisites verification, and syllabus outline download/viewing.
- **Observed Strengths:**
  - High-impact header banner displaying course code, title, duration, and delivery modes.
  - Tabbed interface separating Overview, Objectives, Prerequisites, and Course Outline.
  - Direct PDF outline download link streaming from Neon PostgreSQL ByteA storage.
- **Identified Usability & Interaction Weaknesses:**
  - `ISSUE-PUB-09 (High):` **Course Outline In-Page Viewer Missing.** The outline tab provides an external download link rather than an embedded, interactive in-page PDF reader or structured expandable module tree.
  - `ISSUE-PUB-10 (Medium):` **Disjointed Sticky Registration CTA.** When scrolling through long course descriptions, the user loses sight of the primary "Enroll / Inquire" action. A sticky bottom action sheet on mobile is missing.
  - `ISSUE-PUB-11 (Medium):` **Unaware ITSC AI Trigger.** The page does not offer a contextual "Ask ITSC AI about this course" button that pre-seeds the chat assistant with the specific course code and prerequisites.

---

### 2.4 Route: `/corporate-training` (Enterprise Solutions)
- **Primary Function:** B2B enterprise client acquisition, customized curriculum offerings, on-site/hybrid training models.
- **Observed Strengths:**
  - Clear institutional messaging oriented toward CTOs and Enterprise Training Managers.
  - Delivery mode comparison cards (On-site, Instructor-led Online, Dedicated Lab Cohorts).
  - Integrated corporate inquiry form with company name, team size, and technology focus.
- **Identified Usability & Interaction Weaknesses:**
  - `ISSUE-PUB-12 (Medium):` **Static Delivery Comparison.** The delivery mode cards are static marketing text without interactive calculation of cohort timelines or group discount parameters.
  - `ISSUE-PUB-13 (Medium):` **Form Submit Feedback.** While form validation is robust (Zod schema), submitting the corporate inquiry lacks micro-feedback (e.g. animated button checkmark, immediate calendar booking suggestion).

---

### 2.5 Route: `/about` (Institutional Profile)
- **Primary Function:** Institutional credibility, accreditation documentation, history, mission, leadership.
- **Observed Strengths:**
  - Elegant serif typography for editorial section headings.
  - Accreditation badges clearly displayed.
- **Identified Usability & Interaction Weaknesses:**
  - `ISSUE-PUB-14 (Low):` **Static Timeline.** The historical milestone section is presented as a plain list rather than an interactive timeline that animates into view on scroll.
  - `ISSUE-PUB-15 (Low):` **Accreditation Detail Tooltips.** Accreditation partner logos lack rich hover cards explaining the exact certification status and authorized testing center details.

---

### 2.6 Route: `/gallery` (Facility & Training Photos)
- **Primary Function:** Visual proof of physical training labs, computer facilities, graduation ceremonies.
- **Observed Strengths:**
  - Album category tabs for fast filtering.
  - Lightbox modal with full-screen view.
- **Identified Usability & Interaction Weaknesses:**
  - `ISSUE-PUB-16 (Medium):` **Lightbox Mobile Gesture Absence.** The lightbox modal requires tapping discrete left/right arrow buttons. Native mobile touch swipe gestures (swipe left for next, swipe down to dismiss) are not supported.
  - `ISSUE-PUB-17 (Low):` **Image Loading Skeleton.** Image grid loads with standard browser image pop-in without smooth aspect-ratio blur-up placeholders.

---

### 2.7 Routes: `/news` & `/news/[slug]` (Corporate Announcements)
- **Primary Function:** Institutional updates, upcoming batch schedules, industry articles.
- **Observed Strengths:**
  - Featured article spotlight hero card.
  - Clear publication date and author tags.
- **Identified Usability & Interaction Weaknesses:**
  - `ISSUE-PUB-18 (Low):` **Reading Progress Indicator.** Detailed technical articles lack a top reading progress bar to indicate remaining article length.
  - `ISSUE-PUB-19 (Low):` **Related Articles Placement.** Related articles at the bottom of the article detail view do not highlight related training courses for the topic discussed.

---

### 2.8 Route: `/contact` (Contact & Location)
- **Primary Function:** Multi-channel inquiry submission, physical office location, phone, email.
- **Observed Strengths:**
  - Split layout with contact details on the left, interactive form on the right, embedded Google Map below.
  - Form validation with inline error state feedback.
- **Identified Usability & Interaction Weaknesses:**
  - `ISSUE-PUB-20 (Medium):` **Map Interception on Mobile.** On touch devices, scrolling down the page can inadvertently trap user swipe gestures inside the Google Map embed.
  - `ISSUE-PUB-21 (Low):` **Phone/Email Action Ergonomics.** Telephone and email links lack prominent "Tap to Call" and "Tap to Email" card styling on mobile viewports.

---

### 2.9 Global Navigation, Header, Footer & ITSC AI
- **Header & Mega-Menu:**
  - `ISSUE-PUB-22 (High):` **Mega-Menu Cognitive Overload.** Desktop mega-menu renders expansive category columns that can feel overwhelming and wrap text awkwardly on 1024px-1280px viewports. Needs a 2-tier master/detail track navigation.
  - `ISSUE-PUB-23 (Medium):` **Header Blur Dynamics.** Header remains static rather than morphing into a subtle frosted glass blur (`backdrop-blur-md`) with reduced vertical padding on scroll.
- **ITSC AI Assistant:**
  - `ISSUE-PUB-24 (High):` **Drawer Physics & Focus Trapping.** The AI chat drawer opens with a linear CSS transform. It lacks spring physics, swipe-to-dismiss gesture on mobile, and does not trap keyboard focus when open.
  - `ISSUE-PUB-25 (Medium):` **Screen-Reader Live Region.** Messages streamed by ITSC AI do not announce completion via `aria-live="polite"`.

---

## 3. Route-by-Route UX Audit: Administrative Portal

### 3.1 Route: `/admin/login`
- **Primary Function:** Secure authentication gate for system administrators and editors.
- **Observed Strengths:**
  - Branded dark aesthetic with password visibility toggle.
  - Rate-limited and validated via Zod.
- **Identified Usability Weaknesses:**
  - `ISSUE-ADM-01 (Low):` **Caps Lock Warning.** No warning indicator is displayed if Caps Lock is enabled on the password input field.

---

### 3.2 Route: `/admin` (Dashboard Overview)
- **Primary Function:** High-level metrics (active courses, total categories, pending inquiries, news articles) and recent activity.
- **Observed Strengths:**
  - Stat cards with clear numeric indicators.
  - Quick action buttons to add training program or manage inquiries.
- **Identified Usability Weaknesses:**
  - `ISSUE-ADM-02 (Medium):` **Metric Trend Context.** Stat cards display raw counts (e.g. "269 Courses", "14 Inquiries") without delta context (e.g. "+3 this week") or visual sparkline mini-charts.
  - `ISSUE-ADM-03 (Low):` **Recent Activity Timestamps.** Timestamps display raw ISO dates rather than relative humanized times ("2 hours ago", "Yesterday").

---

### 3.3 Route: `/admin/training` (Course & Category CMS)
- **Primary Function:** Course catalog authoring, status lifecycle (`DRAFT` -> `REVIEW` -> `PUBLISHED`), category hierarchy management, PDF outline upload.
- **Observed Strengths:**
  - Direct PDF outline upload into Neon PostgreSQL `uploaded_documents` table (`ByteA`).
  - Search and status filtering across training courses.
  - Soft-delete support ensuring data safety.
- **Identified Usability Weaknesses:**
  - `ISSUE-ADM-04 (High):` **Course Authoring Modal Complexity.** The course creation modal is a single long vertical scroll form with over 15 fields. It requires multi-step tabbed segmentation (General Info, Syllabus & Modules, Prerequisites, Publishing Status).
  - `ISSUE-ADM-05 (Medium):` **PDF Upload File Drag-and-Drop Feedback.** While upload succeeds, the dropzone lacks an instant PDF thumbnail preview or page count summary before saving.
  - `ISSUE-ADM-06 (Low):` **Batch Actions Missing.** Administrators cannot select multiple courses to perform batch status updates (e.g. bulk publish or bulk draft).

---

### 3.4 Route: `/admin/inquiries` (Inquiry Management)
- **Primary Function:** Review, triage, and update client inquiries from Contact and Corporate forms.
- **Observed Strengths:**
  - Clear status badges (`NEW`, `IN_PROGRESS`, `RESOLVED`, `ARCHIVED`).
  - Slide-out detail drawer to view full message and client contact details.
- **Identified Usability Weaknesses:**
  - `ISSUE-ADM-07 (Medium):` **Direct Email Response Integration.** The admin drawer displays the inquirer's email, but lacks a "Reply via Email" template action that opens an email composer with pre-filled institutional headers.
  - `ISSUE-ADM-08 (Low):` **Inquiry Filtering by Organization.** Inquiries cannot be filtered specifically by corporate vs individual inquiries.

---

### 3.5 Routes: `/admin/news` & `/admin/gallery`
- **Primary Function:** Authoring corporate announcements and uploading training facility photo albums.
- **Observed Strengths:**
  - Media upload integration with Cloudinary.
  - Rich text article content authoring.
- **Identified Usability Weaknesses:**
  - `ISSUE-ADM-09 (Medium):` **Photo Reordering UI.** Gallery photo management uses manual sort order inputs rather than fluid drag-and-drop tile reordering.

---

## 4. Accessibility (a11y) Evaluation

| Area | Current Status | Finding & Evidence | Severity |
|---|---|---|---|
| **Color Contrast** | Conditional Failure | Brand Gold text (`#febd01`) on white/parchment background yields a contrast ratio of ~1.8:1 (WCAG AA requires 4.5:1). Must be reserved for dark navy containers or paired with dark ink text. | High |
| **Focus Trapping** | Incomplete | Opening `ChatDrawer.tsx` or `MobileNav.tsx` does not confine focus within the drawer. Tabbing escapes to the background page. | High |
| **Live Announcements** | Missing | Chat message streams lack `aria-live="polite"` to notify assistive screen readers of incoming responses. | Medium |
| **Touch Targets** | Partial Incompliance | Several secondary buttons (category close icons, card outline tags, pagination controls) measure < 44x44px. | Medium |
| **Reduced Motion** | Not Implemented | CSS keyframes (`itsc-reveal`, `itsc-float`, `itsc-marquee`) do not respect `@media (prefers-reduced-motion: reduce)`. | Medium |

---

## 5. Performance Observations

- **Next.js Production Build:** Completed in 2.7 minutes; 19 routes compiled; shared JS bundle is **103 kB** (highly performant baseline).
- **Core Web Vitals Risk Points:**
  - **LCP (Largest Contentful Paint):** Hero image assets must ensure `priority` loading and WebP optimization.
  - **CLS (Cumulative Layout Shift):** Dynamic filter updates on `/training-programs` currently shift course card grids. Layout animations with fixed card dimensions will eliminate shift.
  - **Client-Side Hydration:** Excellent separation between server components and client interactive shells.

---

## 6. Audit Limitations & Unverified Items

- **Physical Touch Device Haptics:** `NOT VERIFIED` on physical iOS/Android hardware (emulated via headless Chrome touch viewports).
- **Production Third-Party Analytics Impact:** `NOT VERIFIED` (No live Google Analytics or GTM scripts active in local test environment).
- **High-Concurrency Rate-Limit Response Latency:** `VERIFIED AT API LAYER`, but end-user UI jitter during simulated 100+ concurrent users is `NOT VERIFIED`.
