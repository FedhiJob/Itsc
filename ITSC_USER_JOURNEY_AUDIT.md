# ITSC Next-Generation Experience — User Journey Audit
**Document ID:** `ITSC_USER_JOURNEY_AUDIT.md`  
**Phase:** Phase 1 — Comprehensive UX Audit  
**Project:** Information Technology Support Centre (ITSC) Official Web Platform  
**Target Architecture:** Next.js 15 App Router & Express 5 API  
**Audit Date:** November 10, 2026  
**Auditor:** Google Antigravity Agent  
**Status:** Completed Phase 1 Deliverable — Awaiting Review & Phase 2 Authorization  

---

## 1. Executive Summary

This document evaluates **11 critical end-to-end user journeys** across both public trainee/client workflows and authenticated administrative operations. Each journey was executed and analyzed across actual repository route structures, UI components, API contracts, and form validations to pinpoint friction, cognitive bottlenecks, and opportunities for fluid, intuitive interaction.

In compliance with strict investigative restrictions, all journeys were tested using safe, non-destructive inspection methods without mutating production records.

---

## 2. Real User Journey Evaluations

### Journey 1: Visitor Discovers ITSC & Understands Services
- **Persona / Intent:** First-time visitor looking to understand ITSC's institutional accreditations and training spectrum.
- **Starting Point:** External link or direct navigation to `https://itsc-web.vercel.app/` (or `http://localhost:3000/`).
- **Steps Required:**
  1. Lands on Homepage hero section.
  2. Reads headline, value propositions, and accreditation ticker.
  3. Explores category pill carousel (Database, Networking, Cloud, Security).
  4. Scrolls to "Why Choose Us" and institutional statistics.
  5. Navigates to `/about` via header or footer.
- **Expected Behavior:** Smooth visual hierarchy, effortless comprehension of services, immediate sense of institutional prestige.
- **Actual Observed Behavior:** Value proposition is clear and legible. Hero typography renders well. Category pills allow quick clicks into specific tracks.
- **Friction Points:**
  - On mobile (< 640px), category pills lack horizontal scroll edge fade masks; users may not realize there are 50+ categories available.
  - Accreditation marquee is continuous and cannot be paused by touch tap or mouse hover.
- **Improvement Opportunities:**
  - Add gradient edge masks to category pill carousels.
  - Implement subtle parallax depth on hero floating vectors.

---

### Journey 2: Visitor Searches for a Particular Technical Course
- **Persona / Intent:** Trainee seeking a specific course code (e.g. "Oracle Database 19c DBA" or "CCNA").
- **Starting Point:** Homepage `/` search bar or header search button.
- **Steps Required:**
  1. Types search term into hero input.
  2. Presses Enter or clicks "Search Courses".
  3. Browser redirects to `/training-programs?q=oracle`.
  4. Course catalog page loads and renders matching results.
- **Expected Behavior:** Instant typeahead preview showing instant match count and direct course links without leaving the homepage.
- **Actual Observed Behavior:** The input triggers a full page navigation to `/training-programs?q=...`. The catalog page filters courses correctly on load.
- **Friction Points:**
  - Lack of instant search dropdown/spotlight modal causes cognitive break and extra navigation delay.
  - No autocomplete or fuzzy match suggestions on the search input itself.
- **Improvement Opportunities:**
  - Introduce an Apple Spotlight-style global search modal (`Cmd+K` / `Ctrl+K` or search icon tap) providing instant live results with highlighted keyword matches.

---

### Journey 3: Visitor Browses Categories & Applies Multiple Filters
- **Persona / Intent:** Prospective trainee exploring enterprise Linux administration courses and filtering by Advanced difficulty.
- **Starting Point:** `/training-programs`.
- **Steps Required:**
  1. Visits catalog page.
  2. Selects "Linux & Unix Administration" checkbox in sidebar.
  3. Selects "Advanced" difficulty level pill.
  4. Observes catalog update.
- **Expected Behavior:** Instantaneous, animated filter transition; card grid updates with zero flicker; clear active filter tags with single-click removal.
- **Actual Observed Behavior:** Checkbox click updates URL search params via `router.push()`. Page undergoes a standard router re-fetch.
- **Friction Points:**
  - Visual layout flicker during router re-fetch.
  - On mobile, the filter sheet occupies full screen height with 56 category checkboxes and lacks a sticky bottom bar ("Apply X Filters", "Reset").
- **Improvement Opportunities:**
  - Implement client-side optimistic filtering with smooth FLIP card reordering.
  - Add fixed bottom action bar on mobile filter sheet with safe-area padding.

---

