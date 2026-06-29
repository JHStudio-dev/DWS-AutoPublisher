import { z } from "zod";

// Company settings validation

export const companySettingsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio.")
    .max(80, "Debe tener máximo 80 caracteres."),
});

export type CompanySettingsInput = z.infer<typeof companySettingsSchema>;
