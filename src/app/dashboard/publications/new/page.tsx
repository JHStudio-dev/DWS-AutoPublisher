import Link from "next/link";
import type { Metadata } from "next";
import { listVehicles } from "@/services/vehicles";
import { VEHICLE_STATUS_LABELS } from "@/lib/constants/vehicles";

export const metadata: Metadata = {
  title: "Nueva publicación · DWS PublishFlow",
};

export default async function NewPublicationPage() {
  const vehicles = await listVehicles();

  return (
    <section className="dws-publication-new">
      <header className="dws-publication-new__header">
        <h1 className="dws-publication-new__title text-2xl font-semibold text-text">
          Nueva publicación
        </h1>
        <p className="dws-publication-new__subtitle mt-1 text-sm text-text-muted">
          Selecciona el vehículo que quieres publicar.
        </p>
      </header>

      {vehicles.length === 0 ? (
        <div className="dws-publication-new__empty mt-6 rounded-lg border border-border bg-surface p-8 text-center">
          <p className="dws-publication-new__empty-text text-text">
            No hay vehículos registrados.
          </p>
          <Link
            href="/dashboard/vehicles/new"
            className="dws-publication-new__empty-action mt-2 inline-block text-sm text-accent"
          >
            Agregar un vehículo
          </Link>
        </div>
      ) : (
        <ul className="dws-publication-new__list mt-6 divide-y divide-border rounded-lg border border-border bg-surface">
          {vehicles.map((vehicle) => (
            <li key={vehicle.id} className="dws-publication-new__item">
              <Link
                href={`/dashboard/vehicles/${vehicle.id}/publish`}
                className="dws-publication-new__link flex items-center justify-between gap-3 px-4 py-3 text-sm transition-colors hover:bg-surface-muted"
              >
                <span className="dws-publication-new__vehicle truncate text-text">
                  {vehicle.title}
                  <span className="text-text-muted">
                    {" "}
                    · {vehicle.brand} {vehicle.model} {vehicle.year}
                  </span>
                </span>
                <span className="dws-publication-new__status shrink-0 text-text-muted">
                  {VEHICLE_STATUS_LABELS[vehicle.status]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
