# ITSC Next-Generation Experience
## PHASE 4 — COMPLETION REPORT: Contextual ITSC AI Assistant Deepening

**Status:** COMPLETED & VERIFIED  
**Branch:** `main`  
**Date:** November 14, 2026  

---

## 1. Executive Summary

Phase 4 transformed **ITSC AI** from a static conversational chat box into a context-aware, fluidly animated, and deeply accessible digital advisor. Inspired by modern Apple interaction ergonomics, the assistant now understands where the visitor is in their journey, provides route-specific guidance, features native mobile swipe-to-dismiss gestures, eliminates streaming scroll jitter, and introduces direct course conversion actions.

All Phase 4 objectives have been verified with complete monorepo typechecking, ESLint validation, and strict Next.js 15 production build compilation across all 19 routes.

---

## 2. Key Enhancements & Architectural Upgrades

### A. Context-Aware Intelligence (`INT-AI-02`)
- **Component:** `apps/web/src/components/chat/chat-widget.tsx`
- **Dynamic Route Sensing:** Integrates `usePathname()` to dynamically detect active views and contextualize the assistant's initial state without manual user input.
- **Route-Tailored Starter Prompts:**
  - **Course Detail (`/training-programs/[slug]`):** Formats the slug into a human-readable title and surfaces targeted prompts:
    - *"What are the prerequisites for this course?"*
    - *"What certification exam does this course prepare for?"*
    - *"How do I download or review the full syllabus?"*
    - *"Can this course be delivered for our corporate team?"*
    - *"When is the next batch of classes starting?"*
  - **Corporate Training (`/corporate-training`):** Surfaces enterprise customization, on-site delivery, and RFP/quotation prompts.
  - **Contact & Admissions (`/contact`):** Surfaces facility location in Addis Ababa, office visiting hours, direct advisor phone/email, and response time prompts.
  - **Facilities & Labs (`/gallery`):** Surfaces hardware, computer labs, hands-on lab equipment, and in-person campus visit questions.
  - **News & Announcements (`/news`):** Surfaces upcoming semester schedules, enrollment deadlines, and new certification course releases.
  - **About ITSC (`/about`):** Surfaces ITSC's mission, international technology partnerships, and credential recognition details.
- **Visual Context Badge:** A clean gold-accented badge in the chat subheader displays the active context (e.g., `Course: Azure Fundamentals` or `Corporate & Enterprise Training`).

### B. Mobile Sheet Ergonomics & Swipe-to-Dismiss (`INT-AI-01`)
- **Native Bottom Sheet:** On mobile devices (`< 640px`), the chat window converts into a native bottom sheet anchored to the lower edge with a frosted backdrop overlay.
- **Tactile Drag Handle:** Features a top grab bar (`h-1.5 w-12 rounded-full bg-white/40`) providing clear visual affordance for swiping.
- **Touch Gesture Engine:**
  - Tracks touch delta in real-time (`onTouchStart`, `onTouchMove`, `onTouchEnd`).
  - Implements smooth downward translation tracking (`transform: translateY(${dragOffsetY}px)`).
  - If dragged down past the 75px threshold, smoothly dismisses the modal.
  - If released below threshold, springs back to rest position using `cubic-bezier(0.16, 1, 0.3, 1)`.

### C. Jitter-Free Auto-Scroll & Reading Memory (`INT-AI-03`)
- **Throttled Auto-Scrolling:** Employs `requestAnimationFrame` for scroll operations, eliminating layout thrashing and jitter during rapid token generation.
- **User Scroll-Up Protection:** Monitors distance to bottom (`distanceToBottom > 80px`). If a user scrolls up to read earlier responses, auto-scroll is suspended so their reading position is never abruptly lost.
- **Jump-to-Latest Floating Pill:** When scrolled up, a floating "↓ New updates below" button appears, allowing 1-click smooth navigation to incoming messages.

### D. Live Accessibility & Dialog Focus Trapping (`INT-A11Y-01` & `INT-A11Y-02`)
- **Focus Trap:** When the dialog is open, a keyboard trap keeps `Tab` and `Shift+Tab` cycles strictly inside the assistant modal, preventing focus from escaping to obscured background links.
- **Escape Key Restoration:** Pressing `Escape` closes the chat dialog and immediately returns focus to the floating launcher button.
- **Polite Live Announcements:** An invisible `aria-live="polite"` region communicates state changes ("ITSC AI assistant opened", "Question sent...", "ITSC AI replied", "Connectivity issue...").

### E. Rich In-Chat Conversion Actions (`INT-AI-04`)
- **Course Recommendation Cards:** Enhanced in-chat course cards now feature two direct one-click actions:
  - **"Inquire":** Pre-fills the contact form with the specific course title (`/contact?subject=Inquiry regarding [Course Title]`).
  - **"View details":** Direct deep-link to the program page (`/training-programs/[slug]`).

### F. Admin Back-Office Protection
- The public `ChatWidget` now automatically detects `/admin` routes and unmounts, ensuring administrative workflows, multi-field course editors, and tables remain completely unobscured.

---

## 3. Phase 1 Traceability Matrix

| Phase 1 Issue ID | Priority | Resolution Summary | Target File(s) |
|---|---|---|---|
| **INT-AI-01** | P1 | Mobile bottom sheet with grab handle, real-time drag tracking & swipe-to-dismiss | `chat-widget.tsx`, `globals.css` |
| **INT-AI-02** | P2 | Route-sensing context awareness with dynamic starter prompts & page badge | `chat-widget.tsx` |
| **INT-AI-03** | P2 | `requestAnimationFrame` throttled auto-scroll, scroll-up protection & jump pill | `chat-widget.tsx` |
| **INT-A11Y-01** | P0 | Tab focus trapping and Escape focus restoration on chat dialog | `chat-widget.tsx` |
| **INT-A11Y-02** | P0 | Dedicated `aria-live="polite"` live announcements for screen readers | `chat-widget.tsx` |

---

## 4. Verification Results

| Check / Command | Scope | Result |
|---|---|---|
| `npm run typecheck` | `@itsc/api`, `@itsc/shared` | **PASSED (Exit Code 0)** |
| `npm --workspace=web exec -- tsc --noEmit` | `@itsc/web` strict TypeScript | **PASSED (Exit Code 0)** |
| `npm run lint` | Monorepo ESLint check | **PASSED (Exit Code 0)** |
| `npm --workspace=web run build` | Next.js 15 production compile (19 routes) | **PASSED (Exit Code 0)** |

---

## 5. Next Steps — Phase 5: Administrative Experience & Micro-Polish

With Phase 4 complete, the project advances to **Phase 5 — Administrative Experience & Micro-Polish**:
1. **`ISSUE-ADM-04` (Course Form Multi-Step Tabs):** Segment the 15+ field training program creation/edit modal into clean, digestible tabs (Basic Info, Curriculum & Modules, Schedule & Pricing, SEO & Publishing).
2. **`ISSUE-ADM-05` (PDF Upload Dropzone Feedback):** Add instant file validation, size indicator, and preview state before submitting syllabus PDFs.
3. **`ISSUE-ADM-07` (Pre-filled Mailto Action):** Add 1-click email response button in the inquiries management drawer.
4. **`ISSUE-ADM-02` (Dashboard Metric Trend Indicators):** Add weekly activity indicators and status badges to admin overview cards.
5. **`ISSUE-ADM-01` (Caps Lock Warning on Login):** Display subtle warning when Caps Lock is active on the admin login password field.
