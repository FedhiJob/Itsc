# ITSC Next-Generation Experience — Interaction & Micro-UX Audit
**Document ID:** `ITSC_INTERACTION_AUDIT.md`  
**Phase:** Phase 1 — Comprehensive UX Audit  
**Project:** Information Technology Support Centre (ITSC) Official Web Platform  
**Target Architecture:** React 19 / Next.js 15 App Router  
**Audit Date:** November 10, 2026  
**Auditor:** Google Antigravity Agent  
**Status:** Completed Phase 1 Deliverable — Awaiting Review & Phase 2 Authorization  

---

## 1. Executive Summary & Interaction Philosophy

An institutional corporate platform must balance solemn professionalism with modern fluid responsiveness. Inspired by the interaction philosophy of modern Apple software, every tap, click, hover, keypress, and swipe should feel tactile, predictable, and immediately responsive.

This audit examines the granular interaction states across eight primary UI categories:
1. **Buttons & Interactive Controls**
2. **Forms, Inputs & Validation**
3. **Menus & Navigation Drawers**
4. **Course Catalog Filters & Facets**
5. **Search & Discovery Systems**
6. **Dialogs, Modals & Lightboxes**
7. **ITSC AI Assistant Interaction Engine**
8. **Keyboard Navigation & Accessibility (a11y) States**

---

## 2. Granular Interaction Audits

### 2.1 Buttons & Interactive Controls
- **Inspected Components:** `apps/web/src/components/ui/button.tsx`, `apps/web/src/components/ui/badge.tsx`.
- **Observed Behavior:**
  - Standard variants implemented: `default`, `outline`, `secondary`, `ghost`, `link`.
  - Focus rings (`focus-visible:ring-2 focus-visible:ring-offset-2`) are active.
- **Identified Weaknesses:**
  - `INT-BTN-01 (Medium):` **Missing Tactile Press Scale.** Buttons lack tactile physical response on mouse click or finger tap (`active:scale-[0.98]`). Interacting with buttons feels visual but not tactile.
  - `INT-BTN-02 (Medium):` **Disabled State Opacity vs Cursor.** When a button is disabled, `disabled:pointer-events-none` prevents custom cursor feedback (e.g. `cursor-not-allowed`) and screen-reader tooltip explanations.
  - `INT-BTN-03 (Low):` **Spinner Transition.** During async form submission, the button text abruptly swaps with a spinner without smooth size reservation or cross-fade.

---

### 2.2 Forms, Inputs & Validation
- **Inspected Components:** `InquiryForm.tsx` (`components/contact/`), Corporate Form (`components/sections/CorporateCta.tsx`), Admin Login (`app/admin/login/page.tsx`).
- **Observed Behavior:**
  - Robust schema validation using Zod v4 and React Hook Form.
  - Inline error text displays below invalid inputs in red (`text-red-500 text-xs`).
- **Identified Weaknesses:**
  - `INT-FRM-01 (Medium):` **Touched vs Dirty Feedback.** Form fields only validate on blur or submit. As a user corrects an error, the error state does not immediately resolve until focus leaves the field or the form is re-submitted.
  - `INT-FRM-02 (Low):` **Missing Success Checkmarks.** Inputs (such as valid enterprise email or phone format) lack subtle green checkmark micro-icons confirming valid format before submit.
  - `INT-FRM-03 (Low):` **Mobile Auto-Capitalize & Keyboards.** Phone input fields do not consistently specify `inputMode="tel"`, and email fields occasionally trigger mobile auto-capitalization on small screens.

---

### 2.3 Menus & Navigation Drawers
- **Inspected Components:** `MegaMenu.tsx`, `MobileNav.tsx`, `BottomNav.tsx` (`components/layout/`).
- **Observed Behavior:**
  - Mega-menu opens on desktop mouse hover over "Programs".
  - Mobile drawer slides in from the right when the hamburger icon is tapped.
- **Identified Weaknesses:**
  - `INT-MNU-01 (High):` **Desktop Mega-Menu Hover Flickering.** Because the mega-menu relies on CSS hover, moving the cursor quickly across the gap between the header link and the dropdown can cause the menu to accidentally dismiss. It requires a directional hover delay buffer (aim-assistance).
  - `INT-MNU-02 (High):` **Mobile Drawer Animation Rigidity.** The mobile navigation drawer slides in using basic CSS classes (`translate-x-full` to `translate-x-0` with `transition-transform duration-300`). It lacks natural spring deceleration and cannot be swiped away with a natural finger drag.
  - `INT-MNU-03 (Medium):` **Bottom Navigation Active Indicator.** Mobile bottom nav items toggle color when selected, but lack a fluid sliding pill indicator beneath the active tab.

---

### 2.4 Course Catalog Filters & Facets
- **Inspected Components:** `CourseFilter.tsx`, `CourseGrid.tsx` (`components/features/`).
- **Observed Behavior:**
  - Filters sync state to URL search parameters (`q`, `category`, `level`, `mode`, `page`).
