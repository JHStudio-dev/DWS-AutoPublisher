"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  createPublicationSchema,
  targetUpdateSchema,
} from "@/lib/validation/publication";
import { GENERIC_ERROR_MESSAGE, type FormState } from "@/lib/errors";
import {
  cancelPublication,
  createPublicationBatch,
  updateTargetStatus,
} from "@/services/publications";

// Publication actions

const PUBLICATIONS_PATH = "/dashboard/publications";

function field(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function readId(formData: FormData, name = "id"): string | null {
  const parsed = z.string().uuid().safeParse(field(formData, name));
  return parsed.success ? parsed.data : null;
}

function readGroupIds(formData: FormData): string[] {
  return formData
    .getAll("groupIds")
    .filter((value): value is string => typeof value === "string");
}

export async function createPublicationAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = createPublicationSchema.safeParse({
    vehicleId: field(formData, "vehicleId"),
    groupIds: readGroupIds(formData),
    publicationText: field(formData, "publicationText"),
  });
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? GENERIC_ERROR_MESSAGE,
    };
  }

  let createdId: string | null = null;
  try {
    const publication = await createPublicationBatch(parsed.data);
    createdId = publication.id;
  } catch {
    return { status: "error", message: "No se pudo crear la publicación." };
  }

  revalidatePath(PUBLICATIONS_PATH);
  redirect(`${PUBLICATIONS_PATH}/${createdId}`);
}

export async function setTargetStatusAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = targetUpdateSchema.safeParse({
    targetId: field(formData, "targetId"),
    status: field(formData, "status"),
    targetUrl: field(formData, "targetUrl"),
    errorMessage: field(formData, "errorMessage"),
  });
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? GENERIC_ERROR_MESSAGE,
    };
  }

  try {
    await updateTargetStatus(parsed.data);
  } catch {
    return { status: "error", message: "No se pudo actualizar el destino." };
  }

  revalidatePath(PUBLICATIONS_PATH);
  const publicationId = readId(formData, "publicationId");
  if (publicationId) {
    revalidatePath(`${PUBLICATIONS_PATH}/${publicationId}`);
  }
  return { status: "success", message: "Destino actualizado." };
}

export async function cancelPublicationAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const id = readId(formData);
  if (!id) {
    return { status: "error", message: "No se encontró la publicación." };
  }

  try {
    await cancelPublication(id);
  } catch {
    return { status: "error", message: "No se pudo cancelar la publicación." };
  }

  revalidatePath(PUBLICATIONS_PATH);
  revalidatePath(`${PUBLICATIONS_PATH}/${id}`);
  return { status: "success", message: "Publicación cancelada." };
}
