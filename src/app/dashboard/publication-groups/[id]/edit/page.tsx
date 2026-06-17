import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import { getGroupById } from "@/services/publication-groups";
import { updateGroupAction } from "@/services/publication-groups/actions";
import { GroupForm } from "@/components/publication-groups/group-form";

export const metadata: Metadata = {
  title: "Editar grupo · DWS PublishFlow",
};

export default async function EditGroupPage({
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
    <section className="dws-group-form-page">
      <header className="dws-group-form-page__header">
        <h1 className="dws-group-form-page__title text-2xl font-semibold text-text">
          Editar grupo
        </h1>
        <p className="dws-group-form-page__subtitle mt-1 text-sm text-text-muted">
          Actualiza la información del grupo.
        </p>
      </header>

      <div className="dws-group-form-page__body mt-6">
        <GroupForm
          action={updateGroupAction}
          submitLabel="Guardar cambios"
          pendingLabel="Guardando…"
          cancelHref={`/dashboard/publication-groups/${group.id}`}
          group={group}
        />
      </div>
    </section>
  );
}
