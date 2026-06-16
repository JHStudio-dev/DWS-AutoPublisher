"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  groupActiveSchema,
  publicationGroupSchema,
} from "@/lib/validation/publication-group";
import { GENERIC_ERROR_MESSAGE, type FormState } from "@/lib/errors";
import {
  createGroup,
  deleteGroup,
  setGroupActive,
  updateGroup,
} from "@/services/publication-groups";

// Publication group actions

const GROUPS_PATH = "/dashboard/publication-groups";
const NOT_FOUND_MESSAGE = "No se encontró el grupo.";

function field(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function readGroupForm(formData: FormData) {
  return {
    name: field(formData, "name"),
    url: field(formData, "url"),
    platform: field(formData, "platform"),
    active: field(formData, "active"),
    notes: field(formData, "notes"),
  };
}

function readId(formData: FormData): string | null {
  const parsed = z.string().uuid().safeParse(field(formData, "id"));
  return parsed.success ? parsed.data : null;
}

export async function createGroupAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = publicationGroupSchema.safeParse(readGroupForm(formData));
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? GENERIC_ERROR_MESSAGE,
    };
  }

  let createdId: string | null = null;
  try {
    const group = await createGroup(parsed.data);
    createdId = group.id;
  } catch {
    return { status: "error", message: "No se pudo guardar el grupo." };
  }

  revalidatePath(GROUPS_PATH);
  redirect(`${GROUPS_PATH}/${createdId}`);
}

export async function updateGroupAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const id = readId(formData);
  if (!id) {
    return { status: "error", message: NOT_FOUND_MESSAGE };
  }

  const parsed = publicationGroupSchema.safeParse(readGroupForm(formData));
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? GENERIC_ERROR_MESSAGE,
    };
  }

  try {
    await updateGroup(id, parsed.data);
  } catch {
    return { status: "error", message: "No se pudo guardar el grupo." };
  }

  revalidatePath(GROUPS_PATH);
  revalidatePath(`${GROUPS_PATH}/${id}`);
  redirect(`${GROUPS_PATH}/${id}`);
}

export async function deleteGroupAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const id = readId(formData);
  if (!id) {
    return { status: "error", message: NOT_FOUND_MESSAGE };
  }

  try {
    await deleteGroup(id);
  } catch {
    return { status: "error", message: "No se pudo eliminar el grupo." };
  }

  revalidatePath(GROUPS_PATH);
  redirect(GROUPS_PATH);
}

export async function setGroupActiveAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const id = readId(formData);
  if (!id) {
    return { status: "error", message: NOT_FOUND_MESSAGE };
  }

  const parsedActive = groupActiveSchema.safeParse(formData.get("active"));
  if (!parsedActive.success) {
    return {
      status: "error",
      message: parsedActive.error.issues[0]?.message ?? GENERIC_ERROR_MESSAGE,
    };
  }

  try {
    await setGroupActive(id, parsedActive.data);
  } catch {
    return { status: "error", message: "No se pudo actualizar el grupo." };
  }

  revalidatePath(GROUPS_PATH);
  revalidatePath(`${GROUPS_PATH}/${id}`);
  return { status: "success", message: "Grupo actualizado." };
}
