import { z } from "zod";
import { TARGET_ACTION_STATUSES } from "@/lib/constants/publications";

// Publication validation

const emptyToUndefined = (value: unknown): unknown =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

export const createPublicationSchema = z.object({
  vehicleId: z.string().uuid("Selecciona un vehículo válido."),
  groupIds: z
    .array(z.string().uuid())
    .min(1, "Selecciona al menos un grupo."),
  publicationText: z
    .string()
    .trim()
    .min(1, "El texto de la publicación es obligatorio.")
    .max(5000, "Debe tener máximo 5000 caracteres."),
});

export const targetStatusSchema = z.enum(TARGET_ACTION_STATUSES, {
  errorMap: () => ({ message: "Selecciona un estado válido." }),
});

export const targetUpdateSchema = z.object({
  targetId: z.string().uuid(),
  status: targetStatusSchema,
  targetUrl: z.preprocess(
    emptyToUndefined,
    z.string().trim().url("Ingresa una URL válida.").optional(),
  ),
  errorMessage: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(500, "Debe tener máximo 500 caracteres.").optional(),
  ),
});

export type CreatePublicationInput = z.infer<typeof createPublicationSchema>;
export type TargetUpdateInput = z.infer<typeof targetUpdateSchema>;
