# ITSC CMS Architecture — Dynamic Content-Managed Platform

> **Date:** 2026-08-03
> **Status:** Planning baseline for Phase 1.3 and Phase 2
> **Purpose:** Enforce the core principle that ITSC is a dynamic content-managed platform, not a static website. Every public-facing section must be manageable from the Admin Portal.

---

## 1. Core Principle

**This is NOT a static website.** It is a dynamic content-managed platform.

Every piece of content that appears on the public website must eventually be manageable from the Admin Portal. The frontend must be designed with this future integration in mind, even if some pages temporarily use mock data during development.

---

## 2. Frontend Data-Driven Architecture

### 2.1 Rules

1. **No hardcoded business content in reusable components.** Components must accept props and TypeScript interfaces that can later be populated from API responses.
2. **Pages compose data-driven sections.** Each public page is a composition of section components, each receiving typed props. The page is responsible for fetching/assembling data (from API or temporary mock data) and passing it down.
3. **Mock data is temporary and documented.** Any page or component intentionally using mock data must be documented (a `// MOCK DATA` comment and an entry in the mock-data registry). Mock data must live in a dedicated `mock/` directory, never inline in components.
4. **API-ready interfaces.** Shared TypeScript contracts in `packages/shared` define the shape of every content entity so components and API responses stay in sync.
5. **No rewrite on integration.** The architecture must allow swapping mock data for API data by changing only the data-fetching layer, never the component props or structure.

### 2.2 Proposed Frontend Structure

```
apps/web/src/
  app/
    (public pages — compose sections, fetch data)
    admin/
      (admin portal pages)
  components/
    sections/          # Data-driven section components (typed props)
      hero-section.tsx
      stats-section.tsx
      services-section.tsx
      logo-grid.tsx
      mission-vision-section.tsx
      cta-section.tsx
      contact-info-section.tsx
      ...
    features/          # Feature-specific cards (NewsCard, TrainingCard, etc.)
    ui/                # Generic UI primitives (Button, Card, Input, etc.)
  lib/
    api/               # API client + hooks (TanStack Query + Axios)
    mock/              # Temporary mock data (documented, replaceable)
  config/
    site.ts            # Static config only (nav structure, non-content constants)
```

### 2.3 Data Flow

```
Admin Portal (forms)  →  API (REST)  →  Database (Prisma/PostgreSQL)
                                          ↓
Public Pages (Server Components / Client fetch)  ←  API (REST)  ←  Database
```

- **Public pages** fetch content via the API (or temporary mock data) and pass typed props to section components.
- **Admin portal** provides CRUD forms that write to the same API.
- **Shared contracts** (`packages/shared`) define the TypeScript shapes used by both sides.

---

## 3. Content Model — Database Entities

The following entities are required to make every public section manageable. Existing models are marked `[EXISTS]`; new models are proposed.

### 3.1 Homepage

| Entity | Purpose | Status |
|--------|---------|--------|
| `HomepageContent` | Hero (title, subtitle, CTAs, background image), mission, vision, CTA section | NEW |
| `Statistic` | Value + label (e.g., "100+", "Courses") | NEW |
| `Service` | Icon, title, description (homepage services overview) | NEW |
| `PartnerLogo` | Image, alt, href, sort order | NEW |
| `ClientLogo` | Image, alt, href, sort order | NEW |

### 3.2 About

| Entity | Purpose | Status |
|--------|---------|--------|
| `AboutContent` | Company profile, history, objectives (structured JSON or fields) | NEW |
| `LeadershipMember` | Name, role, bio, image, sort order | NEW |

### 3.3 Training Programs

| Entity | Purpose | Status |
|--------|---------|--------|
| `TrainingCategory` | Category (name, slug, description) | EXISTS |
| `TrainingProgram` | Course (title, slug, descriptions, duration, delivery mode, level, featured image, isFeatured, status) | EXISTS |
| `TrainingRequirement` | Requirement item per program | NEW |
| `LearningOutcome` | Outcome item per program | NEW |

### 3.4 Corporate Training

