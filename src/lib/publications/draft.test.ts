import { describe, expect, it } from "vitest";
import type { Vehicle } from "@/db/types/database";
import { buildPublicationDraft } from "./draft";

const baseVehicle: Vehicle = {
  id: "11111111-1111-4111-8111-111111111111",
  company_id: "22222222-2222-4222-8222-222222222222",
  title: "Toyota Corolla",
  brand: "Toyota",
  model: "Corolla",
  year: 2020,
  price: 15000,
  mileage: 50000,
  transmission: "Automática",
  fuel_type: "Gasolina",
  color: "Blanco",
  description: "Buen estado.",
  status: "ready",
  visibility: "internal_only",
  created_by: null,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

describe("buildPublicationDraft", () => {
  it("includes the main vehicle data", () => {
    const draft = buildPublicationDraft(baseVehicle);
    expect(draft).toContain("Toyota Corolla");
    expect(draft).toContain("Toyota Corolla 2020");
    expect(draft).toContain("Precio:");
    expect(draft).toContain("Kilometraje:");
    expect(draft).toContain("Transmisión: Automática");
    expect(draft).toContain("Combustible: Gasolina");
    expect(draft).toContain("Color: Blanco");
    expect(draft).toContain("Buen estado.");
  });

  it("omits optional fields when absent", () => {
    const draft = buildPublicationDraft({
      ...baseVehicle,
      mileage: null,
      transmission: null,
      fuel_type: null,
      color: null,
      description: null,
    });
    expect(draft).not.toContain("Kilometraje");
    expect(draft).not.toContain("Transmisión");
    expect(draft).not.toContain("Combustible");
    expect(draft).not.toContain("Color:");
  });
});
