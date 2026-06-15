import type { Metadata } from "next";
import { createVehicleAction } from "@/services/vehicles/actions";
import { VehicleForm } from "@/components/vehicles/vehicle-form";

export const metadata: Metadata = {
  title: "Agregar vehículo · DWS PublishFlow",
};

export default function NewVehiclePage() {
  return (
    <section className="dws-vehicle-form-page">
      <header className="dws-vehicle-form-page__header">
        <h1 className="dws-vehicle-form-page__title text-2xl font-semibold text-text">
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