- **Identified Weaknesses:**
  - `INT-FLT-01 (High):` **Full Router Reload Flicker.** Every checkbox click pushes a new router state, triggering an async server re-fetch. Courses unmount and remount abruptly.
  - `INT-FLT-02 (High):` **Mobile Filter Sticky Actions.** On mobile, scrolling through 56 categories pushes the "Apply" and "Clear" buttons out of view. Users must scroll back to the top or bottom.
  - `INT-FLT-03 (Medium):` **No Counter Badges on Filter Headers.** The category filter accordion does not indicate how many filters are currently active within that sub-group (e.g. "Cloud & DevOps (3)").

---

### 2.5 Search & Discovery Systems
- **Inspected Components:** Hero search input, catalog search input, header search trigger.
- **Observed Behavior:**
  - Query parameter search looks up courses across title, code, and description.
- **Identified Weaknesses:**
  - `INT-SRC-01 (High):` **Absence of Spotlight Search Modal.** Tapping search on desktop or mobile triggers a page redirect instead of opening an instant, blur-backed typeahead modal with keyword highlighting and immediate keyboard arrow selection.
  - `INT-SRC-02 (Medium):` **Debounce Delay.** Search inputs lack smooth client debouncing (300ms) with an inline loading spinner inside the input field.

---

### 2.6 Dialogs, Modals & Lightboxes
- **Inspected Components:** `Lightbox.tsx` (`components/features/`), Admin Course Modal, Admin Inquiry Drawer.
- **Observed Behavior:**
  - Full-screen lightbox renders facility and graduation gallery photos.
- **Identified Weaknesses:**
  - `INT-DLG-01 (High):` **Missing Touch Swipe in Lightbox.** On mobile phones, users naturally expect to swipe left or right to flip through photos. The current lightbox only supports discrete tap buttons.
  - `INT-DLG-02 (Medium):` **Backdrop Click and Escape Key.** While Escape key dismisses modals, clicking the dark backdrop occasionally triggers text selection if the cursor is dragged outside the dialog box.

---

### 2.7 ITSC AI Assistant Interaction Engine
- **Inspected Components:** `ChatDrawer.tsx`, `ChatLauncher.tsx`, `ChatMessage.tsx`, `SuggestedQuestions.tsx` (`components/chat/`).
- **Observed Behavior:**
  - Floating launcher FAB pulses with gold accent ring.
  - Chat drawer slides in from the right.
  - Suggestion prompt pills allow single-tap query submission.
  - Live AI streaming backed by Gemini 2.5 Flash with fallback grounding.
- **Identified Weaknesses:**
  - `INT-AI-01 (High):` **Linear Open/Close Motion.** Chat drawer uses linear CSS translation without spring physics, bounce, or swipe-down dismissal.
  - `INT-AI-02 (Medium):` **Context Unawareness.** The chat assistant launches with the same static prompt suggestions regardless of whether the user is on the homepage, browsing the Oracle DBA course, or looking at corporate training.
  - `INT-AI-03 (Medium):` **Markdown Streaming Jitter.** As response tokens stream in, code blocks and lists cause minor vertical jitter during auto-scrolling. Smooth throttling of scroll-to-bottom is needed.

---

### 2.8 Keyboard Navigation & Accessibility (a11y)
- **Inspected Architecture:** Keyboard Tab flow across all public and admin views.
- **Observed Behavior:**
  - Native anchor tags and buttons receive focus rings.
- **Identified Weaknesses:**
  - `INT-A11Y-01 (High):` **Absence of Focus Trapping.** When `ChatDrawer.tsx` or `MobileNav.tsx` is open, pressing `Tab` allows focus to escape behind the drawer and navigate the obscured homepage links.
  - `INT-A11Y-02 (High):` **Screen-Reader Stream Silence.** Incoming AI assistant responses are not wrapped in an `aria-live="polite"` region, leaving blind and low-vision screen reader users unaware when generation finishes.
  - `INT-A11Y-03 (Medium):` **Skip-to-Content Link.** The platform does not provide a hidden "Skip to Main Content" link as the first focusable element on public pages.
  - `INT-A11Y-04 (Low):` **Reduced Motion Setting.** No `@media (prefers-reduced-motion: reduce)` handler disables the continuous accreditation marquee or floating hero vectors.

---

## 3. Summary of Core Interaction Targets for Phase 2–5

```
1. Spring Physics:       Transition from static CSS transitions to physics-based spring motions.
2. Tactile Press:        Inject active:scale-98 and micro-haptic visual feedback into all buttons.
3. Spotlight Search:     Replace page reload search with an instant Cmd+K typeahead modal.
4. Mobile Gestures:      Add swipe-to-dismiss on drawers and swipe left/right in image lightboxes.
5. Focus Locking (a11y): Enforce strict focus traps on all modals and slide-out drawers.
6. Contextual AI:        Inject page-aware prompt pills into ITSC AI based on active route/course.
```
