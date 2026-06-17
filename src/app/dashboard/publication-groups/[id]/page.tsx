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
    <article className="dws-group-detail">
      <div className="dws-group-detail__back">
        <Link
          href="/dashboard/publication-groups"
          className="dws-group-detail__back-link text-sm text-text-muted transition-colors hover:text-text"
        >
          ← Volver a Grupos de publicación
        </Link>
      </div>

      <header className="dws-group-detail__header mt-4">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="dws-group-detail__title text-2xl font-semibold text-text">
            {group.name}
          </h1>
          <span className="dws-group-detail__status rounded-full border border-border bg-surface-muted px-2 py-0.5 text-xs text-text-muted">
            {groupActiveLabel(group.active)}
          </span>
        </div>
        <p className="dws-group-detail__subtitle mt-1 text-sm text-text-muted">
          {GROUP_PLATFORM_LABELS[group.platform]}
        </p>
      </header>

      <div className="dws-group-detail__actions-wrap mt-6">
        <GroupActions groupId={group.id} active={group.active} />
      </div>

      <section className="dws-group-detail__section mt-8">
        <h2 className="dws-group-detail__section-title text-sm font-medium uppercase tracking-wide text-text-muted">
          Información
        </h2>
        <dl className="dws-group-detail__info mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem
            label="Plataforma"
            value={GROUP_PLATFORM_LABELS[group.platform]}
          />
          <InfoItem label="Estado" value={groupActiveLabel(group.active)} />
          <InfoItem label="Creado" value={formatDate(group.created_at)} />
          <InfoItem label="Actualizado" value={formatDate(group.updated_at)} />
        </dl>
      </section>

      <section className="dws-group-detail__section mt-8">
        <h2 className="dws-group-detail__section-title text-sm font-medium uppercase tracking-wide text-text-muted">
          URL
        </h2>
        <a
          href={group.url}
          target="_blank"
          rel="noopener noreferrer"
          className="dws-group-detail__url mt-3 inline-block break-all text-sm text-accent transition-colors hover:text-text"
        >
          {group.url}
        </a>
      </section>

      {group.notes ? (
        <section className="dws-group-detail__section mt-8">
          <h2 className="dws-group-detail__section-title text-sm font-medium uppercase tracking-wide text-text-muted">
            Notas
          </h2>
          <p className="dws-group-detail__notes mt-3 whitespace-pre-line text-sm text-text">
            {group.notes}
          </p>
        </section>
      ) : null}
    </article>
  );
}
