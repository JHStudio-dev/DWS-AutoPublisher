import Link from "next/link";
import { TextField } from "@/components/ui/text-field";
import { SelectField } from "@/components/ui/select-field";
import {
  PUBLICATION_STATUSES,
  PUBLICATION_STATUS_LABELS,
} from "@/lib/constants/publications";

type PublicationFiltersProps = {
  search: string;
  status: string;
};

export function PublicationFilters({ search, status }: PublicationFiltersProps) {
  const statusOptions = PUBLICATION_STATUSES.map((value) => ({
    value,
    label: PUBLICATION_STATUS_LABELS[value],
  }));

  return (
    <form
      method="get"
      className="dws-publications__filters grid gap-3 rounded-lg border border-border bg-surface p-4 sm:grid-cols-2 lg:grid-cols-3 lg:items-end"
    >
      <TextField
        label="Buscar"
        name="q"
        type="search"
        placeholder="Vehículo"
        defaultValue={search}
      />
      <SelectField
        label="Estado"
        name="status"
        options={statusOptions}
        placeholder="Todos"
        defaultValue={status}
      />
      <div className="dws-publications__filters-actions flex items-center gap-3">
        <button
          type="submit"
          className="dws-publications__filters-submit rounded-md border border-border px-4 py-2 text-sm text-text transition-colors hover:bg-surface-muted"
        >
          Filtrar
        </button>
        <Link
          href="/dashboard/publications"
          className="dws-publications__filters-clear text-sm text-text-muted transition-colors hover:text-text"
        >
          Limpiar
        </Link>
      </div>
    </form>
  );
}
