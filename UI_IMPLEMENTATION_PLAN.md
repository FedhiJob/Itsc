# ITSC Frontend — UI Implementation Plan

> **Date:** 2026-07-27 (updated 2026-08-03)  
> **Sources:** `ITSC_REDESIGN_SPECIFICATION.md` (design blueprint) + `UI_COMPLIANCE_AUDIT.md` (gap analysis) + `docs/cms-architecture.md` (dynamic CMS architecture)  
> **Objective:** Engineering execution roadmap for achieving 100% compliance with the redesign specification AND the dynamic content-managed platform architecture  
> **Current Compliance:** 28%  
> **Target Compliance:** 100%  
> **Estimated Duration:** 4-6 weeks for a single developer

---

## Core Principle — Dynamic Content-Managed Platform

**This is NOT a static website.** It is a dynamic content-managed platform.

Every piece of content that appears on the public website must eventually be manageable from the Admin Portal. The frontend must be designed with this future integration in mind, even if some pages temporarily use mock data during development.

**This plan enforces the following rules (see `docs/cms-architecture.md` for full details):**

1. **No hardcoded business content in reusable components.** Components must accept props and TypeScript interfaces that can later be populated from API responses.
2. **Pages compose data-driven sections.** Each public page is a composition of section components, each receiving typed props. The page is responsible for fetching/assembling data (from API or temporary mock data) and passing it down.
3. **Mock data is temporary and documented.** Mock data lives in `apps/web/src/lib/mock/` (never inline in components), is typed to shared contracts, and is tracked in the mock-data registry.
4. **API-ready interfaces.** Shared TypeScript contracts in `packages/shared` define the shape of every content entity.
5. **No rewrite on integration.** Swapping mock data for API data changes only the data-fetching layer, never component props or structure.

---

## Phase 0 — Quick Wins (Day 1)

**Objective:** Fix critical bugs and lay the brand foundation with minimal effort. These tasks have no dependencies and can be done in parallel.

### Task 0.1: Fix Contact Page Broken HTML

**Description:** The contact page has missing closing `</div>` tags causing broken rendering. Restructure the contact info section to properly close all divs.

**Files likely to change:**
- `apps/web/src/app/contact/page.tsx`

**Dependencies:** None

**Estimated complexity:** Low (~10 minutes)

**Acceptance criteria:**
- Contact page renders without HTML validation errors
- Contact info (email, phone, address) displays correctly
- Form section is properly separated from contact info section
- No visual regression on desktop or mobile

**Testing checklist:**
- [ ] Validate HTML structure (no unclosed tags)
- [ ] Verify contact info renders correctly
- [ ] Verify form renders correctly
- [ ] Test on mobile and desktop viewports

---

### Task 0.2: Add Merriweather Font

**Description:** Add Merriweather (serif) as the heading font via `next/font/google`. Configure it as a CSS variable and apply to all headings.

**Files likely to change:**
- `apps/web/src/app/layout.tsx` — add Merriweather import and CSS variable
- `apps/web/src/app/globals.css` — add `--font-heading` token

**Dependencies:** None

**Estimated complexity:** Low (~10 minutes)

**Acceptance criteria:**
- Merriweather is loaded via `next/font/google`
- A CSS variable `--font-heading` is defined
- Headings can use `font-serif` class to render in Merriweather

**Testing checklist:**
- [ ] Merriweather font loads in browser
- [ ] CSS variable `--font-heading` is available
- [ ] No CLS impact from font loading
- [ ] Font-display is set to swap or optional

---

### Task 0.3: Replace "IT" Logo with Actual ITSC Logo

**Description:** Replace the "IT" text placeholder in the SiteHeader with the actual ITSC logo image. The logo file needs to be placed in the public directory.

**Files likely to change:**
- `apps/web/src/components/layout/site-header.tsx` — replace text with `<Image>` component
- `apps/web/public/` — add logo image file

**Dependencies:** Logo image file from legacy site

**Estimated complexity:** Low (~5 minutes)

**Acceptance criteria:**
- ITSC logo image displays in the header
- Logo links to homepage
- Logo has proper alt text
- Logo is responsive (scales on mobile)

**Testing checklist:**
- [ ] Logo renders on all pages
- [ ] Logo links to `/`
- [ ] Alt text is descriptive
- [ ] Logo scales on mobile viewport
- [ ] No layout shift from image loading

---

### Task 0.4: Add Tagline to Footer

**Description:** Add the tagline "Imparting Knowledge Skills and Attitudes" to the SiteFooter component near the organization name.

**Files likely to change:**
- `apps/web/src/components/layout/site-footer.tsx`

**Dependencies:** None

**Estimated complexity:** Low (~5 minutes)

**Acceptance criteria:**
- Tagline appears in the footer
- Tagline is visually distinct from the organization name
- Tagline is present on every page

**Testing checklist:**
- [ ] Tagline renders in footer
- [ ] Tagline is visible on all pages
- [ ] No visual regression

---

### Task 0.5: Add Social Media Icons to Footer

**Description:** Add social media icons (Facebook, Twitter, LinkedIn, YouTube) to the SiteFooter. Use Lucide React icons or simple SVG icons.

**Files likely to change:**
- `apps/web/src/components/layout/site-footer.tsx`

**Dependencies:** None

**Estimated complexity:** Low (~10 minutes)

**Acceptance criteria:**
- Facebook, Twitter, LinkedIn, and YouTube icons are present in the footer
- Icons link to the correct ITSC social media URLs
- Icons have proper aria-labels
- Icons open in new tabs with rel="noopener noreferrer"

**Testing checklist:**
- [ ] All 4 social icons render
- [ ] Icons link to correct URLs
- [ ] Icons have aria-labels
- [ ] Links open in new tabs
- [ ] Icons are responsive on mobile

---

## Phase 1 — Brand Foundation (Day 1-2)

**Objective:** Establish the complete design token system. Every downstream component depends on these tokens being correct.

### Task 1.1: Update Color Tokens in globals.css

**Description:** Replace the current blue/indigo color palette with the gold/gray palette specified in the redesign spec. Remove orphaned tokens. Add missing tokens.

**Current tokens to remove:**
- `--primary: #123a6f` → replace with `--color-brand-gold: #febd01`
- `--primary-700: #0d2e59` → replace with `--color-brand-gold-600: #e5a800`
- `--secondary: #3f3cbb` → remove
- `--secondary-700: #302d91` → remove
- `--accent: #f97316` → remove

**Current tokens to update (hex corrections):**
- `--muted: #eef2f7` → `--color-gray-100: #f1f5f9`
- `--border: #d9e2ec` → `--color-gray-200: #e2e8f0`
- `--muted-foreground: #526071` → `--color-gray-500: #64748b`
- `--foreground: #111827` → `--color-gray-900: #0f172a`

**New tokens to add:**
- `--color-brand-gold-700: #cc9400`
- `--color-brand-gold-50: #fffbe6`
- `--color-gray-700: #334155`
- `--color-info: #2563eb`
- `--radius-sm: 0.375rem`
- `--radius-md: 0.5rem`
- `--radius-lg: 0.75rem`
- `--radius-full: 9999px`
- `--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)`
- `--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1)`
- `--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1)`
- `--shadow-gold: 0 0 0 2px #febd01`

**Files likely to change:**
- `apps/web/src/app/globals.css`

**Dependencies:** None

**Estimated complexity:** Low (~15 minutes)

**Acceptance criteria:**
- All gold tokens are defined and accessible via Tailwind `bg-brand-gold`, `text-brand-gold`, etc.
- All gray tokens are defined and accessible via Tailwind `bg-gray-100`, `text-gray-500`, etc.
- Blue/indigo tokens are removed
- Radius and shadow tokens are defined
- The `@theme inline` block in globals.css maps all new tokens correctly

