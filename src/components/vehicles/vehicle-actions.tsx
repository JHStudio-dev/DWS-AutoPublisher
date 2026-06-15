"use client";

import Link from "next/link";
import { useActionState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import {
  deleteVehicleAction,
  duplicateVehicleAction,
} from "@/services/vehicles/actions";
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

export function VehicleActions({ vehicleId }: { vehicleId: string }) {
  const [duplicateState, duplicateAction] = useActionState(
    duplicateVehicleAction,
    initialFormState,
  );
  const [deleteState, deleteAction] = useActionState(
    deleteVehicleAction,
    initialFormState,
  );

  return (
    <div className="dws-vehicle-detail__actions space-y-3">
      <FormAlert state={duplicateState} />
      <FormAlert state={deleteState} />

      <div className="dws-vehicle-detail__actions-buttons flex flex-wrap items-center gap-3">
        <Link
          href={`/dashboard/vehicles/${vehicleId}/edit`}
          className={SECONDARY_CLASS}
        >
          Editar
        </Link>

        <form action={duplicateAction}>
          <input type="hidden" name="id" value={vehicleId} />
          <ActionSubmit pendingLabel="Duplicando…" className={SECONDARY_CLASS}>
            Duplicar
          </ActionSubmit>
        </form>

        <form
          action={deleteAction}
          onSubmit={(event) => {
            if (
              !window.confirm(
                "¿Eliminar este vehículo? Esta acción no se puede deshacer.",
              )
            ) {
              event.preventDefault();
            }
          }}
        >
          <input type="hidden" name="id" value={vehicleId} />
          <ActionSubmit pendingLabel="Eliminando…" className={DANGER_CLASS}>
            Eliminar
          </ActionSubmit>
        </form>
      </div>
    </div>
  );
}
