-- Seed data for the first company (Hernández Car Import).
-- Run after 0001 and 0002.

insert into public.companies (name, slug, theme_key, primary_color, accent_color)
values (
  'Hernández Car Import',
  'hernandez-car-import',
  'hernandez-car-import',
  '#d11f2a',
  '#c9a227'
)
on conflict (slug) do nothing;

-- The owner profile links to a Supabase Auth user. Create that user first
-- (Supabase Auth), then run the insert below with their id and email.
--
-- insert into public.profiles (auth_user_id, company_id, email, full_name, role)
-- select
--   '00000000-0000-0000-0000-000000000000', -- auth.users.id of the owner
--   c.id,
--   'propietario@hernandezcarimport.com',
--   'Nombre del propietario',
--   'owner'
-- from public.companies c
-- where c.slug = 'hernandez-car-import';
