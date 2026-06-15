"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  vehicleSchema,
  vehicleStatusSchema,
  vehicleVisibilitySchema,
  type VehicleInput,
} from "@/lib/validation/vehicle";
import { GENERIC_ERROR_MESSAGE, type FormState } from "@/lib/errors";
import type { Vehicle } from "@/db/types/database";
import {
  createVehicle,
  deleteVehicle,
  duplicateVehicle,
  getVehicleById,
  updateVehicle,
} from "@/services/vehicles";

// Vehicle actions

const VEHICLES_PATH = "/dashboard/vehicles";

function field(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function readVehicleForm(formData: FormData) {
  return {
    title: field(formData, "title"),
    brand: field(formData, "brand"),
    model: field(formData, "model"),
    year: field(formData, "year"),
    price: field(formData, "price"),
    mileage: field(formData, "mileage"),
    transmission: field(formData, "transmission"),
    fuel_type: field(formData, "fuel_type"),
    color: field(formData, "color"),
    description: field(formData, "description"),
    status: field(formData, "status"),
    visibility: field(formData, "visibility"),
  };
}

function readId(formData: FormData): string | null {
  const parsed = z.string().uuid().safeParse(field(formData, "id"));
  return parsed.success ? parsed.data : null;
}

function vehicleToInput(vehicle: Vehicle): VehicleInput {
  return {
    title: vehicle.title,
    brand: vehicle.brand,
    model: vehicle.model,
    year: vehicle.year,
    price: vehicle.price,
    mileage: vehicle.mileage ?? undefined,
    transmission: vehicle.transmission ?? undefined,
    fuel_type: vehicle.fuel_type ?? undefined,
    color: vehicle.color ?? undefined,
    description: vehicle.description ?? undefined,
    status: vehicle.status,
    visibility: vehicle.visibility,
  };
}

const NOT_FOUND_MESSAGE = "No se encontró el vehículo.";

export async function createVehicleAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = vehicleSchema.safeParse(readVehicleForm(formData));
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? GENERIC_ERROR_MESSAGE,
    };
  }

  let createdId: string | null = null;
  try {
    const vehicle = await createVehicle(parsed.data);
    createdId = vehicle.id;
  } catch {
    return { status: "error", message: "No se pudo guardar el vehículo." };
  }

  revalidatePath(VEHICLES_PATH);
  redirect(`${VEHICLES_PATH}/${createdId}`);
}

export async function updateVehicleAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const id = readId(formData);
  if (!id) {
    return { status: "error", message: NOT_FOUND_MESSAGE };
  }

  const parsed = vehicleSchema.safeParse(readVehicleForm(formData));
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? GENERIC_ERROR_MESSAGE,
    };
  }

  try {
    await updateVehicle(id, parsed.data);
  } catch {
    return { status: "error", message: "No se pudo guardar el vehículo." };
  }

  revalidatePath(VEHICLES_PATH);
  revalidatePath(`${VEHICLES_PATH}/${id}`);
  redirect(`${VEHICLES_PATH}/${id}`);
}

export async function deleteVehicleAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const id = readId(formData);
  if (!id) {
    return { status: "error", message: NOT_FOUND_MESSAGE };
  }

  try {
    await deleteVehicle(id);
  } catch {
    return { status: "error", message: "No se pudo eliminar el vehículo." };
  }

  revalidatePath(VEHICLES_PATH);
  redirect(VEHICLES_PATH);
}

export async function duplicateVehicleAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const id = readId(formData);
  if (!id) {
    return { status: "error", message: NOT_FOUND_MESSAGE };
  }

  let newId: string | null = null;
  try {
    const copy = await duplicateVehicle(id);
    newId = copy.id;
  } catch {
    return { status: "error", message: "No se pudo duplicar el vehículo." };
  }

  revalidatePath(VEHICLES_PATH);
  redirect(`${VEHICLES_PATH}/${newId}`);
}

export async function changeVehicleStatusAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const id = readId(formData);
  if (!id) {
    return { status: "error", message: NOT_FOUND_MESSAGE };
  }

  const parsedStatus = vehicleStatusSchema.safeParse(formData.get("status"));
  if (!parsedStatus.success) {
    return {
      status: "error",
      message: parsedStatus.error.issues[0]?.message ?? GENERIC_ERROR_MESSAGE,
    };
  }

  try {
    const current = await getVehicleById(id);
    if (!current) {
      return { status: "error", message: NOT_FOUND_MESSAGE };
    }
    await updateVehicle(id, { ...vehicleToInput(current), status: parsedStatus.data });
  } catch {
    return { status: "error", message: "No se pudo actualizar el vehículo." };
  }

  revalidatePath(VEHICLES_PATH);
  revalidatePath(`${VEHICLES_PATH}/${id}`);
  return { status: "success", message: "Estado actualizado." };
}

export async function changeVehicleVisibilityAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const id = readId(formData);
  if (!id) {
    return { status: "error", message: NOT_FOUND_MESSAGE };
  }

  const parsedVisibility = vehicleVisibilitySchema.safeParse(
    formData.get("visibility"),
  );
  if (!parsedVisibility.success) {
    return {
      status: "error",
      message:
        parsedVisibility.error.issues[0]?.message ?? GENERIC_ERROR_MESSAGE,
    };
  }

  try {
    const current = await getVehicleById(id);
    if (!current) {
      return { status: "error", message: NOT_FOUND_MESSAGE };
    }
    await updateVehicle(id, {
      ...vehicleToInput(current),
      visibility: parsedVisibility.data,
    });
  } catch {
    return { status: "error", message: "No se pudo actualizar el vehículo." };
  }

  revalidatePath(VEHICLES_PATH);
  revalidatePath(`${VEHICLES_PATH}/${id}`);
  return { status: "success", message: "Visibilidad actualizada." };
}
