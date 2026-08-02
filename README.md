# ITSC Website Platform

Corporate website and content management platform for ITSC Technology Support.

This project is not an LMS. Version 1.0 focuses on a professional public website, a secure
admin portal, dynamic content management, SEO, performance, accessibility, and a modular
AI assistant. The architecture is intentionally prepared for future LMS capabilities.

## Workspace

```txt
apps/
  api/      Express, Prisma, PostgreSQL, OpenAI integration
  web/      Next.js 15 App Router frontend
packages/
  shared/   Shared TypeScript contracts
docs/       Architecture and project notes
```

## Requirements

- Node.js 22+
- npm 11+
- PostgreSQL for backend development

## Setup

```bash
npm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
npm run typecheck
```

After configuring `DATABASE_URL`, generate Prisma Client:

```bash
npm run prisma:generate -w @itsc/api
```

## Development

```bash
npm run dev -w web
npm run dev -w @itsc/api
```

The frontend runs on `http://localhost:3000`.
The API is designed around `http://localhost:5000/api/v1`.

## Baseline Principles

- Unified TypeScript stack with Next.js 15, Express, Prisma, and PostgreSQL.
- Feature-based organization with clean architecture boundaries.
- Server Components preferred for public pages.
- Security, SEO, accessibility, and performance are MVP requirements.
- Admin content management should minimize routine developer intervention.
