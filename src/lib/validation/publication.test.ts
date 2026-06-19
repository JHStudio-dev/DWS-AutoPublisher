import { describe, expect, it } from "vitest";
import {
  createPublicationSchema,
  targetStatusSchema,
  targetUpdateSchema,
} from "./publication";

const VEHICLE_ID = "11111111-1111-4111-8111-111111111111";
const GROUP_ID = "22222222-2222-4222-8222-222222222222";
const TARGET_ID = "33333333-3333-4333-8333-333333333333";

const validPublication = {
  vehicleId: VEHICLE_ID,
  groupIds: [GROUP_ID],
  publicationText: "Texto de la publicación.",
};

describe("createPublicationSchema", () => {
  it("accepts valid input", () => {
    expect(createPublicationSchema.safeParse(validPublication).success).toBe(
      true,
    );
  });

  it("rejects an invalid vehicle id", () => {
    const result = createPublicationSchema.safeParse({
      ...validPublication,
      vehicleId: "nope",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        "Selecciona un vehículo válido.",
      );
    }
  });

  it("requires at least one group", () => {
    const result = createPublicationSchema.safeParse({
      ...validPublication,
      groupIds: [],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        "Selecciona al menos un grupo.",
      );
    }
  });

  it("requires publication text", () => {
    const result = createPublicationSchema.safeParse({
      ...validPublication,
      publicationText: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        "El texto de la publicación es obligatorio.",
      );
    }
  });
});

describe("targetStatusSchema", () => {
  it.each(["completed", "failed", "requires_review", "cancelled"])(
    "accepts %s",
    (value) => {
      expect(targetStatusSchema.safeParse(value).success).toBe(true);
    },
  );

  it("rejects pending (not a checklist action)", () => {
    expect(targetStatusSchema.safeParse("pending").success).toBe(false);
  });

  it("rejects an unknown status with a Spanish message", () => {
    const result = targetStatusSchema.safeParse("nope");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        "Selecciona un estado válido.",
      );
    }
  });
});

describe("targetUpdateSchema", () => {
  it("accepts minimal input and leaves optionals undefined", () => {
    const result = targetUpdateSchema.safeParse({
      targetId: TARGET_ID,
      status: "completed",
      targetUrl: "",
      errorMessage: "",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.targetUrl).toBeUndefined();
      expect(result.data.errorMessage).toBeUndefined();
    }
  });

  it("rejects an invalid target url", () => {
    const result = targetUpdateSchema.safeParse({
      targetId: TARGET_ID,
      status: "completed",
      targetUrl: "not-a-url",
      errorMessage: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Ingresa una URL válida.");
    }
  });
});
