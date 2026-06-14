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

**Phase 0 — Planning & documentation.** No application code yet. This repository
currently contains the architecture, security, database, theme, workflow, and
roadmap documentation that the implementation phases will build on.

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

Setup instructions, environment configuration, and scripts will be added in
**Phase 1** together with the application scaffold. Required environment
variables are documented in [.env.example](.env.example).
