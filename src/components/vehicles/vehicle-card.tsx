import Link from "next/link";
import type { Vehicle } from "@/db/types/database";
import {
  VEHICLE_STATUS_LABELS,
  VEHICLE_VISIBILITY_LABELS,
} from "@/lib/constants/vehicles";
import { formatDate, formatPrice } from "@/lib/formatting";

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Link
      href={`/dashboard/vehicles/${vehicle.id}`}
      className="dws-vehicle-card block rounded-lg border border-border bg-surface p-4 transition-colors hover:border-primary"
    >
      <div className="dws-vehicle-card__header flex items-start justify-between gap-3">
        <h2 className="dws-vehicle-card__title font-medium text-text">
          {vehicle.title}
        </h2>
        <span className="dws-vehicle-card__status shrink-0 rounded-full border border-border bg-surface-muted px-2 py-0.5 text-xs text-text-muted">
          {VEHICLE_STATUS_LABELS[vehicle.status]}
        </span>
      </div>

      <p className="dws-vehicle-card__meta mt-1 text-sm text-text-muted">
        {vehicle.brand} · {vehicle.model} · {vehicle.year}
      </p>

      <p className="dws-vehicle-card__price mt-3 text-lg font-semibold text-text">
        {formatPrice(vehicle.price)}
      </p>

      <div className="dws-vehicle-card__footer mt-3 flex items-center justify-between text-xs text-text-muted">
        <span className="dws-vehicle-card__visibility">
          {VEHICLE_VISIBILITY_LABELS[vehicle.visibility]}
        </span>
        <span className="dws-vehicle-card__updated">
          Actualizado {formatDate(vehicle.updated_at)}
        </span>
      </div>
    </Link>
  );
}
