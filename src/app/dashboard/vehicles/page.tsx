import Link from "next/link";
import type { Metadata } from "next";
import { listVehicles } from "@/services/vehicles";
import {
  VEHICLE_STATUSES,
  VEHICLE_VISIBILITIES,
} from "@/lib/constants/vehicles";
import type { VehicleStatus, VehicleVisibility } from "@/db/types/database";
import { IconPlus } from "@/components/ui/icons";
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
          <h1 className="dws-vehicles__title text-2xl font-semibold tracking-tight text-text">
            Vehículos
          </h1>
          <p className="dws-vehicles__subtitle mt-1 text-sm text-text-muted">
            {vehicles.length}{" "}
            {vehicles.length === 1 ? "vehículo" : "vehículos"}
          </p>
        </div>
        <Link
          href="/dashboard/vehicles/new"
          className="dws-vehicles__create group inline-flex items-center gap-2 rounded-lg bg-primary py-2 pl-4 pr-2 text-sm font-medium text-text shadow-primary transition-[transform,background-color] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-primary-hover active:scale-[0.98]"
        >
          <span>Agregar vehículo</span>
          <span className="grid h-6 w-6 place-items-center rounded-md bg-black/20 transition-transform duration-200 group-hover:translate-x-0.5">
            <IconPlus className="h-4 w-4" />
          </span>
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
        <div className="dws-vehicles__empty mt-6 grid place-items-center rounded-card border border-dashed border-border bg-surface p-12 text-center">
          <p className="dws-vehicles__empty-text text-sm text-text-muted">
            {hasFilters
              ? "No se encontraron vehículos con los filtros aplicados."
              : "Aún no hay vehículos registrados."}
          </p>
          {hasFilters ? (
            <Link
              href="/dashboard/vehicles"
              className="dws-vehicles__empty-action mt-2 inline-block text-sm font-medium text-primary transition-colors hover:text-primary-hover"
            >
              Limpiar filtros
            </Link>
          ) : (
            <Link
              href="/dashboard/vehicles/new"
              className="dws-vehicles__empty-action mt-2 inline-block text-sm font-medium text-primary transition-colors hover:text-primary-hover"
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
