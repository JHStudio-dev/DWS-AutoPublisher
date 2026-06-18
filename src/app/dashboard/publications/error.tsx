"use client";

export default function PublicationsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="dws-publications dws-publications--error">
      <div className="dws-publications__error rounded-lg border border-danger/40 bg-danger/10 p-6 text-center">
        <p className="dws-publications__error-text text-text">
          No se pudieron cargar las publicaciones.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="dws-publications__error-retry mt-3 rounded-md border border-border px-3 py-1.5 text-sm text-text transition-colors hover:bg-surface-muted"
        >
          Reintentar
        </button>
      </div>
    </section>
  );
}
