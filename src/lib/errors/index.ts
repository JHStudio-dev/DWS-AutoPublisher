import type { AuthError } from "@supabase/supabase-js";

// Errors
// Failures are mapped to safe Spanish messages for the UI. Raw provider errors
// are never shown to users.

export const GENERIC_ERROR_MESSAGE =
  "Ocurrió un error inesperado. Vuelve a intentarlo.";

export type FormState = {
  status: "idle" | "error" | "success";
  message: string | null;
};

export const initialFormState: FormState = {
  status: "idle",
  message: null,
};

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  invalid_credentials: "Correo o contraseña incorrectos.",
  email_not_confirmed:
    "Tu correo aún no ha sido confirmado. Revisa tu bandeja de entrada.",
  user_already_exists: "Ya existe una cuenta con este correo.",
  email_exists: "Ya existe una cuenta con este correo.",
  weak_password: "La contraseña es demasiado débil.",
  same_password: "La nueva contraseña debe ser diferente a la anterior.",
  over_request_rate_limit:
    "Demasiados intentos. Espera unos minutos e inténtalo de nuevo.",
  over_email_send_rate_limit:
    "Se enviaron demasiados correos. Espera unos minutos e inténtalo de nuevo.",
};

export function authErrorMessage(error: AuthError | null): string {
  if (!error?.code) {
    return GENERIC_ERROR_MESSAGE;
  }
  return AUTH_ERROR_MESSAGES[error.code] ?? GENERIC_ERROR_MESSAGE;
}
