import { z } from "zod";

// Validation
// User-facing messages are in Spanish; field names stay in English.

export const loginSchema = z.object({
  email: z.string().email("Ingresa un correo electrónico válido."),
  password: z.string().min(1, "Ingresa tu contraseña."),
});

export const signupSchema = z.object({
  fullName: z.string().trim().min(1, "Ingresa tu nombre completo."),
  email: z.string().email("Ingresa un correo electrónico válido."),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres."),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Ingresa un correo electrónico válido."),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