### Journey 4: Visitor Opens a Course & Accesses Its Outline
- **Persona / Intent:** IT Manager reviewing course syllabus modules, prerequisites, and learning objectives before enrollment.
- **Starting Point:** `/training-programs/[slug]`.
- **Steps Required:**
  1. Clicks course card from catalog.
  2. Lands on Course Detail page.
  3. Switches tabs: "Overview" -> "Prerequisites" -> "Course Outline".
  4. Clicks "Download Course Outline (PDF)".
- **Expected Behavior:** In-browser interactive preview of syllabus modules, with option to download or view embedded PDF outline.
- **Actual Observed Behavior:** Detail page loads cleanly with breadcrumb navigation. Clicking "Download Course Outline" streams the PDF binary directly from the Neon PostgreSQL database via API.
- **Friction Points:**
  - No in-page PDF outline previewer; user must download file or rely on external browser PDF viewer.
  - Long course content requires excessive scrolling without a persistent floating enrollment CTA.
- **Improvement Opportunities:**
  - Add embedded in-browser syllabus module tree with interactive accordions and full-screen PDF outline preview modal.
  - Introduce a sticky bottom registration bar on scroll.

---

### Journey 5: Visitor Submits Corporate Training Inquiry
- **Persona / Intent:** Enterprise HR Director requesting tailored on-site team training.
- **Starting Point:** `/corporate-training`.
- **Steps Required:**
  1. Reads corporate delivery models and enterprise curriculum options.
  2. Scrolls down to the Corporate Training Inquiry Form.
  3. Fills in Organization Name, Contact Person, Email, Phone, Expected Cohort Size, and Target Technologies.
  4. Clicks "Submit Corporate Request".
- **Expected Behavior:** Clean form validation, clear field-level helper text, immediate submission feedback, confirmation notification.
- **Actual Observed Behavior:** Form is strictly validated using Zod schema. Input fields provide clear error borders when invalid.
- **Friction Points:**
  - Form lacks instant micro-interactions (e.g. checkmarks when email is valid).
  - Submit button shows standard spinner without tactile completion animation.
- **Improvement Opportunities:**
  - Add progressive field indicators and instant submission success banner offering an immediate calendar consultation link.

---

### Journey 6: Visitor Uses ITSC AI to Ask About Course Prerequisites
- **Persona / Intent:** Student uncertain if they meet the prerequisites for advanced Cloud DevOps certification.
- **Starting Point:** Floating Action Button (FAB) on any public page.
- **Steps Required:**
  1. Clicks floating ITSC AI button in lower-right corner.
  2. Chat drawer slides into view.
  3. Clicks suggested question pill: "What courses do you offer in Cloud & DevOps?".
  4. Types follow-up question: "What are the prerequisites for the advanced track?".
- **Expected Behavior:** Instant drawer spring transition; grounded, accurate response referencing verified database records; clickable course links.
- **Actual Observed Behavior:** Chat assistant responds with verified course data; multi-turn memory maintains course context across questions (verified in 14 test cases).
- **Friction Points:**
  - Chat drawer uses linear CSS transform rather than spring physics; lacks swipe-to-dismiss gesture on mobile.
  - Keyboard focus is not trapped inside drawer; screen readers do not announce incoming messages via `aria-live`.
  - Assistant does not automatically read the active page context (e.g. current course code).
- **Improvement Opportunities:**
  - Upgrade drawer with spring motion, focus trapping, swipe down to dismiss, and page-aware suggested prompts.

---

### Journey 7: Visitor Reads a Corporate News Article
- **Persona / Intent:** Alumni reading an announcement regarding new international accreditation.
- **Starting Point:** `/news`.
- **Steps Required:**
  1. Browses news grid and clicks featured article.
  2. Lands on `/news/[slug]`.
  3. Reads article body and checks publication date.
- **Expected Behavior:** High-readability typography, reading progress bar, clear social share actions, links to related training courses.
- **Actual Observed Behavior:** Page renders with clean serif heading and legible body font.
- **Friction Points:**
  - No reading progress bar on long articles.
  - Article does not cross-link to relevant courses matching the announcement topic.
- **Improvement Opportunities:**
  - Add subtle top reading progress bar and embedded course recommendation cards.

---

### Journey 8: Administrator Logs In & Navigates Dashboard
- **Persona / Intent:** Course coordinator accessing administrative portal.
- **Starting Point:** `/admin/login`.
- **Steps Required:**
  1. Enters email and password.
  2. Clicks "Sign In".
  3. Backend validates JWT token and redirects to `/admin`.
  4. Explores dashboard stat cards (Courses, Categories, Inquiries, News).
- **Expected Behavior:** Fast, secure authentication; immediate overview of pending tasks and platform health.
- **Actual Observed Behavior:** Authentication flow is robust and strictly typed with JWT validation and role enforcement.
- **Friction Points:**
  - Dashboard stat cards show static numbers without weekly growth indicators or interactive filters.
