# ITSC Architecture Baseline

## Objective

ITSC is a corporate website and content platform, not a Learning Management System. The
first release showcases training services, corporate programs, news, galleries, contact
channels, and an AI-powered assistant.

Future LMS features such as student accounts, enrollment, certificates, payments, exams, and
analytics remain out of scope for Version 1.0 but should be technically feasible later.

## Core Principle — Dynamic Content-Managed Platform

**This is NOT a static website.** It is a dynamic content-managed platform.

Every piece of content that appears on the public website must eventually be manageable from
the Admin Portal. The frontend must be designed with this future integration in mind, even if
some pages temporarily use mock data during development.

### Frontend Data-Driven Rules

1. **No hardcoded business content in reusable components.** Components must accept props and
   TypeScript interfaces that can later be populated from API responses.
2. **Pages compose data-driven sections.** Each public page is a composition of section
   components, each receiving typed props. The page is responsible for fetching/assembling
   data (from API or temporary mock data) and passing it down.
3. **Mock data is temporary and documented.** Any page or component intentionally using mock
   data must be documented (a `// MOCK DATA` comment and an entry in the mock-data registry).
   Mock data must live in a dedicated `mock/` directory, never inline in components.
4. **API-ready interfaces.** Shared TypeScript contracts in `packages/shared` define the
   shape of every content entity so components and API responses stay in sync.
5. **No rewrite on integration.** The architecture must allow swapping mock data for API data
   by changing only the data-fetching layer, never the component props or structure.

### Admin-Manageable Content Scope

The Admin Portal must allow authorized administrators to manage:

- **Homepage** — hero, mission, vision, statistics, services, partner logos, client logos,
  CTA sections, homepage content.
- **About** — company profile, history, objectives, leadership, images.
- **Training Programs** — courses (CRUD), categories, duration, requirements, learning
  outcomes, images, featured, publish/unpublish.
- **Corporate Training** — services, packages, industries, benefits, process, images.
- **News** — articles (CRUD), draft/publish, featured, categories, images.
- **Gallery** — albums, multi-image upload, delete, reorder, captions, featured albums.
- **Contact** — office info, phones, emails, address, map, social links, office hours.
- **AI Assistant** — knowledge document upload/delete, RAG index rebuild, prompt config,
  suggested questions, indexing status.
- **Media Library** — upload, delete, reuse media.
- **User Management** — admin users, roles, permissions.
- **Website Settings** — branding, SEO, footer, general settings.

### Database & API Design Rules

1. Every public-facing section maps to a database entity (or a structured JSON content block)
   and a REST endpoint so it can be managed without code changes.
2. Content entities use the existing conventions: UUID PKs, slug-based public access, audit
   fields, status enums, and indexes for common filters.
3. The `WebsiteSetting` model (or a dedicated content model) stores structured JSON for
   flexible sections (hero, stats, CTA, contact info, social links) that do not warrant
   dedicated relational tables.
4. Media is managed through a Media Library entity; content references media by ID.
5. Admin endpoints are protected by `authenticate` + `authorize` middleware with role-based
   access.

## Stack

### Frontend

- Next.js 15 App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui-style primitives
- Lucide React
- React Hook Form and Zod
- TanStack Query and Axios

### Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- OpenAI API through an isolated AI service layer

## Workspace Boundaries

- `apps/web` owns public pages, admin UI, layout, SEO, and frontend data access.
- `apps/api` owns REST endpoints, auth, validation, business logic, persistence, uploads,
  AI integration, and operational middleware.
- `packages/shared` owns API response contracts and cross-app domain types.

## Backend Baseline

The API is versioned under `/api/v1` and returns a consistent response shape:

```json
{ "success": true, "message": "Operation completed successfully.", "data": {} }
```

```json
{ "success": false, "message": "Validation failed.", "errors": [] }
```

Mandatory backend concerns are present from the beginning:

- Helmet
- CORS
- Compression
- Rate limiting
- Zod environment validation
- Centralized error handling
- Request logging
- Prisma parameterized queries
- Health endpoint

## Database Baseline

Initial Prisma models:

- `Administrator`
- `TrainingCategory`
- `TrainingProgram`
- `NewsArticle`
- `GalleryAlbum`
- `GalleryImage`
- `ContactInquiry`
- `WebsiteSetting`

The schema uses UUID primary keys, slug-based public content, audit fields, status enums, and
indexes for common filters.

## Frontend Baseline

The frontend starts with:

- Global metadata and canonical URL support
- Open Graph and Twitter metadata defaults
- `robots.txt`
- XML sitemap route
- Shared navigation and footer
- Design tokens for the approved light theme
- Server-rendered homepage shell

## Feature Delivery Pattern

Each major module should be built as a vertical slice:

1. Database model and migration
2. Validation schema
3. Repository and service
4. Controller and route
5. Admin management UI
6. Public page integration
7. SEO, loading, empty, and error states
8. Focused validation and tests
