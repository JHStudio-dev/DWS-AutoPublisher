import Link from "next/link";
import { TextField } from "@/components/ui/text-field";
import { SelectField } from "@/components/ui/select-field";
import {
  GROUP_PLATFORMS,
  GROUP_PLATFORM_LABELS,
} from "@/lib/constants/publication-groups";

type GroupFiltersProps = {
  search: string;
  platform: string;
  active: string;
};

export function GroupFilters({ search, platform, active }: GroupFiltersProps) {
  const platformOptions = GROUP_PLATFORMS.map((value) => ({
    value,
    label: GROUP_PLATFORM_LABELS[value],
  }));
  const activeOptions = [
    { value: "true", label: "Activos" },
    { value: "false", label: "Inactivos" },
  ];

  return (
    <form
      method="get"
      className="dws-groups__filters grid gap-3 rounded-lg border border-border bg-surface p-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end"
    >
      <TextField
        label="Buscar"
        name="q"
        type="search"
        placeholder="Nombre o URL"
        defaultValue={search}
      />
      <SelectField
        label="Plataforma"
        name="platform"
        options={platformOptions}
        placeholder="Todas"
        defaultValue={platform}
      />
      <SelectField
        label="Estado"
        name="active"
        options={activeOptions}
        placeholder="Todos"
        defaultValue={active}
      />
      <div className="dws-groups__filters-actions flex items-center gap-3">
        <button
          type="submit"
          className="dws-groups__filters-submit rounded-md border border-border px-4 py-2 text-sm text-text transition-colors hover:bg-surface-muted"
        >
          Filtrar
        </button>
        <Link
          href="/dashboard/publication-groups"
          className="dws-groups__filters-clear text-sm text-text-muted transition-colors hover:text-text"
        >
          Limpiar
        </Link>
      </div>
    </form>
  );
}
