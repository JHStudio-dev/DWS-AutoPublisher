import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import { getGroupById } from "@/services/publication-groups";
import {
  GROUP_PLATFORM_LABELS,
  groupActiveLabel,
} from "@/lib/constants/publication-groups";
import { formatDate } from "@/lib/formatting";
import { Panel } from "@/components/ui/panel";
import { StatusPill } from "@/components/ui/status-pill";
import { IconExternal } from "@/components/ui/icons";
import { GroupActions } from "@/components/publication-groups/group-actions";

export const metadata: Metadata = {
  title: "Grupo · DWS PublishFlow",
};

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="dws-group-detail__meta">
      <dt className="dws-group-detail__meta-label text-xs uppercase tracking-wide text-text-muted">
        {label}
      </dt>
      <dd className="dws-group-detail__meta-value mt-0.5 text-sm text-text">
        {value}
      </dd>
    </div>
  );
}

export default async function GroupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const parsedId = z.string().uuid().safeParse(id);
  if (!parsedId.success) {
    notFound();
  }

  const group = await getGroupById(parsedId.data);
  if (!group) {
    notFound();
  }

  return (
    <div className="dws-group-detail space-y-6">
      <Link
        href="/dashboard/publication-groups"
        className="dws-group-detail__back inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-text"
      >
        <span aria-hidden="true">←</span> Volver a Grupos de publicación
      </Link>

      <header className="dws-group-detail__header rounded-card border border-border bg-surface p-5 shadow-card sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="dws-group-detail__title text-2xl font-semibold tracking-tight text-text">
                {group.name}
              </h1>
              <StatusPill tone={group.active ? "success" : "muted"}>
                {groupActiveLabel(group.active)}
              </StatusPill>
            </div>
            <p className="dws-group-detail__subtitle mt-1 text-sm text-text-muted">
              {GROUP_PLATFORM_LABELS[group.platform]}
            </p>
          </div>

          <GroupActions groupId={group.id} active={group.active} />
        </div>
      </header>

      <div className="dws-group-detail__grid grid gap-4 lg:grid-cols-3">
        <div className="dws-group-detail__main space-y-4 lg:col-span-2">
          <Panel title="URL del grupo">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <a
                href={group.url}
                target="_blank"
                rel="noopener noreferrer"
                className="dws-group-detail__url min-w-0 break-all text-sm text-primary transition-colors hover:text-primary-hover"
              >
                {group.url}
              </a>
              <a
                href={group.url}
                target="_blank"
                rel="noopener noreferrer"
                className="dws-group-detail__open inline-flex shrink-0 items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm text-text transition-colors hover:bg-surface-muted"
              >
                <IconExternal className="h-4 w-4" />
                Abrir
              </a>
            </div>
          </Panel>

          {group.notes ? (
            <Panel title="Notas">
              <p className="dws-group-detail__notes whitespace-pre-line text-sm text-text">
                {group.notes}
              </p>
            </Panel>
          ) : null}
        </div>

        <Panel title="Información" className="h-fit">
          <dl className="dws-group-detail__info grid gap-4 sm:grid-cols-2">
            <InfoItem
              label="Plataforma"
              value={GROUP_PLATFORM_LABELS[group.platform]}
            />
            <InfoItem label="Estado" value={groupActiveLabel(group.active)} />
            <InfoItem label="Creado" value={formatDate(group.created_at)} />
            <InfoItem label="Actualizado" value={formatDate(group.updated_at)} />
          </dl>
        </Panel>
      </div>
    </div>
  );
}
