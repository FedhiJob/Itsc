# ITSC Platform — UI Redesign Specification

> **Date:** 2026-07-26  
> **Status:** Design Blueprint — v1.0  
> **Sources:** Legacy ITSC website (brand authority) + Current Next.js project (architecture authority)  
> **Objective:** Brand evolution — preserve ITSC identity while modernizing UX

---

## 1. Redesign Vision

### The Finished Product Should Feel Like

| Quality | Rationale |
|---------|-----------|
| **Professional** | ITSC is a training and certification center for enterprises and government institutions. The design must convey competence and reliability. |
| **Trustworthy** | The legacy site builds trust through partner logos, client logos, and certification vendor affiliations. The redesign must preserve and amplify these trust signals. |
| **Warm and welcoming** | The legacy gold (#febd01) creates warmth. The redesign should feel approachable to individual learners, not just corporate clients. |
| **Authoritative** | As a Pearson VUE Authorized Test Center with 14 international vendor partnerships, the design must communicate institutional authority. |
| **Certification-focused** | The legacy site's primary value proposition is certification training. The redesign should make certification paths easy to discover. |
| **Modern without flashiness** | The redesign should use modern design principles (clean spacing, responsive layouts, accessible components) without introducing trendy elements that would undermine the institutional brand. |
| **Globally minded** | International partners, English-language content, and enterprise clients position ITSC as an internationally connected institution. |
| **Content-rich but scannable** | The legacy site is content-dense (11 homepage sections). The redesign should improve scannability without losing information depth. |

### Design Personality Keywords

```
Warm · Authoritative · Certified · Institutional · Welcoming · Professional · Clear · Trustworthy
```

### What the Redesign Is NOT

- Not a rebranding
- Not a startup-style flashy design
- Not a minimalist reduction that loses information
- Not a departure from the gold brand color
- Not a move away from certification/vendor focus

---

## 2. Brand Preservation Principles

### 2.1 Gold (#febd01) as Primary Brand Color

**Why it matters:** Gold is the single most recognizable brand element of ITSC. It appears in the hero overlay, the page loader, and throughout the visual identity. The current Next.js project uses blue (#123a6f) as primary, which has zero connection to the legacy brand. Restoring gold as the primary or secondary color is the most critical brand preservation action.

**How to preserve:** Gold must be a prominent color in the design — either as the primary button color, the hero accent, or a key interactive color. It should not be relegated to a minor accent.

### 2.2 Logo

**Why it matters:** The existing logo (wide horizontal format, 3170×1214) carries all brand equity from the legacy site. A new logo would require rebuilding brand recognition.

**How to preserve:** Use the existing logo in the header and footer. The logo should link to the homepage. The favicon should remain the same.

### 2.3 Tagline: "Imparting Knowledge Skills and Attitudes"

**Why it matters:** This tagline appears in the page title and is core to ITSC's mission statement. It differentiates ITSC from purely commercial training centers.

**How to preserve:** Display the tagline prominently on the homepage (hero or mission section) and in the site metadata.

### 2.4 Vendor-Based Course Organization

**Why it matters:** The legacy site organizes courses by certification vendor (Microsoft, Cisco, CompTIA, EC Council, etc.). This is how ITSC's target audience thinks about training — they want a specific certification from a specific vendor. Organizing by skill domain instead would confuse returning visitors.

**How to preserve:** The training programs page should support filtering/browsing by vendor. The navigation should include vendor categories.

### 2.5 Service Categories

**Why it matters:** Training, Consulting, Networking, Certification, and Industrial Automation are ITSC's core service lines. These appear in the legacy navigation and services section.

**How to preserve:** These five service categories should be prominently displayed on the homepage and in the services/corporate training pages.

### 2.6 Trust-Building Elements

**Why it matters:** The legacy site builds trust through:
- International partner logos (LPI, Cisco, Microsoft, CompTIA, EC Council, Pearson VUE, etc.)
- Client logos (banks, government ministries, UNDP, Coca-Cola)
- Stats (100+ Courses, 150+ Clients, 30+ Trainers)

These are critical conversion elements for an educational institution.

**How to preserve:** Partner logos, client logos, and stats must be present on the homepage. They should be more visually prominent than in the legacy site, not less.

### 2.7 Contact Information Prominence

**Why it matters:** The legacy site displays phone, email, and location in a persistent top bar. For a training center, contact accessibility is a conversion driver.

**How to preserve:** Contact information (phone, email, address) should be easily accessible from every page — either in the header, footer, or both.

### 2.8 Educational and Corporate Tone

**Why it matters:** ITSC serves both individual students and enterprise clients. The tone must balance educational encouragement with corporate professionalism.

**How to preserve:** Copy should use phrases like "professional technology training," "certification programs," "corporate capacity building." Avoid overly casual or startup-style language.

### 2.9 Mission and Vision Statement

**Why it matters:** The legacy mission — "provide ICT training with a strong practical focus... contribute to internationally accredited ICT professionals" — communicates ITSC's educational philosophy.

**How to preserve:** The mission and vision should be present on the About page and potentially as a homepage section.

### 2.10 Social Media Presence

**Why it matters:** Facebook, Twitter (@techItsc), LinkedIn, and YouTube are established channels with existing followers.

**How to preserve:** Social media icons should be in the footer and potentially the header.

---

## 3. Modernization Principles

### 3.1 Cleaner Layouts

**Current problem:** The legacy site uses Bootstrap 4 with inconsistent containers, inline styles, and no unified max-width. Sections have varying padding and alignment.

**Target:** Every section uses the existing `Container` component (`max-w-7xl mx-auto`). Consistent horizontal padding. No inline styles.

### 3.2 Better Spacing and Rhythm

**Current problem:** The legacy site has inconsistent spacing between elements. The current Next.js project has inconsistent `mt-*` values across pages.

**Target:** Define a vertical rhythm system. Consistent spacing between headings and body text. Consistent section padding (`py-16 sm:py-20` is already correct — preserve this).

### 3.3 Improved Visual Hierarchy

**Current problem:** The legacy site has flat hierarchy — all sections compete equally. The current Next.js project has inconsistent heading sizes.

**Target:** Clear visual hierarchy:
- Hero: dominant headline
- Section headings: consistent `text-3xl font-bold`
- Card headings: consistent `text-xl font-semibold`
- Body: consistent `text-base` or `text-sm`

### 3.4 Responsive Navigation

**Current problem:** The legacy site's mega-menu is unusable on mobile. The current Next.js project's hamburger button does nothing.

**Target:** A responsive navigation that works on all screen sizes. Desktop: horizontal nav with dropdowns for vendor categories. Mobile: slide-out sheet with collapsible categories.

### 3.5 Improved Readability

**Current problem:** The legacy site uses justified text alignment globally, which creates uneven word spacing. The current Next.js project uses left-aligned text, which is correct.

**Target:** Left-aligned text throughout. Adequate line-height (`leading-7` for body, `leading-relaxed` for longer content). Max-width on text blocks for comfortable reading.

### 3.6 Better Calls-to-Action

**Current problem:** The legacy hero has headlines but no buttons. Users must navigate menus to find courses.

**Target:** Every page should have clear, contextual CTAs. The hero should have primary CTAs ("Explore Programs," "View Schedule"). Section CTAs should guide users to the next logical action.

### 3.7 Faster Visual Scanning

**Current problem:** The legacy site's 11-section homepage requires significant scrolling and reading.

**Target:** Use visual anchors (icons, badges, stats, color blocks) to help users quickly find what they need. Card-based layouts with clear labels.

### 3.8 Better Interactions

**Current problem:** The current Next.js project has virtually no interactions — no hover effects, no transitions, no feedback.

**Target:** Subtle, purposeful interactions:
- Card hover: subtle shadow elevation
- Button hover: smooth color transition
- Link hover: underline or color change
- Focus: visible focus rings on all interactive elements

### 3.9 Accessibility Foundation

**Current problem:** The legacy site has no accessibility features. The current Next.js project has partial implementation.

**Target:** WCAG 2.1 AA compliance:
- Skip-to-content link
- Proper heading hierarchy
- ARIA labels on interactive elements
- Focus management
- Color contrast (already passing)
- Keyboard navigation
- Reduced motion support

### 3.10 What NOT to Modernize

- Do not remove the gold color
- Do not replace the logo
- Do not remove vendor-based course organization
- Do not remove partner/client logos
- Do not remove stats counter
- Do not switch to an all-minimalist design
- Do not use trendy design elements (glassmorphism, neumorphism, extreme gradients)

---

## 4. Design System

### 4.1 Color Palette

#### Primary Colors

| Token | Hex | Usage | Legacy Source |
|-------|-----|-------|---------------|
| `--color-brand-gold` | `#febd01` | Primary buttons, accent elements, hero accents, interactive states | Legacy gold overlay + loader color |
| `--color-brand-gold-600` | `#e5a800` | Hover state for gold elements | Darkened variant |
| `--color-brand-gold-700` | `#cc9400` | Active/pressed state | Darkened variant |
| `--color-brand-gold-50` | `#fffbe6` | Subtle gold backgrounds, badges | Lightened variant |

#### Neutral Colors

| Token | Hex | Usage | Legacy Source |
|-------|-----|-------|---------------|
| `--color-white` | `#ffffff` | Page backgrounds, card backgrounds | Legacy white |
| `--color-gray-50` | `#f8fafc` | Section alternating backgrounds | Current project background |
| `--color-gray-100` | `#f1f5f9` | Muted backgrounds, hover states | Near current muted |
| `--color-gray-200` | `#e2e8f0` | Borders, dividers | Near current border |
| `--color-gray-500` | `#64748b` | Muted text, metadata | Near current muted-foreground |
| `--color-gray-700` | `#334155` | Secondary text | — |
| `--color-gray-900` | `#0f172a` | Primary text (headings, body) | Near current foreground |

#### Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-success` | `#0f9f6e` | Success messages, status indicators |
| `--color-warning` | `#d97706` | Warning messages |
| `--color-error` | `#dc2626` | Error messages, destructive actions |
| `--color-info` | `#2563eb` | Informational messages |

#### Color Application Rules

1. **Gold (#febd01)** is the primary brand color. Use for: primary buttons, key interactive elements, hero accents, active navigation indicators, badge backgrounds, stat number colors.
2. **Gray-900** is the primary text color. Use for: headings, body text, navigation links.
3. **Gray-500** is the secondary text color. Use for: metadata, captions, muted information.
4. **Gray-100** is the muted background. Use for: alternating section backgrounds, hover states.
5. **White** is the default background. Use for: page backgrounds, card backgrounds.
6. **Gray-200** is the border color. Use for: card borders, dividers, input borders.
7. **Do not use blue (#123a6f) or indigo (#3f3cbb)** as primary colors. These have no connection to the ITSC brand.

### 4.2 Typography

#### Font Family

| Role | Font | Fallback | Source |
|------|------|----------|--------|
| **Headings** | Merriweather (serif) | Georgia, serif | Legacy brand — preserves authoritative, educational tone |
| **Body** | Geist Sans (sans-serif) | system-ui, sans-serif | Current project — modern, clean, readable |
| **Monospace** | Geist Mono | monospace | Current project — code snippets |

#### Type Scale

| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `--text-hero` | `text-4xl sm:text-5xl lg:text-6xl` | `font-bold` | `leading-tight` | Homepage hero headline |
| `--text-display` | `text-3xl sm:text-4xl` | `font-bold` | `leading-tight` | Page titles (h1) |
| `--text-section` | `text-2xl sm:text-3xl` | `font-bold` | `leading-snug` | Section headings (h2) |
| `--text-card` | `text-xl` | `font-semibold` | `leading-snug` | Card titles (h3) |
| `--text-body` | `text-base` | `font-normal` | `leading-7` | Body text |
| `--text-body-sm` | `text-sm` | `font-normal` | `leading-6` | Secondary body text |
| `--text-meta` | `text-xs` | `font-medium` | `leading-5` | Metadata, dates, badges |
| `--text-eyebrow` | `text-xs sm:text-sm` | `font-semibold` | `tracking-wide uppercase` | Section eyebrow labels |

#### Typography Rules

1. **Headings use Merriweather (serif).** This is a direct preservation of the legacy brand's authoritative, educational tone.
2. **Body text uses Geist Sans (sans-serif).** This maintains the modern, clean readability of the current project.
3. **Do not use justified text alignment.** Left-align all text for readability.
4. **Maximum line length:** Constrain body text to `max-w-prose` (65 characters) or `max-w-2xl` for comfortable reading.
5. **Heading hierarchy:** Every page must have exactly one h1. Section headings use h2. Card titles use h3. Never skip heading levels.

### 4.3 Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | `0.375rem` (6px) | Inputs, small UI elements |
| `--radius-md` | `0.5rem` (8px) | Cards, buttons, containers |
| `--radius-lg` | `0.75rem` (12px) | Modals, large containers |
| `--radius-full` | `9999px` | Badges, pills, avatars |

### 4.4 Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px 0 rgb(0 0 0 / 0.05)` | Card default state |
| `--shadow-md` | `0 4px 6px -1px rgb(0 0 0 / 0.1)` | Card hover state, dropdowns |
| `--shadow-lg` | `0 10px 15px -3px rgb(0 0 0 / 0.1)` | Modals, sheets |
| `--shadow-gold` | `0 0 0 2px #febd01` | Focus ring for gold elements |

### 4.5 Spacing Scale

Use Tailwind's default spacing scale consistently:

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | `0.25rem` | Tight spacing between small elements |
| `space-2` | `0.5rem` | Gap between icon and text |
| `space-3` | `0.75rem` | Tight card padding |
| `space-4` | `1rem` | Default gap, form field spacing |
| `space-6` | `1.5rem` | Card padding, grid gaps |
| `space-8` | `2rem` | Section heading to content spacing |
| `space-10` | `2.5rem` | Large spacing between sections |
| `space-12` | `3rem` | Hero heading to description spacing |
| `space-16` | `4rem` | Section padding (vertical) |
| `space-20` | `5rem` | Large section padding (desktop) |

### 4.6 Containers

| Token | Value | Usage |
|-------|-------|-------|
| `--container-max` | `max-w-7xl` | Default page content width |
| `--container-narrow` | `max-w-3xl` | Text-heavy content (about, contact) |
| `--container-prose` | `max-w-prose` | Article body text |

### 4.7 Grid System

Use CSS Grid (Tailwind grid utilities) consistently:

| Pattern | Class | Usage |
|---------|-------|-------|
| 2 columns | `grid grid-cols-1 md:grid-cols-2` | Feature pairs, text+image |
| 3 columns | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` | Card grids |
| 4 columns | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` | Stats, icon grids |
| Auto-fill | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4` | Partner/client logo grids |

### 4.8 Icon Style

- Use **Lucide React** icons (already in the project)
- Icons should be `h-4 w-4` for inline, `h-5 w-5` for standard, `h-6 w-6` for feature cards
- Icons in feature cards should use `text-brand-gold` as the default color
- Icons in contact info should use `text-brand-gold`
- Icons in navigation should use `text-gray-500`

### 4.9 Elevation

| Level | Element | Shadow |
|-------|---------|--------|
| 0 | Page background | None |
| 1 | Cards (default) | `shadow-sm` |
| 2 | Cards (hover) | `shadow-md` |
| 3 | Dropdown menus | `shadow-lg` |
| 4 | Modals, sheets | `shadow-lg` + overlay |
| 5 | Toast notifications | `shadow-lg` + elevated z-index |

### 4.10 Motion Principles

1. **Purposeful only** — Every animation must serve a purpose (feedback, orientation, delight). No decorative animations.
2. **Subtle** — Use `transition-colors`, `transition-shadow`, `transition-transform` with `duration-200`.
3. **Reduced motion** — Wrap all animations in `@media (prefers-reduced-motion: no-preference)`.
4. **No page loader** — The legacy LoftLoader should NOT be replicated. Content should appear immediately.
5. **Staggered card entrance** — Optional: cards can fade in with a `stagger` delay on scroll into view.
6. **Hover states** — Cards: `hover:shadow-md transition-shadow duration-200`. Buttons: `hover:opacity-90 transition-opacity`. Links: `hover:text-brand-gold transition-colors`.

---

## 5. Component Standards

### 5.1 Navbar

**Current State:** Sticky header with logo, nav links, non-functional hamburger, "Ask ITSC" button linking to contact page.

**Target State:**
- Sticky header with white/95 backdrop-blur background
- Logo on the left (use the actual ITSC logo image, not the "IT" text placeholder)
- Desktop: horizontal nav links with dropdown for "Certifications & Courses" (vendor list)
- Mobile: slide-out sheet (shadcn Sheet component) with collapsible vendor categories
- Contact info (phone) displayed in header
- "Ask ITSC" button (gold primary) — links to AI assistant when implemented, otherwise to contact
- Search icon that opens a search overlay

**Reason for redesign:** The current header uses a text placeholder instead of the real logo. The hamburger is non-functional. The vendor mega-menu is essential for the brand but must be usable on mobile.

**Implementation notes:**
- Use the existing `SiteHeader` component as a base
- Replace the "IT" text logo with the actual ITSC logo image
- Implement mobile sheet using shadcn `Sheet` component
- Vendor categories should be a collapsible accordion in mobile
- Add phone number display
- Make "Ask ITSC" button gold (`bg-brand-gold text-gray-900 hover:bg-brand-gold-600`)

### 5.2 Footer

**Current State:** 3-column footer with dark background, white text, navigation links, contact info, social icons.

**Target State:**
- 4-column layout: Logo + description | Quick Links | Contact Info | Subscribe
- Logo at the top of the first column
- Contact info with gold icons
- Social media icons (Facebook, Twitter, LinkedIn, YouTube)
- Subscribe form (email input + submit button)
- Copyright bar at bottom
- Dark background (gray-900) with white/gray text

**Reason for redesign:** The current footer is well-structured but missing the subscribe form and social media links from the legacy site.

**Implementation notes:**
- Use the existing `SiteFooter` component as a base
- Add social media icons (Lucide: Facebook, Twitter, Linkedin, Youtube)
- Add subscribe form (email input + gold button)
- Preserve the dark background with white text pattern
- Add the tagline "Imparting Knowledge Skills and Attitudes" near the logo

### 5.3 Hero

**Current State:** Homepage has a two-column layout with headline + feature cards. Other pages have a text-only hero with eyebrow + h1 + description.

**Target State:**
- **Homepage hero:** Full-width with gold accent. Background image (optional) with gold overlay (preserving the legacy pattern). Headline in serif (Merriweather). Subtitle in sans-serif. Two CTAs: "Explore Programs" (gold primary) and "View Schedule" (outline).
- **Interior page hero:** Consistent pattern: gold eyebrow text → serif h1 → sans-serif description. Optional: subtle gold left border accent on the hero container.

**Reason for redesign:** The legacy gold overlay on hero images is a signature brand element. The current hero lacks this warmth. Interior pages need a consistent hero pattern.

**Implementation notes:**
- Create a reusable `PageHero` component for interior pages
- Homepage hero can be custom with optional background image
- Gold accent: `border-l-4 border-brand-gold pl-6` on the hero text container
- Eyebrow text: `text-xs sm:text-sm font-semibold tracking-wide uppercase text-brand-gold`
- Headings in serif: `font-serif font-bold` (Merriweather)

### 5.4 Buttons

**Current State:** CVA-based Button component with 4 variants (primary, secondary, outline, ghost) and 3 sizes. Primary uses blue (#123a6f).

**Target State:**
- **Primary:** Gold background (`bg-brand-gold`), dark text (`text-gray-900`), hover darkens (`hover:bg-brand-gold-600`). Focus ring: gold.
- **Secondary:** Dark background (`bg-gray-900`), white text, hover slightly lighter.
- **Outline:** Border only, transparent background, text color inherits. Hover: fills with gold.
- **Ghost:** No background, text only. Hover: subtle gray background.
- **Sizes:** `sm` (h-9 px-4), `default` (h-11 px-5), `lg` (h-12 px-6)

**Reason for redesign:** The current blue primary button has no connection to the ITSC brand. Gold buttons with dark text are more distinctive and brand-aligned.

**Implementation notes:**
- Modify the existing `buttonVariants` in `button.tsx`
- Primary variant: `bg-brand-gold text-gray-900 hover:bg-brand-gold-600 focus-visible:outline-brand-gold`
- All buttons should use `transition-colors duration-200`
- Icons in buttons: `h-4 w-4`, placed after text for "forward" actions, before text for "back" actions

### 5.5 Cards

**Current State:** Multiple inline card patterns across pages with inconsistent padding, shadows, and hover states.

**Target State:**
- Create a reusable `Card` component with sub-components: `Card`, `CardHeader`, `CardBody`, `CardFooter`
- Default: white background, `rounded-lg`, `border border-gray-200`, `shadow-sm`, `p-6`
- Hover: `hover:shadow-md transition-shadow duration-200`
- Optional: gold top border accent (`border-t-4 border-t-brand-gold`) for featured/highlighted cards
- Card title: `text-xl font-semibold font-serif` (Merriweather)
- Card body: `text-sm text-gray-500 leading-6`

**Reason for redesign:** Cards are the most repeated pattern in the application. A standardized Card component will eliminate duplication and ensure consistency.

**Implementation notes:**
- Follow shadcn/ui Card conventions
- Use `cn()` utility for className merging
- Card variants: `default`, `featured` (with gold top border), `interactive` (with hover shadow)

### 5.6 Forms

**Current State:** Contact page uses raw HTML inputs with no React Hook Form integration, no validation, no API wiring.

**Target State:**
- Reusable form components: `FormField`, `Input`, `Textarea`, `Select`, `Label`, `FormError`
- Wrapping React Hook Form + Zod validation
- Gold focus ring on all form elements
- Clear error states with red text and border
- Submit button: gold primary, full-width on mobile
- Success state: green success message after submission

**Reason for redesign:** The current contact form is non-functional. Forms are critical for lead generation.

**Implementation notes:**
- Use shadcn/ui form conventions (React Hook Form + Zod)
- Input focus: `focus:border-brand-gold focus:ring-1 focus:ring-brand-gold`
- Error state: `border-red-500 focus:border-red-500 focus:ring-red-500`
- Label: `text-sm font-medium text-gray-700`

### 5.7 Gallery

**Current State:** Placeholder gradient backgrounds with alt text displayed as text. No actual images.

**Target State:**
- Album grid with cover images
- Click album → opens album detail with image grid
- Lightbox for full-size image viewing
- Image captions and alt text displayed
- Responsive grid: 1 col mobile, 2 col tablet, 3 col desktop

**Reason for redesign:** The current gallery is unusable. A proper gallery is essential for showcasing training facilities and events.

**Implementation notes:**
- Use Next.js `Image` component for optimization
- Lightbox: shadcn `Dialog` with image
- Grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`

### 5.8 News Cards

**Current State:** Inline article pattern with hardcoded data. Category badge, date, title, summary, "Read More" link.

**Target State:**
- Reusable `NewsCard` component
- Category badge: gold background (`bg-brand-gold/10 text-brand-gold-600`)
- Date: gray-500 with calendar icon
- Title: serif (`font-serif font-semibold`)
- Summary: gray-500 text
- "Read More" link: gold color with arrow icon
- Hover: card shadow elevation

**Reason for redesign:** News cards appear on the news listing page and potentially on the homepage. A standardized component ensures consistency.

**Implementation notes:**
- Extract from the current inline pattern in `news/page.tsx`
- Badge: `inline-flex items-center rounded-md bg-brand-gold/10 px-2 py-1 text-xs font-medium text-brand-gold-600`

### 5.9 Training Cards

**Current State:** Inline article pattern with category badge, title, description, duration, delivery mode, level, and "View Details" button.

**Target State:**
- Reusable `TrainingCard` component
- Category badge: gold
- Level badge: gray background
- Duration and delivery mode: icons + text in gray-500
- Title: serif
- "View Details" button: outline style
- Hover: card shadow elevation

**Reason for redesign:** Training cards are the core product display. Consistency here is critical for the training programs page.

**Implementation notes:**
- Extract from the current inline pattern in `training-programs/page.tsx`
- Metadata row: `flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500`

### 5.10 Statistics

**Current State:** Not present in the current Next.js project. Legacy site has 3 stats (100+ Courses, 150+ Clients, 30+ Trainers).

**Target State:**
- Reusable `StatsSection` component
- 3 or 4 stat items in a row
- Large number in gold (`text-4xl font-bold text-brand-gold`)
- Label below in gray-700
- Responsive: 2 col mobile, 4 col desktop
- Optional: subtle background section

**Reason for redesign:** Stats are a key trust-building element from the legacy site that must be restored.

**Implementation notes:**
- Grid: `grid grid-cols-2 md:grid-cols-4 gap-8`
- Number: `text-4xl font-bold text-brand-gold`
- Label: `text-sm font-medium text-gray-700`
- Section background: `bg-gray-50`

### 5.11 Partner/Client Logos

**Current State:** Not present in the current Next.js project. Legacy site has partner and client logo grids/carousels.

**Target State:**
- Reusable `LogoGrid` component
- Responsive grid of partner/client logos
- Logos should be grayscale by default, full color on hover
- No carousel — use a static grid for better accessibility and SEO
- Section heading: "Our International Partners" / "Trusted By"

**Reason for redesign:** Partner and client logos are critical trust signals that must be restored from the legacy site.

**Implementation notes:**
- Grid: `grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 items-center`
- Logo images: `grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100`
- Use Next.js `Image` component

### 5.12 Contact Section

**Current State:** Contact page has contact info (email, phone, address) with broken HTML and a non-functional form.

**Target State:**
- Reusable `ContactInfo` component (icon + label + value)
- Contact info with gold icons
- Functional form with React Hook Form + Zod validation
- Success message after submission
- Responsive: stacked on mobile, side-by-side on desktop

**Reason for redesign:** The current contact page is broken and non-functional. This is a critical business conversion point.

**Implementation notes:**
- Fix the broken HTML structure
- Contact info items: `flex items-start gap-4`
- Icon container: `flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand-gold/10`
- Icon: `h-5 w-5 text-brand-gold`

### 5.13 AI Assistant

**Current State:** "Ask ITSC" button exists in the header but links to contact page. No AI functionality implemented.

**Target State:**
- Chat bubble icon in the bottom-right corner
- Click opens a chat dialog (shadcn Dialog or Sheet)
- Chat interface with message history and input field
- Powered by OpenAI (backend already prepared)
- Gold accent on the chat bubble and send button
- Typing indicator while waiting for response

**Reason for redesign:** The AI assistant is a key differentiator mentioned in the architecture. The current button is misleading.

**Implementation notes:**
- Chat bubble: fixed position bottom-right, gold background
- Dialog: shadcn `Dialog` or `Sheet` from the right
- Messages: user messages right-aligned, AI messages left-aligned with gold accent border
- Input: text input with gold focus ring + send button

### 5.14 Admin Components

**Current State:** Admin portal does not exist yet.

**Target State:**
- Admin layout with sidebar navigation
- Sidebar: dark background (gray-900), white text, gold active indicators
- Data tables with sorting, filtering, pagination
- Form pages for CRUD operations
- Dashboard with stats cards
- Gold accent on primary actions

**Reason for redesign:** The admin portal needs to be built from scratch. It should feel like part of the same brand.

**Implementation notes:**
- Use shadcn `Table`, `Dialog`, `Form` components
- Sidebar: `w-64 bg-gray-900 text-white`
- Active nav item: `bg-brand-gold/10 text-brand-gold border-l-4 border-brand-gold`
- Data tables: shadcn Table with pagination

---

## 6. Page Specifications

### 6.1 Homepage

**Purpose:** First impression. Communicate ITSC's value proposition, build trust, guide users to key actions.

**Target Layout (top to bottom):**
1. **Hero** — Full-width with optional background image + gold overlay. Headline: serif. Subtitle: sans-serif. Two CTAs: "Explore Programs" (gold) and "View Schedule" (outline).
2. **Stats Bar** — 3-4 stats (100+ Courses, 150+ Clients, 30+ Trainers, 14+ Partners). Gold numbers.
3. **Services Overview** — 4-5 service cards (Training, Consulting, Networking, Certification, Industrial Automation). Gold icons. Brief descriptions. Links to service pages.
4. **Featured Programs** — 3 featured training program cards. Gold category badges. "View All Programs" link.
5. **Partner Logos** — "Our International Partners" heading. Logo grid (grayscale, color on hover).
6. **Mission & Vision** — Brief mission/vision statement. Gold left border accent.
7. **Client Logos** — "Trusted By" heading. Client logo grid.
8. **CTA Section** — "Ready to get started?" heading. Two buttons: "Contact Us" (gold) and "View Programs" (outline).
9. **Footer** — 4-column footer with logo, links, contact, subscribe.

**Information hierarchy:**
1. Value proposition (hero)
2. Social proof (stats)
3. What we offer (services)
4. Product highlights (featured programs)
5. Credibility (partners)
6. Who we are (mission)
7. Social proof (clients)
8. Call to action

**Interaction improvements:**
- Hero: smooth scroll to services section on CTA click
- Cards: hover elevation
- Partner logos: grayscale to color on hover
- Stats: subtle count-up animation on scroll into view (optional)

**Responsive behavior:**
- All grids collapse to single column on mobile
- Hero text centered on mobile
- Stats: 2 columns on mobile
- Partner logos: 3 columns on mobile

**Accessibility expectations:**
- Skip-to-content link
- Proper heading hierarchy (h1 → h2 → h3)
- Alt text on all images
- ARIA labels on CTAs
- Keyboard navigable card grid

### 6.2 About Page

**Purpose:** Tell ITSC's story, mission, vision, and values. Build emotional connection.

**Target Layout:**
1. **Page Hero** — Gold eyebrow "About ITSC" → serif h1 → sans-serif description
2. **Mission & Vision** — Two cards side by side. Gold top border accent. Mission text + Vision text.
3. **Values/Approach** — 3-4 value cards with icons. Gold icons. Serif titles.
4. **Stats** — Same stats bar as homepage (reuse component)
5. **Partner Logos** — Reuse partner logo grid
6. **CTA Section** — "Ready to get started?" with two buttons

**Information hierarchy:**
1. Page introduction
2. Mission and vision (core identity)
3. Values and approach (what we believe)
4. Social proof (stats, partners)
5. Call to action

**Interaction improvements:**
- Cards: hover elevation
- Partner logos: grayscale to color

**Responsive behavior:**
- Mission/Vision: stacked on mobile, side by side on desktop
- Values: 1 col mobile, 2 col tablet, 3 col desktop

**Accessibility expectations:**
- Proper heading hierarchy
- Alt text on images
- Keyboard navigable

### 6.3 Training Programs Page

**Purpose:** Help users discover and choose training programs. This is the core product page.

**Target Layout:**
1. **Page Hero** — Gold eyebrow "Programs" → serif h1 → description
2. **Category Filter** — Horizontal category pills/tabs. Gold active state. Includes "All" option. Vendor-based categories (LPI, Cisco, CompTIA, etc.).
3. **Program Grid** — Training program cards in responsive grid. Filtered by selected category.
4. **Pagination** — Page numbers or "Load More" button.
5. **CTA Section** — "Need help choosing?" with contact CTA.

**Information hierarchy:**
1. Page introduction
2. Category filter (vendor-based)
3. Program cards (title, category, duration, level, delivery mode)
4. Pagination
5. Call to action

**Interaction improvements:**
- Category filter: smooth transition when switching categories
- Cards: hover elevation
- "View Details" links to program detail page

**Responsive behavior:**
- Category filter: horizontal scroll on mobile (overflow-x-auto)
- Program grid: 1 col mobile, 2 col tablet, 3 col desktop

**Accessibility expectations:**
- Category filter: ARIA role="tablist" with role="tab"
- Program cards: keyboard navigable
- Proper heading hierarchy

### 6.4 Corporate Training Page

**Purpose:** Convince organizations to choose ITSC for corporate training. B2B-focused.

**Target Layout:**
1. **Page Hero** — Gold eyebrow "Corporate" → serif h1 → description → "Request a Consultation" CTA (gold)
2. **Benefits** — 4 benefit cards with icons. Gold icons. "Why Choose ITSC Corporate Training?"
3. **Program Areas** — 4 corporate program cards with detail lists. Gold accent.
4. **Client Logos** — "Trusted By" heading. Client logo grid (government ministries, banks, UNDP, etc.)
5. **CTA Section** — "Ready to transform your team?" with two buttons

**Information hierarchy:**
1. Page introduction + primary CTA
2. Benefits (why choose us)
3. Program areas (what we offer)
4. Social proof (client logos)
5. Call to action

**Interaction improvements:**
- "Request a Consultation" button: gold primary
- Cards: hover elevation
- Client logos: grayscale to color

**Responsive behavior:**
- Benefits: 1 col mobile, 2 col desktop
- Program areas: 1 col mobile, 2 col desktop

**Accessibility expectations:**
- Proper heading hierarchy
- Alt text on client logos
- Keyboard navigable

### 6.5 News Page

**Purpose:** Share updates, announcements, and articles. Build community and SEO.

**Target Layout:**
1. **Page Hero** — Gold eyebrow "Updates" → serif h1 → description
2. **News Grid** — News article cards in a single column (for readability) or 2-column grid
3. **Pagination** — Page numbers or "Load More"
4. **Sidebar (optional)** — Categories, recent posts, archive

**Information hierarchy:**
1. Page introduction
2. Article cards (category badge, date, title, summary, "Read More")
3. Pagination

**Interaction improvements:**
- Cards: hover elevation
- "Read More": gold link with arrow

**Responsive behavior:**
- Single column on all sizes (for readability) or 2 columns on desktop
- Article cards full-width

**Accessibility expectations:**
- Article cards: `<article>` with proper heading
- "Read More" links: descriptive aria-label
- Date: proper `<time>` element

### 6.6 Gallery Page

**Purpose:** Showcase training facilities, events, and activities through images.

**Target Layout:**
1. **Page Hero** — Gold eyebrow "Gallery" → serif h1 → description
2. **Album Grid** — Album cards with cover image, title, image count
3. **Album Detail** (when clicked) — Image grid with lightbox

**Information hierarchy:**
1. Page introduction
2. Album list
3. Image grid within album

**Interaction improvements:**
- Album cards: hover elevation
- Images: click to open lightbox
- Lightbox: keyboard navigable (arrow keys, Escape to close)

**Responsive behavior:**
- Album grid: 1 col mobile, 2 col tablet, 3 col desktop
- Image grid: 2 col mobile, 3 col tablet, 4 col desktop
- Lightbox: full-screen on all sizes

**Accessibility expectations:**
- All images: descriptive alt text
- Lightbox: focus trap, Escape to close
- Keyboard navigation for image grid

### 6.7 Contact Page

**Purpose:** Generate leads. Make it easy for potential students and clients to reach ITSC.

**Target Layout:**
1. **Page Hero** — Gold eyebrow "Contact" → serif h1 → description
2. **Two-column layout:**
   - **Left:** Contact info (email, phone, address) with gold icons. Social media links.
   - **Right:** Contact form (name, email, phone, organization, subject dropdown, message, submit)
3. **Map (optional)** — Embedded Google Map showing location (Bole Road, Mega Building, 902)

**Information hierarchy:**
1. Page introduction
2. Contact info + form (equal priority)
3. Map (supplementary)

**Interaction improvements:**
- Form: real-time validation with clear error messages
- Submit: loading state, success state, error state
- Phone: click-to-call link
- Email: mailto link

**Responsive behavior:**
- Contact info and form: stacked on mobile, side by side on desktop
- Form fields: full-width on mobile, 2-column grid for name/email on desktop

**Accessibility expectations:**
- All form fields: proper labels with `htmlFor`/`id`
- Error messages: associated with inputs via `aria-describedby`
- Submit button: loading state with `aria-busy`

### 6.8 AI Assistant Page/Component

**Purpose:** Provide instant answers to common questions. Reduce friction in the discovery process.

**Target Layout:**
- Chat bubble button (fixed bottom-right, gold background)
- Chat dialog (shadcn Dialog or Sheet from right)
- Chat interface: message history, input field, send button
- Suggested questions to help users get started

**Information hierarchy:**
1. Chat history (scrollable)
2. Input area (fixed at bottom)
3. Suggested questions (optional, above input)

**Interaction improvements:**
- Typing indicator while AI responds
- Smooth scroll to new messages
- Send on Enter key
- Loading state while waiting for response

**Responsive behavior:**
- Chat dialog: full-screen on mobile, side panel on desktop

**Accessibility expectations:**
- Chat bubble: proper aria-label
- Dialog: focus trap, Escape to close
- Messages: proper role="log" for live region
- Keyboard navigable

### 6.9 Admin Portal

**Purpose:** Allow ITSC staff to manage website content (training programs, news, gallery, contact inquiries).

**Target Layout:**
- **Login page:** Email + password form. Gold submit button. ITSC logo.
- **Dashboard:** Stats cards (total programs, total inquiries, total articles, total albums). Recent activity list.
- **CRUD pages:** Data table with search, filter, pagination. Create/Edit form in dialog or dedicated page.
- **Layout:** Sidebar navigation (dark background, gold active indicators) + main content area.

**Information hierarchy:**
1. Login: credentials → dashboard
2. Dashboard: stats overview → recent activity
3. CRUD: list view → detail/edit view

**Interaction improvements:**
- Data tables: sortable columns, search, filter by status
- Forms: validation with clear error messages
- Delete: confirmation dialog
- Success/error toasts

**Responsive behavior:**
- Sidebar: collapsible on mobile (hamburger menu)
- Data tables: horizontal scroll on mobile
- Forms: full-width on mobile

**Accessibility expectations:**
- Login form: proper labels, error messages
- Data tables: proper table markup, sort indicators
- Dialogs: focus trap, Escape to close
- Toasts: role="status" with aria-live="polite"

---

## 7. UX Principles

### 7.1 Navigation Philosophy

- **Flat over deep.** The legacy site's 4-level mega-menu is too deep. Prefer 2 levels max.
- **Vendor-first.** Organize training programs by certification vendor (Microsoft, Cisco, CompTIA, etc.) as the primary taxonomy.
- **Search is essential.** Provide a search function that covers training programs and news articles.
- **Mobile-first navigation.** The mobile experience should not be an afterthought.

### 7.2 CTA Philosophy

- **Every page needs a primary CTA.** The hero should always guide users to the next logical action.
- **Gold for primary actions.** Primary CTAs (Explore Programs, Contact Us, Enroll Now) use gold buttons.
- **Outline for secondary actions.** Secondary CTAs (View Schedule, Learn More) use outline buttons.
- **CTAs should be contextual.** A training program card should link to the program detail. A news card should link to the article.

### 7.3 Scrolling Experience

- **Smooth scrolling** (`scroll-behavior: smooth` — already implemented).
- **No full-screen sections.** Avoid forcing users through full-screen slides.
- **Content density is acceptable.** ITSC is an information-rich site. Don't oversimplify to the point of losing information.
- **Use visual anchors** (icons, badges, color) to break up dense content.

### 7.4 Content Density

- **Information-rich but scannable.** The legacy site's 11-section homepage is acceptable if each section is visually distinct and scannable.
- **Use cards to group related information.** Cards create visual chunks that are easier to scan.
- **Use icons as visual anchors.** Gold icons help users quickly identify sections.
- **Use badges for metadata.** Category badges, level badges, and status badges help users filter information visually.

### 7.5 Search

- **Search should be accessible from every page.** Search icon in the header.
- **Search covers:** Training programs, news articles, gallery albums.
- **Search results:** Show title, category, brief excerpt, and link.
- **AJAX search** for instant results (like the legacy Ivory Search plugin).

### 7.6 Filtering

- **Training programs:** Filter by vendor/category, level, delivery mode, status.
- **News:** Filter by category, date range.
- **Gallery:** Filter by album.
- **Contact inquiries (admin):** Filter by status (NEW, IN_PROGRESS, RESOLVED, ARCHIVED).
- **Filters should be visible and intuitive.** Use pill/tab-style filters for categories.

### 7.7 Feedback

- **Every user action should produce feedback.** Button clicks show loading states. Form submissions show success/error messages. Navigation changes show page transitions.
- **Use toasts for non-blocking feedback.** shadcn Toast component for success/error messages.
- **Use loading skeletons** for data-driven pages (when API is connected).
- **Use optimistic updates** for admin CRUD operations where appropriate.

### 7.8 Empty States

- **No results:** Show a friendly message with a suggested action. "No programs found matching your criteria. Try adjusting your filters or [contact us] for personalized recommendations."
- **No articles:** "No articles published yet. Check back soon for updates."
- **No gallery images:** "No images in this album yet."
- **No inquiries (admin):** "No inquiries yet. Inquiries from the contact form will appear here."
- **Empty states should include an illustration or icon** for visual interest.

### 7.9 Loading States

- **Page transitions:** Use Next.js `loading.tsx` for automatic loading states.
- **Data fetching:** Use TanStack Query's `isLoading` and `isFetching` states.
- **Skeleton components:** Create reusable `Skeleton` component (shadcn) for cards, tables, and text blocks.
- **Buttons:** Show a spinner icon and disable the button during submission.
- **Images:** Use `placeholder="blur"` with Next.js Image for smooth loading.

### 7.10 Error States

- **API errors:** Show a friendly error message with a retry button. "Something went wrong. Please try again."
- **404 pages:** Custom 404 page with ITSC branding, search, and navigation links.
- **Form errors:** Inline validation errors below each field. Clear, specific messages.
- **Network errors:** Detect offline state and show appropriate message.
- **Error boundary:** Wrap major sections in React error boundaries to prevent full-page crashes.

---

## 8. Technical UI Standards

### 8.1 Component Architecture

- **Reuse existing components whenever possible.** The `Button`, `Section`, `Container`, and `cn()` utility are well-implemented and should be preserved.
- **Refactor instead of rewrite.** Extract inline patterns into reusable components rather than rebuilding from scratch.
- **Follow shadcn/ui conventions.** Use CVA for variants, Slot for asChild, cn() for className merging.
- **One component per file.** Each component in its own file with a clear, descriptive name.

### 8.2 Styling Standards

- **Use Tailwind utility classes consistently.** No inline styles, no CSS modules, no styled-components.
- **Use design tokens instead of hardcoded values.** Reference `bg-brand-gold` not `bg-[#febd01]`. Reference `text-gray-500` not `text-[#64748b]`.
- **Avoid duplicated UI patterns.** If a pattern appears more than once, extract it into a component.
- **Use the `cn()` utility** for conditional className merging.

### 8.3 Accessibility Standards

- **All interactive elements must be keyboard accessible.**
- **All images must have descriptive alt text.**
- **All forms must have proper labels** associated via `htmlFor`/`id`.
- **Color contrast must meet WCAG AA** (4.5:1 for normal text, 3:1 for large text).
- **Focus indicators must be visible** on all interactive elements.
- **Use semantic HTML** (`<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`).
- **Support reduced motion** via `prefers-reduced-motion` media query.

### 8.4 Performance Standards

- **Use Next.js Image component** for all images (automatic optimization, lazy loading).
- **Use Server Components** for static content (public pages).
- **Use Client Components** only where interactivity is needed (forms, filters, AI assistant).
- **Minimize JavaScript bundle size.** Avoid unnecessary client-side libraries.
- **Use TanStack Query** for data fetching with caching and deduplication.

### 8.5 File Organization

- **Components in `src/components/`:** Reusable UI components.
- **`ui/`:** Primitive components (Button, Card, Input, etc.)
- **`layout/`:** Layout components (Header, Footer, Sidebar)
- **`sections/`:** Page sections (HeroSection, StatsSection, PartnerLogos)
- **`features/`:** Feature-specific components (TrainingCard, NewsCard, GalleryAlbum)
- **Pages in `src/app/`:** Next.js App Router pages. Keep pages thin — compose from components.

---

## 9. Implementation Priorities

### Phase 1: Brand Foundation (Week 1)

| Priority | Task | Dependencies |
|----------|------|-------------|
| P1 | Update color tokens in `globals.css` — replace blue/indigo with gold/gray palette | None |
| P1 | Update Button component variants — gold primary, dark secondary | Color tokens |
| P1 | Add Merriweather font via `next/font/google` | None |
| P1 | Update `globals.css` with new design tokens (radius, shadows, spacing) | None |
| P1 | Replace "IT" text logo with actual ITSC logo image in SiteHeader | Logo file |
| P2 | Add tagline to SiteFooter | None |
| P2 | Add social media icons to SiteFooter | None |

### Phase 2: Component Library (Week 1-2)

| Priority | Task | Dependencies |
|----------|------|-------------|
| P1 | Create reusable `PageHero` component (gold eyebrow + serif h1 + description) | Phase 1 |
| P1 | Create reusable `Card` component with sub-components | Phase 1 |
| P1 | Create reusable `StatsSection` component | Phase 1 |
| P1 | Create reusable `LogoGrid` component (partners/clients) | Phase 1 |
| P1 | Create reusable `NewsCard` component | Card component |
| P1 | Create reusable `TrainingCard` component | Card component |
| P2 | Create reusable `ContactInfo` component | Phase 1 |
| P2 | Create form components (Input, Textarea, Select, FormField) | Phase 1 |
| P2 | Create `Skeleton` component for loading states | None |

### Phase 3: Page Redesigns (Week 2-3)

| Priority | Task | Dependencies |
|----------|------|-------------|
| P1 | Redesign Homepage — hero, stats, services, featured programs, partners, mission, clients, CTA | Phase 1, Phase 2 |
| P1 | Redesign About page — mission/vision, values, stats, partners | Phase 1, Phase 2 |
| P1 | Redesign Training Programs page — category filter, program grid, pagination | Phase 1, Phase 2 |
| P1 | Redesign Corporate Training page — benefits, program areas, client logos | Phase 1, Phase 2 |
| P1 | Redesign News page — news grid, pagination | Phase 1, Phase 2 |
| P1 | Redesign Gallery page — album grid, image grid, lightbox | Phase 1, Phase 2 |
| P1 | Redesign Contact page — fix HTML, functional form, contact info | Phase 1, Phase 2 |
| P2 | Implement responsive mobile navigation (shadcn Sheet) | Phase 1 |
| P2 | Implement search functionality | Phase 1 |

### Phase 4: Admin Portal (Week 3-4)

| Priority | Task | Dependencies |
|----------|------|-------------|
| P1 | Admin login page | Phase 1 |
| P1 | Admin layout with sidebar | Phase 1 |
| P1 | Admin dashboard with stats | Phase 1, Phase 2 |
| P1 | Training programs CRUD | Phase 2 |
| P1 | News articles CRUD | Phase 2 |
| P2 | Gallery albums CRUD | Phase 2 |
| P2 | Contact inquiries management | Phase 2 |

### Phase 5: AI Assistant & Polish (Week 4)

| Priority | Task | Dependencies |
|----------|------|-------------|
| P2 | AI Assistant chat bubble + dialog | Phase 1 |
| P2 | AI chat interface | Backend AI service |
| P3 | Add micro-animations (staggered entrance, hover transitions) | Phase 1 |
| P3 | Accessibility pass (skip-to-content, focus management, reduced motion) | All phases |
| P3 | Loading/empty/error states for all data-driven pages | Phase 3 |
| P3 | Performance optimization (image optimization, bundle analysis) | All phases |

---

## 10. Success Criteria

### Brand Recognition

- [ ] The gold color (#febd01) is immediately recognizable as ITSC's brand color
- [ ] The ITSC logo is prominently displayed in the header and footer
- [ ] The tagline "Imparting Knowledge Skills and Attitudes" is present
- [ ] The site feels like a modern evolution of the legacy ITSC website, not a different brand
- [ ] Someone familiar with the legacy site would immediately recognize this as ITSC

### Visual Consistency

- [ ] All pages use the same color palette with no orphan colors
- [ ] All headings use Merriweather (serif) consistently
- [ ] All body text uses Geist Sans (sans-serif) consistently
- [ ] All cards use the same border radius, shadow, and padding
- [ ] All buttons use the same variant system
- [ ] All forms use the same input styling and focus rings
- [ ] All sections use the same container width and padding
- [ ] No visual inconsistencies between pages

### Responsive Design

- [ ] All pages render correctly on mobile (320px+)
- [ ] All pages render correctly on tablet (768px+)
- [ ] All pages render correctly on desktop (1024px+)
- [ ] Navigation is usable on all screen sizes
- [ ] No horizontal scroll on any page
- [ ] Images are properly sized for each breakpoint
- [ ] Touch targets are at least 44×44px on mobile

### Accessibility

- [ ] Skip-to-content link is present and functional
- [ ] All pages have proper heading hierarchy (one h1, no skipped levels)
- [ ] All images have descriptive alt text
- [ ] All form inputs have associated labels
- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are visible on all interactive elements
- [ ] Color contrast meets WCAG AA (4.5:1 normal text, 3:1 large text)
- [ ] Reduced motion is supported
- [ ] ARIA landmarks are present (banner, navigation, main, contentinfo)

### Component System

- [ ] No duplicated UI patterns across pages
- [ ] All reusable components are in `src/components/`
- [ ] Components use CVA for variants where applicable
- [ ] Components use `cn()` for className merging
- [ ] Components are typed with TypeScript
- [ ] No inline styles anywhere in the codebase

### Performance

- [ ] All images use Next.js Image component with proper sizing
- [ ] Static pages use Server Components
- [ ] Client Components are used only where interactivity is needed
- [ ] No unnecessary JavaScript is loaded on static pages
- [ ] Lighthouse performance score ≥ 90
- [ ] Lighthouse accessibility score ≥ 95

### Content Completeness

- [ ] Partner logos are present on the homepage
- [ ] Client logos are present on the homepage and corporate training page
- [ ] Stats counter is present on the homepage
- [ ] Contact information is accessible from every page
- [ ] Social media links are in the footer
- [ ] Mission and vision are on the About page
- [ ] Service categories are on the homepage
- [ ] Vendor-based course filtering is on the Training Programs page

### User Experience

- [ ] Every page has a clear primary call-to-action
- [ ] Forms provide clear feedback (loading, success, error states)
- [ ] Data-driven pages have loading, empty, and error states
- [ ] Navigation is intuitive and predictable
- [ ] Content is scannable with clear visual hierarchy
- [ ] The site feels professional, trustworthy, and modern
- [ ] The site preserves ITSC's institutional and educational character