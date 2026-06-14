# Roadmap

Phased plan for DWS PublishFlow. Each phase is shippable and builds on the
previous one. Dates are indicative targets from a **June 2026** start; sequence
and scope matter more than exact dates. Run lint, typecheck, build, and tests
before closing each phase ([code-standards.md](code-standards.md)).

## Phase 0 — Planning & documentation ✅ (complete: June 2026)

- Inspect existing project (empty repo).
- Architecture, authentication, database, security/RLS, theme, workflow,
  automation, and catalog documentation.
- Folder structure, code standards, roadmap.
- `.gitignore`, `.env.example`, `README`.
- Initial commit. **No application code.**

## Phase 1 — Foundation & auth (target: late June 2026)

- Scaffold Next.js + TypeScript (strict) + Tailwind.
- Supabase project wiring (browser/server/admin client factories).
- SQL migrations implementing the schema + enums + RLS policies.
- Generated DB types.
- Supabase Auth: `/login`, invite-ready `/signup`, `/forgot-password`.
- Middleware route protection; profile + company loading.
- Theme system in `lib/theme/` with the Hernández Car Import theme.
- App shell/layout, base UI components, scripts (`lint`, `typecheck`, `build`,
  `test`).
- Seed the first company and an owner profile.
- `code-reviewer` + RLS isolation tests.

## Phase 2 — Vehicle management (target: July 2026)

- Vehicle CRUD: create, edit, delete, duplicate.
- Image upload to Supabase Storage (private bucket, signed URLs), reordering.
- Status and visibility management.
- Search and filters (status, visibility).
- Strong Zod validation; loading/empty/error states.

## Phase 3 — Dashboard & group library (target: July–August 2026)

- Dashboard: total/draft/ready/published counts, active groups, recent activity,
  recent vehicles (structured for later analytics).
- Group library CRUD: add/edit/disable, search, active/inactive filter, notes.

## Phase 4 — Publication workflow & history (target: August 2026)

- Publication content preparation (editable text; AI-ready structure).
- Workflow: select vehicle → review text → select groups → confirm → create
  publication + targets.
- Assisted publishing checklist (copy text, open URL, mark completed/failed,
  error details, images).
- Publication history: search, filters, sorting, status filters, logs.

## Phase 5 — Settings, roles & hardening (target: September 2026)

- Company settings (name, logo, theme colors, theme key) for `owner`.
- Profile/account page.
- Role enforcement pass (`owner`/`admin`/`staff`).
- Security hardening: automated RLS tests, secret scanning in CI, rate limiting,
  security headers; `senior-secops` / `senior-security` review.

## Phase 6+ — Future expansion (no committed dates)

Prioritized later, behind the existing abstractions:

- Public catalog integration ([catalog-integration.md](catalog-integration.md)).
- Meta Pages API and Instagram Business API
  ([automation-strategy.md](automation-strategy.md)).
- Internal, compliant assisted RPA (only if stable and within platform terms).
- AI-generated descriptions.
- Scheduled publications / reposting (`scheduled_for` already modeled).
- Webhooks (n8n / Make), WhatsApp notifications, CRM/lead/analytics.
- SaaS expansion: billing, subscriptions, public onboarding, multi-tenant admin.

## Risks and limitations

- **Platform/ToS risk (Facebook):** mitigated by assisted-first design, official
  APIs where available, and no automation that violates platform terms.
- **RLS correctness:** the core security control — must be covered by tests
  before any external exposure.
- **Single-company assumption creep:** guard against code that assumes one
  company; isolation is always applied.
- **Scope creep toward a bot:** the foundation is inventory + assisted
  publishing, not automation. Keep automation behind its abstraction.
- **Image storage costs/limits:** monitor Supabase Storage usage as inventory
  grows.
