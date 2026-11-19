# ITSC Platform — Pre-Implementation Health Check

> **Date:** 2026-07-27  
> **Method:** Static code analysis + build verification + targeted searches across `apps/web` and `apps/api`  
> **Scope:** Full monorepo — API (Express), Web (Next.js), Shared (types), Docs  
> **Objective:** Identify all issues that must be addressed before redesign implementation begins

---

## 1. Project Structure

### Structure Verification

| Check | Status | Details |
|-------|--------|---------|
| Workspace structure | ✅ | Correct — `apps/api`, `apps/web`, `packages/shared` as npm workspaces |
| `apps/api` structure | ✅ | Feature-based modules (auth, training, news, gallery, contact, health) with schema→service→controller→routes clean architecture |
| `apps/web` structure | ⚠️ | Mostly correct — `app/` (pages), `components/` (ui, layout), `config/`, `lib/`. However `features/home/` is empty — should be removed or populated |
| `packages/shared` structure | ✅ | Clean — `index.ts` re-exports from `api-response.ts` and `content.ts` |

### Duplicate/Dead Components

| Component | Location | Issue |
|-----------|----------|-------|
| `features/home/` | `apps/web/src/features/home/` | **Dead directory** — directory exists but is completely empty. No files inside. Should be removed. |
| `getParam()` function | `apps/web/src/app/training-programs/page.tsx`, `news/page.tsx`, `gallery/page.tsx`, `contact/page.tsx` | **Duplicated** — exact same function `getParam(param, label)` defined in 4 controller files. Should be a shared utility in `apps/api/src/utils/`. |

### Dead Pages/Routes

| Route | Status | Notes |
|-------|--------|-------|
| `/` (home) | ✅ Active | Static page with hardcoded content |
| `/about` | ✅ Active | Static page with hardcoded content |
| `/training-programs` | ✅ Active | Static page — will be replaced with API-driven |
| `/training-programs/[slug]` | ✅ Active | Static hardcoded data — **build-blocking JSX error** |
| `/corporate-training` | ✅ Active | Static page |
| `/news` | ✅ Active | Static page |
| `/news/[slug]` | ❌ Not implemented | Listed as missing in TODO.md |
| `/gallery` | ✅ Active | Static page — **build-blocking JSX error** |
| `/contact` | ✅ Active | Static page — **build-blocking JSX error** |
| `/admin/*` | ❌ Not built | Entire admin portal missing |
| `/robots.ts` | ✅ Active | Dynamic robots.txt |
| `/sitemap.ts` | ✅ Active | Dynamic sitemap |

### Folder Organization Issues

| Issue | Location | Recommendation |
|-------|----------|---------------|
| Types duplicated in two places | `apps/api/src/types/` + `packages/shared/src/` | The API has its own type declarations that duplicate shared package types. Remove `apps/api/src/types/` and use only `@itsc/shared`. |
| Empty features directory | `apps/web/src/features/home/` | Remove or populate |
| Components not organized by domain | `apps/web/src/components/` | All components flat in `ui/`, `layout/`, no `sections/` or `features/` subdirectories yet |

### Circular Dependencies

No circular dependencies detected. The import graph is clean:
- `packages/shared` ← `apps/api` ← `apps/web`
- No cycles in module imports

---

## 2. Code Quality

### TODOs, FIXMEs, HACKs

| Count | Type | Location |
|-------|------|----------|
| 0 | `TODO` comments | None found in source code |
| 0 | `FIXME` | None found |
| 0 | `HACK` | None found |
| 0 | `XXX` | None found |

**Result:** No temporary code or workarounds. The codebase is clean of inline comments signaling issues.

### Commented-Out Code

| Location | Line(s) | Content |
|----------|---------|---------|
| `apps/web/src/app/training-programs/page.tsx` | 35-39 (inside hero) | Comments used for structured data — acceptable |
| `apps/web/src/app/gallery/page.tsx` | 71 | Missing `</div>` closing tag (uncommented, broken) |

### Duplicate Code Patterns

| Pattern | File Count | Lines | Description |
|---------|-----------|-------|-------------|
| `getParam()` | 4 files | ~8 each | Duplicated in training, news, gallery, contact controllers |
| Section+Container hero pattern | 7 pages | ~10 each | All pages repeat: `Section className="border-b border-border bg-white" > Container className="max-w-3xl text-center" > eyebrow > h1 > p` |
| Category badge styling | 3 files | ~3 each | `rounded-md bg-primary/10 px-2 py-1 text-primary` repeated |
| Card grids | 4 files | ~1 each | `grid gap-6 md:grid-cols-2` repeated across pages |
| CTA sections | 2 files | ~12 each | "Ready to get started?" with 2 buttons repeated on About and Corporate pages |

