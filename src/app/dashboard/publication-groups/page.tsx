import Link from "next/link";
import type { Metadata } from "next";
import { listGroups } from "@/services/publication-groups";
import { GROUP_PLATFORMS } from "@/lib/constants/publication-groups";
import type { GroupPlatform } from "@/db/types/database";
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
          <h1 className="dws-groups__title text-2xl font-semibold text-text">
            Grupos de publicación
          </h1>
          <p className="dws-groups__subtitle mt-1 text-sm text-text-muted">
            {groups.length} {groups.length === 1 ? "grupo" : "grupos"}
          </p>
        </div>
        <Link
          href="/dashboard/publication-groups/new"
          className="dws-groups__create rounded-md bg-primary px-4 py-2 text-sm font-medium text-text transition-colors hover:bg-primary-hover"
        >
          Agregar grupo
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
        <div className="dws-groups__empty mt-8 rounded-lg border border-border bg-surface p-8 text-center">
          <p className="dws-groups__empty-text text-text">
            {hasFilters
              ? "No se encontraron grupos con los filtros aplicados."
              : "No hay grupos registrados."}
          </p>
          {hasFilters ? (
            <Link
              href="/dashboard/publication-groups"
              className="dws-groups__empty-action mt-2 inline-block text-sm text-accent"
            >
              Limpiar filtros
            </Link>
          ) : (
            <Link
              href="/dashboard/publication-groups/new"
              className="dws-groups__empty-action mt-2 inline-block text-sm text-accent"
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
