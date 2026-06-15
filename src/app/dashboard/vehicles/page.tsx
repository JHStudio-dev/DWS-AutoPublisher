import Link from "next/link";
import type { Metadata } from "next";
import { listVehicles } from "@/services/vehicles";
import {
  VEHICLE_STATUSES,
  VEHICLE_VISIBILITIES,
} from "@/lib/constants/vehicles";
import type { VehicleStatus, VehicleVisibility } from "@/db/types/database";
import { VehicleCard } from "@/components/vehicles/vehicle-card";
import { VehicleFilters } from "@/components/vehicles/vehicle-filters";

export const metadata: Metadata = {
  title: "Vehículos · DWS PublishFlow",
};

type SearchParams = {
  q?: string;
  status?: string;
  visibility?: string;
};

function asStatus(value?: string): VehicleStatus | undefined {
  return value && (VEHICLE_STATUSES as readonly string[]).includes(value)
    ? (value as VehicleStatus)
    : undefined;
}

function asVisibility(value?: string): VehicleVisibility | undefined {
  return value && (VEHICLE_VISIBILITIES as readonly string[]).includes(value)
    ? (value as VehicleVisibility)
    : undefined;
}

export default async function VehiclesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const search = (params.q ?? "").trim();
  const status = asStatus(params.status);
  const visibility = asVisibility(params.visibility);

  const vehicles = await listVehicles({
    search: search || undefined,
    status,
    visibility,
  });

  const hasFilters = Boolean(search || status || visibility);

  return (
    <section className="dws-vehicles">
      <header className="dws-vehicles__header flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="dws-vehicles__title text-2xl font-semibold text-text">
            Vehículos
          </h1>
          <p className="dws-vehicles__subtitle mt-1 text-sm text-text-muted">
            {vehicles.length}{" "}
            {vehicles.length === 1 ? "vehículo" : "vehículos"}
          </p>
        </div>
        <Link
          href="/dashboard/vehicles/new"
          className="dws-vehicles__create rounded-md bg-primary px-4 py-2 text-sm font-medium text-text transition-colors hover:bg-primary-hover"
        >
          Agregar vehículo
        </Link>
      </header>

      <div className="dws-vehicles__toolbar mt-6">
        <VehicleFilters
          search={search}
          status={status ?? ""}
          visibility={visibility ?? ""}
        />
      </div>

      {vehicles.length === 0 ? (
        <div className="dws-vehicles__empty mt-8 rounded-lg border border-border bg-surface p-8 text-center">
          <p className="dws-vehicles__empty-text text-text">
            {hasFilters
              ? "No se encontraron vehículos con los filtros aplicados."
              : "No hay vehículos registrados."}
          </p>
          {hasFilters ? (
            <Link
              href="/dashboard/vehicles"
              className="dws-vehicles__empty-action mt-2 inline-block text-sm text-accent"
            >
              Limpiar filtros
            </Link>
          ) : (
            <Link
              href="/dashboard/vehicles/new"
              className="dws-vehicles__empty-action mt-2 inline-block text-sm text-accent"
            >
              Agregar el primer vehículo
            </Link>
          )}
        </div>
      ) : (
        <ul className="dws-vehicles__list mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <li key={vehicle.id} className="dws-vehicles__item">
              <VehicleCard vehicle={vehicle} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
