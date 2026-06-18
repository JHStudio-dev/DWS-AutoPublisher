"use client";

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="dws-dashboard-home dws-dashboard-home--error">
      <div className="dws-dashboard-home__error rounded-lg border border-danger/40 bg-danger/10 p-6 text-center">
        <p className="dws-dashboard-home__error-text text-text">
          No se pudo cargar el panel.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="dws-dashboard-home__error-retry mt-3 rounded-md border border-border px-3 py-1.5 text-sm text-text transition-colors hover:bg-surface-muted"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}
