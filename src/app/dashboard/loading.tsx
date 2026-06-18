export default function DashboardLoading() {
  return (
    <div className="dws-dashboard-home dws-dashboard-home--loading">
      <h1 className="dws-dashboard-home__title text-2xl font-semibold text-text">
        Panel
      </h1>
      <p className="dws-dashboard-home__loading mt-6 text-sm text-text-muted">
        Cargando panel…
      </p>
    </div>
  );
}
