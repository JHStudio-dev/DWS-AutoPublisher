# Security and Row Level Security

Security model for DWS PublishFlow: how company data is isolated, how secrets are
handled, and the threat model the design defends against. This document is the
security plan; policies are implemented as SQL migrations in Phase 1.

## Security principles

- **Company isolation is enforced at the database**, not just the UI. Row Level
  Security is the source of truth for "who can see what."
- **Defense in depth:** middleware route guards, server-side service layer, and
  RLS each independently prevent unauthorized access.
- **Least privilege:** the anon key is the default; the service role key is
  server-only and used sparingly.
- **No secrets in the repo or browser.** `.env` is git-ignored; `.env.example`
  documents required variables without values.
- **No Facebook passwords, ever.** The assisted workflow never collects or stores
  Facebook credentials. Official APIs (later) use OAuth tokens stored
  server-side, encrypted.

## Trust boundaries

```
[ User browser ]  --HTTPS-->  [ Next.js server ]  -->  [ Supabase Postgres + Storage ]
       (anon key, user session)        (server client = anon + session)
                                        (admin client = service role, narrow)
                                  --future-->  [ Meta APIs / webhooks ]
[ Future public catalog ] --public read, visible vehicles only--> [ Supabase ]
```

The browser is **untrusted**. Anything the browser can call must be safe under
RLS. The server is the only place the service role key exists.

## Secrets handling

| Secret | Where it may appear | Never appears |
|--------|---------------------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Browser + server | — (public by design) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser + server | — (public by design, RLS-gated) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** | Browser, client bundles, logs, git |
| Future Meta OAuth tokens | **Server only, encrypted at rest** | Browser, plaintext storage, git |

Rules:

- `.env` and `.env*.local` are git-ignored. Only `.env.example` is committed.
- The service role key is imported only from a server-only module
  (`db/supabase/admin`) and never re-exported to client code.
- Errors shown to users are sanitized; raw database/driver errors are logged
  server-side, not surfaced to the UI.

## Row Level Security strategy

RLS is **enabled on every table**. The central predicate is "the row's company
matches the caller's company." The caller's company is derived from their
`profiles` row, keyed by `auth.uid()`.

A helper function resolves the caller's company once:

```sql
-- returns the company_id for the currently authenticated user
create or replace function public.current_company_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select company_id from public.profiles where auth_user_id = auth.uid()
$$;
```

### Policy intent per table

| Table | Read | Write |
|-------|------|-------|
| `companies` | Members of the company | `owner`/`admin` of the company |
| `profiles` | Own profile; company members readable to `owner`/`admin` | Own profile (limited fields); role/membership by `owner` |
| `vehicles` | Same company | Same company (`owner`/`admin`/`staff` per role rules) |
| `vehicle_images` | Same company (via parent vehicle) | Same company |
| `publication_groups` | Same company | Same company |
| `publications` | Same company | Same company |
| `publication_targets` | Same company (via parent publication) | Same company |
| `publication_logs` | Same company (via parent publication) | Insert by same company; effectively append-only |
| `publication_jobs` | Same company | Same company / service role |

### Example policies (illustrative)

Direct company match (e.g. `vehicles`):

```sql
alter table public.vehicles enable row level security;

create policy vehicles_select_same_company
  on public.vehicles for select
  using (company_id = public.current_company_id());

create policy vehicles_insert_same_company
  on public.vehicles for insert
  with check (company_id = public.current_company_id());

create policy vehicles_update_same_company
  on public.vehicles for update
  using (company_id = public.current_company_id())
  with check (company_id = public.current_company_id());
```

Child rows matched through their parent (e.g. `vehicle_images`):

```sql
create policy vehicle_images_same_company
  on public.vehicle_images for select
  using (
    exists (
      select 1 from public.vehicles v
      where v.id = vehicle_images.vehicle_id
        and v.company_id = public.current_company_id()
    )
  );
```

Profiles — users read their own row:

```sql
create policy profiles_select_own
  on public.profiles for select
  using (auth_user_id = auth.uid());
```

Role-gated writes (e.g. company settings) add a role check:

```sql
create policy companies_update_admins
  on public.companies for update
  using (
    id = public.current_company_id()
    and exists (
      select 1 from public.profiles p
      where p.auth_user_id = auth.uid()
        and p.company_id = companies.id
        and p.role in ('owner','admin')
    )
  );
```

### Storage (vehicle images)

The vehicle images bucket is **private**. Access is granted through Storage RLS
policies that mirror the company-isolation rule (path or metadata carries the
company/vehicle reference), and images are served to the UI via **signed URLs**
generated server-side. No public bucket for internal images.

## Threat model (STRIDE)

DFD elements: external entities (user browser, Facebook, future public catalog),
processes (Next.js server, Supabase Auth, future automation worker), data stores
(Postgres, Storage), data flows (browser↔server, server↔Supabase, server↔Meta).

| # | Threat (STRIDE) | Element | Mitigation |
|---|-----------------|---------|------------|
| 1 | **S**poofing a user session | Browser ↔ server | Supabase Auth, HTTP-only cookies, middleware session validation |
| 2 | **T**ampering with another company's data | Postgres | RLS company-isolation on every table; `with check` on writes |
| 3 | **R**epudiation of a publish action | Process | `publication_logs` append-only audit trail with actor + timestamp |
| 4 | **I**nfo disclosure of cross-company data | Postgres / Storage | RLS reads keyed to `current_company_id()`; private bucket + signed URLs |
| 5 | **I**nfo disclosure of secrets | Process / repo | Service role key server-only; `.env` git-ignored; sanitized error output |
| 6 | **D**enial of service via abusive input/uploads | Process / Storage | Input validation, upload size/type limits (Phase 1), Supabase platform limits |
| 7 | **E**levation via role bypass | Process / Postgres | Role checks in RLS for privileged writes; coarse role gate server-side |
| 8 | **T**ampering / injection in form input | Process | Zod validation on all inputs; parameterized queries via Supabase client |
| 9 | **I**njection of malicious content into posts | Data flow | Validate/sanitize user-generated publication text before display/use |
| 10 | **S**poofing Facebook identity / ToS risk | External | Assisted workflow only; no credential storage; official APIs later |

Priority for Phase 1 hardening (highest risk first): **#2, #4, #5** — these are
the company-isolation and secret-exposure threats that the RLS policies and the
server-only service role key directly close.

## Input validation and content safety

- All form inputs validated with **Zod** schemas in `lib/validation/`, on the
  server (and mirrored on the client for UX).
- User-generated content (vehicle descriptions, publication text, group notes) is
  validated and escaped at render; never injected as raw HTML.
- File uploads (Phase 1): restrict MIME types and size, generate storage paths
  server-side, never trust client-provided paths.

## Security assumptions

- Supabase Auth and Postgres RLS are correctly configured and enabled (verified
  by tests in Phase 1).
- The deployment keeps server-only env vars out of the client bundle (enforced by
  the `NEXT_PUBLIC_` prefix convention).
- Only one company exists at launch, but no code path assumes that — isolation is
  always applied.

## Future security improvements

- Automated RLS policy tests (attempt cross-company access, expect denial).
- Secret scanning in CI.
- Rate limiting on auth and mutation endpoints.
- Encrypted storage + rotation for future Meta OAuth tokens.
- Audit log viewer and retention policy.
- 2FA via Supabase Auth for `owner`/`admin`.
- Security headers and CSP review before any external exposure.
