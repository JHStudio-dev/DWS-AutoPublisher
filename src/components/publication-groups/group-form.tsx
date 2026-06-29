"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { PublicationGroup } from "@/db/types/database";
import { initialFormState, type FormState } from "@/lib/errors";
import {
  GROUP_PLATFORMS,
  GROUP_PLATFORM_LABELS,
} from "@/lib/constants/publication-groups";
import { Panel } from "@/components/ui/panel";
import { TextField } from "@/components/ui/text-field";
import { TextareaField } from "@/components/ui/textarea-field";
import { SelectField } from "@/components/ui/select-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { FormAlert } from "@/components/ui/form-alert";

type GroupFormAction = (
  prev: FormState,
  formData: FormData,
) => Promise<FormState>;

type GroupFormProps = {
  action: GroupFormAction;
  submitLabel: string;
  pendingLabel: string;
  cancelHref: string;
  group?: PublicationGroup;
};

export function GroupForm({
  action,
  submitLabel,
  pendingLabel,
  cancelHref,
  group,
}: GroupFormProps) {
  const [state, formAction] = useActionState(action, initialFormState);

  const platformOptions = GROUP_PLATFORMS.map((value) => ({
    value,
    label: GROUP_PLATFORM_LABELS[value],
  }));
  const activeOptions = [
    { value: "true", label: "Activo" },
    { value: "false", label: "Inactivo" },
  ];

  return (
    <form action={formAction} className="dws-group-form space-y-4" noValidate>
      <FormAlert state={state} />

      {group ? <input type="hidden" name="id" value={group.id} /> : null}

      <Panel title="Datos del grupo">
        <div className="dws-group-form__grid grid gap-4 sm:grid-cols-2">
          <TextField
            label="Nombre"
            name="name"
            defaultValue={group?.name ?? ""}
            required
            maxLength={80}
          />
          <TextField
            label="URL"
            name="url"
            type="url"
            inputMode="url"
            placeholder="https://..."
            defaultValue={group?.url ?? ""}
            required
          />
          <SelectField
            label="Plataforma"
            name="platform"
            options={platformOptions}
            defaultValue={group?.platform ?? "facebook_group"}
          />
          <SelectField
            label="Estado"
            name="active"
            options={activeOptions}
            defaultValue={group ? String(group.active) : "true"}
          />
        </div>
      </Panel>

      <Panel title="Notas">
        <TextareaField
          label="Notas"
          name="notes"
          rows={4}
          maxLength={500}
          defaultValue={group?.notes ?? ""}
        />
      </Panel>

      <div className="dws-group-form__actions flex flex-wrap items-center gap-3">
        <SubmitButton pendingLabel={pendingLabel} fullWidth={false}>
          {submitLabel}
        </SubmitButton>
        <Link
          href={cancelHref}
          className="dws-group-form__cancel rounded-md border border-border px-4 py-2 text-sm text-text transition-colors hover:bg-surface-muted"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