| Entity | Purpose | Status |
|--------|---------|--------|
| `CorporateTrainingContent` | Services, packages, industries, benefits, process (structured JSON or fields) | NEW |

### 3.5 News

| Entity | Purpose | Status |
|--------|---------|--------|
| `NewsArticle` | Article (title, slug, summary, content, featured image, publishedAt, status) | EXISTS |
| `NewsCategory` | Category (name, slug) | NEW |
| `NewsArticleCategory` | Many-to-many join (article ↔ category) | NEW |

### 3.6 Gallery

| Entity | Purpose | Status |
|--------|---------|--------|
| `GalleryAlbum` | Album (title, slug, description, cover image, isFeatured) | EXISTS (add `isFeatured`) |
| `GalleryImage` | Image (albumId, imageUrl, caption, altText, sortOrder) | EXISTS (add `sortOrder`) |

### 3.7 Contact

| Entity | Purpose | Status |
|--------|---------|--------|
| `ContactInquiry` | Submitted inquiry (fullName, email, phone, organization, subject, message, status) | EXISTS |
| `ContactInfo` | Office info, phones, emails, address, map embed, social links, office hours (structured JSON) | NEW |

### 3.8 AI Assistant

| Entity | Purpose | Status |
|--------|---------|--------|
| `KnowledgeDocument` | Uploaded document (title, fileUrl, status, indexedAt) | NEW |
| `AiAssistantConfig` | Prompt config, suggested questions, RAG index status (structured JSON) | NEW |

### 3.9 Media Library

| Entity | Purpose | Status |
|--------|---------|--------|
| `MediaAsset` | Uploaded file (filename, url, mimeType, size, altText, uploadedBy) | NEW |

### 3.10 User Management

| Entity | Purpose | Status |
|--------|---------|--------|
| `Administrator` | Admin user (fullName, email, passwordHash, role, status, lastLogin) | EXISTS |
| `Role` / `Permission` | Granular role/permission model (optional; can use existing `AdminRole` enum initially) | OPTIONAL |

### 3.11 Website Settings

| Entity | Purpose | Status |
|--------|---------|--------|
| `WebsiteSetting` | Key-value JSON store (branding, SEO, footer, general) | EXISTS |

---

## 4. API Surface

All endpoints are under `/api/v1`. Public endpoints are unauthenticated; admin endpoints require `authenticate` + `authorize`.

### 4.1 Existing Endpoints

| Module | Public | Admin |
|--------|--------|-------|
| Health | `GET /health` | — |
| Auth | — | `POST /auth/login`, `POST /auth/register`, `GET /auth/me` |
| Training | `GET /training/categories`, `GET /training/categories/:slug`, `GET /training/programs`, `GET /training/programs/:slug` | CRUD for categories + programs |
| News | `GET /news`, `GET /news/:slug` | CRUD for articles |
| Gallery | `GET /gallery/albums`, `GET /gallery/albums/:slug` | CRUD for albums + images |
| Contact | `POST /contact/inquiries` | CRUD for inquiries |

### 4.2 Proposed New Endpoints

| Module | Public | Admin |
|--------|--------|-------|
| Homepage | `GET /content/homepage` | `PUT /content/homepage`, CRUD for stats/services/partner-logos/client-logos |
| About | `GET /content/about` | `PUT /content/about`, CRUD for leadership |
| Corporate Training | `GET /content/corporate-training` | `PUT /content/corporate-training` |
| Contact Info | `GET /content/contact-info` | `PUT /content/contact-info` |
| News Categories | `GET /news/categories` | CRUD for news categories |
| Media | — | `POST /media/upload`, `GET /media`, `DELETE /media/:id` |
| AI Assistant | `POST /ai/chat` | `POST /ai/documents`, `DELETE /ai/documents/:id`, `POST /ai/rebuild-index`, `GET /ai/status`, `PUT /ai/config` |
| Users | — | CRUD for administrators |
| Settings | `GET /settings/public` | `GET /settings`, `PUT /settings/:key` |

---

## 5. Admin Portal Capabilities

The Admin Portal must allow authorized administrators to manage:

