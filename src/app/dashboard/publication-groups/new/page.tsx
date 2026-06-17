import type { Metadata } from "next";
import { createGroupAction } from "@/services/publication-groups/actions";
import { GroupForm } from "@/components/publication-groups/group-form";

export const metadata: Metadata = {
  title: "Agregar grupo · DWS PublishFlow",
};

export default function NewGroupPage() {
  return (
    <section className="dws-group-form-page">
      <header className="dws-group-form-page__header">
        <h1 className="dws-group-form-page__title text-2xl font-semibold text-text">
          Agregar grupo
        </h1>
        <p className="dws-group-form-page__subtitle mt-1 text-sm text-text-muted">
          Registra un destino de publicación.
        </p>
      </header>

      <div className="dws-group-form-page__body mt-6">
        <GroupForm
          action={createGroupAction}
          submitLabel="Crear grupo"
          pendingLabel="Creando…"
          cancelHref="/dashboard/publication-groups"
        />
      </div>
    </section>
  );
}
