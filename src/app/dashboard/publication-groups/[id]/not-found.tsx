import Link from "next/link";

export default function GroupNotFound() {
  return (
    <section className="dws-group-detail dws-group-detail--not-found">
      <div className="dws-group-detail__not-found rounded-lg border border-border bg-surface p-8 text-center">
        <p className="dws-group-detail__not-found-text text-text">
          No se encontró el grupo.
        </p>
        <Link
          href="/dashboard/publication-groups"
          className="dws-group-detail__not-found-link mt-3 inline-block text-sm text-accent"
        >
          Volver a Grupos de publicación
        </Link>
      </div>
    </section>
  );
}
