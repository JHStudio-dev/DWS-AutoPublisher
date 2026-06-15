-- Seed the first company. See migrations README for owner setup.

insert into public.companies (name, slug, theme_key, primary_color, accent_color)
values (
  'Hernández Car Import',
  'hernandez-car-import',
  'hernandez-car-import',
  '#d11f2a',
  '#c9a227'
)
on conflict (slug) do nothing;
