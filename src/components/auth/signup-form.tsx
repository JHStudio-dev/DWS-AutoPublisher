"use client";

import { useActionState } from "react";
import { signUpAction } from "@/services/auth/actions";
import { initialFormState } from "@/lib/errors";
import { TextField } from "@/components/ui/text-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { FormAlert } from "@/components/ui/form-alert";

export function SignupForm() {
  const [state, formAction] = useActionState(signUpAction, initialFormState);

  return (
    <form action={formAction} className="dws-auth__form space-y-4" noValidate>
      <FormAlert state={state} />
      <TextField
        label="Nombre completo"
        name="fullName"
        type="text"
        autoComplete="name"
        required
      />
      <TextField
        label="Correo electrónico"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="tucorreo@empresa.com"
        required
      />
      <TextField
        label="Contraseña"
        name="password"
        type="password"
        autoComplete="new-password"
        required
      />
      <SubmitButton>Solicitar acceso</SubmitButton>
    </form>
  );
}