- **Improvement Opportunities:**
  - Add delta change pills (+8% this month) and quick filter shortcuts to jump directly to pending inquiries.

---

### Journey 9: Administrator Manages a Training Program
- **Persona / Intent:** Administrator authoring a new course and attaching a PDF syllabus.
- **Starting Point:** `/admin/training`.
- **Steps Required:**
  1. Clicks "Create Course" button.
  2. Fills in Title, Code, Category, Duration, Objectives, Prerequisites.
  3. Uploads PDF syllabus file to Neon PostgreSQL ByteA storage.
  4. Selects status `PUBLISHED` and saves.
- **Expected Behavior:** Segmented multi-step modal, drag-and-drop PDF dropzone with page count preview, instant table refresh.
- **Actual Observed Behavior:** Program creation and PDF upload work correctly (verified via `admin-cms-workflow.test.ts` and `document-upload.test.ts`).
- **Friction Points:**
  - Form is a single continuous scroll modal with 15+ fields.
  - No live PDF thumbnail or preview rendered in the admin editor.
- **Improvement Opportunities:**
  - Tabbed modal segmentation (Overview, Curriculum, Requirements, Publishing).
  - Visual PDF document chip with file size and preview trigger.

---

### Journey 10: Administrator Manages Facility Gallery Content
- **Persona / Intent:** Marketing editor uploading new training classroom photos.
- **Starting Point:** `/admin/gallery`.
- **Steps Required:**
  1. Selects or creates an Album.
  2. Uploads photos via Cloudinary integration.
  3. Reorders photo sequence.
- **Expected Behavior:** Multi-file drag and drop, visual thumbnail grid with drag-and-drop reordering.
- **Actual Observed Behavior:** Upload works via existing backend routes.
- **Friction Points:**
  - Reordering requires manual number typing in sort order inputs rather than fluid drag-and-drop tiles.
- **Improvement Opportunities:**
  - Add touch/pointer drag-and-drop thumbnail reordering.

---

### Journey 11: Administrator Reviews an Inquiry
- **Persona / Intent:** Student advisor triaging corporate training inquiries.
- **Starting Point:** `/admin/inquiries`.
- **Steps Required:**
  1. Reviews inquiry list table.
  2. Filters by `NEW` status.
  3. Clicks inquiry row to open slide-out detail drawer.
  4. Updates status to `IN_PROGRESS` or `RESOLVED`.
- **Expected Behavior:** Slide-out drawer with full message, direct email response link, and instant status pill toggle.
- **Actual Observed Behavior:** Inquiry table and drawer work cleanly with Zod-validated status updates.
- **Friction Points:**
  - No one-click "Reply via Email" template button pre-filling the user's default mail client.
- **Improvement Opportunities:**
  - Add mailto action button with standardized institutional response template.

---

## 3. Journey Testing Summary Matrix

| # | User Journey | Primary Persona | Observed Status | Friction Level | Key Recommendation |
|---|---|---|---|---|---|
| 1 | Discover Services | First-Time Trainee | **Verified Functional** | Low | Add edge masks to category pills; pause marquee on hover. |
| 2 | Search Specific Course | Returning Trainee | **Verified Functional** | Medium | Replace full page reload with instant Spotlight search modal. |
| 3 | Filter Catalog | Technical Learner | **Verified Functional** | High | Add sticky mobile filter bar; client-side optimistic FLIP layout. |
| 4 | Access Course Syllabus | Enterprise Sponsor | **Verified Functional** | Medium | Embedded in-page PDF/module outline viewer; sticky mobile CTA. |
| 5 | Corporate Inquiry | Enterprise Director | **Verified Functional** | Low | Micro-feedback on form submission; calendar booking prompt. |
| 6 | ITSC AI Course Inquiry | Self-Guided Trainee | **Verified Functional** | Medium | Spring drawer motion; focus trapping; page-aware suggestions. |
| 7 | Read News Article | Alumni / Client | **Verified Functional** | Low | Reading progress indicator; related course links. |
| 8 | Admin Auth & Dashboard | System Administrator | **Verified Functional** | Low | Growth delta indicators; humanized timestamps. |
| 9 | Course CMS & PDF Upload | Training Coordinator | **Verified Functional** | Medium | Tabbed modal segmentation; PDF thumbnail preview. |
| 10 | Gallery Media Management | Marketing Editor | **Verified Functional** | Medium | Drag-and-drop photo tile reordering. |
| 11 | Review Client Inquiry | Student Advisor | **Verified Functional** | Low | Pre-filled mailto reply action button. |
