import Link from "next/link";
import { TextField } from "@/components/ui/text-field";
import { SelectField } from "@/components/ui/select-field";
import {
  VEHICLE_STATUSES,
  VEHICLE_STATUS_LABELS,
  VEHICLE_VISIBILITIES,
  VEHICLE_VISIBILITY_LABELS,
} from "@/lib/constants/vehicles";

type VehicleFiltersProps = {
  search: string;
  status: string;
  visibility: string;
};

export function VehicleFilters({
  search,
  status,
  visibility,
}: VehicleFiltersProps) {
  const statusOptions = VEHICLE_STATUSES.map((value) => ({
    value,
    label: VEHICLE_STATUS_LABELS[value],
  }));
  const visibilityOptions = VEHICLE_VISIBILITIES.map((value) => ({
    value,
    label: VEHICLE_VISIBILITY_LABELS[value],
  }));

  return (
    <form
      method="get"
      className="dws-vehicles__filters grid gap-3 rounded-lg border border-border bg-surface p-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end"
    >
      <TextField
        label="Buscar"
        name="q"
        type="search"
        placeholder="Título, marca o modelo"
        defaultValue={search}
      />
      <SelectField
        label="Estado"
        name="status"
        options={statusOptions}
        placeholder="Todos"
        defaultValue={status}
      />
      <SelectField
        label="Visibilidad"
        name="visibility"
        options={visibilityOptions}
        placeholder="Todas"
        defaultValue={visibility}
      />
      <div className="dws-vehicles__filters-actions flex items-center gap-3">
        <button
          type="submit"
          className="dws-vehicles__filters-submit rounded-md border border-border px-4 py-2 text-sm text-text transition-colors hover:bg-surface-muted"
        >
          Filtrar
        </button>
        <Link
          href="/dashboard/vehicles"
          className="dws-vehicles__filters-clear text-sm text-text-muted transition-colors hover:text-text"
        >
          Limpiar
        </Link>
      </div>
    </form>
  );
}
