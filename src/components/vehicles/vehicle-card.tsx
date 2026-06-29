import Link from "next/link";
import type { Vehicle } from "@/db/types/database";
import {
  VEHICLE_STATUS_LABELS,
  VEHICLE_STATUS_TONES,
  VEHICLE_VISIBILITY_LABELS,
} from "@/lib/constants/vehicles";
import { formatDate, formatPrice } from "@/lib/formatting";
import { IconCar } from "@/components/ui/icons";
import { StatusPill } from "@/components/ui/status-pill";

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Link
      href={`/dashboard/vehicles/${vehicle.id}`}
      className="dws-vehicle-card group block overflow-hidden rounded-card border border-border bg-surface shadow-card transition-[transform,border-color] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:border-primary/40"
    >
      <div className="dws-vehicle-card__media grid aspect-[16/9] place-items-center bg-surface-muted text-text-muted/40">
        <IconCar className="h-10 w-10" />
      </div>

      <div className="dws-vehicle-card__body p-4">
        <div className="dws-vehicle-card__header flex items-start justify-between gap-3">
          <h2 className="dws-vehicle-card__title truncate font-medium text-text">
            {vehicle.title}
          </h2>
          <span className="shrink-0">
            <StatusPill tone={VEHICLE_STATUS_TONES[vehicle.status]}>
              {VEHICLE_STATUS_LABELS[vehicle.status]}
            </StatusPill>
          </span>
        </div>

        <p className="dws-vehicle-card__meta mt-1 text-sm text-text-muted">
          {vehicle.brand} · {vehicle.model} · {vehicle.year}
        </p>

        <p className="dws-vehicle-card__price mt-3 text-lg font-semibold tabular-nums text-text">
          {formatPrice(vehicle.price)}
        </p>

        <div className="dws-vehicle-card__footer mt-3 flex items-center justify-between border-t border-border pt-3 text-xs text-text-muted">
          <span className="dws-vehicle-card__visibility">
            {VEHICLE_VISIBILITY_LABELS[vehicle.visibility]}
          </span>
          <span className="dws-vehicle-card__updated">
            {formatDate(vehicle.updated_at)}
          </span>
        </div>
      </div>
    </Link>
  );
}
