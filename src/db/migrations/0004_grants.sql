-- Table privileges for the authenticated role. RLS (0002) still enforces
-- per-company isolation; these grants only let the role reach the tables at all.
-- The anon role intentionally gets none.

grant usage on schema public to authenticated;

grant select, insert, update, delete
  on all tables in schema public
  to authenticated;
