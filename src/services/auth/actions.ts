"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/db/supabase/server";
import {
  forgotPasswordSchema,
  loginSchema,
  signupSchema,
} from "@/lib/validation/auth";
import {
  authErrorMessage,
  GENERIC_ERROR_MESSAGE,
  type FormState,
} from "@/lib/errors";

// Auth

export async function signInAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? GENERIC_ERROR_MESSAGE,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { status: "error", message: authErrorMessage(error) };
  }

  redirect("/dashboard");
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function requestPasswordResetAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? GENERIC_ERROR_MESSAGE,
    };
  }

  const supabase = await createClient();
  const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/login`;
  const { error } = await supabase.auth.resetPasswordForEmail(
    parsed.data.email,
    { redirectTo },
  );

  if (error) {
    return { status: "error", message: authErrorMessage(error) };
  }

  // Neutral confirmation avoids revealing whether the email exists.
  return {
    status: "success",
    message:
      "Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña.",
  };
}

export async function signUpAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = signupSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? GENERIC_ERROR_MESSAGE,
    };
  }

  // Registration is invite-oriented in this phase: accounts are linked to a
  // company by an administrator. The validated input matches the shape an
  // invite flow will consume once it is wired.
  return {
    status: "success",
    message:
      "El registro es por invitación. Solicita acceso al administrador de tu empresa.",
  };
}
