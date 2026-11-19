# ITSC Web Platform — Component Inventory & Architecture
**Document ID:** `ITSC_COMPONENT_INVENTORY.md`  
**Phase:** Phase 0 — Project Discovery and Baseline  
**Project:** Information Technology Support Centre (ITSC) Official Web Platform  
**Target Architecture:** React 19 / Next.js 15 App Router  
**Audit Date:** November 9, 2026  
**Auditor:** Google Antigravity Agent  
**Status:** Completed Baseline — Awaiting Approval for Phase 1  

---

## 1. Executive Summary

This inventory documents all React components comprising the frontend application (`apps/web/src/components/`). The codebase exhibits clean modular organization across:
- **Layout & Navigation Components:** Header, Footer, Mega-Menu, Mobile Navigation, Bottom Bar.
- **Content & Hero Sections:** Hero, Stats, Featured Courses, Testimonials, Corporate CTA.
- **Feature & Domain Components:** Course Cards, Course Catalog Filters, Course Outline Viewer, Gallery Lightbox, News Cards.
- **ITSC AI Assistant Components:** Chat Drawer, Chat Launcher, Chat Message stream, Prompt Pills.
- **Administrative Components:** Sidebar, Admin Header, Stat Cards, Data Modals.
- **Base UI Primitives:** Button, Badge, Input, Dialog, Tabs.

---

## 2. Comprehensive Component Matrix

| # | Component Name | Directory Path | Primary Purpose | State Management | Accessibility (a11y) Status | Planned Next-Gen Upgrade |
|---|---|---|---|---|---|---|
| 1 | `Header` | `components/layout/Header.tsx` | Global top navigation bar with logo, links, search trigger, and AI trigger | React local state (`isOpen`, `scrolled`) | Good (`aria-label`, landmarks) | Glassmorphic blur, shrink-on-scroll dynamics |
| 2 | `Footer` | `components/layout/Footer.tsx` | Global footer with quick links, accreditations, contact details, and copyright | Stateless server/client | High (semantic `<footer>`, links) | Refined typographic rhythm, newsletter validation |
| 3 | `MegaMenu` | `components/layout/MegaMenu.tsx` | Desktop expansive course navigation menu by track | Client state (`hoveredCategory`, `open`) | Needs ARIA expanded & keyboard arrows | Spring motion entrance, category icons, zero layout shift |
| 4 | `MobileNav` | `components/layout/MobileNav.tsx` | Slide-out mobile navigation drawer | Client state (`isOpen`) | Moderate (Focus trap required) | Swipe-to-dismiss gesture, spring physics |
| 5 | `BottomNav` | `components/layout/BottomNav.tsx` | Mobile persistent thumb navigation bar | Stateless (reads current pathname) | Good (semantic nav) | Subtle active tab pill indicator animation |
| 6 | `Hero` | `components/sections/Hero.tsx` | Homepage high-impact value proposition & search prompt | Stateless | High (h1 hierarchy, contrast) | Fluid Apple-style typography, subtle depth layers |
| 7 | `StatsSection` | `components/sections/StatsSection.tsx` | Institutional metrics (trainees, courses, enterprise clients) | Stateless | Good (tabular aria where needed) | Animated number counter on viewport enter |
| 8 | `FeaturedCourses` | `components/sections/FeaturedCourses.tsx` | Spotlight grid of high-demand certification programs | Stateless (receives programs prop) | High (grid list semantics) | Horizontal smooth snap carousel on mobile |
| 9 | `WhyChooseUs` | `components/sections/WhyChooseUs.tsx` | Value differentiators (hands-on labs, certified trainers) | Stateless | High | Elevated card hover states and micro-interactions |
| 10 | `TestimonialsSection` | `components/sections/TestimonialsSection.tsx` | Corporate client and trainee success stories | Client state (`activeSlide`) | Moderate | Touch swipe carousel, verified reviewer badges |
| 11 | `CorporateCta` | `components/sections/CorporateCta.tsx` | Enterprise consultation call-to-action banner | Stateless | High | Subtle gradient shimmer and focus states |
| 12 | `CourseCard` | `components/features/CourseCard.tsx` | Catalog item card displaying title, code, level, duration | Stateless (receives program object) | High (anchor card semantics) | Smooth lift on hover, interactive outline badge |
| 13 | `CourseGrid` | `components/features/CourseGrid.tsx` | Responsive grid wrapper for training catalog | Stateless | High (aria-live on results count) | FLIP layout animations on category filtering |
| 14 | `CourseFilter` | `components/features/CourseFilter.tsx` | Desktop & mobile faceted filter controls | URL query params / Next router | Moderate | Sticky mobile sheet, active badge counters |
| 15 | `CourseOutlineViewer` | `components/features/CourseOutlineViewer.tsx` | Interactive syllabus viewer & PDF document streaming link | Client state (`viewMode`, `isDownloading`) | High (accessible PDF link) | In-browser embedded PDF outline preview modal |
| 16 | `CategoryPills` | `components/features/CategoryPills.tsx` | Horizontal category selector pills | Client state (`selectedCategory`) | High (radiogroup semantics) | Inertial smooth drag scroll on mobile |
| 17 | `GalleryGrid` | `components/features/GalleryGrid.tsx` | Photographic grid for lab and facility tours | Client state (`activeAlbum`) | High (image alt texts) | Aspect-ratio blur placeholders on image load |
| 18 | `Lightbox` | `components/features/Lightbox.tsx` | Fullscreen photo viewer modal | Client state (`isOpen`, `currentIndex`) | Moderate (keyboard Escape / arrows) | Touch swipe left/right, pinch-to-zoom |
| 19 | `NewsCard` | `components/features/NewsCard.tsx` | Blog / corporate announcement teaser card | Stateless | High | Refined serif typography, reading time tag |
| 20 | `InquiryForm` | `components/contact/InquiryForm.tsx` | Interactive contact and training inquiry form | React Hook Form + Zod v4 | High (accessible form labels & errors) | Inline input verification, clear submit animation |
| 21 | `ChatDrawer` | `components/chat/ChatDrawer.tsx` | Slide-out ITSC AI assistant panel | React local state / TanStack Query | Moderate (Focus trap needed) | Spring-physics slide-in, swipe down to close |
| 22 | `ChatLauncher` | `components/chat/ChatLauncher.tsx` | Floating action button (FAB) for ITSC AI | Client state (`isOpen`) | High (`aria-label`, tooltip) | Subtle breathing pulse indicator |
| 23 | `ChatMessage` | `components/chat/ChatMessage.tsx` | Individual user and AI assistant message bubble | Stateless | High (structured markdown rendering) | Streaming typewriter effect, formatted course cards |
| 24 | `SuggestedQuestions` | `components/chat/SuggestedQuestions.tsx` | Clickable question pills for quick AI prompts | Stateless (callback prop) | High (accessible button pills) | Context-aware dynamic suggestions by page |
| 25 | `AdminSidebar` | `components/admin/AdminSidebar.tsx` | Administrative navigation panel | Client state (`collapsed`) | High | Fluid collapse/expand, active route highlighting |
| 26 | `AdminHeader` | `components/admin/AdminHeader.tsx` | Top bar for admin with user profile and quick logout | Client state (session profile) | High | User avatar dropdown, quick notification bell |
| 27 | `StatCard` | `components/admin/StatCard.tsx` | Metric dashboard card for administrative overview | Stateless | High | Metric change delta indicators (+12%) |
| 28 | `Button` (UI Primitive) | `components/ui/button.tsx` | Standardized button with Radix Slot polymorphism | Stateless (`cva` variants) | High (`aria-busy` on loading) | Press-scale micro-interaction (`active:scale-98`) |

