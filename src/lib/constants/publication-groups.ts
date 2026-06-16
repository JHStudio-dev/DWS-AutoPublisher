import type { GroupPlatform } from "@/db/types/database";

export const GROUP_PLATFORMS = [
  "facebook_group",
  "facebook_page",
  "instagram",
  "marketplace",
  "whatsapp",
  "other",
] as const satisfies readonly GroupPlatform[];

export const GROUP_PLATFORM_LABELS: Record<GroupPlatform, string> = {
  facebook_group: "Grupo de Facebook",
  facebook_page: "Página de Facebook",
  instagram: "Instagram",
  marketplace: "Marketplace",
  whatsapp: "WhatsApp",
  other: "Otro",
};

export function groupActiveLabel(active: boolean): string {
  return active ? "Activo" : "Inactivo";
}
