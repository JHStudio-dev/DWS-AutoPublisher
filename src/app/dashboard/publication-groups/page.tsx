import Link from "next/link";
import type { Metadata } from "next";
import { listGroups } from "@/services/publication-groups";
import { GROUP_PLATFORMS } from "@/lib/constants/publication-groups";
import type { GroupPlatform } from "@/db/types/database";
import { IconPlus } from "@/components/ui/icons";
import { GroupCard } from "@/components/publication-groups/group-card";
import { GroupFilters } from "@/components/publication-groups/group-filters";

export const metadata: Metadata = {
  title: "Grupos de publicación · DWS PublishFlow",
};

type SearchParams = {
  q?: string;
  platform?: string;
  active?: string;
};

function asPlatform(value?: string): GroupPlatform | undefined {
  return value && (GROUP_PLATFORMS as readonly string[]).includes(value)
    ? (value as GroupPlatform)
    : undefined;
}

function asActive(value?: string): boolean | undefined {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

export default async function PublicationGroupsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const search = (params.q ?? "").trim();
  const platform = asPlatform(params.platform);
  const active = asActive(params.active);

  const groups = await listGroups({
    search: search || undefined,
    platform,
    active,
  });

  const hasFilters = Boolean(search || platform || typeof active === "boolean");
  const activeValue = active === undefined ? "" : String(active);

  return (
    <section className="dws-groups">
      <header className="dws-groups__header flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="dws-groups__title text-2xl font-semibold tracking-tight text-text">
            Grupos de publicación
          </h1>
          <p className="dws-groups__subtitle mt-1 text-sm text-text-muted">
            {groups.length} {groups.length === 1 ? "grupo" : "grupos"}
          </p>
        </div>
        <Link
          href="/dashboard/publication-groups/new"
          className="dws-groups__create group inline-flex items-center gap-2 rounded-lg bg-primary py-2 pl-4 pr-2 text-sm font-medium text-text shadow-primary transition-[transform,background-color] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-primary-hover active:scale-[0.98]"
        >
          <span>Agregar grupo</span>
          <span className="grid h-6 w-6 place-items-center rounded-md bg-black/20 transition-transform duration-200 group-hover:translate-x-0.5">
            <IconPlus className="h-4 w-4" />
          </span>
        </Link>
      </header>

      <div className="dws-groups__toolbar mt-6">
        <GroupFilters
          search={search}
          platform={platform ?? ""}
          active={activeValue}
        />
      </div>

      {groups.length === 0 ? (
        <div className="dws-groups__empty mt-6 grid place-items-center rounded-card border border-dashed border-border bg-surface p-12 text-center">
          <p className="dws-groups__empty-text text-sm text-text-muted">
            {hasFilters
              ? "No se encontraron grupos con los filtros aplicados."
              : "Aún no hay grupos registrados."}
          </p>
          {hasFilters ? (
            <Link
              href="/dashboard/publication-groups"
              className="dws-groups__empty-action mt-2 inline-block text-sm font-medium text-primary transition-colors hover:text-primary-hover"
            >
              Limpiar filtros
            </Link>
          ) : (
            <Link
              href="/dashboard/publication-groups/new"
              className="dws-groups__empty-action mt-2 inline-block text-sm font-medium text-primary transition-colors hover:text-primary-hover"
            >
              Agregar el primer grupo
            </Link>
          )}
        </div>
      ) : (
        <ul className="dws-groups__list mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <li key={group.id} className="dws-groups__item">
              <GroupCard group={group} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