### Naming Conventions

| Convention | Assessment |
|------------|------------|
| File names | ✅ kebab-case consistently used |
| Component names | ✅ PascalCase |
| Functions | ✅ camelCase |
| Constants/Config | ✅ camelCase or UPPER_SNAKE |
| CSS classes | ✅ Tailwind utility classes (no custom class names) |
| TypeScript interfaces | ✅ PascalCase with `I` prefix avoided |
| Zod schemas | ✅ PascalCase + `Schema` suffix |

### Oversized Components

| File | Lines | Assessment |
|------|-------|------------|
| `page.tsx` (training-programs) | 203 | Too large — should be split into components (PageHero, TrainingCard, CategoryFilter) |
| `page.tsx` (training-programs/[slug]) | 271 | Too large — should be split (ProgramDetailHeader, ProgramObjectives, ProgramSidebar) |
| `page.tsx` (corporate-training) | 148 | Large — should use PageHero + Card components |
| `page.tsx` (home) | 106 | Reasonable for now, will grow with redesign |
| `page.tsx` (contact) | 148 | Large, broken HTML — will be refactored with form components |
| `auth.service.ts` | 111 | Reasonable for a service file |
| `gallery.service.ts` | 118 | Reasonable |
| `training.service.ts` | 205 | Large — could split into categories + programs services |

---

## 3. TypeScript

### Type Assertions

| Location | Pattern | Issue |
|----------|---------|-------|
| Training controller (6x) | `request.body as CreateCategoryInput` etc. | **Unnecessary** — Zod validation already parsed the body; the validated type should flow from the middleware |
| News controller (2x) | `request.body as CreateNewsInput` etc. | Same issue |
| Gallery controller (4x) | `request.body as CreateAlbumInput` etc. | Same issue |
| Contact controller (2x) | `request.body as SubmitContactInput` etc. | Same issue |
| Training controller | `request.query as unknown as ProgramQueryInput` | **Type unsafe** — should use the Zod-parsed query |
| News controller | `request.query as unknown as NewsQueryInput` | Same issue |
| Gallery controller | `request.query.page ? Number(request.query.page) : 1` | **Manual parsing** — Zod validation already runs via `validateRequest` but the query isn't being used from the validated result |
| Contact controller | `request.query as unknown as InquiryQueryInput` | Same issue |

### `any` / `unknown` Usage

| Location | Type | Issue |
|----------|------|-------|
| `training.service.ts` (3x) | `Record<string, unknown>` | Acceptable — used for dynamic Prisma `where` clause building |
| `news.service.ts` (1x) | `Record<string, unknown>` | Same pattern |
| `news.service.ts` (1x) | `Record<string, unknown>` | For dynamic `data` in update |
| `contact.service.ts` (1x) | `Record<string, unknown>` | Same pattern |
| `AppError.details` | `unknown` | Acceptable — generic error details |

### Inconsistent / Missing Type Definitions

| Issue | Details |
|-------|---------|
| `text-destructive` CSS class used | Contact page uses `className="text-destructive"` but `--color-destructive` is not defined in globals.css |

---

## 4. React

### Client/Server Component Balance

| Check | Result |
|-------|--------|
| `'use client'` directives | **None found** — all components are Server Components |
| Unnecessary client components | ✅ None detected — correct |
| Components that should be client | Contact form (when implemented), AI Assistant, mobile sheet — these are not built yet, so Server Components are correct for now |

### Missing Keys in Lists

| Location | Pattern | Issue |
|----------|---------|-------|
| `gallery/page.tsx:61` | `{album.images.map((image, index) => (` | Uses `index` as key — acceptable for static data, should use stable IDs when API-connected |

### Hydration Risks

| Location | Risk |
|----------|------|
| `news/page.tsx:81` | `toLocaleDateString("en-US", ...)` — will cause hydration mismatch if server and client have different locales. Should use a deterministic date formatter. |

### Prop Drilling

| Location | Pattern | Recommendation |
|----------|---------|----------------|
| `training-programs/[slug]/page.tsx` | Static data object passed through `programs[slug]` lookup | Acceptable for static data; will use API when connected |

---

## 5. Next.js

### App Router Best Practices

