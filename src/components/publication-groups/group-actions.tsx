"use client";

import Link from "next/link";
import { useActionState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import {
  deleteGroupAction,
  setGroupActiveAction,
} from "@/services/publication-groups/actions";
import { initialFormState } from "@/lib/errors";
import { FormAlert } from "@/components/ui/form-alert";

const SECONDARY_CLASS =
  "rounded-md border border-border px-4 py-2 text-sm text-text transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-60";

const DANGER_CLASS =
  "rounded-md border border-danger/50 px-4 py-2 text-sm text-danger transition-colors hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-60";

function ActionSubmit({
  children,
  pendingLabel,
  className,
}: {
  children: ReactNode;
  pendingLabel: string;
  className: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? pendingLabel : children}
    </button>
  );
}

export function GroupActions({
  groupId,
  active,
}: {
  groupId: string;
  active: boolean;
}) {
  const [toggleState, toggleAction] = useActionState(
    setGroupActiveAction,
    initialFormState,
  );
  const [deleteState, deleteAction] = useActionState(
    deleteGroupAction,
    initialFormState,
  );

  const nextActive = active ? "false" : "true";
  const toggleLabel = active ? "Desactivar" : "Activar";
  const togglePending = active ? "Desactivando…" : "Activando…";

  return (
    <div className="dws-group-detail__actions space-y-3">
      <FormAlert state={toggleState} />
      <FormAlert state={deleteState} />

      <div className="dws-group-detail__actions-buttons flex flex-wrap items-center gap-3">
        <Link
          href={`/dashboard/publication-groups/${groupId}/edit`}
          className={SECONDARY_CLASS}
        >
          Editar
        </Link>

        <form action={toggleAction}>
          <input type="hidden" name="id" value={groupId} />
          <input type="hidden" name="active" value={nextActive} />
          <ActionSubmit pendingLabel={togglePending} className={SECONDARY_CLASS}>
            {toggleLabel}
          </ActionSubmit>
        </form>

        <form
          action={deleteAction}
          onSubmit={(event) => {
            if (
              !window.confirm(
                "¿Eliminar este grupo? Esta acción no se puede deshacer.",
              )
            ) {
              event.preventDefault();
            }
          }}
        >
          <input type="hidden" name="id" value={groupId} />
          <ActionSubmit pendingLabel="Eliminando…" className={DANGER_CLASS}>
            Eliminar
          </ActionSubmit>
        </form>
      </div>
    </div>
  );
}
