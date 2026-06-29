# Migrations

SQL migrations for the Supabase Postgres database, applied in numeric order.

| File | Purpose |
|------|---------|
| `0001_initial_schema.sql` | Enums, tables, indexes, and the `updated_at` trigger |
| `0002_rls_policies.sql` | `current_company_id()` helper, enables RLS, and company-isolation policies |
| `0003_seed.sql` | Seeds the first company |
| `0004_grants.sql` | Table privileges for the `authenticated` role (RLS still applies) |
| `0005_storage.sql` | Private `vehicle-images` bucket and company-isolation storage policies |

## Applying

Run each file in order against the project database, for example through the
Supabase SQL editor or `psql`:

```bash
psql "$DATABASE_URL" -f src/db/migrations/0001_initial_schema.sql
psql "$DATABASE_URL" -f src/db/migrations/0002_rls_policies.sql
psql "$DATABASE_URL" -f src/db/migrations/0003_seed.sql
psql "$DATABASE_URL" -f src/db/migrations/0004_grants.sql
psql "$DATABASE_URL" -f src/db/migrations/0005_storage.sql
```

Migrations are written to run once on a fresh database. Re-running them requires
dropping the existing objects first.

## Owner setup

The owner profile links to a Supabase Auth user. Create that user in Supabase
Auth first, then insert their profile with the real id and email:

```sql
insert into public.profiles (auth_user_id, company_id, email, full_name, role)
select
  '<auth.users.id of the owner>',
  c.id,
  'propietario@hernandezcarimport.com',
  'Nombre del propietario',
  'owner'
from public.companies c
where c.slug = 'hernandez-car-import';
```
