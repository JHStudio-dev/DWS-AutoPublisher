import { describe, expect, it } from "vitest";
import { companySettingsSchema } from "./company";

function firstMessage(input: unknown): string | undefined {
  const result = companySettingsSchema.safeParse(input);
  return result.success ? undefined : result.error.issues[0]?.message;
}

describe("companySettingsSchema", () => {
  it("accepts a valid name", () => {
    const result = companySettingsSchema.safeParse({ name: "Hernández Car Import" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Hernández Car Import");
    }
  });

  it("trims surrounding whitespace", () => {
    const result = companySettingsSchema.safeParse({ name: "  Darkward Studio  " });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Darkward Studio");
    }
  });

  it("accepts a name at the 80 character limit", () => {
    const result = companySettingsSchema.safeParse({ name: "a".repeat(80) });
    expect(result.success).toBe(true);
  });

  it("rejects an empty name", () => {
    expect(firstMessage({ name: "" })).toBe("El nombre es obligatorio.");
  });

  it("rejects a whitespace-only name", () => {
    expect(firstMessage({ name: "   " })).toBe("El nombre es obligatorio.");
  });

  it("rejects a name longer than 80 characters", () => {
    expect(firstMessage({ name: "a".repeat(81) })).toBe(
      "Debe tener máximo 80 caracteres.",
    );
  });
});
