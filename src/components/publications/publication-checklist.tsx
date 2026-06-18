"use client";

import { useActionState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import type { PublicationTargetWithGroup } from "@/services/publications";
import { initialFormState } from "@/lib/errors";
import { PUBLICATION_TARGET_STATUS_LABELS } from "@/lib/constants/publications";
import { GROUP_PLATFORM_LABELS } from "@/lib/constants/publication-groups";
import { setTargetStatusAction } from "@/services/publications/actions";
import { FormAlert } from "@/components/ui/form-alert";

const SECONDARY_CLASS =
  "rounded-md border border-border px-3 py-1.5 text-sm text-text transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-60";

const DANGER_CLASS =
  "rounded-md border border-danger/50 px-3 py-1.5 text-sm text-danger transition-colors hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-60";

const STATUS_BUTTONS = [
  { value: "completed", label: "Marcar publicado", className: SECONDARY_CLASS },
  {
    value: "requires_review",
    label: "Requiere revisión",
    className: SECONDARY_CLASS,
  },
  { value: "failed", label: "Marcar fallido", className: DANGER_CLASS },
  { value: "cancelled", label: "Cancelar", className: SECONDARY_CLASS },
] as const;

function StatusButton({
  value,
  children,
  className,
}: {
  value: string;
  children: ReactNode;
  className: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      name="status"
      value={value}
      disabled={pending}
      className={className}
    >
      {children}
    </button>
  );
}

function TargetItem({
  publicationId,
  target,
}: {
  publicationId: string;
  target: PublicationTargetWithGroup;
}) {
  const [state, formAction] = useActionState(
    setTargetStatusAction,
    initialFormState,
  );

  return (
    <div className="dws-checklist__item rounded-lg border border-border bg-surface p-4">
      <div className="dws-checklist__head flex items-start justify-between gap-3">
        <div>
          <p className="dws-checklist__name font-medium text-text">
            {target.group?.name ?? "Grupo no disponible"}
          </p>
          {target.group ? (
            <p className="dws-checklist__platform text-xs text-text-muted">
              {GROUP_PLATFORM_LABELS[target.group.platform]}
            </p>
          ) : null}
        </div>
        <span className="dws-checklist__status shrink-0 rounded-full border border-border bg-surface-muted px-2 py-0.5 text-xs text-text-muted">
          {PUBLICATION_TARGET_STATUS_LABELS[target.status]}
        </span>
      </div>

      {target.group ? (
        <a
          href={target.group.url}
          target="_blank"
          rel="noopener noreferrer"
          className="dws-checklist__open mt-2 inline-block text-sm text-accent transition-colors hover:text-text"
        >
          Abrir grupo
        </a>
      ) : null}

      <FormAlert state={state} />

      <form
        action={formAction}
        className="dws-checklist__actions mt-3 flex flex-wrap gap-2"
      >
        <input type="hidden" name="targetId" value={target.id} />
        <input type="hidden" name="publicationId" value={publicationId} />
        {STATUS_BUTTONS.map((button) => (
          <StatusButton
            key={button.value}
            value={button.value}
            className={button.className}
          >
            {button.label}
          </StatusButton>
        ))}
      </form>
    </div>
  );
}

export function PublicationChecklist({
  publicationId,
  targets,
}: {
  publicationId: string;
  targets: PublicationTargetWithGroup[];
}) {
  if (targets.length === 0) {
    return (
      <p className="dws-checklist__empty text-sm text-text-muted">
        No hay destinos.
      </p>
    );
  }

  return (
    <div className="dws-checklist grid gap-3">
      {targets.map((target) => (
        <TargetItem
          key={target.id}
          publicationId={publicationId}
          target={target}
        />
      ))}
    </div>
  );
}