---

## 3. UI Primitives & Design System Tokens

The application utilizes standardized UI primitives built on Radix UI slots and Tailwind CSS v4 variables:

### Color Palette Variables (`apps/web/src/app/globals.css`):
- `--background: #f8f7f2;` (Warm institutional parchment)
- `--foreground: #172033;` (Deep slate ink)
- `--color-brand-gold: #febd01;` (ITSC primary gold)
- `--color-brand-ink: #172033;` (ITSC midnight navy)
- `--color-brand-navy: #10253f;` (Deep corporate navy)
- `--color-brand-teal: #0d9488;` (Accent cyan/teal)

### Typography Tokens:
- **Interface / Body:** `--font-sans` (Geist Sans, system fallback `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto`)
- **Display / Editorial Headings:** `--font-heading` ("Merriweather", Georgia, serif)

### Motion & Keyframe Utilities:
- `itsc-reveal`: Fade-in translation for newly mounted elements.
- `itsc-float`: Continuous floating animation for decorative hero vectors.
- `itsc-pulse`: Glowing beacon animation for status badges and AI assistant launcher.
- `itsc-marquee`: Continuous horizontal ticker for corporate partner accreditations.

---

## 4. Key Takeaways for Next-Gen Engineering

1. **Motion Framework:** All existing animations are purely CSS keyframe transitions. Integrating a spring-based physics motion library will dramatically increase the tactile quality and fluid responsiveness of drawers, mega-menus, and cards without altering business logic.
2. **Form Interaction:** Forms already use robust Zod schemas and React Hook Form. Micro-interactions (field-level checkmarks, subtle haptic-style error shakes) will elevate polish.
3. **Component Reusability:** Component boundaries are clean and strictly typed. Zero code rebuilds are required—only surgical UI/interaction enhancements.
