# DWS PublishFlow

A professional internal web platform for managing vehicle inventory, preparing
publication-ready content, organizing Facebook group targets, tracking
publication history, and assisting publication workflows for automotive
businesses.

The first deployment is used internally by **Hernández Car Import**. The system
is built as a strong foundation that can evolve into a multi-company SaaS product
later, while the first version stays focused, stable, secure, and useful as an
internal business tool.

> Built by Darkward Studio (DWS).

## What this is

- A tool to **manage vehicle inventory** and store vehicle images.
- A tool to **prepare publication content** and keep a reusable **Facebook group library**.
- A tool to run an **assisted publishing workflow** and keep a complete
  **publication history** with logs.

## What this is not

- It is **not** a spam tool.
- It is **not** a tool to bypass Facebook restrictions, captchas, checkpoints,
  or platform limits.
- It is **not** a fully automatic Facebook group bot. Facebook Groups use an
  **assisted** workflow; Facebook Pages are prepared for **official Meta APIs**
  in a later phase.

## Technology

- [Next.js](https://nextjs.org/) (App Router) + TypeScript (strict)
- [Tailwind CSS](https://tailwindcss.com/) with a centralized CSS-variable theme
- [Supabase](https://supabase.com/): Postgres, Auth, Storage, Row Level Security
- [Playwright](https://playwright.dev/) — reserved for future internal automation and testing only

## Project status

**Phase 1 — Foundation & authentication.** The application scaffold is in place:
Next.js + TypeScript + Tailwind, the Supabase client structure, database
migrations with Row Level Security, Supabase Auth (login, invite-oriented
signup, password reset, logout), middleware route protection, the centralized
theme system, and a protected dashboard shell. Inventory, groups, and
publication modules arrive in later phases — see [docs/roadmap.md](docs/roadmap.md).

## Documentation

| Document | Purpose |
|----------|---------|
| [docs/architecture.md](docs/architecture.md) | System architecture, layering, folder structure |
| [docs/authentication.md](docs/authentication.md) | Supabase Auth flow, sessions, roles, protected routes |
| [docs/database-design.md](docs/database-design.md) | Schema, tables, enums, relationships |
| [docs/security-and-rls.md](docs/security-and-rls.md) | RLS policies, threat model, secrets handling |
| [docs/theme-and-branding.md](docs/theme-and-branding.md) | Theme tokens, branding, multi-company theming |
| [docs/publication-workflow.md](docs/publication-workflow.md) | The publication workflow, end to end |
| [docs/automation-strategy.md](docs/automation-strategy.md) | Strategy abstraction, what is and is not automated |
| [docs/catalog-integration.md](docs/catalog-integration.md) | Future public catalog integration plan |
| [docs/roadmap.md](docs/roadmap.md) | Phased development roadmap |
| [docs/code-standards.md](docs/code-standards.md) | TypeScript, BEM `dws-` naming, comment style |

## Getting started

### Requirements

- Node.js 20+
- A Supabase project (Postgres, Auth)

### Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment variables. Copy the template and fill in your Supabase
   values (never commit the result):

   ```bash
   cp .env.example .env.local
   ```

   Required variables are documented in [.env.example](.env.example). The
   service role key is server-side only and must never be exposed to the browser.

3. Apply the database migrations in order against your Supabase database (see
   [src/db/migrations/README.md](src/db/migrations/README.md)), then create the
   owner user in Supabase Auth and link their profile as described in the seed.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint the project |
| `npm run typecheck` | Type-check without emitting |

> A test runner is not configured yet; it is planned for a later phase.
