"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { PublicationGroup } from "@/db/types/database";
import { initialFormState } from "@/lib/errors";
import { GROUP_PLATFORM_LABELS } from "@/lib/constants/publication-groups";
import { createPublicationAction } from "@/services/publications/actions";
import { TextareaField } from "@/components/ui/textarea-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { FormAlert } from "@/components/ui/form-alert";

type PublicationFormProps = {
  vehicleId: string;
  groups: PublicationGroup[];
  draft: string;
  cancelHref: string;
};

export function PublicationForm({
  vehicleId,
  groups,
  draft,
  cancelHref,
}: PublicationFormProps) {
  const [state, formAction] = useActionState(
    createPublicationAction,
    initialFormState,
  );

  return (
    <form action={formAction} className="dws-publication-form space-y-6" noValidate>
      <FormAlert state={state} />

      <input type="hidden" name="vehicleId" value={vehicleId} />

      <fieldset className="dws-publication-form__groups">
        <legend className="dws-publication-form__legend text-sm font-medium text-text">
          Grupos de destino
        </legend>
        <p className="dws-publication-form__hint mt-1 text-sm text-text-muted">
          Selecciona al menos un grupo activo.
        </p>
        <div className="dws-publication-form__group-list mt-3 grid gap-2 sm:grid-cols-2">
          {groups.map((group) => (
            <label
              key={group.id}
              className="dws-publication-form__group flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm text-text"
            >
              <input
                type="checkbox"
                name="groupIds"
                value={group.id}
                className="dws-publication-form__checkbox accent-primary"
              />
              <span className="dws-publication-form__group-name">
                {group.name}
              </span>
              <span className="dws-publication-form__group-platform ml-auto text-xs text-text-muted">
                {GROUP_PLATFORM_LABELS[group.platform]}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <TextareaField
        label="Texto de la publicación"
        name="publicationText"
        rows={10}
        maxLength={5000}
        defaultValue={draft}
        required
      />

      <div className="dws-publication-form__actions flex flex-wrap items-center gap-3">
        <SubmitButton pendingLabel="Creando…" fullWidth={false}>
          Crear publicación
        </SubmitButton>
        <Link
          href={cancelHref}
          className="dws-publication-form__cancel rounded-md border border-border px-4 py-2 text-sm text-text transition-colors hover:bg-surface-muted"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
