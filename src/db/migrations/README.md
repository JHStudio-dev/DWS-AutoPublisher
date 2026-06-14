# Migrations

SQL migrations for the Supabase Postgres database, applied in numeric order.

| File | Purpose |
|------|---------|
| `0001_initial_schema.sql` | Enums, tables, indexes, and the `updated_at` trigger |

## Applying

Run each file in order against the project database, for example through the
Supabase SQL editor or `psql`:

```bash
psql "$DATABASE_URL" -f src/db/migrations/0001_initial_schema.sql
```

Migrations are written to run once on a fresh database. Re-running them requires
dropping the existing objects first.
