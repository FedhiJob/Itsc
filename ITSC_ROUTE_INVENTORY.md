# ITSC Web Platform — Complete Route Inventory
**Document ID:** `ITSC_ROUTE_INVENTORY.md`  
**Phase:** Phase 0 — Project Discovery and Baseline  
**Project:** Information Technology Support Centre (ITSC) Official Web Platform  
**Target Architecture:** Next.js 15 App Router  
**Audit Date:** November 9, 2026  
**Auditor:** Google Antigravity Agent  
**Status:** Completed Baseline — Awaiting Approval for Phase 1  

---

## 1. Master Route Summary Table

The application serves **15 primary routes** (9 public portal routes, 6 administrative routes) plus system routes (`robots.txt`, `sitemap.xml`, `not-found`):

| # | Route URL | Type | Rendering Strategy | Size / First Load JS | Primary Data Sources | Primary Components Used |
|---|---|---|---|---|---|---|
| 1 | `/` | Public | Dynamic (SSR / ISR fallback) | 3.82 kB / 125 kB | `/settings/public`, `/training/categories`, `/training/programs` | `Header`, `Hero`, `StatsSection`, `CategoryPills`, `FeaturedCourses`, `WhyChooseUs`, `TestimonialsSection`, `Footer` |
| 2 | `/about` | Public | Dynamic (SSR) | 550 B / 115 kB | `/settings/public` | `Header`, `PageHero`, `MissionVision`, `Milestones`, `AccreditationBadges`, `Leadership`, `Footer` |
| 3 | `/corporate-training` | Public | Dynamic (SSR) | 550 B / 115 kB | `/settings/public` | `Header`, `PageHero`, `CorporateBenefits`, `DeliveryModes`, `CustomCurriculum`, `CorporateInquiryForm`, `Footer` |
| 4 | `/training-programs` | Public | Dynamic (SSR / SearchParams) | 6.05 kB / 120 kB | `/training/programs`, `/training/categories` | `Header`, `CourseCatalogHeader`, `FilterSidebar`, `MobileFilterDrawer`, `CourseGrid`, `CourseCard`, `Pagination`, `Footer` |
| 5 | `/training-programs/[slug]` | Public | Dynamic (SSR) | 167 B / 106 kB | `/training/programs/:slug` | `Header`, `Breadcrumbs`, `CourseHero`, `CourseKeyFacts`, `CourseTabs`, `OutlineViewer`, `EnrollmentCtaCard`, `Footer` |
| 6 | `/gallery` | Public | Dynamic (SSR) | 2.34 kB / 105 kB | `/gallery/albums` | `Header`, `GalleryHeader`, `AlbumFilterTabs`, `PhotoGrid`, `LightboxModal`, `Footer` |
| 7 | `/news` | Public | Dynamic (SSR) | 167 B / 106 kB | `/news?status=PUBLISHED` | `Header`, `NewsHero`, `FeaturedArticle`, `ArticleGrid`, `NewsCard`, `Pagination`, `Footer` |
| 8 | `/news/[slug]` | Public | Dynamic (SSR) | 167 B / 106 kB | `/news/:slug` | `Header`, `Breadcrumbs`, `ArticleHeader`, `ArticleContent`, `RelatedArticles`, `SocialShare`, `Footer` |
| 9 | `/contact` | Public | Dynamic (SSR / Client Form) | 2.01 kB / 105 kB | `/settings/public`, `/inquiries` (POST) | `Header`, `ContactHero`, `ContactInfoCards`, `InteractiveMapEmbed`, `InquiryForm`, `Footer` |
| 10 | `/admin/login` | Admin | Static (Prerendered) | 5.43 kB / 120 kB | `/auth/login` (POST) | `AdminLoginForm`, `PasswordVisibilityToggle`, `BrandedAuthCard` |
| 11 | `/admin` | Admin | Static (Prerendered Shell) | 2.49 kB / 108 kB | `/admin/stats`, `/admin/inquiries` | `AdminSidebar`, `AdminHeader`, `StatCardsGrid`, `RecentInquiriesWidget`, `QuickActions` |
| 12 | `/admin/training` | Admin | Static (Prerendered Shell) | 9.27 kB / 123 kB | `/training/programs`, `/training/categories`, `/upload/document` | `AdminSidebar`, `AdminHeader`, `CourseTable`, `CourseFormModal`, `CategoryManagerModal`, `PdfUploadZone` |
| 13 | `/admin/news` | Admin | Static (Prerendered Shell) | 5.10 kB / 119 kB | `/news`, `/upload/image` | `AdminSidebar`, `AdminHeader`, `NewsTable`, `ArticleEditorModal`, `ImageUploader` |
| 14 | `/admin/gallery` | Admin | Static (Prerendered Shell) | 6.52 kB / 121 kB | `/gallery/albums`, `/upload/image` | `AdminSidebar`, `AdminHeader`, `AlbumManager`, `PhotoBatchUploader`, `SortablePhotoGrid` |
| 15 | `/admin/inquiries` | Admin | Static (Prerendered Shell) | 4.52 kB / 116 kB | `/inquiries` | `AdminSidebar`, `AdminHeader`, `InquiryTable`, `InquiryDetailDrawer`, `StatusBadgeDropdown` |
| * | `/robots.txt` | System | Static | 126 B / 103 kB | Next.js Metadata Route | `robots.ts` |
| * | `/sitemap.xml` | System | Static | 126 B / 103 kB | Next.js Metadata Route | `sitemap.ts` |
| * | `/_not-found` | System | Static | 988 B / 104 kB | Client Error State | `not-found.tsx`, `Header`, `Footer` |

