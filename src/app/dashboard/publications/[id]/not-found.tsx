import Link from "next/link";

export default function PublicationNotFound() {
  return (
    <section className="dws-publication-detail dws-publication-detail--not-found">
      <div className="dws-publication-detail__not-found rounded-lg border border-border bg-surface p-8 text-center">
        <p className="dws-publication-detail__not-found-text text-text">
          No se encontró la publicación.
        </p>
        <Link
          href="/dashboard/publications"
          className="dws-publication-detail__not-found-link mt-3 inline-block text-sm text-accent"
        >
          Volver a Publicaciones
        </Link>
      </div>
    </section>
  );
}
