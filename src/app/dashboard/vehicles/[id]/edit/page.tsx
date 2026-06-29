import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import { getVehicleById } from "@/services/vehicles";
import { updateVehicleAction } from "@/services/vehicles/actions";
import { VehicleForm } from "@/components/vehicles/vehicle-form";

export const metadata: Metadata = {
  title: "Editar vehículo · DWS PublishFlow",
};

export default async function EditVehiclePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const parsedId = z.string().uuid().safeParse(id);
  if (!parsedId.success) {
    notFound();
  }

  const vehicle = await getVehicleById(parsedId.data);
  if (!vehicle) {
    notFound();
  }

  return (
    <section className="dws-vehicle-form-page mx-auto max-w-3xl">
      <Link
        href={`/dashboard/vehicles/${vehicle.id}`}
        className="dws-vehicle-form-page__back inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-text"
      >
        <span aria-hidden="true">←</span> Volver al vehículo
      </Link>

      <header className="dws-vehicle-form-page__header mt-4">
        <h1 className="dws-vehicle-form-page__title text-2xl font-semibold tracking-tight text-text">
          Editar vehículo
        </h1>
        <p className="dws-vehicle-form-page__subtitle mt-1 text-sm text-text-muted">
          Actualiza la información del vehículo.
        </p>
      </header>

      <div className="dws-vehicle-form-page__body mt-6">
        <VehicleForm
          action={updateVehicleAction}
          submitLabel="Guardar cambios"
          pendingLabel="Guardando…"
          cancelHref={`/dashboard/vehicles/${vehicle.id}`}
          vehicle={vehicle}
        />
      </div>
    </section>
  );
}
