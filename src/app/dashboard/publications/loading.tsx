export default function PublicationsLoading() {
  return (
    <section className="dws-publications dws-publications--loading">
      <h1 className="dws-publications__title text-2xl font-semibold text-text">
        Publicaciones
      </h1>
      <p className="dws-publications__loading mt-6 text-sm text-text-muted">
        Cargando publicaciones…
      </p>
    </section>
  );
}
