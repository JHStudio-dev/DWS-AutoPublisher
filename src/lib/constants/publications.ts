import type {
  PublicationLogLevel,
  PublicationStatus,
  PublicationTargetStatus,
} from "@/db/types/database";

export const PUBLICATION_STATUSES = [
  "draft",
  "pending",
  "processing",
  "requires_review",
  "completed",
  "failed",
  "cancelled",
] as const satisfies readonly PublicationStatus[];

// Target statuses a user can set from the assisted checklist.
export const TARGET_ACTION_STATUSES = [
  "completed",
  "failed",
  "requires_review",
  "cancelled",
] as const satisfies readonly PublicationTargetStatus[];

export const PUBLICATION_STATUS_LABELS: Record<PublicationStatus, string> = {
  draft: "Borrador",
  pending: "Pendiente",
  processing: "En proceso",
  requires_review: "Requiere revisión",
  completed: "Completada",
  failed: "Fallida",
  cancelled: "Cancelada",
};

export const PUBLICATION_TARGET_STATUS_LABELS: Record<
  PublicationTargetStatus,
  string
> = {
  pending: "Pendiente",
  requires_review: "Requiere revisión",
  completed: "Publicado",
  failed: "Fallido",
  cancelled: "Cancelado",
};

export const PUBLICATION_LOG_LEVEL_LABELS: Record<PublicationLogLevel, string> =
  {
    info: "Información",
    warning: "Advertencia",
    error: "Error",
    success: "Éxito",
  };
