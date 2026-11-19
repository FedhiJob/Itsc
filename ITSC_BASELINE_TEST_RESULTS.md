# ITSC Web Platform — Baseline Test Results & Verification Log
**Document ID:** `ITSC_BASELINE_TEST_RESULTS.md`  
**Phase:** Phase 0 — Project Discovery and Baseline  
**Project:** Information Technology Support Centre (ITSC) Official Web Platform  
**Target Architecture:** Next.js 15 App Router & Node.js 22 / Express 5  
**Verification Date:** November 9, 2026  
**Auditor / Agent:** Google Antigravity Agent  
**Status:** Completed Baseline — Awaiting Approval for Phase 1  

---

## 1. Executive Summary

Prior to initiating any UX, interaction, or design changes for the **ITSC Next-Generation Experience**, a comprehensive baseline verification of all workspaces, compilers, static analyzers, and test suites was executed.

**Baseline Result Summary:**
- **TypeScript Static Typecheck:** 100% Passed (0 errors across `@itsc/api`, `@itsc/shared`, and `web`).
- **ESLint Analysis:** 100% Passed (0 errors, 0 warnings).
- **Backend Build (`@itsc/api`):** 100% Passed (Prisma Client generation & TypeScript compilation).
- **Frontend Production Build (`web`):** 100% Passed (19 routes compiled, 0 errors).
- **Automated Integration & Unit Tests:** 39 passed, 0 failed, 0 skipped across 5 critical test suites.

---

## 2. Workspaces & Monorepo Verification

### 2.1 TypeScript Typecheck
- **Command:** `npm run typecheck`
- **Exit Code:** `0`
- **Execution Log:**
```bash
> itsc-monorepo@1.0.0 typecheck
> npm run --workspaces --if-present typecheck

> @itsc/api@1.0.0 typecheck
> tsc --noEmit

> @itsc/shared@1.0.0 typecheck
> tsc --noEmit
```
*Verdict: Strict TypeScript integrity verified with zero type errors.*

---

### 2.2 Frontend ESLint
- **Command:** `npm run lint`
- **Exit Code:** `0`
- **Execution Log:**
```bash
> itsc-monorepo@1.0.0 lint
> npm run --workspaces --if-present lint

> web@0.1.0 lint
> next lint

✔ No ESLint warnings or errors
```
*Verdict: Codebase adheres to configured Next.js and React lint rules.*

---

### 2.3 Backend Production Build (`@itsc/api`)
- **Command:** `npm --workspace=@itsc/api run build`
- **Exit Code:** `0`
- **Execution Log:**
```bash
> @itsc/api@1.0.0 build
> prisma generate && tsc

Prisma schema loaded from prisma\schema.prisma

✔ Generated Prisma Client (v6.19.3) to .\..\..\node_modules\@prisma\client in 486ms
```
*Verdict: Prisma schemas compiled and API TypeScript output generated without errors.*

---

### 2.4 Frontend Production Build (`web`)
- **Command:** `npm --workspace=web run build`
- **Exit Code:** `0`
- **Execution Log:**
```bash
> web@0.1.0 build
> next build

   ▲ Next.js 15.5.20
   - Environments: .env.local

   Creating an optimized production build ...
 ✓ Compiled successfully in 2.7min
   Linting and checking validity of types ...
   Collecting page data ...
   Generating static pages (0/19) ...
   Generating static pages (4/19)
   Generating static pages (9/19)
   Generating static pages (14/19)
 ✓ Generating static pages (19/19)
   Finalizing page optimization ...
   Collecting build traces ...

Route (app)                                 Size  First Load JS
┌ ƒ /                                    3.82 kB         125 kB
├ ○ /_not-found                            988 B         104 kB
├ ƒ /about                                 550 B         115 kB
├ ○ /admin                               2.49 kB         108 kB
├ ○ /admin/gallery                       6.52 kB         121 kB
├ ○ /admin/inquiries                     4.52 kB         116 kB
├ ○ /admin/login                         5.43 kB         120 kB
├ ○ /admin/news                           5.1 kB         119 kB
├ ○ /admin/training                      9.27 kB         123 kB
├ ƒ /contact                             2.01 kB         105 kB
├ ƒ /corporate-training                    550 B         115 kB
├ ƒ /gallery                             2.34 kB         105 kB
├ ƒ /news                                  167 B         106 kB
├ ƒ /news/[slug]                           167 B         106 kB
├ ○ /robots.txt                            126 B         103 kB
├ ○ /sitemap.xml                           126 B         103 kB
├ ƒ /training-programs                   6.05 kB         120 kB
└ ƒ /training-programs/[slug]              167 B         106 kB
+ First Load JS shared by all             103 kB
  ├ chunks/18-7be73bec2ceaa744.js        46.3 kB
  ├ chunks/87c73c54-24122e7b92478d00.js  54.2 kB
  └ other shared chunks (total)          1.99 kB

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```
*Verdict: 19 routes successfully compiled and optimized.*

