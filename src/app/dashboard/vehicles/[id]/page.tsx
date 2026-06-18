import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import { getVehicleById } from "@/services/vehicles";
import { getSignedImageUrl, listVehicleImages } from "@/services/vehicles/images";
import {
  VEHICLE_STATUS_LABELS,
  VEHICLE_VISIBILITY_LABELS,
} from "@/lib/constants/vehicles";
import { formatDate, formatPrice } from "@/lib/formatting";
import { VehicleActions } from "@/components/vehicles/vehicle-actions";
import { VehicleGallery } from "@/components/vehicles/vehicle-gallery";

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
    <article className="dws-vehicle-detail">
      <div className="dws-vehicle-detail__back">
        <Link
          href="/dashboard/vehicles"
          className="dws-vehicle-detail__back-link text-sm text-text-muted transition-colors hover:text-text"
        >
          ← Volver a Vehículos
        </Link>
      </div>

      <header className="dws-vehicle-detail__header mt-4">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="dws-vehicle-detail__title text-2xl font-semibold text-text">
            {vehicle.title}
          </h1>
          <span className="dws-vehicle-detail__status rounded-full border border-border bg-surface-muted px-2 py-0.5 text-xs text-text-muted">
            {VEHICLE_STATUS_LABELS[vehicle.status]}
          </span>
        </div>
        <p className="dws-vehicle-detail__subtitle mt-1 text-sm text-text-muted">
          {vehicle.brand} · {vehicle.model} · {vehicle.year}
        </p>
        <p className="dws-vehicle-detail__price mt-2 text-xl font-semibold text-text">
          {formatPrice(vehicle.price)}
        </p>
      </header>

      <div className="dws-vehicle-detail__actions-wrap mt-6 space-y-3">
        <Link
          href={`/dashboard/vehicles/${vehicle.id}/publish`}
          className="dws-vehicle-detail__publish inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-text transition-colors hover:bg-primary-hover"
        >
          Preparar publicación
        </Link>
        <VehicleActions vehicleId={vehicle.id} />
      </div>

      <section className="dws-vehicle-detail__section mt-8">
        <h2 className="dws-vehicle-detail__section-title text-sm font-medium uppercase tracking-wide text-text-muted">
          Imágenes
        </h2>
        <div className="mt-3">
          <VehicleGallery images={gallery} />
        </div>
      </section>

      <section className="dws-vehicle-detail__section mt-8">
        <h2 className="dws-vehicle-detail__section-title text-sm font-medium uppercase tracking-wide text-text-muted">
          Información
        </h2>
        <dl className="dws-vehicle-detail__info mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem label="Marca" value={vehicle.brand} />
          <InfoItem label="Modelo" value={vehicle.model} />
          <InfoItem label="Año" value={String(vehicle.year)} />
          <InfoItem label="Precio" value={formatPrice(vehicle.price)} />
          <InfoItem label="Kilometraje" value={mileage} />
          <InfoItem label="Transmisión" value={vehicle.transmission ?? "—"} />
          <InfoItem label="Combustible" value={vehicle.fuel_type ?? "—"} />
          <InfoItem label="Color" value={vehicle.color ?? "—"} />
          <InfoItem
            label="Estado"
            value={VEHICLE_STATUS_LABELS[vehicle.status]}
          />
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
      </section>

      {vehicle.description ? (
        <section className="dws-vehicle-detail__section mt-8">
          <h2 className="dws-vehicle-detail__section-title text-sm font-medium uppercase tracking-wide text-text-muted">
            Descripción
          </h2>
          <p className="dws-vehicle-detail__description mt-3 whitespace-pre-line text-sm text-text">
            {vehicle.description}
          </p>
        </section>
      ) : null}
    </article>
  );
}
