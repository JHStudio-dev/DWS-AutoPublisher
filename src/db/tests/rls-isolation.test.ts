import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createRlsHarness, type RlsHarness } from "./rls-harness";

let h: RlsHarness;

beforeAll(async () => {
  h = await createRlsHarness();
});

afterAll(async () => {
  await h?.close();
});

const idsOf = (rows: { id: string }[]) => rows.map((row) => row.id);

describe("read isolation: a company member never sees another company's rows", () => {
  it("vehicles", async () => {
    const { rows } = await h.asUser<{ id: string }>(
      h.ids.ownerA,
      "select id from public.vehicles",
    );
    expect(idsOf(rows)).toEqual([h.ids.vehicleA]);
  });

  it("publication_groups", async () => {
    const { rows } = await h.asUser<{ id: string }>(
      h.ids.ownerA,
      "select id from public.publication_groups",
    );
    expect(idsOf(rows)).toEqual([h.ids.groupA]);
  });

  it("publications", async () => {
    const { rows } = await h.asUser<{ id: string }>(
      h.ids.ownerA,
      "select id from public.publications",
    );
    expect(idsOf(rows)).toEqual([h.ids.publicationA]);
  });

  it("publication_jobs", async () => {
    const { rows } = await h.asUser<{ id: string }>(
      h.ids.ownerA,
      "select id from public.publication_jobs",
    );
    expect(idsOf(rows)).toEqual([h.ids.jobA]);
  });

  it("vehicle_images (scoped through the parent vehicle)", async () => {
    const { rows } = await h.asUser<{ id: string }>(
      h.ids.ownerA,
      "select id from public.vehicle_images",
    );
    expect(idsOf(rows)).toEqual([h.ids.imageA]);
  });

  it("publication_targets (scoped through the parent publication)", async () => {
    const { rows } = await h.asUser<{ id: string }>(
      h.ids.ownerA,
      "select id from public.publication_targets",
    );
    expect(idsOf(rows)).toEqual([h.ids.targetA]);
  });

  it("publication_logs (scoped through the parent publication)", async () => {
    const { rows } = await h.asUser<{ id: string }>(
      h.ids.ownerA,
      "select id from public.publication_logs",
    );
    expect(idsOf(rows)).toEqual([h.ids.logA]);
  });

  it("companies", async () => {
    const { rows } = await h.asUser<{ id: string }>(
      h.ids.ownerA,
      "select id from public.companies",
    );
    expect(idsOf(rows)).toEqual([h.ids.companyA]);
  });
});

describe("profiles read isolation", () => {
  it("an owner sees their own company's members but not another company's", async () => {
    const { rows } = await h.asUser<{ id: string }>(
      h.ids.ownerA,
      "select id from public.profiles order by email",
    );
    const ids = idsOf(rows);
    expect(ids).toContain(h.ids.profileOwnerA);
    expect(ids).toContain(h.ids.profileStaffA);
    expect(ids).not.toContain(h.ids.profileOwnerB);
  });

  it("a non-admin staff member sees only their own profile", async () => {
    const { rows } = await h.asUser<{ id: string }>(
      h.ids.staffA,
      "select id from public.profiles",
    );
    expect(idsOf(rows)).toEqual([h.ids.profileStaffA]);
  });
});

describe("write isolation: a company member cannot mutate another company's rows", () => {
  it("rejects inserting a vehicle into another company", async () => {
    await expect(
      h.asUser(
        h.ids.ownerA,
        "insert into public.vehicles (company_id, title, brand, model, year, price) values ($1, 'x', 'x', 'x', 2020, 1)",
        [h.ids.companyB],
      ),
    ).rejects.toThrow();
  });

  it("cannot update another company's vehicle (no rows match)", async () => {
    const result = await h.asUser(
      h.ids.ownerA,
      "update public.vehicles set title = 'hacked' where id = $1",
      [h.ids.vehicleB],
    );
    expect(result.affectedRows).toBe(0);
  });

  it("cannot delete another company's vehicle (no rows match)", async () => {
    const result = await h.asUser(
      h.ids.ownerA,
      "delete from public.vehicles where id = $1",
      [h.ids.vehicleB],
    );
    expect(result.affectedRows).toBe(0);
  });

  it("rejects attaching an image to another company's vehicle", async () => {
    await expect(
      h.asUser(
        h.ids.ownerA,
        "insert into public.vehicle_images (vehicle_id, storage_path) values ($1, 'x/x.jpg')",
        [h.ids.vehicleB],
      ),
    ).rejects.toThrow();
  });

  it("rejects writing a log against another company's publication", async () => {
    await expect(
      h.asUser(
        h.ids.ownerA,
        "insert into public.publication_logs (publication_id, level, message) values ($1, 'info', 'x')",
        [h.ids.publicationB],
      ),
    ).rejects.toThrow();
  });
});

describe("positive control: own-company access still works", () => {
  it("reads its own vehicle", async () => {
    const { rows } = await h.asUser<{ id: string }>(
      h.ids.ownerA,
      "select id from public.vehicles where id = $1",
      [h.ids.vehicleA],
    );
    expect(idsOf(rows)).toEqual([h.ids.vehicleA]);
  });

  it("inserts a vehicle into its own company", async () => {
    const result = await h.asUser(
      h.ids.ownerA,
      "insert into public.vehicles (company_id, title, brand, model, year, price) values ($1, 'own', 'b', 'm', 2020, 1)",
      [h.ids.companyA],
    );
    expect(result.affectedRows).toBe(1);
  });

  it("updates its own vehicle", async () => {
    const result = await h.asUser(
      h.ids.ownerA,
      "update public.vehicles set title = 'renamed' where id = $1",
      [h.ids.vehicleA],
    );
    expect(result.affectedRows).toBe(1);
  });
});

describe("anonymous (unauthenticated) access is denied", () => {
  it("reads no vehicles", async () => {
    const { rows } = await h.asAnon("select id from public.vehicles");
    expect(rows).toHaveLength(0);
  });

  it("reads no companies", async () => {
    const { rows } = await h.asAnon("select id from public.companies");
    expect(rows).toHaveLength(0);
  });

  it("cannot insert a vehicle", async () => {
    await expect(
      h.asAnon(
        "insert into public.vehicles (company_id, title, brand, model, year, price) values ($1, 'x', 'x', 'x', 2020, 1)",
        [h.ids.companyA],
      ),
    ).rejects.toThrow();
  });
});