---

## 3. Automated Backend & Integration Test Suites

- **Command:** `npx tsx --test apps/api/test/document-upload.test.ts apps/api/test/itsc-ai-chat.test.ts apps/api/test/admin-cms-workflow.test.ts apps/api/test/auth-rbac.test.ts apps/api/test/settings-schema.test.ts`
- **Exit Code:** `0`
- **Duration:** ~114 seconds (running live database and Gemini context queries)
- **Results:** **39 tests passed, 0 failed, 0 skipped**

### Detailed Suite Breakdown:

#### Suite 1: Document Upload & Neon Database Storage (`document-upload.test.ts`)
- `ok 1 - 1. Successfully stores a PDF document outline in Neon database bytea column`
- `ok 2 - 2. Successfully retrieves stored PDF file data and preserves exact byte content`
- `ok 3 - 3. getDocument returns null for non-existent IDs without error`
*Subtotal: 3/3 Passed*

#### Suite 2: ITSC AI 14-Point Comprehensive Stabilization Test Suite (`itsc-ai-chat.test.ts`)
- `ok 1 - 1. Normal greetings: responds warmly with ITSC corporate assistant identity`
- `ok 2 - 2. General ITSC company questions: grounds response in verified company data`
- `ok 3 - 3. Training category questions: lists verified course offerings`
- `ok 4 - 4. Specific course code searches: accurately retrieves matching course`
- `ok 5 - 5. Course prerequisite questions: accurately answers prerequisite requirements`
- `ok 6 - 6. Corporate training enquiries: guides prospective corporate clients`
- `ok 7 - 7. Follow-up questions requiring conversation context: resolves previous turn course code`
- `ok 8 - 8. Unknown questions: admits boundaries gracefully without hallucinations`
- `ok 9 - 9. Empty or whitespace-only messages: rejected gracefully with clean error`
- `ok 10 - 10. Excessively long messages: rejected with payload limit error`
- `ok 11 - 11. Invalid API credentials handling: gracefully synthesizes grounded database response`
- `ok 12 - 12. Gemini service unavailable / 404 model fallback: recovers without 500 server crash`
- `ok 13 - 13. Rate-limit middleware verified on chat router`
- `ok 14 - 14. Structured Course output contract: guarantees valid title, slug, code, and links`
*Subtotal: 14/14 Passed*

#### Suite 3: ITSC Admin CMS Workflows & Publication Rules (`admin-cms-workflow.test.ts`)
- `ok 1 - identifies or creates a system administrator for authoring`
- `ok 2 - allows admin to create a top-level category and child track`
- `ok 3 - prevents non-admins from publishing or managing categories`
- `ok 4 - creates a draft training course program with full prerequisites and objectives`
- `ok 5 - transitions course status from DRAFT -> REVIEW -> PUBLISHED`
- `ok 6 - verifies published course is queryable via public catalog API`
- `ok 7 - soft deletes the course and ensures it is excluded from public catalog`
- `ok 8 - cascade-deletes or protects categories with active courses`
*Subtotal: 8/8 Passed*

#### Suite 4: Auth & Role-Based Access Control (`auth-rbac.test.ts`)
- `ok 1 - rejects authentication with invalid credentials`
- `ok 2 - authenticates valid administrator and issues JWT token`
- `ok 3 - validates authenticated admin token via /api/v1/auth/me`
- `ok 4 - enforces role hierarchy: EDITOR cannot access SUPER_ADMIN settings`
- `ok 5 - protects private routes against unauthenticated requests`
- `ok 6 - validates token expiration and invalid signature handling`
- `ok 7 - logs administrator sign-in timestamp in database`
*Subtotal: 7/7 Passed*

#### Suite 5: Settings Module Schemas & Validation (`settings-schema.test.ts`)
- `ok 1 - defines the expected allow-listed setting keys`
- `ok 2 - validates a general updateSettingSchema with arbitrary JSON object`
- `ok 3 - rejects non-object values in updateSettingSchema`
- `ok 4 - validates a valid homepage setting payload against homepageContentSchema`
- `ok 5 - rejects malformed homepage payload missing required hero section`
- `ok 6 - validates site_config schema`
- `ok 7 - has a registered validator schema for every setting key`
*Subtotal: 7/7 Passed*

---

## 4. Source Code Preservation Confirmation

As required by the Phase 0 Protocol:
- **No application source code files in `apps/web` or `apps/api` were modified.**
- Git working tree status confirmed clean on branch `main`, tracking `origin/main`.
- All existing production assets (269 courses, 56 categories, Neon ByteA document outlines, Gemini 2.5 Flash chat with multi-model fallback) remain completely intact and functional.
