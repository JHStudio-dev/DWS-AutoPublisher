export default function PublicationGroupsLoading() {
  return (
    <section className="dws-groups dws-groups--loading">
      <h1 className="dws-groups__title text-2xl font-semibold text-text">
        Grupos de publicación
      </h1>
      <p className="dws-groups__loading mt-6 text-sm text-text-muted">
        Cargando grupos…
      </p>
    </section>
  );
}
