import "server-only";
import { randomUUID } from "node:crypto";
import type { VehicleImage } from "@/db/types/database";
import { getCompanyScope } from "@/services/company-scope";

// Vehicle images
// Read and display helpers. Upload is handled in a later increment; paths are
// always generated server-side and never trusted from the client.

export const VEHICLE_IMAGES_BUCKET = "vehicle-images";

export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const SIGNED_URL_TTL_SECONDS = 60 * 60;

export function isAllowedImageType(mimeType: string): boolean {
  return (ALLOWED_IMAGE_MIME_TYPES as readonly string[]).includes(mimeType);
}

export function buildVehicleImagePath(
  companyId: string,
  vehicleId: string,
  originalName: string,
): string {
  const hasDot = originalName.includes(".");
  const rawExtension = hasDot ? (originalName.split(".").pop() ?? "") : "";
  const extension = rawExtension.toLowerCase().replace(/[^a-z0-9]/g, "");
  const suffix = extension ? `.${extension}` : "";
  return `${companyId}/${vehicleId}/${randomUUID()}${suffix}`;
}

export async function listVehicleImages(
  vehicleId: string,
): Promise<VehicleImage[]> {
  const { supabase } = await getCompanyScope();
  const { data, error } = await supabase
    .from("vehicle_images")
    .select("*")
    .eq("vehicle_id", vehicleId)
    .order("sort_order", { ascending: true })
    .returns<VehicleImage[]>();

  if (error) throw error;
  return data ?? [];
}

export async function getSignedImageUrl(
  storagePath: string,
  expiresIn: number = SIGNED_URL_TTL_SECONDS,
): Promise<string | null> {
  const { supabase } = await getCompanyScope();
  const { data, error } = await supabase.storage
    .from(VEHICLE_IMAGES_BUCKET)
    .createSignedUrl(storagePath, expiresIn);

  if (error || !data) {
    return null;
  }
  return data.signedUrl;
}
