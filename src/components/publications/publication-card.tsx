import Link from "next/link";
import type { PublicationListItem } from "@/services/publications";
import { PUBLICATION_STATUS_LABELS } from "@/lib/constants/publications";
import { formatDate } from "@/lib/formatting";

export function PublicationCard({
  publication,
}: {
  publication: PublicationListItem;
}) {
  const total = publication.targets.length;
  const completed = publication.targets.filter(
    (target) => target.status === "completed",
  ).length;

  return (
    <Link
      href={`/dashboard/publications/${publication.id}`}
      className="dws-publication-card block rounded-lg border border-border bg-surface p-4 transition-colors hover:border-primary"
    >
      <div className="dws-publication-card__header flex items-start justify-between gap-3">
        <h2 className="dws-publication-card__title font-medium text-text">
          {publication.vehicle?.title ?? "Vehículo no disponible"}
        </h2>
        <span className="dws-publication-card__status shrink-0 rounded-full border border-border bg-surface-muted px-2 py-0.5 text-xs text-text-muted">
          {PUBLICATION_STATUS_LABELS[publication.status]}
        </span>
      </div>

      <p className="dws-publication-card__progress mt-2 text-sm text-text-muted">
        {completed} de {total}{" "}
        {total === 1 ? "destino publicado" : "destinos publicados"}
      </p>

      <p className="dws-publication-card__date mt-2 text-xs text-text-muted">
        Creada {formatDate(publication.created_at)}
      </p>
    </Link>
  );
}