| Check | Status | Details |
|-------|--------|---------|
| Metadata API usage | ✅ | All pages use `export const metadata` or `generateMetadata()` |
| Layout usage | ✅ | Root layout with header/footer |
| Loading states | ❌ Missing | No `loading.tsx` files anywhere |
| Error states | ❌ Missing | No `error.tsx` files anywhere |
| Not-found states | ⚠️ Partial | `notFound()` is called in `training-programs/[slug]` but no custom `not-found.tsx` page |

### Image Usage

| Check | Result |
|-------|--------|
| Next.js Image component | **Not used anywhere** — no images currently exist in the app |
| Placeholder logo | `"IT"` text replaces the actual logo |

### Link Usage

| Check | Result |
|-------|--------|
| `<Link>` usage | ✅ Correct — all internal links use Next.js `<Link>` |

---

## 6. Styling

### Hardcoded Colors

| Location | Value | Issue |
|----------|-------|-------|
| Multiple files | `text-white/72`, `text-white/60`, `text-white/75` | Arbitrary opacity values — should use design tokens |
| `button.tsx` | `focus-visible:outline-2 focus-visible:outline-offset-2` | Should use token values |
| `globals.css` | Various hex values | Will be replaced in Phase 1 of redesign |

### Inline Styles

| Location | Content |
|----------|---------|
| **None found** | ✅ No inline `style` attributes used anywhere in the frontend |

### Hardcoded Spacing

| Location | Pattern | Inconsistency |
|----------|---------|---------------|
| Multiple pages | `mt-2`, `mt-3`, `mt-4`, `mt-6`, `mt-8`, `mt-10` | Inconsistent vertical rhythm — no system behind margin values |
| Multiple pages | `gap-6`, `gap-8`, `gap-12` | Inconsistent grid gaps |

---

## 7. Design System (Current State)

### Button Inconsistencies

| Location | Button Style |
|----------|-------------|
| `button.tsx` | CVA-based: primary (blue), secondary (indigo), outline, ghost |
| Pages | All use `Button` component — ✅ consistent |

### Card Inconsistencies

| Page | Card Padding | Shadow | Hover |
|------|-------------|--------|-------|
| Homepage feature cards | `p-6` | `shadow-sm` | ❌ None |
| Category cards | `p-5` | `shadow-sm` | `hover:border-primary` |
| News cards | `p-6` | `shadow-sm` | `hover:shadow-md` |
| Program cards | `p-6` | `shadow-sm` | ❌ None |

### Spacing Rhythm

| Page | Section Padding | Heading→Description Gap |
|------|----------------|------------------------|
| Home | `py-16 sm:py-20` | `mt-6` |
| About | `py-16 sm:py-20` | `mt-4` |
| Training | `py-16 sm:py-20` | `mt-6` |
| News | `py-16 sm:py-20` | `mt-6` |
| Gallery | `py-16 sm:py-20` | `mt-6` |
| Contact | `py-16 sm:py-20` | `mt-6` |

Section padding is consistent. Heading→description gap varies (mt-4 vs mt-6).

---

## 8. Accessibility

### Issues Found

| Issue | Location | Severity |
|-------|----------|----------|
| Missing closing divs → broken DOM | Contact, Gallery, Training slug pages | **Critical** |
| No skip-to-content link | All pages | High |
| Non-functional mobile hamburger | Header | High |
| No ARIA landmarks | Layout | Medium |
| No reduced motion support | Global CSS | Medium |
| No focus indicators on cards | All card grids | Medium |
| Gallery alt text displayed as text | Gallery page | Low |
| `scroll-behavior: smooth` without reduced motion fallback | globals.css | Medium |

---

## 9. Responsiveness

| Check | Result |
|-------|--------|
| Layout overflow | ✅ None detected |
| Fixed-width elements | ✅ None detected |
| Mobile navigation | ❌ Hamburger button does nothing |
| Responsive grids | ✅ All grids use responsive classes |
| Touch targets | ⚠️ Most meet 44×44px minimum |

---

## 10. Performance

| Check | Result |
|-------|--------|
| Unnecessary client bundles | ✅ None — all pages are Server Components |
| Image optimization | ❌ Not used (no images present) |
| Code splitting | ✅ Next.js handles automatically |
| Lazy loading | ❌ No real images to lazy load |

---

## 11. State Management

| Check | Result |
|-------|--------|
| Local state | ✅ None used (static pages) |
| Duplicated state | ✅ N/A |
| Data flow | ✅ Clean — pages receive no state (static) |

---

## 12. Forms

| Check | Status |
|-------|--------|
| Functional forms | ❌ Contact form has no `onSubmit` handler |
| Validation | ❌ None — raw HTML with `required` attribute only |
| React Hook Form | ❌ Not integrated |
| Loading/Error/Success states | ❌ Not implemented |

