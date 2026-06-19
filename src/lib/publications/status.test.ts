import { describe, expect, it } from "vitest";
import { derivePublicationStatus } from "./status";

describe("derivePublicationStatus", () => {
  it("returns pending with no targets", () => {
    expect(derivePublicationStatus([])).toBe("pending");
  });

  it("stays pending while any target is pending or needs review", () => {
    expect(
      derivePublicationStatus([
        { status: "completed" },
        { status: "pending" },
      ]),
    ).toBe("pending");
    expect(derivePublicationStatus([{ status: "requires_review" }])).toBe(
      "pending",
    );
  });

  it("is completed when every target is completed", () => {
    expect(
      derivePublicationStatus([
        { status: "completed" },
        { status: "completed" },
      ]),
    ).toBe("completed");
  });

  it("is cancelled when every target is cancelled", () => {
    expect(
      derivePublicationStatus([
        { status: "cancelled" },
        { status: "cancelled" },
      ]),
    ).toBe("cancelled");
  });

  it("is failed when terminal with at least one failure", () => {
    expect(
      derivePublicationStatus([
        { status: "completed" },
        { status: "failed" },
      ]),
    ).toBe("failed");
    expect(
      derivePublicationStatus([
        { status: "failed" },
        { status: "cancelled" },
      ]),
    ).toBe("failed");
  });
});
