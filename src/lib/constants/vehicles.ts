import type { VehicleStatus, VehicleVisibility } from "@/db/types/database";
import type { StatusTone } from "@/components/ui/status-pill";

export const VEHICLE_STATUSES = [
  "draft",
  "ready",
  "published",
  "archived",
] as const satisfies readonly VehicleStatus[];

export const VEHICLE_VISIBILITIES = [
  "internal_only",
  "visible_in_catalog",
  "archived",
] as const satisfies readonly VehicleVisibility[];

export const VEHICLE_STATUS_LABELS: Record<VehicleStatus, string> = {
  draft: "Borrador",
  ready: "Listo",
  published: "Publicado",
  archived: "Archivado",
};

export const VEHICLE_STATUS_TONES: Record<VehicleStatus, StatusTone> = {
  draft: "muted",
  ready: "accent",
  published: "success",
  archived: "neutral",
};

export const VEHICLE_VISIBILITY_LABELS: Record<VehicleVisibility, string> = {
  internal_only: "Solo interno",
  visible_in_catalog: "Visible en catálogo",
  archived: "Archivado",
};