---

## 13. API Layer (Frontend)

| Check | Status |
|-------|--------|
| Axios configured | ❌ Not configured — in package.json but no client instance |
| TanStack Query configured | ❌ Not configured — in package.json but no provider |
| API abstraction | ❌ No API client or hooks exist |
| Error handling | ❌ Not implemented |
| Loading states | ❌ Not implemented |
| Empty states | ❌ Not implemented |
| Retry strategies | ❌ Not implemented |

---

## 14. Security

| Check | Result |
|-------|--------|
| Exposed secrets | ✅ None — environment variables use `.env.example` pattern |
| Unsafe HTML rendering | ✅ None — no `dangerouslySetInnerHTML` |
| Input sanitization | ✅ No user input rendered as HTML |
| `target="_blank"` without `rel` | ✅ No `target="_blank"` usage in frontend code |
| CORS (backend) | ✅ Properly configured with origin check |
| Helmet (backend) | ✅ Configured |
| Rate limiting (backend) | ✅ Tiered rate limiters |

---

## 15. SEO

| Check | Status |
|-------|--------|
| Metadata | ✅ All pages have metadata |
| Open Graph | ✅ Root layout has OG defaults |
| Sitemap | ✅ Dynamic `/sitemap.ts` |
| Robots | ✅ `/robots.ts` with admin path disallowed |
| Canonical URLs | ✅ Set in root layout |
| Structured data | ❌ Not implemented (legacy had schema.org) |
| Heading hierarchy | ⚠️ Some pages correct, some inconsistent |

---

## 16. Dependencies

### Unused Packages

| Package | Location | Status |
|---------|----------|--------|
| `@hookform/resolvers` | `apps/web` | **Unused** — in package.json but not imported anywhere |
| `@tanstack/react-query` | `apps/web` | **Unused** — in package.json but not configured |
| `react-hook-form` | `apps/web` | **Unused** — in package.json but not used in any component |
| `axios` | `apps/web` | **Unused** — in package.json but not configured |

### Deprecated Packages

| Package | Version | Status |
|---------|---------|--------|
| All packages | Current | No deprecated packages detected |

### Duplicate Packages

| Package | Locations | Issue |
|---------|-----------|-------|
| `typescript` | Root + `apps/api` + `apps/web` | Expected — consistent version (^5.9.3 / ^5) |
| `zod` | `apps/api` + `apps/web` | Expected — used in both workspaces |

---

## 17. Assets

| Asset | Status | Location |
|-------|--------|----------|
| Logo | ❌ Missing — using "IT" text placeholder | `site-header.tsx` |
| Favicon | ❌ Using default Next.js favicon | `app/favicon.ico` |
| Gallery images | ❌ Placeholder gradients | `gallery/page.tsx` |
| Partner logos | ❌ Not present | Will be added in Phase 3 |
| Client logos | ❌ Not present | Will be added in Phase 3 |

---

## 18. Documentation

| Document | Accuracy | Notes |
|----------|----------|-------|
| `README.md` | ✅ Accurate | Reflects current project structure and setup |
| `docs/architecture.md` | ✅ Accurate | Reflects current architecture decisions |
| `TODO.md` | ⚠️ Outdated | Lists `/news/[slug]` as "in progress" — should be "not started" |

---

## 19. Final Assessment

### Overall Project Health Score: **65/100**

| Category | Score | Assessment |
|----------|-------|------------|
| Project Structure | 70% | Clean monorepo; empty directory and duplicated types |
| Code Quality | 75% | Clean code, no TODOs, but duplicated patterns |
| TypeScript | 70% | Unnecessary type casts, `Record<string, unknown>` patterns |
| React | 80% | Good Server Component usage; hydration risk in news page |
| Next.js | 60% | Missing loading/error/not-found states |
| Styling | 50% | No design tokens, hardcoded values, inconsistent spacing |
| Design System | 40% | Partially consistent Button, inconsistent cards |
| Accessibility | 30% | Critical HTML issues, no skip-to-content, no ARIA |
| Responsiveness | 65% | Functional grids but broken mobile navigation |
| Performance | 70% | Good architecture, no optimization yet |
| State Management | 90% | Clean (no state) |
| Forms | 10% | Non-functional contact form |
| API Layer | 0% | Not configured |
| Security | 90% | Good backend security, safe frontend |
| SEO | 75% | Good metadata, missing structured data |
| Dependencies | 70% | 4 unused packages |
| Assets | 20% | Missing logo, images, favicon |
| Documentation | 80% | Mostly accurate |

