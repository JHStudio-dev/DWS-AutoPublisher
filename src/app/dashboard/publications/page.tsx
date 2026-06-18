import Link from "next/link";
import type { Metadata } from "next";
import { listPublications } from "@/services/publications";
import { PUBLICATION_STATUSES } from "@/lib/constants/publications";
import type { PublicationStatus } from "@/db/types/database";
import { PublicationCard } from "@/components/publications/publication-card";
import { PublicationFilters } from "@/components/publications/publication-filters";

export const metadata: Metadata = {
  title: "Publicaciones · DWS PublishFlow",
};

type SearchParams = {
  q?: string;
  status?: string;
};

function asStatus(value?: string): PublicationStatus | undefined {
  return value && (PUBLICATION_STATUSES as readonly string[]).includes(value)
    ? (value as PublicationStatus)
    : undefined;
}

export default async function PublicationsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const search = (params.q ?? "").trim();
  const status = asStatus(params.status);

  const all = await listPublications({ status });
  const term = search.toLowerCase();
  const publications = term
    ? all.filter((publication) =>
        (publication.vehicle?.title ?? "").toLowerCase().includes(term),
      )
    : all;

  const hasFilters = Boolean(search || status);

  return (
    <section className="dws-publications">
      <header className="dws-publications__header flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="dws-publications__title text-2xl font-semibold text-text">
            Publicaciones
          </h1>
          <p className="dws-publications__subtitle mt-1 text-sm text-text-muted">
            {publications.length}{" "}
            {publications.length === 1 ? "publicación" : "publicaciones"}
          </p>
        </div>
        <Link
          href="/dashboard/publications/new"
          className="dws-publications__create rounded-md bg-primary px-4 py-2 text-sm font-medium text-text transition-colors hover:bg-primary-hover"
        >
          Nueva publicación
        </Link>
      </header>

      <div className="dws-publications__toolbar mt-6">
        <PublicationFilters search={search} status={status ?? ""} />
      </div>

      {publications.length === 0 ? (
        <div className="dws-publications__empty mt-8 rounded-lg border border-border bg-surface p-8 text-center">
          <p className="dws-publications__empty-text text-text">
            {hasFilters
              ? "No se encontraron publicaciones con los filtros aplicados."
              : "No hay publicaciones todavía."}
          </p>
          {hasFilters ? (
            <Link
              href="/dashboard/publications"
              className="dws-publications__empty-action mt-2 inline-block text-sm text-accent"
            >
              Limpiar filtros
            </Link>
          ) : (
            <Link
              href="/dashboard/publications/new"
              className="dws-publications__empty-action mt-2 inline-block text-sm text-accent"
            >
              Crear la primera publicación
            </Link>
          )}
        </div>
      ) : (
        <ul className="dws-publications__list mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {publications.map((publication) => (
            <li key={publication.id} className="dws-publications__item">
              <PublicationCard publication={publication} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
