import Link from "next/link";

export default function VehicleNotFound() {
  return (
    <section className="dws-vehicle-detail dws-vehicle-detail--not-found">
      <div className="dws-vehicle-detail__not-found rounded-lg border border-border bg-surface p-8 text-center">
        <p className="dws-vehicle-detail__not-found-text text-text">
          No se encontró el vehículo.
        </p>
        <Link
          href="/dashboard/vehicles"
          className="dws-vehicle-detail__not-found-link mt-3 inline-block text-sm text-accent"
        >
          Volver a Vehículos
        </Link>
      </div>
    </section>
  );
}