**Testing checklist:**
- [ ] `bg-brand-gold` renders gold (#febd01) background
- [ ] `text-brand-gold` renders gold text
- [ ] `bg-gray-100` renders #f1f5f9 background
- [ ] `text-gray-500` renders #64748b text
- [ ] `rounded-md` uses 0.5rem radius
- [ ] `shadow-sm` applies correct shadow
- [ ] No blue (#123a6f) or indigo (#3f3cbb) tokens remain
- [ ] Build succeeds with no token errors

---

### Task 1.2: Update Button Component Variants

**Description:** Update the Button component's CVA variants to use the new gold/gray color tokens. Change primary to gold, secondary to dark gray, outline to gold hover.

**Variant changes:**
- `primary`: `bg-brand-gold text-gray-900 hover:bg-brand-gold-600 focus-visible:outline-brand-gold`
- `secondary`: `bg-gray-900 text-white hover:bg-gray-700 focus-visible:outline-gray-900`
- `outline`: `border border-gray-200 bg-white text-gray-900 hover:bg-brand-gold hover:text-gray-900 focus-visible:outline-brand-gold`
- `ghost`: `text-gray-900 hover:bg-gray-100 focus-visible:outline-brand-gold`

**Files likely to change:**
- `apps/web/src/components/ui/button.tsx`

**Dependencies:** Task 1.1 (color tokens must exist)

**Estimated complexity:** Low (~10 minutes)

**Acceptance criteria:**
- Primary button has gold background with dark text
- Secondary button has dark background with white text
- Outline button has border with gold hover fill
- Ghost button has no background with gray hover
- All variants have proper focus rings
- All variants use `transition-colors duration-200`

**Testing checklist:**
- [ ] Primary button renders gold bg with dark text
- [ ] Primary button hover darkens gold
- [ ] Secondary button renders dark bg with white text
- [ ] Outline button hover fills with gold
- [ ] Ghost button hover shows gray bg
- [ ] Focus ring is visible on all variants
- [ ] Disabled state shows reduced opacity
- [ ] `asChild` still works with Link components

---

### Task 1.3: Global Search/Replace Color References

**Description:** Update all hardcoded references to the old color tokens across all page and component files. Replace `text-primary` with `text-brand-gold`, `bg-primary` with `bg-brand-gold`, etc.

**Search patterns:**
- `text-primary` → `text-brand-gold` (for accent text, badges, links)
- `bg-primary` → `bg-brand-gold` (for buttons, badges)
- `bg-primary/10` → `bg-brand-gold/10` (for badge backgrounds)
- `text-muted-foreground` → `text-gray-500`
- `text-foreground` → `text-gray-900`
- `bg-muted` → `bg-gray-100`
- `border-border` → `border-gray-200`
- `hover:text-foreground` → `hover:text-gray-900`
- `hover:bg-muted` → `hover:bg-gray-100`

**Files likely to change:**
- `apps/web/src/app/page.tsx`
- `apps/web/src/app/about/page.tsx`
- `apps/web/src/app/training-programs/page.tsx`
- `apps/web/src/app/corporate-training/page.tsx`
- `apps/web/src/app/news/page.tsx`
- `apps/web/src/app/gallery/page.tsx`
- `apps/web/src/app/contact/page.tsx`
- `apps/web/src/components/layout/site-header.tsx`
- `apps/web/src/components/layout/site-footer.tsx`
- `apps/web/src/components/ui/button.tsx`

**Dependencies:** Task 1.1 (new tokens must exist)

**Estimated complexity:** Medium (~30 minutes of search/replace)

**Acceptance criteria:**
- No references to `text-primary` remain (except in comments)
- No references to `bg-primary` remain
- No references to `text-muted-foreground` remain
- No references to `border-border` remain
- All pages use the new gold/gray color tokens

**Testing checklist:**
- [ ] All pages render with gold accents instead of blue
- [ ] All badges use gold background
- [ ] All links use gold color
- [ ] All borders use gray-200
- [ ] All muted text uses gray-500
- [ ] Build succeeds with no type errors

---

## Phase 1.3 — Data-Driven Foundation (Day 2-3)

**Objective:** Enforce the dynamic content-managed platform architecture. Refactor public pages to compose data-driven section components fed by typed mock data, so API integration later requires no component changes. See `docs/cms-architecture.md` for the full architecture.

### Task 1.3.1: Define Shared Content Contracts

**Description:** Add TypeScript interfaces to `packages/shared` for all content entities that public pages render: HomepageContent, Statistic, Service, PartnerLogo, ClientLogo, AboutContent, LeadershipMember, CorporateTrainingContent, ContactInfo, NewsCategory, etc. These contracts are the single source of truth for both frontend components and API responses.

**Files to create:**
- `packages/shared/src/content.ts` (extend existing)
- `packages/shared/src/index.ts` (re-export)

**Dependencies:** None

**Estimated complexity:** Medium (~1 hour)

**Acceptance criteria:**
- Interfaces exist for every public-facing content section
- Interfaces are API-ready (match future REST response shapes)
- Interfaces are exported from the shared package

**Testing checklist:**
- [ ] All content entities have typed interfaces
- [ ] Shared package typechecks
- [ ] API and web can import the contracts

---

### Task 1.3.2: Create Typed Mock Data

**Description:** Create `apps/web/src/lib/mock/` with typed mock data for all public sections (homepage, about, training, corporate-training, news, gallery, contact). Each file conforms to the shared contracts and is marked `// MOCK DATA — replace with API integration (see docs/cms-architecture.md)`.

**Files to create:**
- `apps/web/src/lib/mock/homepage.ts`
- `apps/web/src/lib/mock/about.ts`
- `apps/web/src/lib/mock/training.ts`
- `apps/web/src/lib/mock/corporate-training.ts`
- `apps/web/src/lib/mock/news.ts`
- `apps/web/src/lib/mock/gallery.ts`
- `apps/web/src/lib/mock/contact.ts`

**Dependencies:** Task 1.3.1 (shared contracts)

**Estimated complexity:** Medium (~1.5 hours)

**Acceptance criteria:**
- Mock data lives in `mock/` (never inline in components)
- Mock data is typed to shared contracts
- Each file has the documented MOCK DATA header comment
- Mock data registry in `docs/cms-architecture.md` is updated

**Testing checklist:**
- [ ] Mock files exist for all public sections
- [ ] Mock data conforms to shared contracts
- [ ] Header comments present
- [ ] Registry updated

---

### Task 1.3.3: Refactor Public Pages to Compose Data-Driven Sections

**Description:** Refactor each public page to be a composition of section components receiving typed props, fed by mock data. The page fetches/assembles data and passes it down; components never hardcode business content. This is the foundation that makes API integration a data-layer-only change.

**Files likely to change:**
- `apps/web/src/app/page.tsx` (homepage)
- `apps/web/src/app/about/page.tsx`
- `apps/web/src/app/training-programs/page.tsx`
- `apps/web/src/app/corporate-training/page.tsx`
- `apps/web/src/app/news/page.tsx`
- `apps/web/src/app/gallery/page.tsx`
- `apps/web/src/app/contact/page.tsx`

**Dependencies:** Task 1.3.1, Task 1.3.2

**Estimated complexity:** High (~4 hours)

**Acceptance criteria:**
- No hardcoded business content in reusable components
- Pages compose section components with typed props
- Mock data is imported from `mock/`, not inline
- Swapping mock data for API data requires no component changes

**Testing checklist:**
- [ ] No business content hardcoded in components
- [ ] Pages pass typed props to sections
- [ ] Mock data imported from `mock/`
- [ ] Build succeeds
- [ ] Pages render identically to before

---

## Phase 2 — Shared UI Components (Day 2-4)

**Objective:** Build the reusable component library that all pages will consume. Each component should be built once and reused across all pages.

### Task 2.1: Create Card Component

**Description:** Create a reusable Card component with sub-components (Card, CardHeader, CardBody, CardFooter) following shadcn/ui conventions. Support variants: default, featured (gold top border), interactive (hover shadow).

**Component API:**
```tsx
<Card variant="default" className="...">
  <CardHeader>Title</CardHeader>
  <CardBody>Content</CardBody>
  <CardFooter>Actions</CardFooter>
</Card>
```

**Variants:**
- `default`: white bg, rounded-lg, border, shadow-sm, p-6
- `featured`: same as default + `border-t-4 border-t-brand-gold`
- `interactive`: same as default + `hover:shadow-md transition-shadow duration-200`

**Files to create:**
- `apps/web/src/components/ui/card.tsx`

**Dependencies:** Task 1.1 (color tokens), Task 1.2 (button for reference pattern)

**Estimated complexity:** Medium (~30 minutes)

**Acceptance criteria:**
- Card component renders with correct default styling
- CardHeader, CardBody, CardFooter sub-components work
- Featured variant shows gold top border
- Interactive variant shows hover shadow
- Component accepts className for customization
- Component is properly typed with TypeScript

**Testing checklist:**
- [ ] Default card renders with white bg, border, shadow, rounded corners
- [ ] Featured card shows gold top border
- [ ] Interactive card shows shadow on hover
- [ ] CardHeader renders with correct typography
- [ ] CardBody renders content correctly
- [ ] CardFooter renders actions correctly
- [ ] Custom className merges correctly via cn()
- [ ] TypeScript compilation passes

---

### Task 2.2: Create PageHero Component

**Description:** Create a reusable PageHero component for interior pages. Gold eyebrow text → serif h1 → sans-serif description. Optional gold left border accent.

**Component API:**
```tsx
<PageHero
  eyebrow="About ITSC"
  title="Our Mission & Vision"
  description="Learn about our story..."
/>
```

**Files to create:**
- `apps/web/src/components/ui/page-hero.tsx`

**Dependencies:** Task 1.1 (color tokens), Task 0.2 (Merriweather font)

**Estimated complexity:** Low (~20 minutes)

**Acceptance criteria:**
- Eyebrow text renders in gold with uppercase tracking
- Title renders in serif (Merriweather) font
- Description renders in sans-serif
- Component is centered by default
- Component accepts className for customization

**Testing checklist:**
- [ ] Eyebrow text is gold (#febd01)
- [ ] Title uses Merriweather (serif)
- [ ] Description uses Geist Sans (sans-serif)
- [ ] Component is centered
- [ ] Custom className overrides work
- [ ] TypeScript compilation passes

---

### Task 2.3: Create StatsSection Component

**Description:** Create a reusable StatsSection component displaying statistics with gold numbers. Content: 100+ Courses, 150+ Clients, 30+ Trainers, 14+ Partners.

**Component API:**
```tsx
<StatsSection
  stats={[
    { value: "100+", label: "Different Courses" },
    { value: "150+", label: "Happy Clients" },
    { value: "30+", label: "Elite Trainers" },
    { value: "14+", label: "International Partners" }
  ]}
/>
```

**Files to create:**
- `apps/web/src/components/sections/stats-section.tsx`

**Dependencies:** Task 1.1 (color tokens)

**Estimated complexity:** Low (~15 minutes)

**Acceptance criteria:**
- Stat numbers render in gold with large font
- Stat labels render in gray below numbers
- Responsive grid: 2 columns mobile, 4 columns desktop
- Component accepts custom stats array

**Testing checklist:**
- [ ] Numbers render in gold (#febd01)
- [ ] Labels render in gray-700
- [ ] 2 columns on mobile viewport
- [ ] 4 columns on desktop viewport
- [ ] Custom stats array works
- [ ] TypeScript compilation passes

---

### Task 2.4: Create LogoGrid Component

**Description:** Create a reusable LogoGrid component for displaying partner and client logos. Logos are grayscale by default, full color on hover.

**Component API:**
```tsx
<LogoGrid
  title="Our International Partners"
  logos={[
    { src: "/logos/lpi.png", alt: "LPI", href: "https://lpi.org" },
    // ...
  ]}
/>
```

**Files to create:**
- `apps/web/src/components/sections/logo-grid.tsx`

**Dependencies:** Task 1.1 (color tokens)

**Estimated complexity:** Low (~20 minutes)

**Acceptance criteria:**
- Logos display in a responsive grid
- Logos are grayscale by default
- Logos transition to full color on hover
- Logos have proper alt text
- Logos link to partner websites
- Section title is optional

**Testing checklist:**
- [ ] Grid renders with correct column count per breakpoint
- [ ] Logos are grayscale by default
- [ ] Logos become full color on hover
- [ ] Hover transition is smooth (duration-300)
- [ ] Alt text is descriptive
- [ ] Links open in new tab with rel="noopener noreferrer"
- [ ] Title renders when provided
- [ ] TypeScript compilation passes

---

### Task 2.5: Create NewsCard Component

**Description:** Create a reusable NewsCard component for displaying news articles. Category badge (gold), date with calendar icon, title (serif), summary, "Read More" link (gold).

**Component API:**
```tsx
<NewsCard
  title="ITSC Launches New AI Training Program"
  slug="ai-training-launch"
  summary="Our comprehensive AI Foundations program..."
  date="2024-03-15"
  category="Programs"
/>
```

**Files to create:**
- `apps/web/src/components/features/news-card.tsx`

**Dependencies:** Task 2.1 (Card component), Task 1.1 (color tokens), Task 0.2 (Merriweather)

**Estimated complexity:** Low (~20 minutes)

**Acceptance criteria:**
- Category badge renders with gold background
- Date renders with calendar icon in gray-500
- Title renders in serif (Merriweather)
- Summary renders in gray-500
- "Read More" link renders in gold with arrow icon
- Card has hover shadow elevation

**Testing checklist:**
- [ ] Badge has gold bg with dark text
- [ ] Date shows with calendar icon
- [ ] Title uses Merriweather font
- [ ] Summary uses gray-500 text
- [ ] "Read More" link is gold with arrow
- [ ] Card elevates on hover
- [ ] TypeScript compilation passes

---

### Task 2.6: Create TrainingCard Component

**Description:** Create a reusable TrainingCard component for displaying training programs. Category badge (gold), level badge (gray), metadata (duration, delivery mode), title (serif), "View Details" button (outline).

**Component API:**
```tsx
<TrainingCard
  title="AI Foundations"
  slug="ai-foundations"
  description="Understand core AI concepts..."
  category="Artificial Intelligence"
  duration="6 weeks"
  level="Beginner"
  delivery="Online"
/>
```

**Files to create:**
- `apps/web/src/components/features/training-card.tsx`

**Dependencies:** Task 2.1 (Card component), Task 1.1 (color tokens), Task 0.2 (Merriweather)

**Estimated complexity:** Low (~25 minutes)

**Acceptance criteria:**
- Category badge renders with gold background
- Level badge renders with gray background
- Duration and delivery mode show with icons in gray-500
- Title renders in serif (Merriweather)
- "View Details" button renders as outline variant
- Card has hover shadow elevation

**Testing checklist:**
- [ ] Category badge has gold bg
- [ ] Level badge has gray bg
- [ ] Duration shows with clock icon
- [ ] Delivery mode shows with map pin icon
- [ ] Title uses Merriweather font
- [ ] "View Details" button is outline variant
- [ ] Card elevates on hover
- [ ] TypeScript compilation passes

---

### Task 2.7: Create ContactInfo Component

**Description:** Create a reusable ContactInfo component for displaying contact details with gold icons. Supports email, phone, and address items.

**Component API:**
```tsx
<ContactInfo
  items={[
    { type: "email", value: "info@itsc.com.et", href: "mailto:info@itsc.com.et" },
    { type: "phone", value: "+251-115-507150", href: "tel:+251115507150" },
    { type: "address", value: "Bole Road, Mega Building, 902" }
  ]}
/>
```

**Files to create:**
- `apps/web/src/components/ui/contact-info.tsx`

**Dependencies:** Task 1.1 (color tokens)

**Estimated complexity:** Low (~15 minutes)

**Acceptance criteria:**
- Each contact item shows a gold icon with label and value
- Email and phone are clickable links (mailto/tel)
- Address is plain text
- Component is responsive

**Testing checklist:**
- [ ] Icons render in gold (#febd01)
- [ ] Email renders as mailto link
- [ ] Phone renders as tel link
- [ ] Address renders as text
- [ ] Responsive layout works
- [ ] TypeScript compilation passes

---

### Task 2.8: Create Form Components

**Description:** Create reusable form components wrapping React Hook Form + Zod validation. Components: FormField, Input, Textarea, Select, Label, FormError.

**Component API:**
```tsx
<FormField name="email" label="Email" required>
  <Input placeholder="you@example.com" />
  <FormError />
</FormField>
```

**Files to create:**
- `apps/web/src/components/ui/form.tsx` (FormField, Label, FormError)
- `apps/web/src/components/ui/input.tsx`
- `apps/web/src/components/ui/textarea.tsx`
- `apps/web/src/components/ui/select.tsx`

**Dependencies:** Task 1.1 (color tokens)

**Estimated complexity:** Medium (~1 hour)

**Acceptance criteria:**
- Input has gold focus ring
- Textarea has gold focus ring
- Select has gold focus ring
- Error state shows red border + error message
- Label is associated with input via htmlFor/id
- Components forward refs for React Hook Form integration

**Testing checklist:**
- [ ] Input focus shows gold ring
- [ ] Textarea focus shows gold ring
- [ ] Select focus shows gold ring
- [ ] Error state shows red border
- [ ] Error message renders below input
- [ ] Label htmlFor matches input id
- [ ] Ref forwarding works with React Hook Form register()
- [ ] TypeScript compilation passes

---

### Task 2.9: Update Navigation (Header + Mobile)

**Description:** Update the SiteHeader component. Replace "IT" logo with actual image. Add gold styling to "Ask ITSC" button. Implement mobile slide-out navigation using shadcn Sheet. Add phone number display. Add search icon placeholder.

**Files likely to change:**
- `apps/web/src/components/layout/site-header.tsx`

**Dependencies:** Task 0.3 (logo image), Task 1.1 (color tokens), shadcn Sheet component (needs to be installed)

**Estimated complexity:** Medium (~1.5 hours)

**Acceptance criteria:**
- Logo image displays correctly
- "Ask ITSC" button is gold with dark text
- Mobile hamburger opens a slide-out Sheet
- Sheet contains all navigation links
- Phone number is displayed in header
- Search icon is present (can be non-functional placeholder)
- Nav links have gold hover color

**Testing checklist:**
- [ ] Logo renders as image
- [ ] "Ask ITSC" button is gold
- [ ] Hamburger button visible on mobile
- [ ] Clicking hamburger opens Sheet
- [ ] Sheet contains all nav links
- [ ] Sheet closes on link click
- [ ] Sheet closes on Escape key
- [ ] Phone number displays in header
- [ ] Search icon renders
- [ ] Nav links hover in gold
- [ ] Keyboard navigation works in Sheet
- [ ] Focus is trapped in Sheet when open

---

### Task 2.10: Update Footer

**Description:** Update the SiteFooter component. Add tagline. Add social media icons. Add subscribe form placeholder. Update contact info to use gold icons. Expand to 4-column layout.

**Files likely to change:**
- `apps/web/src/components/layout/site-footer.tsx`

**Dependencies:** Task 0.4 (tagline), Task 0.5 (social icons), Task 2.7 (ContactInfo component)

**Estimated complexity:** Medium (~45 minutes)

**Acceptance criteria:**
- 4-column layout: Logo+tagline | Quick Links | Contact Info | Subscribe
- Tagline displays near logo
- Social media icons are present with correct links
- Contact info uses gold icons
- Subscribe form is present (can be non-functional placeholder)
- Copyright bar remains at bottom

**Testing checklist:**
- [ ] 4 columns on desktop
- [ ] Single column on mobile
- [ ] Tagline renders
- [ ] Social icons render with correct URLs
- [ ] Contact info shows gold icons
- [ ] Subscribe form renders
- [ ] Copyright bar renders
- [ ] Responsive at all breakpoints

---

## Phase 3 — Homepage (Day 5-6)

**Objective:** Rebuild the homepage using the new component library. This is the most important page and should demonstrate all new components working together.

### Task 3.1: Rebuild Homepage Hero

**Description:** Replace the current 2-column hero with a full-width hero featuring gold accent, optional background image with gold overlay, serif headline, and two CTAs.

**Sections to build:**
- Full-width hero section (not wrapped in Container)
- Headline in Merriweather (serif)
- Subtitle in Geist Sans
- Two CTAs: "Explore Programs" (gold primary) + "View Schedule" (outline)
- Optional: background image with gold gradient overlay

**Files likely to change:**
- `apps/web/src/app/page.tsx`

**Dependencies:** Task 1.1 (color tokens), Task 0.2 (Merriweather), Task 1.2 (Button variants)

**Estimated complexity:** Medium (~45 minutes)

**Acceptance criteria:**
- Hero is full-width (no Container constraint)
- Headline uses Merriweather font
- CTAs use correct button variants
- Layout is responsive

**Testing checklist:**
- [ ] Hero spans full viewport width
- [ ] Headline uses serif font
- [ ] "Explore Programs" button is gold primary
- [ ] "View Schedule" button is outline
- [ ] Responsive on mobile (text centered, buttons stacked)
- [ ] No horizontal scroll

---

### Task 3.2: Add Stats Section to Homepage

**Description:** Add the StatsSection component to the homepage after the hero, using the legacy site's stats (100+ Courses, 150+ Clients, 30+ Trainers, 14+ Partners).

**Files likely to change:**
- `apps/web/src/app/page.tsx`

**Dependencies:** Task 2.3 (StatsSection component)

**Estimated complexity:** Low (~10 minutes)

**Acceptance criteria:**
- Stats section renders with gold numbers and gray labels
- Responsive grid works correctly
- Stats are visible on all viewport sizes

**Testing checklist:**
- [ ] Stats render with gold numbers
- [ ] 4 stat items display
- [ ] 2 columns on mobile
- [ ] 4 columns on desktop
- [ ] Section spacing is consistent

---

### Task 3.3: Add Services Overview to Homepage

**Description:** Add a services overview section with 5 service cards (Training, Consulting, Networking, Certification, Industrial Automation). Each card has a gold icon, title, and brief description.

**Files likely to change:**
- `apps/web/src/app/page.tsx`

**Dependencies:** Task 2.1 (Card component), Task 1.1 (color tokens)

**Estimated complexity:** Medium (~30 minutes)

**Acceptance criteria:**
- 5 service cards in a responsive grid
- Each card has a gold icon
- Each card has a title and description
- Cards are interactive (hover elevation)

**Testing checklist:**
- [ ] 5 service cards render
- [ ] Icons are gold (#febd01)
- [ ] Grid: 1 col mobile, 2 col tablet, 3-5 col desktop
- [ ] Cards elevate on hover
- [ ] Section heading "Our Services" renders

---

### Task 3.4: Add Partner Logos Section

**Description:** Add the LogoGrid component to the homepage displaying international partner logos (LPI, Cisco, Microsoft, CompTIA, EC Council, Pearson VUE, etc.).

**Files likely to change:**
- `apps/web/src/app/page.tsx`

**Dependencies:** Task 2.4 (LogoGrid component), partner logo image files

**Estimated complexity:** Low (~15 minutes)

**Acceptance criteria:**
- Partner logos display in a responsive grid
- Logos are grayscale by default, color on hover
- Section heading "Our International Partners" renders

**Testing checklist:**
- [ ] All partner logos render
- [ ] Logos are grayscale by default
- [ ] Logos become color on hover
- [ ] Grid is responsive
- [ ] Links open in new tabs

---

### Task 3.5: Add Mission & Vision Section

**Description:** Add a brief mission and vision section with gold left border accent and serif headings.

**Files likely to change:**
- `apps/web/src/app/page.tsx`

**Dependencies:** Task 0.2 (Merriweather), Task 1.1 (color tokens)

**Estimated complexity:** Low (~20 minutes)

**Acceptance criteria:**
- Mission and vision text display with gold left border
- Headings use serif font
- Text is constrained to readable width

**Testing checklist:**
- [ ] Gold left border renders
- [ ] Serif headings render
- [ ] Text is readable (constrained width)
- [ ] Responsive layout

---

### Task 3.6: Add Client Logos Section

**Description:** Add a second LogoGrid for client logos (NIB, UNDP, CBE, Coca Cola, Awash Bank, etc.) with heading "Trusted By".

**Files likely to change:**
- `apps/web/src/app/page.tsx`

**Dependencies:** Task 2.4 (LogoGrid component), client logo image files

**Estimated complexity:** Low (~15 minutes)

**Acceptance criteria:**
- Client logos display in responsive grid
- Logos are grayscale by default, color on hover
- Section heading "Trusted By" renders

**Testing checklist:**
- [ ] All client logos render
- [ ] Logos are grayscale by default
- [ ] Logos become color on hover
- [ ] Grid is responsive

---

### Task 3.7: Add CTA Section

**Description:** Add a "Ready to get started?" CTA section at the bottom of the homepage with two buttons: "Contact Us" (gold primary) and "View Programs" (outline).

**Files likely to change:**
- `apps/web/src/app/page.tsx`

**Dependencies:** Task 1.2 (Button variants)

**Estimated complexity:** Low (~15 minutes)

**Acceptance criteria:**
- Section heading renders in serif
- Description renders in sans-serif
- Two CTAs with correct button variants
- Section is centered and constrained to max-w-2xl

**Testing checklist:**
- [ ] Heading uses serif font
- [ ] "Contact Us" button is gold primary
- [ ] "View Programs" button is outline
- [ ] Section is centered
- [ ] Buttons stack on mobile

---

## Phase 4 — Remaining Public Pages (Day 7-10)

**Objective:** Update all remaining public pages to use the new component library and brand tokens.

### Task 4.1: Update About Page

**Description:** Replace PageHero component. Update mission/vision to use Card component with gold top border. Update value cards with gold icons and serif titles. Add StatsSection. Add LogoGrid for partners.

**Files likely to change:**
- `apps/web/src/app/about/page.tsx`

**Dependencies:** Phase 2 (all components), Phase 1 (all tokens)

**Estimated complexity:** Medium (~45 minutes)

**Acceptance criteria:**
- PageHero renders with gold eyebrow and serif heading
- Mission/Vision uses featured Card variant (gold top border)
- Value cards have gold icons and serif titles
- StatsSection renders
- LogoGrid renders

**Testing checklist:**
- [ ] PageHero has gold eyebrow
- [ ] h1 uses serif font
- [ ] Mission/Vision cards have gold top border
- [ ] Value card icons are gold
- [ ] Stats render correctly
- [ ] Partner logos render
- [ ] CTA section renders

---

### Task 4.2: Update Training Programs Page

**Description:** Replace PageHero component. Implement vendor-based category filter. Use TrainingCard component for program grid. Add pagination. Add CTA section.

**Files likely to change:**
- `apps/web/src/app/training-programs/page.tsx`

**Dependencies:** Task 2.2 (PageHero), Task 2.6 (TrainingCard)

**Estimated complexity:** Medium (~1 hour)

**Acceptance criteria:**
- PageHero renders correctly
- Category filter is vendor-based with gold active state
- Program grid uses TrainingCard component
- Pagination or "Load More" is present
- CTA section renders

**Testing checklist:**
- [ ] PageHero renders correctly
- [ ] Category filter tabs are clickable
- [ ] Active category shows gold styling
- [ ] TrainingCard renders with all metadata
- [ ] Grid is responsive
- [ ] Pagination works (or placeholder exists)

---

### Task 4.3: Update Corporate Training Page

**Description:** Replace PageHero component. Add "Request a Consultation" CTA in hero. Update benefit cards with gold icons. Add client logos section.

**Files likely to change:**
- `apps/web/src/app/corporate-training/page.tsx`

**Dependencies:** Task 2.2 (PageHero), Task 2.4 (LogoGrid)

**Estimated complexity:** Medium (~30 minutes)

**Acceptance criteria:**
- PageHero renders with "Request a Consultation" gold CTA
- Benefit cards have gold icons
- Client logos render
- CTA section renders

**Testing checklist:**
- [ ] PageHero has gold CTA button
- [ ] Benefit card icons are gold
- [ ] Client logos render
- [ ] "Ready to transform your team?" CTA renders
- [ ] All sections responsive

---

### Task 4.4: Update News Page

**Description:** Replace PageHero component. Use NewsCard component for article grid. Add pagination.

**Files likely to change:**
- `apps/web/src/app/news/page.tsx`

**Dependencies:** Task 2.2 (PageHero), Task 2.5 (NewsCard)

**Estimated complexity:** Low (~30 minutes)

**Acceptance criteria:**
- PageHero renders correctly
- Article grid uses NewsCard component
- Pagination is present
- All articles render with correct data

**Testing checklist:**
- [ ] PageHero renders correctly
- [ ] NewsCard renders with gold badge, serif title
- [ ] Grid layout is correct (single column)
- [ ] Pagination renders (or placeholder)

---

### Task 4.5: Update Gallery Page

**Description:** Replace PageHero component. Implement album grid with cover images. Implement lightbox for image viewing.

**Files likely to change:**
- `apps/web/src/app/gallery/page.tsx`

**Dependencies:** Task 2.2 (PageHero), shadcn Dialog component

**Estimated complexity:** Medium (~1 hour)

**Acceptance criteria:**
- PageHero renders correctly
- Album grid shows cover images with titles
- Clicking an album shows image grid
- Clicking an image opens lightbox
- Lightbox is keyboard navigable

**Testing checklist:**
- [ ] PageHero renders correctly
- [ ] Album cards render with images
- [ ] Album click shows images
- [ ] Image click opens lightbox
- [ ] Lightbox closes on Escape
- [ ] Lightbox arrow keys navigate images
- [ ] Responsive grid works

---

### Task 4.6: Update Contact Page

**Description:** Replace PageHero component. Use ContactInfo component. Implement functional form with React Hook Form + Zod + API submission. Add social media links. Add optional map.

**Files likely to change:**
- `apps/web/src/app/contact/page.tsx`

**Dependencies:** Task 2.2 (PageHero), Task 2.7 (ContactInfo), Task 2.8 (Form components)

**Estimated complexity:** High (~2 hours)

**Acceptance criteria:**
- PageHero renders correctly
- Contact info uses ContactInfo component with gold icons
- Form is functional with validation, submission, and success state
- Social media links are present
- Responsive layout: stacked on mobile, side-by-side on desktop

**Testing checklist:**
- [ ] PageHero renders correctly
- [ ] ContactInfo renders with gold icons
- [ ] Email is mailto link
- [ ] Phone is tel link
- [ ] Form validates on submit
- [ ] Form shows error messages
- [ ] Form submits to API
- [ ] Success message displays after submission
- [ ] Social media links render
- [ ] Layout is responsive
- [ ] Broken HTML from original is fixed

---

## Phase 5 — AI Assistant (Day 11-12)

**Objective:** Implement the AI Assistant chat interface. The backend AI service is a prerequisite.

### Task 5.1: Create Chat Bubble

**Description:** Add a fixed-position chat bubble button in the bottom-right corner. Gold background with chat icon. Opens a shadcn Dialog or Sheet.

**Files to create:**
- `apps/web/src/components/features/ai-assistant.tsx`

**Dependencies:** Task 1.1 (color tokens), shadcn Dialog component

**Estimated complexity:** Medium (~1 hour)

**Acceptance criteria:**
- Chat bubble is fixed in bottom-right corner
- Bubble has gold background with chat icon
- Clicking bubble opens a chat dialog
- Dialog has proper focus trap and Escape to close

**Testing checklist:**
- [ ] Chat bubble renders on all pages
- [ ] Bubble position is bottom-right
- [ ] Bubble has gold bg
- [ ] Click opens dialog
- [ ] Dialog closes on Escape
- [ ] Focus is trapped in dialog
- [ ] Responsive on mobile (full-screen)

---

### Task 5.2: Create Chat Interface

**Description:** Build the chat interface inside the dialog. Message history display, input field, send button, typing indicator.

**Files to create:**
- `apps/web/src/components/features/ai-assistant.tsx` (add interface)
- `apps/web/src/lib/ai-chat.ts` (API client for OpenAI endpoint)

**Dependencies:** Task 5.1, Backend AI service (OpenAI endpoint)

**Estimated complexity:** Medium (~1.5 hours)

**Acceptance criteria:**
- Messages display in a scrollable history
- User messages are right-aligned
- AI messages are left-aligned with gold accent
- Input field has gold focus ring
- Send button is gold
- Typing indicator shows while waiting for response
- Enter key sends message

**Testing checklist:**
- [ ] Message history scrolls
- [ ] User messages right-aligned
- [ ] AI messages left-aligned
- [ ] Send button works
- [ ] Typing indicator displays
- [ ] Enter key sends
- [ ] Input clears after send

---

## Phase 6 — Admin UI (Day 13-18)

**Objective:** Build the admin portal. This is the largest phase with the most files.

### Task 6.1: Create Admin Layout

**Description:** Build the admin layout with sidebar navigation. Dark sidebar (gray-900) with white text and gold active indicators.

**Files to create:**
- `apps/web/src/app/admin/layout.tsx`
- `apps/web/src/components/layout/admin-sidebar.tsx`
- `apps/web/src/components/layout/admin-header.tsx`

**Dependencies:** Task 1.1 (color tokens)

**Estimated complexity:** Medium (~1.5 hours)

**Acceptance criteria:**
- Sidebar is dark with white text
- Active nav item has gold left border and gold text
- Sidebar is collapsible on mobile
- Content area fills remaining space

**Testing checklist:**
- [ ] Sidebar renders on all admin pages
- [ ] Active link shows gold styling
- [ ] Mobile hamburger toggles sidebar
- [ ] Responsive layout

---

### Task 6.2: Create Admin Login Page

**Description:** Login form with email + password. Gold submit button. ITSC logo. Error handling for invalid credentials.

**Files to create:**
- `apps/web/src/app/admin/login/page.tsx`

**Dependencies:** Task 2.8 (Form components), API auth endpoint

**Estimated complexity:** Medium (~1 hour)

**Acceptance criteria:**
- Login form renders with email and password fields
- Submit button is gold
- Error messages display for invalid credentials
- Successful login redirects to dashboard
- Form validates before submission

**Testing checklist:**
- [ ] Form renders with labels
- [ ] Gold submit button
- [ ] Validation errors display
- [ ] API error displays
- [ ] Successful login redirects
- [ ] Responsive

---

### Task 6.3: Create Admin Dashboard

**Description:** Dashboard page with stats cards (total programs, total inquiries, total articles, total albums) and recent activity list.

**Files to create:**
- `apps/web/src/app/admin/page.tsx`

**Dependencies:** Task 2.1 (Card component), API endpoints

**Estimated complexity:** Medium (~1 hour)

**Acceptance criteria:**
- Stats cards display with gold numbers
- Recent activity list renders
- Data is fetched from API
- Loading/error states display

**Testing checklist:**
- [ ] Stats cards render
- [ ] Numbers are fetched from API
- [ ] Loading skeleton displays
- [ ] Error state displays
- [ ] Responsive grid

---

### Task 6.4: Create CRUD Pages — Training Programs

**Description:** List view with data table, create/edit form, delete confirmation for Training Programs. Manages categories, duration, requirements, learning outcomes, images, featured flag, publish/unpublish.

**Files to create:**
- `apps/web/src/app/admin/training-programs/page.tsx`

**Dependencies:** Task 2.8 (Form components), Task 2.1 (Card), API endpoints

**Estimated complexity:** High (~4 hours)

**Acceptance criteria:**
- Data table displays with sortable columns
- Search filters results
- Create form has validation (incl. requirements + learning outcomes)
- Edit form pre-populates data
- Delete shows confirmation dialog
- Success/error toasts display

**Testing checklist:**
- [ ] Data table renders with data
- [ ] Columns are sortable
- [ ] Search filters correctly
- [ ] Create form validates
- [ ] Requirements/outcomes editable
- [ ] Edit form pre-populates
- [ ] Delete shows confirmation
- [ ] Publish/unpublish toggle works
- [ ] Toast displays on success
- [ ] Pagination works

---

### Task 6.5: Create CRUD Pages — News

**Description:** List view, create/edit form, delete confirmation for News Articles. Manages draft/publish, featured news, categories, images.

**Files to create:**
- `apps/web/src/app/admin/news/page.tsx`

**Dependencies:** Task 2.8 (Form components), Task 2.1 (Card), API endpoints

**Estimated complexity:** High (~4 hours)

**Acceptance criteria:**
- Data table with status badges
- Draft/Publish toggle
- Featured news flag
- Category assignment
- Create/edit form with validation
- Delete with confirmation

**Testing checklist:**
- [ ] Status badges render (Draft/Published/Archived)
- [ ] Publish toggle works
- [ ] Featured flag works
- [ ] Categories assignable
- [ ] Create/edit/delete all work
- [ ] Toasts display on success/error

---

### Task 6.6: Create CRUD Pages — Gallery

**Description:** Album list, multi-image upload, delete, reorder images, captions, featured albums.

**Files to create:**
- `apps/web/src/app/admin/gallery/page.tsx`

**Dependencies:** Task 2.8 (Form components), API endpoints + Media upload endpoint

**Estimated complexity:** High (~4 hours)

**Acceptance criteria:**
- Album CRUD with cover image
- Multi-image upload to album
- Image reorder (drag or up/down)
- Caption and alt-text editing
- Featured album flag
- Image deletion

**Testing checklist:**
- [ ] Album CRUD works
- [ ] Multi-image upload works
- [ ] Reorder persists
- [ ] Captions editable
- [ ] Featured flag works
- [ ] Delete confirms

---

### Task 6.7: Create CRUD Pages — Contact Inquiries

**Description:** Inquiry list with status management (NEW, IN_PROGRESS, RESOLVED, ARCHIVED). View inquiry details.

**Files to create:**
- `apps/web/src/app/admin/inquiries/page.tsx`

**Dependencies:** Task 2.8 (Form components), API endpoints

**Estimated complexity:** Medium (~2 hours)

**Acceptance criteria:**
- Inquiry list with status filter
- Status update
- Detail view
- Pagination

**Testing checklist:**
- [ ] List renders with status filters
- [ ] Status updates persist
- [ ] Detail view renders full message
- [ ] Pagination works

---

### Task 6.8: Create Content Management Pages — Homepage & About

**Description:** Forms to manage homepage sections (hero, mission, vision, statistics, services, partner logos, client logos, CTA) and about content (company profile, history, objectives, leadership). Uses the content API (`/content/homepage`, `/content/about`).

**Files to create:**
- `apps/web/src/app/admin/homepage/page.tsx`
- `apps/web/src/app/admin/about/page.tsx`

**Dependencies:** Task 2.8 (Form components), Content API endpoints

**Estimated complexity:** High (~6 hours)

**Acceptance criteria:**
- All homepage sections editable (hero, mission, vision, stats, services, logos, CTA)
- All about sections editable (profile, history, objectives, leadership)
- Content saves via API and reflects on public pages
- Reusable section editor components (data-driven)

**Testing checklist:**
- [ ] Homepage hero editable
- [ ] Stats add/remove/edit
- [ ] Services add/remove/edit
- [ ] Partner/client logos add/remove
- [ ] About profile/history/objectives editable
- [ ] Leadership member CRUD
- [ ] Changes reflect on public pages

---

### Task 6.9: Create Content Management Pages — Corporate Training & Contact Info

**Description:** Forms to manage corporate training content (services, packages, industries, benefits, process) and contact info (office info, phones, emails, address, map, social links, office hours).

**Files to create:**
- `apps/web/src/app/admin/corporate-training/page.tsx`
- `apps/web/src/app/admin/contact-info/page.tsx`

**Dependencies:** Task 2.8 (Form components), Content API endpoints

**Estimated complexity:** Medium (~3 hours)

**Acceptance criteria:**
- Corporate training sections editable
- Contact info editable (phones, emails, address, map, social links, hours)
- Changes reflect on public pages

**Testing checklist:**
- [ ] Corporate training services/packages editable
- [ ] Contact info fields editable
- [ ] Changes reflect on public pages

---

### Task 6.10: Create Media Library

**Description:** Media Library page for uploading, browsing, and deleting media assets. Content forms reference media by ID.

**Files to create:**
- `apps/web/src/app/admin/media/page.tsx`

**Dependencies:** Media upload API endpoint

**Estimated complexity:** Medium (~2 hours)

**Acceptance criteria:**
- Upload files (images, documents)
- Browse uploaded media in a grid
- Filter by type
- Copy media URL / reference ID
- Delete media
- Reuse uploaded media in content forms

**Testing checklist:**
- [ ] Upload works
- [ ] Grid renders uploaded media
- [ ] Type filter works
- [ ] URL/ID copy works
- [ ] Delete works with confirmation

---

### Task 6.11: Create User Management

**Description:** Admin user management — list, create, edit, deactivate, assign roles.

**Files to create:**
- `apps/web/src/app/admin/users/page.tsx`

**Dependencies:** Task 2.8 (Form components), Admin user management API

**Estimated complexity:** Medium (~2 hours)

**Acceptance criteria:**
- Admin user list
- Create/edit admin users
- Role assignment
- Activate/deactivate
- Cannot deactivate self

**Testing checklist:**
- [ ] User list renders
- [ ] Create user works
- [ ] Role assignment persists
- [ ] Activate/deactivate works
- [ ] Self-deactivation blocked

---

### Task 6.12: Create Website Settings

**Description:** Website settings pages for branding, SEO, footer, and general settings. Uses the `WebsiteSetting` key-value JSON store.

**Files to create:**
- `apps/web/src/app/admin/settings/page.tsx`

**Dependencies:** Task 2.8 (Form components), Settings API

**Estimated complexity:** Medium (~2 hours)

**Acceptance criteria:**
- Branding settings editable (site name, logo, colors)
- SEO settings editable (meta defaults, OG defaults)
- Footer settings editable (tagline, social links)
- General settings editable
- Settings save to API

**Testing checklist:**
- [ ] Branding fields save
- [ ] SEO fields save
- [ ] Footer fields save
- [ ] General fields save
- [ ] Changes reflect on public site

---

### Task 6.13: Create AI Assistant Admin

**Description:** AI Assistant admin — upload knowledge documents, delete documents, rebuild RAG index, configure prompts, suggested questions, view indexing status.

**Files to create:**
- `apps/web/src/app/admin/ai-assistant/page.tsx`

**Dependencies:** AI Assistant API endpoints

**Estimated complexity:** Medium (~2 hours)

**Acceptance criteria:**
- Upload knowledge documents
- Delete documents
- Trigger RAG index rebuild
- Configure system prompt
- Edit suggested questions
- View indexing status

**Testing checklist:**
- [ ] Document upload works
- [ ] Document delete works
- [ ] Index rebuild trigger works
- [ ] Prompt config saves
- [ ] Suggested questions edit
- [ ] Indexing status displays

---

## Phase 7 — Accessibility (Day 19-20)

**Objective:** Ensure the entire site meets WCAG 2.1 AA standards.

### Task 7.1: Add Skip-to-Content Link

**Description:** Add a skip-to-content link as the first focusable element on every page.

**Files likely to change:**
- `apps/web/src/app/layout.tsx`

**Dependencies:** None

**Estimated complexity:** Low (~10 minutes)

**Acceptance criteria:**
- Skip link is first tabbable element
- Skip link is visually hidden until focused
- Skip link scrolls to main content

**Testing checklist:**
- [ ] Skip link is first in tab order
- [ ] Skip link visible on focus
- [ ] Tab press scrolls to main content

---

### Task 7.2: Add ARIA Landmarks

**Description:** Add proper ARIA landmarks to the layout: banner (header), navigation, main, contentinfo (footer).

**Files likely to change:**
- `apps/web/src/app/layout.tsx`
- `apps/web/src/components/layout/site-header.tsx`
- `apps/web/src/components/layout/site-footer.tsx`

**Dependencies:** None

**Estimated complexity:** Low (~15 minutes)

**Acceptance criteria:**
- Header has role="banner"
- Nav has role="navigation" with aria-label
- Main content has role="main"
- Footer has role="contentinfo"

**Testing checklist:**
- [ ] role="banner" on header
- [ ] role="navigation" on nav
- [ ] role="main" on main content
- [ ] role="contentinfo" on footer

---

### Task 7.3: Add Reduced Motion Support

**Description:** Wrap all transitions and animations in `@media (prefers-reduced-motion: no-preference)`. Ensure no content relies on animation.

**Files likely to change:**
- `apps/web/src/app/globals.css`

**Dependencies:** None

**Estimated complexity:** Low (~15 minutes)

**Acceptance criteria:**
- All transitions respect reduced-motion preference
- No content is hidden or broken when animations are disabled

**Testing checklist:**
- [ ] Enable "reduce motion" in OS settings
- [ ] Verify no animations play
- [ ] Verify all content is visible
- [ ] Verify all interactions work

---

### Task 7.4: Add Focus Indicators to All Interactive Elements

**Description:** Ensure every interactive element (links, buttons, inputs, cards, etc.) has a visible focus indicator.

**Files likely to change:**
- All component files

**Dependencies:** None

**Estimated complexity:** Medium (~1 hour)

**Acceptance criteria:**
- All links have visible focus ring
- All buttons have visible focus ring
- All inputs have visible focus ring
- All card links have visible focus ring
- Focus indicators meet 3:1 contrast ratio

**Testing checklist:**
- [ ] Tab through all interactive elements
- [ ] Verify focus indicator is visible on each
- [ ] Verify focus indicator contrast

---

### Task 7.5: Ensure Proper Heading Hierarchy

**Description:** Audit all pages to ensure exactly one h1 per page, no skipped heading levels, and meaningful heading text.

**Files likely to change:**
- All page files

**Dependencies:** None

**Estimated complexity:** Medium (~1 hour)

**Acceptance criteria:**
- Every page has exactly one h1
- No page skips from h1 to h3
- All heading text is descriptive

**Testing checklist:**
- [ ] Each page has one h1
- [ ] Heading hierarchy is sequential (h1→h2→h3)
- [ ] Headings are descriptive

---

## Phase 8 — Performance & Polish (Day 21-22)

**Objective:** Optimize performance and add final polish.

### Task 8.1: Configure TanStack Query + Axios

**Description:** Set up TanStack Query provider and Axios client for API integration. Replace static data on news, training, and gallery pages with API calls.

**Files to create:**
- `apps/web/src/lib/api-client.ts` (Axios instance)
- `apps/web/src/lib/query-provider.tsx` (TanStack Query provider)
- `apps/web/src/hooks/` (custom hooks for each module)

**Dependencies:** Backend API must be running

**Estimated complexity:** Medium (~2 hours)

**Acceptance criteria:**
- Axios client configured with base URL
- TanStack Query provider wraps the app
- Custom hooks fetch data for each module
- Loading states display during fetch
- Error states display on failure

**Testing checklist:**
- [ ] Axios client interceptors work
- [ ] TanStack Query caches data
- [ ] Loading skeletons display
- [ ] Error states display
- [ ] Data renders correctly

---

### Task 8.2: Add Image Optimization

**Description:** Replace all `<img>` tags with Next.js `<Image>` component. Add proper width, height, and placeholder blur.

**Files likely to change:**
- All files using images (logo, gallery, partner logos, client logos)

**Dependencies:** None

**Estimated complexity:** Medium (~1 hour)

**Acceptance criteria:**
- All images use Next.js Image component
- Images have proper width and height
- Images have `priority` on above-the-fold images
- Images have `loading="lazy"` on below-the-fold images

**Testing checklist:**
- [ ] No `<img>` tags remain (use `<Image>`)
- [ ] Above-fold images have priority
- [ ] Below-fold images have lazy loading
- [ ] No layout shift from images

---

### Task 8.3: Add Micro-Animations

**Description:** Add subtle entrance animations to cards on scroll. Add smooth transitions between routes.

**Files likely to change:**
- `apps/web/src/app/globals.css`
- Individual component files

**Dependencies:** Task 7.3 (reduced motion support must be done first)

**Estimated complexity:** Medium (~1 hour)

**Acceptance criteria:**
- Cards have subtle fade-in on scroll
- Transitions respect reduced-motion preference
- Animations are not distracting

**Testing checklist:**
- [ ] Cards fade in on scroll
- [ ] Reduced motion disables animations
- [ ] No performance impact
- [ ] Animations feel subtle

---

### Task 8.4: Add Loading/Empty/Error States

**Description:** Add skeleton loading states, empty state messages, and error state messages to all data-driven components.

**Files likely to change:**
- All feature components (NewsCard, TrainingCard, etc.)
- All page files

**Dependencies:** Task 8.1 (API integration)

**Estimated complexity:** Medium (~2 hours)

**Acceptance criteria:**
- Skeleton loading states display while data loads
- Empty state displays when no data exists
- Error state displays with retry button when API fails
- States are consistent across the application

**Testing checklist:**
- [ ] Skeleton displays during loading
- [ ] Empty state shows friendly message
- [ ] Error state shows message + retry
- [ ] States are visually consistent

---

## Summary

### Effort Estimation

| Phase | Tasks | Est. Time | Components Created/Modified |
|-------|-------|-----------|---------------------------|
| Phase 0 — Quick Wins | 5 | ~1 hour | 3 files modified |
| Phase 1 — Brand Foundation | 3 | ~1 hour | 1 file modified, ~10 files updated |
| Phase 1.3 — Data-Driven Foundation | 3 | ~6.5 hours | Shared contracts + mock data + page refactors |
| Phase 2 — Shared UI Components | 10 | ~6 hours | 10 new components, 2 files modified |
| Phase 3 — Homepage | 7 | ~2.5 hours | 1 file heavily modified |
| Phase 4 — Remaining Pages | 6 | ~6 hours | 6 page files modified |
| Phase 5 — AI Assistant | 2 | ~2.5 hours | 1-2 new files |
| Phase 6 — Admin UI (full CMS) | 13 | ~34 hours | 15+ new files |
| Phase 7 — Accessibility | 5 | ~3 hours | Multiple files modified |
| Phase 8 — Performance & Polish | 4 | ~6 hours | Multiple new + modified files |
| **Total** | **58** | **~68 hours** | **30+ new files, 20+ modified files** |

### Dependency Flow

```
Phase 0 (Quick Wins)
  └── No dependencies, can start immediately

Phase 1 (Brand Foundation)
  └── No dependencies, can start immediately
  └── Task 1.1 ──► All downstream color work
  └── Task 0.2 ──► All heading typography

Phase 1.3 (Data-Driven Foundation)
  └── Depends on: Phase 1 (tokens) — can run in parallel with Phase 2
  └── Task 1.3.1 (Shared contracts) ──► Mock data + page refactors
  └── Enables: Phase 8.1 (API integration) with no component rewrites

Phase 2 (Components)
  └── Depends on: Phase 1 (tokens must exist)
  └── Task 2.1 (Card) ──► NewsCard, TrainingCard
  └── Task 2.8 (Forms) ──► Contact form, Admin forms

Phase 3 (Homepage)
  └── Depends on: Phase 1 + Phase 1.3 + Phase 2

Phase 4 (Pages)
  └── Depends on: Phase 1 + Phase 1.3 + Phase 2

Phase 5 (AI Assistant)
  └── Depends on: Phase 1
  └── Also depends on: Backend AI service

Phase 6 (Admin UI)
  └── Depends on: Phase 1 + Phase 2
  └── Also depends on: API endpoints

Phase 7 (Accessibility)
  └── Depends on: All phases (should be done last)

Phase 8 (Performance)
  └── Depends on: All phases (should be done last)
```

### Parallel Execution Opportunities

- Phase 0 tasks can all be done in parallel
- Phase 1 tasks can be done in parallel
- Phase 1.3 (Data-Driven Foundation) can run in parallel with Phase 2 (Components)
- Phase 2 component tasks (Card, Hero, Stats, LogoGrid, Forms) can be done in parallel
- Phase 3 and 4 can be done partially in parallel if desired
- Phase 7 and 8 must be done last

### Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Missing logo file | Medium | High | Request from legacy site or designer |
| Backend AI service not ready | High | Medium | Phase 5 can be deferred; button links to contact as fallback |
| API endpoints not ready for Phase 6 | High | High | Build admin UI with static data, connect API later |
| Content API endpoints not ready for Phase 1.3 | Medium | Medium | Use typed mock data; swap to API in Phase 8.1 with no component changes |
| Hardcoded content already in pages requires refactor | High | Medium | Phase 1.3.3 refactors pages to data-driven sections before Phase 3/4 rebuilds |
| Color token rename breaks something | Low | Medium | Thorough search/replace with build verification |
| shadcn Sheet/Dialog not installable | Low | Medium | Build custom implementations using Radix primitives directly |
| Merriweather font impacts performance | Low | Low | Use font-display: swap; preconnect to Google Fonts |
