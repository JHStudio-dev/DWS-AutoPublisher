import "server-only";
import { randomUUID } from "node:crypto";
import type { VehicleImage } from "@/db/types/database";
import { getCompanyScope } from "@/services/company-scope";

// Vehicle images
// Storage paths are always generated server-side and never trusted from the
// client. Isolation is enforced both by table RLS and by the bucket policies.

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

export async function uploadVehicleImages(
  vehicleId: string,
  files: File[],
): Promise<void> {
  const { supabase, companyId } = await getCompanyScope();

  const existing = await listVehicleImages(vehicleId);
  let sortOrder =
    existing.reduce((max, image) => Math.max(max, image.sort_order), -1) + 1;

  for (const file of files) {
    const path = buildVehicleImagePath(companyId, vehicleId, file.name);

    const { error: uploadError } = await supabase.storage
      .from(VEHICLE_IMAGES_BUCKET)
      .upload(path, file, { contentType: file.type, upsert: false });
    if (uploadError) throw uploadError;

    const { error: insertError } = await supabase.from("vehicle_images").insert({
      vehicle_id: vehicleId,
      storage_path: path,
      sort_order: sortOrder,
    });
    // A denied insert (vehicle outside the company) leaves an orphan object;
    // remove it so a failed upload never lingers in storage.
    if (insertError) {
      await supabase.storage.from(VEHICLE_IMAGES_BUCKET).remove([path]);
      throw insertError;
    }

    sortOrder += 1;
  }
}

export async function deleteVehicleImage(imageId: string): Promise<void> {
  const { supabase } = await getCompanyScope();

  const { data, error } = await supabase
    .from("vehicle_images")
    .select("storage_path")
    .eq("id", imageId)
    .maybeSingle<{ storage_path: string }>();
  if (error) throw error;
  if (!data) throw new Error("Vehicle image not found.");

  const { error: deleteError } = await supabase
    .from("vehicle_images")
    .delete()
    .eq("id", imageId);
  if (deleteError) throw deleteError;

  await supabase.storage.from(VEHICLE_IMAGES_BUCKET).remove([data.storage_path]);
}
