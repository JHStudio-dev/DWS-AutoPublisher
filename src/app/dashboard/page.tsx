import Link from "next/link";
import type { Metadata } from "next";
import { getDashboardStats } from "@/services/dashboard/stats";
import { listVehicles } from "@/services/vehicles";
import { listPublications } from "@/services/publications";
import { VEHICLE_STATUS_LABELS } from "@/lib/constants/vehicles";
import { formatPrice } from "@/lib/formatting";
import {
  IconCar,
  IconGroups,
  IconPublications,
  IconSend,
} from "@/components/ui/icons";
import { Panel } from "@/components/ui/panel";
import { MetricCard } from "@/components/dashboard/metric-card";
import { ActivityChart } from "@/components/dashboard/activity-chart";
import { StatusDonut } from "@/components/dashboard/status-donut";
import { PlatformBreakdown } from "@/components/dashboard/platform-breakdown";
import { PendingPublications } from "@/components/dashboard/pending-publications";
import { QuickActions } from "@/components/dashboard/quick-actions";

export const metadata: Metadata = {
  title: "Panel · DWS PublishFlow",
};

const SeeAllLink = ({ href }: { href: string }) => (
  <Link
    href={href}
    className="text-xs font-medium text-primary transition-colors hover:text-primary-hover"
  >
    Ver todas
  </Link>
);

export default async function DashboardPage() {
  const [stats, vehicles, pending] = await Promise.all([
    getDashboardStats(),
    listVehicles(),
    listPublications({ status: "pending" }),
  ]);

  const recentVehicles = vehicles.slice(0, 5);
  const pendingTop = pending.slice(0, 4);

  const completedShare =
    stats.publications.total > 0
      ? Math.round(
          (stats.publications.completed / stats.publications.total) * 100,
        )
      : 0;
  const reviewCount = stats.publications.byStatus.requires_review;

  const otherStatuses =
    stats.publications.total -
    stats.publications.pending -
    stats.publications.completed -
    stats.publications.cancelled;

  const donutSegments = [
    {
      label: "Pendientes",
      value: stats.publications.pending,
      color: "color-mix(in srgb, var(--dws-color-primary) 55%, #ffffff)",
    },
    {
      label: "Publicadas",
      value: stats.publications.completed,
      color: "var(--dws-color-primary)",
    },
    {
      label: "Canceladas",
      value: stats.publications.cancelled,
      color: "var(--dws-color-text-muted)",
    },
    ...(otherStatuses > 0
      ? [
          {
            label: "Otras",
            value: otherStatuses,
            color: "var(--dws-color-border)",
          },
        ]
      : []),
  ];

  return (
    <div className="dws-dashboard-home space-y-6">
      <header className="dws-dashboard-home__header">
        <h1 className="dws-dashboard-home__title text-2xl font-semibold tracking-tight text-text">
          Panel
        </h1>
        <p className="dws-dashboard-home__subtitle mt-1 text-sm text-text-muted">
          Resumen general de tu actividad.
        </p>
      </header>

      <section className="dws-dashboard-home__metrics grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={IconCar}
          label="Vehículos activos"
          value={stats.vehicles.active}
          hint={`de ${stats.vehicles.total} en total`}
        />
        <MetricCard
          icon={IconGroups}
          label="Grupos activos"
          value={stats.groups.active}
          hint={`de ${stats.groups.total} en total`}
        />
        <MetricCard
          icon={IconSend}
          label="Publicaciones pendientes"
          value={stats.publications.pending}
          hint={reviewCount > 0 ? `${reviewCount} requieren revisión` : undefined}
        />
        <MetricCard
          icon={IconPublications}
          label="Publicaciones realizadas"
          value={stats.publications.completed}
          hint={
            stats.publications.total > 0
              ? `${completedShare}% del total`
              : undefined
          }
        />
      </section>

      <section className="dws-dashboard-home__overview grid gap-4 lg:grid-cols-3">
        <Panel
          title="Actividad de publicaciones"
          className="lg:col-span-2"
          action={
            <span className="rounded-md border border-border px-2.5 py-1 text-xs text-text-muted">
              Últimos 7 días
            </span>
          }
        >
          <ActivityChart points={stats.publications.activity} />
        </Panel>

        <Panel
          title="Publicaciones pendientes"
          action={<SeeAllLink href="/dashboard/publications" />}
        >
          <PendingPublications items={pendingTop} />
        </Panel>
      </section>

      <section className="dws-dashboard-home__insights grid gap-4 lg:grid-cols-3">
        <Panel title="Publicaciones por estado">
          <StatusDonut
            segments={donutSegments}
            total={stats.publications.total}
          />
        </Panel>

        <Panel title="Publicaciones por plataforma">
          <PlatformBreakdown items={stats.publications.byPlatform} />
        </Panel>

        <Panel title="Acciones rápidas">
          <QuickActions />
        </Panel>
      </section>

      <Panel
        title="Vehículos recientes"
        action={<SeeAllLink href="/dashboard/vehicles" />}
      >
        {recentVehicles.length === 0 ? (
          <div className="dws-dashboard-home__empty grid place-items-center rounded-lg border border-dashed border-border p-8 text-center">
            <p className="text-sm text-text-muted">
              Aún no hay vehículos registrados.
            </p>
            <Link
              href="/dashboard/vehicles/new"
              className="mt-2 text-sm font-medium text-primary transition-colors hover:text-primary-hover"
            >
              Agregar el primer vehículo
            </Link>
          </div>
        ) : (
          <ul className="dws-dashboard-home__recent divide-y divide-border">
            {recentVehicles.map((vehicle) => (
              <li key={vehicle.id}>
                <Link
                  href={`/dashboard/vehicles/${vehicle.id}`}
                  className="flex items-center justify-between gap-3 py-3 text-sm transition-colors hover:text-primary"
                >
                  <span className="truncate text-text">
                    {vehicle.title}
                    <span className="text-text-muted">
                      {" "}
                      · {VEHICLE_STATUS_LABELS[vehicle.status]}
                    </span>
                  </span>
                  <span className="shrink-0 tabular-nums text-text-muted">
                    {formatPrice(vehicle.price)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
