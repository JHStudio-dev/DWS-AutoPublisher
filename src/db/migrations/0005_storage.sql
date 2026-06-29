-- Vehicle image storage: a private bucket isolated by company. The first folder
-- segment of every object key is the company id (see buildVehicleImagePath), so
-- these policies mirror the per-company isolation enforced on the tables.

insert into storage.buckets (id, name, public)
values ('vehicle-images', 'vehicle-images', false)
on conflict (id) do nothing;

create policy vehicle_images_company_read
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'vehicle-images'
    and (storage.foldername(name))[1] = public.current_company_id()::text
  );

create policy vehicle_images_company_insert
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'vehicle-images'
    and (storage.foldername(name))[1] = public.current_company_id()::text
  );

create policy vehicle_images_company_delete
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'vehicle-images'
    and (storage.foldername(name))[1] = public.current_company_id()::text
  );
