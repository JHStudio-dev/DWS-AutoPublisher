import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import { PGlite } from "@electric-sql/pglite";
import { pgcrypto } from "@electric-sql/pglite/contrib/pgcrypto";

// In-memory Postgres harness that applies the real migrations and seeds two
// companies, so the RLS policies can be exercised exactly as they ship.

function migration(file: string): string {
  const url = new URL(`../migrations/${file}`, import.meta.url);
  return readFileSync(fileURLToPath(url), "utf8");
}

export type Ids = {
  companyA: string;
  companyB: string;
  ownerA: string;
  staffA: string;
  ownerB: string;
  profileOwnerA: string;
  profileStaffA: string;
  profileOwnerB: string;
  vehicleA: string;
  vehicleB: string;
  imageA: string;
  imageB: string;
  groupA: string;
  groupB: string;
  publicationA: string;
  publicationB: string;
  targetA: string;
  targetB: string;
  logA: string;
  logB: string;
  jobA: string;
  jobB: string;
};

function newIds(): Ids {
  return {
    companyA: randomUUID(),
    companyB: randomUUID(),
    ownerA: randomUUID(),
    staffA: randomUUID(),
    ownerB: randomUUID(),
    profileOwnerA: randomUUID(),
    profileStaffA: randomUUID(),
    profileOwnerB: randomUUID(),
    vehicleA: randomUUID(),
    vehicleB: randomUUID(),
    imageA: randomUUID(),
    imageB: randomUUID(),
    groupA: randomUUID(),
    groupB: randomUUID(),
    publicationA: randomUUID(),
    publicationB: randomUUID(),
    targetA: randomUUID(),
    targetB: randomUUID(),
    logA: randomUUID(),
    logB: randomUUID(),
    jobA: randomUUID(),
    jobB: randomUUID(),
  };
}

// Stand-ins for the roles and the auth schema Supabase provides at runtime.
const BOOTSTRAP_SQL = `
create role anon;
create role authenticated;

create schema if not exists auth;

create table if not exists auth.users (
  id uuid primary key,
  email text
);

create or replace function auth.uid()
returns uuid
language sql
stable
as $$
  select (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')::uuid;
$$;
`;

const GRANTS_SQL = `
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to anon, authenticated;
`;

function seedSql(ids: Ids): string {
  return `
insert into auth.users (id, email) values
  ('${ids.ownerA}', 'owner-a@test.local'),
  ('${ids.staffA}', 'staff-a@test.local'),
  ('${ids.ownerB}', 'owner-b@test.local');

insert into public.companies (id, name, slug) values
  ('${ids.companyA}', 'Company A', 'company-a'),
  ('${ids.companyB}', 'Company B', 'company-b');

insert into public.profiles (id, auth_user_id, company_id, email, full_name, role) values
  ('${ids.profileOwnerA}', '${ids.ownerA}', '${ids.companyA}', 'owner-a@test.local', 'Owner A', 'owner'),
  ('${ids.profileStaffA}', '${ids.staffA}', '${ids.companyA}', 'staff-a@test.local', 'Staff A', 'staff'),
  ('${ids.profileOwnerB}', '${ids.ownerB}', '${ids.companyB}', 'owner-b@test.local', 'Owner B', 'owner');

insert into public.vehicles (id, company_id, title, brand, model, year, price, status, visibility, created_by) values
  ('${ids.vehicleA}', '${ids.companyA}', 'Vehicle A', 'BrandA', 'ModelA', 2021, 10000, 'ready', 'internal_only', '${ids.profileOwnerA}'),
  ('${ids.vehicleB}', '${ids.companyB}', 'Vehicle B', 'BrandB', 'ModelB', 2022, 20000, 'ready', 'internal_only', '${ids.profileOwnerB}');

insert into public.vehicle_images (id, vehicle_id, storage_path) values
  ('${ids.imageA}', '${ids.vehicleA}', 'a/img.jpg'),
  ('${ids.imageB}', '${ids.vehicleB}', 'b/img.jpg');

insert into public.publication_groups (id, company_id, name, url) values
  ('${ids.groupA}', '${ids.companyA}', 'Group A', 'https://example.com/a'),
  ('${ids.groupB}', '${ids.companyB}', 'Group B', 'https://example.com/b');

insert into public.publications (id, company_id, vehicle_id, publication_text, created_by) values
  ('${ids.publicationA}', '${ids.companyA}', '${ids.vehicleA}', 'text a', '${ids.profileOwnerA}'),
  ('${ids.publicationB}', '${ids.companyB}', '${ids.vehicleB}', 'text b', '${ids.profileOwnerB}');

insert into public.publication_targets (id, publication_id, group_id) values
  ('${ids.targetA}', '${ids.publicationA}', '${ids.groupA}'),
  ('${ids.targetB}', '${ids.publicationB}', '${ids.groupB}');

insert into public.publication_logs (id, publication_id, level, message) values
  ('${ids.logA}', '${ids.publicationA}', 'info', 'log a'),
  ('${ids.logB}', '${ids.publicationB}', 'info', 'log b');

insert into public.publication_jobs (id, company_id, publication_id, strategy) values
  ('${ids.jobA}', '${ids.companyA}', '${ids.publicationA}', 'manual'),
  ('${ids.jobB}', '${ids.companyB}', '${ids.publicationB}', 'manual');
`;
}

type Identity = { role: "authenticated"; sub: string } | { role: "anon" };

export async function createRlsHarness() {
  const db = await PGlite.create({ extensions: { pgcrypto } });
  const ids = newIds();

  await db.exec(BOOTSTRAP_SQL);
  await db.exec(migration("0001_initial_schema.sql"));
  await db.exec(migration("0002_rls_policies.sql"));
  await db.exec(GRANTS_SQL);
  await db.exec(seedSql(ids));

  // Switch the session to act as a given caller before each query, mirroring how
  // Supabase sets the role and JWT claims that the policies read.
  async function setIdentity(identity: Identity): Promise<void> {
    await db.exec("reset role;");
    if (identity.role === "authenticated") {
      await db.query("select set_config('request.jwt.claims', $1, false)", [
        JSON.stringify({ sub: identity.sub, role: "authenticated" }),
      ]);
      await db.exec("set role authenticated;");
    } else {
      await db.query("select set_config('request.jwt.claims', $1, false)", [""]);
      await db.exec("set role anon;");
    }
  }

  return {
    ids,
    async asUser<T = Record<string, unknown>>(
      sub: string,
      sql: string,
      params?: unknown[],
    ) {
      await setIdentity({ role: "authenticated", sub });
      return db.query<T>(sql, params);
    },
    async asAnon<T = Record<string, unknown>>(sql: string, params?: unknown[]) {
      await setIdentity({ role: "anon" });
      return db.query<T>(sql, params);
    },
    async close() {
      await db.close();
    },
  };
}

export type RlsHarness = Awaited<ReturnType<typeof createRlsHarness>>;
