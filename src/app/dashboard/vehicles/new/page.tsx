import Link from "next/link";
import type { Metadata } from "next";
import { createVehicleAction } from "@/services/vehicles/actions";
import { VehicleForm } from "@/components/vehicles/vehicle-form";

export const metadata: Metadata = {
  title: "Agregar vehículo · DWS PublishFlow",
};

export default function NewVehiclePage() {
  return (
    <section className="dws-vehicle-form-page mx-auto max-w-3xl">
      <Link
        href="/dashboard/vehicles"
        className="dws-vehicle-form-page__back inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-text"
      >
        <span aria-hidden="true">←</span> Volver a Vehículos
      </Link>

      <header className="dws-vehicle-form-page__header mt-4">
        <h1 className="dws-vehicle-form-page__title text-2xl font-semibold tracking-tight text-text">
          Agregar vehículo
        </h1>
        <p className="dws-vehicle-form-page__subtitle mt-1 text-sm text-text-muted">
          Completa la información del vehículo.
        </p>
      </header>

      <div className="dws-vehicle-form-page__body mt-6">
        <VehicleForm
          action={createVehicleAction}
          submitLabel="Crear vehículo"
          pendingLabel="Creando…"
          cancelHref="/dashboard/vehicles"
        />
      </div>
    </section>
  );
}
