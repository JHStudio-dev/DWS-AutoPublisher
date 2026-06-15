import { z } from "zod";
import {
  VEHICLE_STATUSES,
  VEHICLE_VISIBILITIES,
} from "@/lib/constants/vehicles";

// Vehicle validation

const MIN_YEAR = 1900;
const MAX_YEAR = new Date().getFullYear() + 1;

const emptyToUndefined = (value: unknown): unknown =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

const requiredText = (max: number, message: string) =>
  z.string().trim().min(1, message).max(max, `Debe tener máximo ${max} caracteres.`);

const optionalText = (max: number) =>
  z.preprocess(
    emptyToUndefined,
    z.string().trim().max(max, `Debe tener máximo ${max} caracteres.`).optional(),
  );

export const vehicleStatusSchema = z.enum(VEHICLE_STATUSES, {
  errorMap: () => ({ message: "Selecciona un estado válido." }),
});

export const vehicleVisibilitySchema = z.enum(VEHICLE_VISIBILITIES, {
  errorMap: () => ({ message: "Selecciona una visibilidad válida." }),
});

export const vehicleSchema = z.object({
  title: requiredText(120, "El título es obligatorio."),
  brand: requiredText(60, "La marca es obligatoria."),
  model: requiredText(60, "El modelo es obligatorio."),
  year: z.preprocess(
    emptyToUndefined,
    z.coerce
      .number({ invalid_type_error: "Ingresa un año válido." })
      .int("Ingresa un año válido.")
      .min(MIN_YEAR, `El año debe ser ${MIN_YEAR} o posterior.`)
      .max(MAX_YEAR, `El año no puede ser mayor a ${MAX_YEAR}.`),
  ),
  price: z.preprocess(
    emptyToUndefined,
    z.coerce
      .number({ invalid_type_error: "Ingresa un precio válido." })
      .nonnegative("El precio no puede ser negativo."),
  ),
  mileage: z.preprocess(
    emptyToUndefined,
    z.coerce
      .number({ invalid_type_error: "Ingresa un kilometraje válido." })
      .int("Ingresa un kilometraje válido.")
      .nonnegative("El kilometraje no puede ser negativo.")
      .optional(),
  ),
  transmission: optionalText(40),
  fuel_type: optionalText(40),
  color: optionalText(40),
  description: optionalText(2000),
  status: vehicleStatusSchema,
  visibility: vehicleVisibilitySchema,
});

export type VehicleInput = z.infer<typeof vehicleSchema>;
