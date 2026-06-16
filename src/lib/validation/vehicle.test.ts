import { describe, expect, it } from "vitest";
import {
  vehicleSchema,
  vehicleStatusSchema,
  vehicleVisibilitySchema,
} from "./vehicle";

const validInput = {
  title: "Toyota Corolla",
  brand: "Toyota",
  model: "Corolla",
  year: "2020",
  price: "15000",
  mileage: "50000",
  transmission: "Automática",
  fuel_type: "Gasolina",
  color: "Blanco",
  description: "Vehículo en buen estado.",
  status: "draft",
  visibility: "internal_only",
};

function build(overrides: Record<string, unknown> = {}) {
  return { ...validInput, ...overrides };
}

function firstMessage(input: unknown): string | undefined {
  const result = vehicleSchema.safeParse(input);
  return result.success ? undefined : result.error.issues[0]?.message;
}

const MAX_YEAR = new Date().getFullYear() + 1;

describe("vehicleSchema — valid input", () => {
  it("accepts a valid create input and coerces numbers", () => {
    const result = vehicleSchema.safeParse(validInput);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.year).toBe(2020);
      expect(result.data.price).toBe(15000);
      expect(result.data.mileage).toBe(50000);
      expect(result.data.status).toBe("draft");
      expect(result.data.visibility).toBe("internal_only");
    }
  });

  it("accepts a valid update input with changed values", () => {
    const result = vehicleSchema.safeParse(
      build({
        title: "Honda Civic",
        status: "ready",
        visibility: "visible_in_catalog",
        price: "20000.50",
      }),
    );
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.price).toBe(20000.5);
      expect(result.data.status).toBe("ready");
      expect(result.data.visibility).toBe("visible_in_catalog");
    }
  });

  it("leaves optional fields undefined when empty", () => {
    const result = vehicleSchema.safeParse(
      build({
        mileage: "",
        transmission: "",
        fuel_type: "",
        color: "",
        description: "",
      }),
    );
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.mileage).toBeUndefined();
      expect(result.data.transmission).toBeUndefined();
      expect(result.data.description).toBeUndefined();
    }
  });
});

describe("vehicleSchema — required fields", () => {
  it("rejects a missing title", () => {
    expect(firstMessage(build({ title: "" }))).toBe("El título es obligatorio.");
  });

  it("rejects a missing brand", () => {
    expect(firstMessage(build({ brand: "" }))).toBe("La marca es obligatoria.");
  });

  it("rejects a missing model", () => {
    expect(firstMessage(build({ model: "" }))).toBe("El modelo es obligatorio.");
  });

  it("rejects a missing year", () => {
    expect(firstMessage(build({ year: "" }))).toBe("Ingresa un año válido.");
  });

  it("rejects a missing price", () => {
    expect(firstMessage(build({ price: "" }))).toBe("Ingresa un precio válido.");
  });
});

describe("vehicleSchema — numeric validation", () => {
  it("rejects a non-integer year", () => {
    expect(firstMessage(build({ year: "2020.5" }))).toBe(
      "Ingresa un año válido.",
    );
  });

  it("rejects a year before 1900", () => {
    expect(firstMessage(build({ year: "1899" }))).toBe(
      "El año debe ser 1900 o posterior.",
    );
  });

  it("rejects a year after the allowed maximum", () => {
    expect(firstMessage(build({ year: String(MAX_YEAR + 1) }))).toBe(
      `El año no puede ser mayor a ${MAX_YEAR}.`,
    );
  });

  it("rejects a non-numeric year", () => {
    expect(firstMessage(build({ year: "abc" }))).toBe("Ingresa un año válido.");
  });

  it("rejects a negative price", () => {
    expect(firstMessage(build({ price: "-100" }))).toBe(
      "El precio no puede ser negativo.",
    );
  });

  it("rejects a non-numeric price", () => {
    expect(firstMessage(build({ price: "abc" }))).toBe(
      "Ingresa un precio válido.",
    );
  });

  it("rejects a negative mileage", () => {
    expect(firstMessage(build({ mileage: "-5" }))).toBe(
      "El kilometraje no puede ser negativo.",
    );
  });

  it("rejects a non-integer mileage", () => {
    expect(firstMessage(build({ mileage: "100.5" }))).toBe(
      "Ingresa un kilometraje válido.",
    );
  });
});

describe("vehicleSchema — status and visibility", () => {
  it("rejects an invalid status", () => {
    expect(firstMessage(build({ status: "invalid" }))).toBe(
      "Selecciona un estado válido.",
    );
  });

  it("rejects an invalid visibility", () => {
    expect(firstMessage(build({ visibility: "invalid" }))).toBe(
      "Selecciona una visibilidad válida.",
    );
  });
});

describe("vehicleStatusSchema", () => {
  it.each(["draft", "ready", "published", "archived"])(
    "accepts %s",
    (value) => {
      expect(vehicleStatusSchema.safeParse(value).success).toBe(true);
    },
  );

  it("rejects an unknown status with a Spanish message", () => {
    const result = vehicleStatusSchema.safeParse("nope");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        "Selecciona un estado válido.",
      );
    }
  });
});

describe("vehicleVisibilitySchema", () => {
  it.each(["internal_only", "visible_in_catalog", "archived"])(
    "accepts %s",
    (value) => {
      expect(vehicleVisibilitySchema.safeParse(value).success).toBe(true);
    },
  );

  it("rejects an unknown visibility with a Spanish message", () => {
    const result = vehicleVisibilitySchema.safeParse("nope");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        "Selecciona una visibilidad válida.",
      );
    }
  });
});
