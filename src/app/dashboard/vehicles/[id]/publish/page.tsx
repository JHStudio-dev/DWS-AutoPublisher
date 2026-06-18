import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import { getVehicleById } from "@/services/vehicles";
import { listGroups } from "@/services/publication-groups";
import { buildPublicationDraft } from "@/lib/publications/draft";
import { PublicationForm } from "@/components/publications/publication-form";

export const metadata: Metadata = {
  title: "Preparar publicación · DWS PublishFlow",
};

export default async function PublishVehiclePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const parsedId = z.string().uuid().safeParse(id);
  if (!parsedId.success) {
    notFound();
  }

  const vehicle = await getVehicleById(parsedId.data);
  if (!vehicle) {
    notFound();
  }

  const groups = await listGroups({ active: true });
  const draft = buildPublicationDraft(vehicle);

  return (
    <section className="dws-publish">
      <div className="dws-publish__back">
        <Link
          href={`/dashboard/vehicles/${vehicle.id}`}
          className="dws-publish__back-link text-sm text-text-muted transition-colors hover:text-text"
        >
          ← Volver al vehículo
        </Link>
      </div>

      <header className="dws-publish__header mt-4">
        <h1 className="dws-publish__title text-2xl font-semibold text-text">
          Preparar publicación
        </h1>
        <p className="dws-publish__subtitle mt-1 text-sm text-text-muted">
          {vehicle.title}
        </p>
      </header>

      <div className="dws-publish__body mt-6">
        {groups.length === 0 ? (
          <div className="dws-publish__empty rounded-lg border border-border bg-surface p-8 text-center">
            <p className="dws-publish__empty-text text-text">
              No hay grupos activos para publicar.
            </p>
            <Link
              href="/dashboard/publication-groups/new"
              className="dws-publish__empty-action mt-2 inline-block text-sm text-accent"
            >
              Crear un grupo
            </Link>
          </div>
        ) : (
          <PublicationForm
            vehicleId={vehicle.id}
            groups={groups}
            draft={draft}
            cancelHref={`/dashboard/vehicles/${vehicle.id}`}
          />
        )}
      </div>
    </section>
  );
}