### 5.1 Homepage
- Hero section (title, subtitle, CTAs, background image)
- Mission, Vision
- Statistics (value + label)
- Services (icon, title, description)
- Partner logos, Client logos
- CTA sections
- Homepage content

### 5.2 About
- Company profile, History, Objectives
- Leadership information (name, role, bio, image)
- Images

### 5.3 Training Programs
- Create/Edit/Delete courses
- Categories
- Duration, Requirements, Learning outcomes
- Images
- Featured courses
- Publish/Unpublish

### 5.4 Corporate Training
- Services, Packages, Industries, Benefits, Process
- Images

### 5.5 News
- Create/Edit/Delete
- Draft/Publish
- Featured news
- Categories
- Images

### 5.6 Gallery
- Albums
- Upload multiple images
- Delete images
- Reorder images
- Captions
- Featured albums

### 5.7 Contact
- Office information
- Phone numbers, Emails, Address
- Google Maps
- Social media links
- Office hours

### 5.8 AI Assistant
- Upload knowledge documents
- Delete documents
- Rebuild RAG index
- Configure prompts
- Suggested questions
- View indexing status

### 5.9 Media Library
- Upload files
- Delete files
- Reuse uploaded media

### 5.10 User Management
- Admin users
- Roles
- Permissions

### 5.11 Website Settings
- Branding
- SEO
- Footer
- General settings

---

## 6. Mock Data Strategy

1. **Dedicated `mock/` directory** — all temporary mock data lives in `apps/web/src/lib/mock/`, organized by module (e.g., `homepage.ts`, `about.ts`, `training.ts`).
2. **Documented** — each mock file has a header comment: `// MOCK DATA — replace with API integration (see docs/cms-architecture.md)`.
3. **Typed** — mock data conforms to the same shared TypeScript contracts as API responses, so swapping is a data-layer change only.
4. **Registry** — a `MOCK_DATA.md` (or section in this doc) tracks which pages/components use mock data and their integration status.

### Mock Data Registry (to be maintained)

| Page / Component | Mock Data Source | Integration Status |
|------------------|------------------|--------------------|
| Homepage | `mock/homepage.ts` | Pending |
| About | `mock/about.ts` | Pending |
| Training Programs | `mock/training.ts` | Pending |
| Corporate Training | `mock/corporate-training.ts` | Pending |
| News | `mock/news.ts` | Pending |
| Gallery | `mock/gallery.ts` | Pending |
| Contact | `mock/contact.ts` | Pending |

---

## 7. Implementation Order (Phase 1.3 + Phase 2)

### Phase 1.3 — Data-Driven Foundation
1. Define shared TypeScript contracts in `packages/shared` for all content entities.
2. Create `apps/web/src/lib/mock/` with typed mock data for all public sections.
3. Refactor public pages to compose data-driven section components (typed props), fed by mock data.
4. Document mock data usage in the registry.

### Phase 2 — Backend Content Models + API
1. Extend Prisma schema with new content entities (homepage, about, corporate training, contact info, news categories, media, AI, etc.).
2. Add validation schemas, services, controllers, and routes for each new module.
3. Add media upload infrastructure.
4. Add AI assistant module (documents, RAG, config, chat).

### Phase 2.5 — Admin Portal
1. Admin layout + auth (login, dashboard).
2. CRUD pages for each content module (homepage, about, training, corporate, news, gallery, contact, media, users, settings, AI).
3. Wire admin forms to the API.

### Phase 2.8 — Public API Integration
1. Replace mock data with API calls (TanStack Query + Axios) on public pages.
2. Add loading/empty/error states.
3. Verify full integration: frontend → API → database.

---

## 8. Acceptance Criteria

- [ ] No hardcoded business content in reusable components.
- [ ] All public pages compose data-driven section components with typed props.
- [ ] Mock data lives in `mock/` and is documented in the registry.
- [ ] Every public-facing section has a corresponding database entity and API endpoint.
- [ ] Admin Portal can manage every public-facing section without code changes.
- [ ] Swapping mock data for API data requires no component changes.