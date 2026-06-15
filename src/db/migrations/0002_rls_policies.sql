-- Row Level Security: every table is isolated by company via current_company_id().
-- Policies target authenticated users; the anon role gets no access.

-- Helpers

create or replace function public.current_company_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select company_id from public.profiles where auth_user_id = auth.uid()
$$;

create or replace function public.current_user_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where auth_user_id = auth.uid()
      and role in ('owner', 'admin')
  )
$$;

-- Companies: members read; owner/admin update.

alter table public.companies enable row level security;

create policy companies_member_select
  on public.companies
  for select
  to authenticated
  using (id = public.current_company_id());

create policy companies_admin_update
  on public.companies
  for update
  to authenticated
  using (id = public.current_company_id() and public.current_user_is_admin())
  with check (id = public.current_company_id() and public.current_user_is_admin());

-- Profiles: read own row, or any company member if admin. Writes are handled
-- server-side (admin client) in this phase.

alter table public.profiles enable row level security;

create policy profiles_select_self_or_admin
  on public.profiles
  for select
  to authenticated
  using (
    auth_user_id = auth.uid()
    or (
      company_id = public.current_company_id()
      and public.current_user_is_admin()
    )
  );

-- Vehicles

alter table public.vehicles enable row level security;

create policy vehicles_company_access
  on public.vehicles
  for all
  to authenticated
  using (company_id = public.current_company_id())
  with check (company_id = public.current_company_id());

-- Vehicle images: scoped through the parent vehicle.

alter table public.vehicle_images enable row level security;

create policy vehicle_images_company_access
  on public.vehicle_images
  for all
  to authenticated
  using (
    exists (
      select 1 from public.vehicles v
      where v.id = vehicle_images.vehicle_id
        and v.company_id = public.current_company_id()
    )
  )
  with check (
    exists (
      select 1 from public.vehicles v
      where v.id = vehicle_images.vehicle_id
        and v.company_id = public.current_company_id()
    )
  );

-- Publication groups

alter table public.publication_groups enable row level security;

create policy publication_groups_company_access
  on public.publication_groups
  for all
  to authenticated
  using (company_id = public.current_company_id())
  with check (company_id = public.current_company_id());

-- Publications

alter table public.publications enable row level security;

create policy publications_company_access
  on public.publications
  for all
  to authenticated
  using (company_id = public.current_company_id())
  with check (company_id = public.current_company_id());

-- Publication targets: scoped through the parent publication.

alter table public.publication_targets enable row level security;

create policy publication_targets_company_access
  on public.publication_targets
  for all
  to authenticated
  using (
    exists (
      select 1 from public.publications p
      where p.id = publication_targets.publication_id
        and p.company_id = public.current_company_id()
    )
  )
  with check (
    exists (
      select 1 from public.publications p
      where p.id = publication_targets.publication_id
        and p.company_id = public.current_company_id()
    )
  );

-- Publication logs: append-only, scoped through the parent publication.

alter table public.publication_logs enable row level security;

create policy publication_logs_company_select
  on public.publication_logs
  for select
  to authenticated
  using (
    exists (
      select 1 from public.publications p
      where p.id = publication_logs.publication_id
        and p.company_id = public.current_company_id()
    )
  );

create policy publication_logs_company_insert
  on public.publication_logs
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.publications p
      where p.id = publication_logs.publication_id
        and p.company_id = public.current_company_id()
    )
  );

-- Publication jobs

alter table public.publication_jobs enable row level security;

create policy publication_jobs_company_access
  on public.publication_jobs
  for all
  to authenticated
  using (company_id = public.current_company_id())
  with check (company_id = public.current_company_id());
