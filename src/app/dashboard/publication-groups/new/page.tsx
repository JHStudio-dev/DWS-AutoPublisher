import Link from "next/link";
import type { Metadata } from "next";
import { createGroupAction } from "@/services/publication-groups/actions";
import { GroupForm } from "@/components/publication-groups/group-form";

export const metadata: Metadata = {
  title: "Agregar grupo · DWS PublishFlow",
};

export default function NewGroupPage() {
  return (
    <section className="dws-group-form-page mx-auto max-w-3xl">
      <Link
        href="/dashboard/publication-groups"
        className="dws-group-form-page__back inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-text"
      >
        <span aria-hidden="true">←</span> Volver a Grupos de publicación
      </Link>

      <header className="dws-group-form-page__header mt-4">
        <h1 className="dws-group-form-page__title text-2xl font-semibold tracking-tight text-text">
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
