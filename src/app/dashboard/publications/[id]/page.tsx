import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import { getPublicationById } from "@/services/publications";
import {
  PUBLICATION_LOG_LEVEL_LABELS,
  PUBLICATION_STATUS_LABELS,
} from "@/lib/constants/publications";
import { formatDate } from "@/lib/formatting";
import { PublicationChecklist } from "@/components/publications/publication-checklist";
import { CopyButton } from "@/components/publications/copy-button";
import { CancelPublicationButton } from "@/components/publications/cancel-publication-button";

export const metadata: Metadata = {
  title: "Publicación · DWS PublishFlow",
};

export default async function PublicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const parsedId = z.string().uuid().safeParse(id);
  if (!parsedId.success) {
    notFound();
  }

  const publication = await getPublicationById(parsedId.data);
  if (!publication) {
    notFound();
  }

  const isActive = publication.targets.some(
    (target) =>
      target.status === "pending" || target.status === "requires_review",
  );

  return (
    <article className="dws-publication-detail">
      <div className="dws-publication-detail__back">
        <Link
          href="/dashboard/publications"
          className="dws-publication-detail__back-link text-sm text-text-muted transition-colors hover:text-text"
        >
          ← Volver a Publicaciones
        </Link>
      </div>

      <header className="dws-publication-detail__header mt-4">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="dws-publication-detail__title text-2xl font-semibold text-text">
            {publication.vehicle?.title ?? "Vehículo no disponible"}
          </h1>
          <span className="dws-publication-detail__status rounded-full border border-border bg-surface-muted px-2 py-0.5 text-xs text-text-muted">
            {PUBLICATION_STATUS_LABELS[publication.status]}
          </span>
        </div>
        <p className="dws-publication-detail__date mt-1 text-sm text-text-muted">
          Creada {formatDate(publication.created_at)}
        </p>
      </header>

      {isActive ? (
        <div className="dws-publication-detail__cancel-wrap mt-4">
          <CancelPublicationButton publicationId={publication.id} />
        </div>
      ) : null}

      <section className="dws-publication-detail__section mt-8">
        <div className="dws-publication-detail__section-head flex items-center justify-between gap-3">
          <h2 className="dws-publication-detail__section-title text-sm font-medium uppercase tracking-wide text-text-muted">
            Texto de la publicación
          </h2>
          <CopyButton text={publication.publication_text} />
        </div>
        <pre className="dws-publication-detail__text mt-3 whitespace-pre-wrap rounded-lg border border-border bg-surface p-4 font-sans text-sm text-text">
          {publication.publication_text}
        </pre>
      </section>

      <section className="dws-publication-detail__section mt-8">
        <h2 className="dws-publication-detail__section-title text-sm font-medium uppercase tracking-wide text-text-muted">
          Destinos
        </h2>
        <div className="mt-3">
          <PublicationChecklist
            publicationId={publication.id}
            targets={publication.targets}
          />
        </div>
      </section>

      {publication.logs.length > 0 ? (
        <section className="dws-publication-detail__section mt-8">
          <h2 className="dws-publication-detail__section-title text-sm font-medium uppercase tracking-wide text-text-muted">
            Actividad
          </h2>
          <ul className="dws-publication-detail__logs mt-3 divide-y divide-border rounded-lg border border-border bg-surface">
            {publication.logs.map((log) => (
              <li
                key={log.id}
                className="dws-publication-detail__log px-4 py-3 text-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-text">{log.message}</span>
                  <span className="shrink-0 text-xs text-text-muted">
                    {formatDate(log.created_at)}
                  </span>
                </div>
                <span className="text-xs text-text-muted">
                  {PUBLICATION_LOG_LEVEL_LABELS[log.level]}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
