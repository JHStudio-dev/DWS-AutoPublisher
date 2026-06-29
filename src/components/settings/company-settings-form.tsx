"use client";

import { useActionState } from "react";
import type { Company } from "@/db/types/database";
import { initialFormState } from "@/lib/errors";
import { updateCompanyAction } from "@/services/companies/actions";
import { TextField } from "@/components/ui/text-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { FormAlert } from "@/components/ui/form-alert";

export function CompanySettingsForm({ company }: { company: Company }) {
  const [state, formAction] = useActionState(
    updateCompanyAction,
    initialFormState,
  );

  return (
    <form action={formAction} className="dws-settings-form space-y-4" noValidate>
      <FormAlert state={state} />
      <TextField
        label="Nombre de la empresa"
        name="name"
        defaultValue={company.name}
        required
        maxLength={80}
      />
      <SubmitButton pendingLabel="Guardando…" fullWidth={false}>
        Guardar cambios
      </SubmitButton>
    </form>
  );
}
