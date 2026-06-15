# Migrations

SQL migrations for the Supabase Postgres database, applied in numeric order.

| File | Purpose |
|------|---------|
| `0001_initial_schema.sql` | Enums, tables, indexes, and the `updated_at` trigger |
| `0002_rls_policies.sql` | `current_company_id()` helper, enables RLS, and company-isolation policies |
| `0003_seed.sql` | Seeds the first company; template for the owner profile |

## Applying

Run each file in order against the project database, for example through the
Supabase SQL editor or `psql`:

```bash
psql "$DATABASE_URL" -f src/db/migrations/0001_initial_schema.sql
psql "$DATABASE_URL" -f src/db/migrations/0002_rls_policies.sql
psql "$DATABASE_URL" -f src/db/migrations/0003_seed.sql
```

Migrations are written to run once on a fresh database. Re-running them requires
dropping the existing objects first.
