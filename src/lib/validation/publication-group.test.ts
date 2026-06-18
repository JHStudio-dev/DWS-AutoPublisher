import { describe, expect, it } from "vitest";
import {
  groupActiveSchema,
  groupPlatformSchema,
  publicationGroupSchema,
} from "./publication-group";

const validInput = {
  name: "Autos Tegucigalpa",
  url: "https://facebook.com/groups/autos-tegucigalpa",
  platform: "facebook_group",
  active: "true",
  notes: "Grupo de compraventa.",
};

function build(overrides: Record<string, unknown> = {}) {
  return { ...validInput, ...overrides };
}

function firstMessage(input: unknown): string | undefined {
  const result = publicationGroupSchema.safeParse(input);
  return result.success ? undefined : result.error.issues[0]?.message;
}

describe("publicationGroupSchema — valid input", () => {
  it("accepts a valid create input and coerces active", () => {
    const result = publicationGroupSchema.safeParse(validInput);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.active).toBe(true);
      expect(result.data.platform).toBe("facebook_group");
    }
  });

  it("accepts a valid update input with changed values", () => {
    const result = publicationGroupSchema.safeParse(
      build({ name: "Página oficial", platform: "facebook_page", active: "false" }),
    );
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.active).toBe(false);
      expect(result.data.platform).toBe("facebook_page");
    }
  });

  it("leaves notes undefined when empty", () => {
    const result = publicationGroupSchema.safeParse(build({ notes: "" }));
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.notes).toBeUndefined();
    }
  });
});

describe("publicationGroupSchema — required fields", () => {
  it("rejects a missing name", () => {
    expect(firstMessage(build({ name: "" }))).toBe("El nombre es obligatorio.");
  });

  it("rejects a missing url", () => {
    expect(firstMessage(build({ url: "" }))).toBe("La URL es obligatoria.");
  });

  it("rejects an invalid url", () => {
    expect(firstMessage(build({ url: "not-a-url" }))).toBe(
      "Ingresa una URL válida.",
    );
  });
});

describe("publicationGroupSchema — platform and active", () => {
  it("rejects an invalid platform", () => {
    expect(firstMessage(build({ platform: "tiktok" }))).toBe(
      "Selecciona una plataforma válida.",
    );
  });

  it("rejects an invalid active value", () => {
    expect(firstMessage(build({ active: "maybe" }))).toBe(
      "Selecciona un estado válido.",
    );
  });
});

describe("groupPlatformSchema", () => {
  it.each([
    "facebook_group",
    "facebook_page",
    "instagram",
    "marketplace",
    "whatsapp",
    "other",
  ])("accepts %s", (value) => {
    expect(groupPlatformSchema.safeParse(value).success).toBe(true);
  });

  it("rejects an unknown platform with a Spanish message", () => {
    const result = groupPlatformSchema.safeParse("nope");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        "Selecciona una plataforma válida.",
      );
    }
  });
});

describe("groupActiveSchema", () => {
  it.each([
    ["true", true],
    ["false", false],
    [true, true],
    [false, false],
  ])("parses %s to %s", (input, expected) => {
    const result = groupActiveSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(expected);
    }
  });

  it("rejects a non-boolean value", () => {
    expect(groupActiveSchema.safeParse("nope").success).toBe(false);
  });
});
