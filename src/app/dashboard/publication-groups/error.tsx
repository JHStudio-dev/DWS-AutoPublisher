"use client";

export default function PublicationGroupsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="dws-groups dws-groups--error">
      <div className="dws-groups__error rounded-lg border border-danger/40 bg-danger/10 p-6 text-center">
        <p className="dws-groups__error-text text-text">
          No se pudieron cargar los grupos.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="dws-groups__error-retry mt-3 rounded-md border border-border px-3 py-1.5 text-sm text-text transition-colors hover:bg-surface-muted"
        >
          Reintentar
        </button>
      </div>
    </section>
  );
}
