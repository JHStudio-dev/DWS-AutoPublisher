import { z } from "zod";
import { GROUP_PLATFORMS } from "@/lib/constants/publication-groups";

// Publication group validation

const emptyToUndefined = (value: unknown): unknown =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

export const groupPlatformSchema = z.enum(GROUP_PLATFORMS, {
  errorMap: () => ({ message: "Selecciona una plataforma válida." }),
});

export const groupActiveSchema = z.preprocess((value) => {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return value;
}, z.boolean({ invalid_type_error: "Selecciona un estado válido." }));

export const publicationGroupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio.")
    .max(80, "Debe tener máximo 80 caracteres."),
  url: z
    .string()
    .trim()
    .min(1, "La URL es obligatoria.")
    .url("Ingresa una URL válida."),
  platform: groupPlatformSchema,
  active: groupActiveSchema,
  notes: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(500, "Debe tener máximo 500 caracteres.").optional(),
  ),
});

export type PublicationGroupInput = z.infer<typeof publicationGroupSchema>;