---

## 2. Detailed Route Profiles

### Route 1: `/` (Homepage)
- **Primary Mission:** Establish ITSC institutional credibility, communicate enterprise value proposition, spotlight key training categories, and guide visitors toward catalog discovery or corporate consultation.
- **Data Dependencies:**
  - `GET /api/v1/settings/public` (revalidate: 0 / dynamic)
  - `GET /api/v1/training/categories` (no-store)
  - `GET /api/v1/training/programs?status=PUBLISHED&limit=500` (no-store)
- **Key Interactivity:**
  - Category pill carousel with live category filtering.
  - Interactive Mega-Menu on desktop hover.
  - ITSC AI quick launcher pill in bottom-right corner.
  - Direct course search input navigating to `/training-programs?q=...`.
- **Target Experience Enhancements (Phase 2 & 3):**
  - Smooth parallax hero typography with Apple-style subtle depth.
  - Fluid spring entrance for course cards.
  - Instant predictive course search modal.

---

### Route 2: `/about` (About ITSC)
- **Primary Mission:** Present the history, mission, leadership, enterprise accreditations, and training methodology of ITSC.
- **Data Dependencies:**
  - `GET /api/v1/settings/public`
- **Key Interactivity:**
  - Tabbed milestones and accreditation proof points.
  - Instructor credentials and institutional leadership cards.
- **Target Experience Enhancements:**
  - Interactive history timeline with progressive reveal animations on scroll.
  - High-definition badge tooltips detailing certification authority.

---

### Route 3: `/corporate-training` (Enterprise Solutions)
- **Primary Mission:** Convert enterprise HR directors, CTOs, and team leads through customized corporate curriculum propositions and on-site delivery models.
- **Data Dependencies:**
  - `GET /api/v1/settings/public`
- **Key Interactivity:**
  - Corporate training inquiry form with organization size, training modality (On-site / Online / Hybrid), and target technology selection.
  - Interactive delivery mode comparison matrix.
- **Target Experience Enhancements:**
  - Multi-step interactive corporate training calculator / estimator.
  - Instant inquiry confirmation with calendar booking suggestion.

---

### Route 4: `/training-programs` (Course Catalog)
- **Primary Mission:** Provide high-speed, frictionless exploration across 269 courses and 56 categories with faceted search, instant filtering, and responsive pagination.
- **Data Dependencies:**
  - `GET /api/v1/training/programs`
  - `GET /api/v1/training/categories`
- **Key Interactivity:**
  - URL-synchronized search parameters (`q`, `category`, `level`, `mode`, `page`).
  - Mobile filter bottom-sheet.
  - Responsive course cards with level indicators, duration chips, and direct syllabus links.
