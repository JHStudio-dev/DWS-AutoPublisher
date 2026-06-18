"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { cancelPublicationAction } from "@/services/publications/actions";
import { initialFormState } from "@/lib/errors";
import { FormAlert } from "@/components/ui/form-alert";

function CancelSubmit() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="dws-publication-detail__cancel-button rounded-md border border-danger/50 px-4 py-2 text-sm text-danger transition-colors hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Cancelando…" : "Cancelar publicación"}
    </button>
  );
}

export function CancelPublicationButton({
  publicationId,
}: {
  publicationId: string;
}) {
  const [state, formAction] = useActionState(
    cancelPublicationAction,
    initialFormState,
  );

  return (
    <div className="dws-publication-detail__cancel space-y-2">
      <FormAlert state={state} />
      <form
        action={formAction}
        onSubmit={(event) => {
          if (
            !window.confirm(
              "¿Cancelar esta publicación? Los destinos pendientes se marcarán como cancelados.",
            )
          ) {
            event.preventDefault();
          }
        }}
      >
        <input type="hidden" name="id" value={publicationId} />
        <CancelSubmit />
      </form>
    </div>
  );
}