---

### Technical Debt Summary

| Debt Item | Impact | Effort to Fix | Priority |
|-----------|--------|---------------|----------|
| 3 build-blocking JSX syntax errors | **Critical** — build fails | 10 min | **BLOCKER** |
| 4 unused npm packages | Weight, confusion | 5 min | Low |
| Empty `features/home/` directory | Confusion | 2 min | Low |
| Duplicated `getParam()` across 4 controllers | Maintenance burden | 15 min | Medium |
| All pages are hardcoded with static data | Cannot launch | Part of redesign | High |
| No API client configured | Cannot fetch data | Part of redesign | High |
| No form system | Contact form non-functional | Part of redesign | High |
| No loading/error/empty states | Poor UX when API connected | Part of redesign | Medium |
| No admin portal | Cannot manage content | Part of redesign | High |
| No mobile navigation | Broken mobile UX | Part of redesign | High |
| 2 TypeScript errors in API | Compilation warnings | 30 min | Medium |
| Duplicated types in `apps/api/src/types/` | Maintenance burden | 15 min | Low |
| No structured data (JSON-LD) | Suboptimal SEO | 30 min | Medium |
| Hydration risk in news date formatting | Potential bug | 5 min | Low |

---

### Risks Before Redesign

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **Build is broken** | ✅ Confirmed | Critical — cannot deploy or preview | Fix 3 JSX syntax errors (10 min) |
| **No test coverage** | ✅ Confirmed | Changes may break existing functionality | Manual verification after each phase |
| **4 unused packages** | ✅ Confirmed | Low — they are declared but not imported | Remove or configure during API integration phase |
| **API TypeScript errors** | ✅ Confirmed | Low — only 2 errors, unrelated to frontend | Fix separately or leave as-is |

---

### Blockers (Must Fix Before Redesign)

| # | Issue | Location | Est. Fix Time |
|---|-------|----------|---------------|
| 1 | Missing `</div>` in gallery/page.tsx line 71 | `apps/web/src/app/gallery/page.tsx` | 2 min |
| 2 | Missing `</div>` in contact/page.tsx lines 53, 62 | `apps/web/src/app/contact/page.tsx` | 5 min |
| 3 | Missing `</div>` in training-programs/[slug]/page.tsx line 210 | `apps/web/src/app/training-programs/[slug]/page.tsx` | 2 min |

**Total blocker fix time: ~10 minutes**

### Warnings (Can Be Postponed)

| # | Issue | Recommended Action |
|---|-------|-------------------|
| 1 | 2 TypeScript errors in API auth module | Fix when working on auth module |
| 2 | Duplicated `getParam()` function | Extract to shared utility when refactoring controllers |
| 3 | Empty `features/home/` directory | Remove during home page redesign (Phase 3) |
| 4 | Duplicated types in `apps/api/src/types/` | Remove when cleaning up shared package usage |
| 5 | Hydration risk in news date formatting | Fix when connecting news to API |

### Nice-to-Have Improvements

| # | Improvement | Effort |
|---|-------------|--------|
| 1 | Add `loading.tsx` to all page segments | 15 min |
| 2 | Add `error.tsx` to all page segments | 15 min |
| 3 | Add `not-found.tsx` | 10 min |
| 4 | Add structured data (JSON-LD) | 30 min |
| 5 | Remove 4 unused npm packages | 5 min |
| 6 | Fix API TypeScript errors | 30 min |

---

### Recommended Implementation Order

```
Step 1: FIX BLOCKERS (~10 minutes)
  ├── Fix gallery/page.tsx — add missing </div>
  ├── Fix contact/page.tsx — restructure contact info divs
  └── Fix training-programs/[slug]/page.tsx — add missing </div>

Step 2: Brand Foundation (Phase 1)
  ├── Color tokens → Button variants → Global color replacement
  └── Merriweather font → Heading typography

Step 3: Component Library (Phase 2)
  ├── Card → NewsCard, TrainingCard
  ├── PageHero → All page heroes
  ├── StatsSection → Homepage, About
  ├── LogoGrid → Homepage, About, Corporate
  ├── ContactInfo → Contact page, Footer
  └── Form components → Contact form, Admin forms

Step 4: Public Pages (Phase 3 + 4)
  ├── Homepage (most important)
  ├── About, Training, Corporate, News, Gallery, Contact
  └── Navigation + Footer updates

Step 5: Admin Portal + AI + Polish (Phase 5-8)
  ├── Admin UI
  ├── AI Assistant
  ├── Accessibility pass
  └── Performance optimization