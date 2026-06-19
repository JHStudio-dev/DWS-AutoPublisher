import type {
  PublicationStatus,
  PublicationTargetStatus,
} from "@/db/types/database";

// Derives the overall publication status from its targets: in progress while any
// target is pending or needs review, otherwise the terminal outcome.
export function derivePublicationStatus(
  targets: { status: PublicationTargetStatus }[],
): PublicationStatus {
  if (targets.length === 0) {
    return "pending";
  }
  const inProgress = targets.some(
    (target) =>
      target.status === "pending" || target.status === "requires_review",
  );
  if (inProgress) {
    return "pending";
  }
  if (targets.every((target) => target.status === "cancelled")) {
    return "cancelled";
  }
  if (targets.some((target) => target.status === "failed")) {
    return "failed";
  }
  return "completed";
}
