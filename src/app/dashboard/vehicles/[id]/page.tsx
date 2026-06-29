import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import { getVehicleById } from "@/services/vehicles";
import { getSignedImageUrl, listVehicleImages } from "@/services/vehicles/images";
import {
  VEHICLE_STATUS_LABELS,
  VEHICLE_STATUS_TONES,
  VEHICLE_VISIBILITY_LABELS,
} from "@/lib/constants/vehicles";
import { formatDate, formatPrice } from "@/lib/formatting";
import { Panel } from "@/components/ui/panel";
import { StatusPill } from "@/components/ui/status-pill";
import { IconSend } from "@/components/ui/icons";
import { VehicleActions } from "@/components/vehicles/vehicle-actions";
import { VehicleImageManager } from "@/components/vehicles/vehicle-image-manager";

export const metadata: Metadata = {
  title: "Vehículo · DWS PublishFlow",
};

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="dws-vehicle-detail__meta">
      <dt className="dws-vehicle-detail__meta-label text-xs uppercase tracking-wide text-text-muted">
        {label}
      </dt>
      <dd className="dws-vehicle-detail__meta-value mt-0.5 text-sm text-text">
        {value}
      </dd>
    </div>
  );
}

export default async function VehicleDetailPage({
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

  const images = await listVehicleImages(vehicle.id);
  const gallery = await Promise.all(
    images.map(async (image) => ({
      id: image.id,
      url: image.public_url ?? (await getSignedImageUrl(image.storage_path)),
    })),
  );

  const mileage =
    vehicle.mileage != null
      ? `${vehicle.mileage.toLocaleString("es-HN")} km`
      : "—";

  return (
    <div className="dws-vehicle-detail space-y-6">
      <Link
        href="/dashboard/vehicles"
        className="dws-vehicle-detail__back inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-text"
      >
        <span aria-hidden="true">←</span> Volver a Vehículos
      </Link>

      <header className="dws-vehicle-detail__header rounded-card border border-border bg-surface p-5 shadow-card sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="dws-vehicle-detail__title text-2xl font-semibold tracking-tight text-text">
                {vehicle.title}
              </h1>
              <StatusPill tone={VEHICLE_STATUS_TONES[vehicle.status]}>
                {VEHICLE_STATUS_LABELS[vehicle.status]}
              </StatusPill>
            </div>
            <p className="dws-vehicle-detail__subtitle mt-1 text-sm text-text-muted">
              {vehicle.brand} · {vehicle.model} · {vehicle.year}
            </p>
            <p className="dws-vehicle-detail__price mt-3 text-2xl font-semibold tabular-nums text-text">
              {formatPrice(vehicle.price)}
            </p>
          </div>

          <div className="dws-vehicle-detail__actions-wrap flex flex-col gap-3 sm:items-end">
            <Link
              href={`/dashboard/vehicles/${vehicle.id}/publish`}
              className="dws-vehicle-detail__publish group inline-flex items-center gap-2 rounded-lg bg-primary py-2 pl-4 pr-2 text-sm font-medium text-text shadow-primary transition-[transform,background-color] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-primary-hover active:scale-[0.98]"
            >
              <span>Preparar publicación</span>
              <span className="grid h-6 w-6 place-items-center rounded-md bg-black/20 transition-transform duration-200 group-hover:translate-x-0.5">
                <IconSend className="h-4 w-4" />
              </span>
            </Link>
            <VehicleActions vehicleId={vehicle.id} />
          </div>
        </div>
      </header>

      <div className="dws-vehicle-detail__grid grid gap-4 lg:grid-cols-3">
        <div className="dws-vehicle-detail__main space-y-4 lg:col-span-2">
          <Panel title="Imágenes">
            <VehicleImageManager vehicleId={vehicle.id} images={gallery} />
          </Panel>

          {vehicle.description ? (
            <Panel title="Descripción">
              <p className="dws-vehicle-detail__description whitespace-pre-line text-sm text-text">
                {vehicle.description}
              </p>
            </Panel>
          ) : null}
        </div>

        <Panel title="Información" className="h-fit">
          <dl className="dws-vehicle-detail__info grid gap-4 sm:grid-cols-2">
            <InfoItem label="Marca" value={vehicle.brand} />
            <InfoItem label="Modelo" value={vehicle.model} />
            <InfoItem label="Año" value={String(vehicle.year)} />
            <InfoItem label="Precio" value={formatPrice(vehicle.price)} />
            <InfoItem label="Kilometraje" value={mileage} />
            <InfoItem label="Transmisión" value={vehicle.transmission ?? "—"} />
            <InfoItem label="Combustible" value={vehicle.fuel_type ?? "—"} />
            <InfoItem label="Color" value={vehicle.color ?? "—"} />
            <InfoItem
              label="Visibilidad"
              value={VEHICLE_VISIBILITY_LABELS[vehicle.visibility]}
            />
            <InfoItem label="Creado" value={formatDate(vehicle.created_at)} />
            <InfoItem
              label="Actualizado"
              value={formatDate(vehicle.updated_at)}
            />
          </dl>
        </Panel>
      </div>
    </div>
  );
}
