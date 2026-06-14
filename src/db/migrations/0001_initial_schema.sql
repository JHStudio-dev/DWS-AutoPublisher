-- Initial schema for DWS PublishFlow
-- Companies, profiles, vehicles, groups, publications, targets, logs, and jobs.
-- RLS is enabled separately in 0002_rls_policies.sql.

create extension if not exists pgcrypto;

-- Enums

create type user_role as enum ('owner', 'admin', 'staff');

create type vehicle_status as enum ('draft', 'ready', 'published', 'archived');

create type vehicle_visibility as enum (
  'internal_only',
  'visible_in_catalog',
  'archived'
);

create type group_platform as enum (
  'facebook_group',
  'facebook_page',
  'instagram',
  'marketplace',
  'whatsapp',
  'other'
);

create type publication_status as enum (
  'draft',
  'pending',
  'processing',
  'requires_review',
  'completed',
  'failed',
  'cancelled'
);

create type publication_target_status as enum (
  'pending',
  'requires_review',
  'completed',
  'failed',
  'cancelled'
);

create type publication_log_level as enum ('info', 'warning', 'error', 'success');

create type publication_strategy as enum (
  'manual',
  'facebook_group_assisted',
  'facebook_page_api_future',
  'facebook_group_rpa_internal_future',
  'instagram_api_future',
  'webhook_future'
);

create type publication_job_status as enum (
  'pending',
  'processing',
  'completed',
  'failed',
  'cancelled'
);

-- updated_at maintenance

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Companies

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  logo_url text,
  primary_color text,
  accent_color text,
  theme_key text not null default 'hernandez-car-import',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger companies_set_updated_at
  before update on public.companies
  for each row execute function public.set_updated_at();

-- Profiles

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete restrict,
  email text not null,
  full_name text,
  role user_role not null default 'staff',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_company_id_idx on public.profiles (company_id);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Vehicles

create table public.vehicles (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  title text not null,
  brand text not null,
  model text not null,
  year integer not null,
  price numeric(12, 2) not null,
  mileage integer,
  transmission text,
  fuel_type text,
  color text,
  description text,
  status vehicle_status not null default 'draft',
  visibility vehicle_visibility not null default 'internal_only',
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index vehicles_company_status_idx
  on public.vehicles (company_id, status);

create index vehicles_company_visibility_idx
  on public.vehicles (company_id, visibility);

create trigger vehicles_set_updated_at
  before update on public.vehicles
  for each row execute function public.set_updated_at();

-- Vehicle images

create table public.vehicle_images (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles (id) on delete cascade,
  storage_path text not null,
  public_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index vehicle_images_vehicle_order_idx
  on public.vehicle_images (vehicle_id, sort_order);

-- Publication groups

create table public.publication_groups (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  name text not null,
  url text not null,
  platform group_platform not null default 'facebook_group',
  active boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index publication_groups_company_active_idx
  on public.publication_groups (company_id, active);

create trigger publication_groups_set_updated_at
  before update on public.publication_groups
  for each row execute function public.set_updated_at();

-- Publications

create table public.publications (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  vehicle_id uuid not null references public.vehicles (id) on delete cascade,
  status publication_status not null default 'draft',
  publication_text text not null default '',
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index publications_company_status_idx
  on public.publications (company_id, status);

create index publications_vehicle_id_idx on public.publications (vehicle_id);

create trigger publications_set_updated_at
  before update on public.publications
  for each row execute function public.set_updated_at();

-- Publication targets

create table public.publication_targets (
  id uuid primary key default gen_random_uuid(),
  publication_id uuid not null references public.publications (id) on delete cascade,
  group_id uuid not null references public.publication_groups (id) on delete restrict,
  status publication_target_status not null default 'pending',
  target_url text,
  published_at timestamptz,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index publication_targets_publication_id_idx
  on public.publication_targets (publication_id);

create index publication_targets_group_id_idx
  on public.publication_targets (group_id);

create trigger publication_targets_set_updated_at
  before update on public.publication_targets
  for each row execute function public.set_updated_at();

-- Publication logs

create table public.publication_logs (
  id uuid primary key default gen_random_uuid(),
  publication_id uuid not null references public.publications (id) on delete cascade,
  target_id uuid references public.publication_targets (id) on delete cascade,
  level publication_log_level not null,
  message text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index publication_logs_publication_id_idx
  on public.publication_logs (publication_id);

create index publication_logs_target_id_idx
  on public.publication_logs (target_id);

-- Publication jobs

create table public.publication_jobs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  publication_id uuid not null references public.publications (id) on delete cascade,
  strategy publication_strategy not null,
  status publication_job_status not null default 'pending',
  attempts integer not null default 0,
  scheduled_for timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  failed_at timestamptz,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index publication_jobs_company_status_idx
  on public.publication_jobs (company_id, status);

create index publication_jobs_publication_id_idx
  on public.publication_jobs (publication_id);

create trigger publication_jobs_set_updated_at
  before update on public.publication_jobs
  for each row execute function public.set_updated_at();