- **Target Experience Enhancements:**
  - Client-side instantaneous optimistic filter updates (zero reload flicker).
  - Floating sticky action bar on mobile viewports.
  - Fluid FLIP-style animation on card filtering and sorting.

---

### Route 5: `/training-programs/[slug]` (Course Detail)
- **Primary Mission:** Convert prospective trainees by detailing syllabus modules, prerequisites, learning objectives, duration, and course outline downloads.
- **Data Dependencies:**
  - `GET /api/v1/training/programs/:slug`
  - `GET /api/v1/upload/document/:id/:filename` (Streamed PDF syllabus)
- **Key Interactivity:**
  - Tab switching between Overview, Objectives, Prerequisites, and Course Outline.
  - Direct syllabus PDF preview / download trigger.
  - Sticky registration CTA bar on scroll.
- **Target Experience Enhancements:**
  - In-browser interactive PDF outline viewer / structured outline tree.
  - Contextual ITSC AI trigger pre-seeded with: *"Ask ITSC AI about this course's prerequisites"*.

---

### Route 6: `/gallery` (Facility & Training Gallery)
- **Primary Mission:** Showcase ITSC physical labs, classrooms, student graduation events, and corporate workshops.
- **Data Dependencies:**
  - `GET /api/v1/gallery/albums?limit=20`
- **Key Interactivity:**
  - Category / Album filter tabs.
  - Lightbox modal with keyboard arrow navigation and image zoom.
- **Target Experience Enhancements:**
  - Masonry grid layout with smooth aspect-ratio preservation and blur-up image placeholders.
  - Touch-friendly swipe gestures inside the lightbox viewer.

---

### Route 7 & 8: `/news` & `/news/[slug]` (Corporate News & Blog)
- **Primary Mission:** Communicate announcements, industry insights, new accreditation certifications, and upcoming batch schedules.
- **Data Dependencies:**
  - `GET /api/v1/news?status=PUBLISHED`
  - `GET /api/v1/news/:slug`
- **Key Interactivity:**
  - Featured article spotlight hero.
  - Categorized news cards with publication dates and read times.
  - Social sharing links and related articles grid.
- **Target Experience Enhancements:**
  - Fluid reading progress bar at top of screen on article detail.
  - Clean typography formatting with optimized line-height and serif headings.

---

### Route 9: `/contact` (Contact & Inquiries)
- **Primary Mission:** Enable swift communication for prospective students and corporate inquiries via phone, email, physical office address, and interactive web form.
- **Data Dependencies:**
  - `GET /api/v1/settings/public`
  - `POST /api/v1/inquiries`
- **Key Interactivity:**
  - Zod-validated contact form with real-time field error feedback.
  - Embedded Google Map showing ITSC headquarters location.
  - Click-to-call and click-to-email action buttons.
- **Target Experience Enhancements:**
  - Micro-haptic feedback styles on form submission.
  - Automatic ITSC AI routing if the user has an urgent, immediate question.

---

### Routes 10–15: Admin Portal (`/admin/*`)
- **Primary Mission:** Role-based administrative dashboard for managing training programs, categories, PDF outlines, news, photo albums, inquiries, and platform settings.
- **Data Dependencies:**
  - Full authenticated REST API (`/api/v1/auth`, `/api/v1/training`, `/api/v1/news`, `/api/v1/gallery`, `/api/v1/inquiries`, `/api/v1/settings`, `/api/v1/upload`).
- **Key Interactivity:**
  - Course CRUD modal with direct PDF outline file upload to Neon PostgreSQL storage.
  - Inquiry status toggling (`NEW` -> `IN_PROGRESS` -> `RESOLVED` -> `ARCHIVED`).
  - Secure JWT session renewal and role enforcement (`SUPER_ADMIN`, `ADMIN`, `EDITOR`).

---

## 3. Route Integrity & Next.js Build Validation

All 15 routes were compiled and verified during `next build`:
- **Total Compiled Routes:** 19 routes (including internal metadata and not-found handlers).
- **Compile Time:** 2.7 minutes.
- **Shared First Load JS:** 103 kB (Well within performant modern web limits).
- **Build Status:** **Exit Code 0 — 100% Green.**
