"use client";

import { useActionState } from "react";
import { requestPasswordResetAction } from "@/services/auth/actions";
import { initialFormState } from "@/lib/errors";
import { TextField } from "@/components/ui/text-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { FormAlert } from "@/components/ui/form-alert";

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(
    requestPasswordResetAction,
    initialFormState,
  );

  return (
    <form action={formAction} className="dws-auth__form space-y-4" noValidate>
      <FormAlert state={state} />
      <TextField
        label="Correo electrónico"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="tucorreo@empresa.com"
        required
      />
      <SubmitButton>Enviar instrucciones</SubmitButton>
    </form>
  );
}
