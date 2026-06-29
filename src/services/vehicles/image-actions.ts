"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { GENERIC_ERROR_MESSAGE, type FormState } from "@/lib/errors";
import {
  MAX_IMAGE_SIZE_BYTES,
  deleteVehicleImage,
  isAllowedImageType,
  uploadVehicleImages,
} from "@/services/vehicles/images";

// Vehicle image actions

const VEHICLES_PATH = "/dashboard/vehicles";

function readId(formData: FormData, name: string): string | null {
  const parsed = z.string().uuid().safeParse(formData.get(name));
  return parsed.success ? parsed.data : null;
}

export async function uploadVehicleImagesAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const vehicleId = readId(formData, "vehicleId");
  if (!vehicleId) {
    return { status: "error", message: "No se encontró el vehículo." };
  }

  const files = formData
    .getAll("images")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  if (files.length === 0) {
    return { status: "error", message: "Selecciona al menos una imagen." };
  }

  for (const file of files) {
    if (!isAllowedImageType(file.type)) {
      return {
        status: "error",
        message: "Formato no permitido. Usa JPG, PNG o WebP.",
      };
    }
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      return { status: "error", message: "Cada imagen debe pesar máximo 5 MB." };
    }
  }

  try {
    await uploadVehicleImages(vehicleId, files);
  } catch {
    return { status: "error", message: "No se pudieron subir las imágenes." };
  }

  revalidatePath(`${VEHICLES_PATH}/${vehicleId}`);
  return { status: "success", message: "Imágenes subidas." };
}

export async function deleteVehicleImageAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const imageId = readId(formData, "imageId");
  const vehicleId = readId(formData, "vehicleId");
  if (!imageId || !vehicleId) {
    return { status: "error", message: GENERIC_ERROR_MESSAGE };
  }

  try {
    await deleteVehicleImage(imageId);
  } catch {
    return { status: "error", message: "No se pudo eliminar la imagen." };
  }

  revalidatePath(`${VEHICLES_PATH}/${vehicleId}`);
  return { status: "success", message: "Imagen eliminada." };
}
