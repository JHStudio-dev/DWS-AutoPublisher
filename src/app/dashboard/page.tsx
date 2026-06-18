import Link from "next/link";
import type { Metadata } from "next";
import { requireProfile } from "@/lib/auth/session";
import { getDashboardStats } from "@/services/dashboard/stats";
import { listVehicles } from "@/services/vehicles";
import { VEHICLE_STATUS_LABELS } from "@/lib/constants/vehicles";
import { formatPrice } from "@/lib/formatting";
import { StatCard } from "@/components/dashboard/stat-card";
import { QuickActions } from "@/components/dashboard/quick-actions";

export const metadata: Metadata = {
  title: "Panel · DWS PublishFlow",
};

export default async function DashboardPage() {
  const { profile, company } = await requireProfile();
  const displayName = profile.full_name ?? profile.email;

  const stats = await getDashboardStats();
  const recentVehicles = (await listVehicles()).slice(0, 5);

  return (
    <div className="dws-dashboard-home">
      <header className="dws-dashboard-home__header">
        <h1 className="dws-dashboard-home__title text-2xl font-semibold text-text">
          Hola, {displayName}
        </h1>
        <p className="dws-dashboard-home__subtitle mt-1 text-text-muted">
          Bienvenido al panel de {company.name}.
        </p>
      </header>

      <section className="dws-dashboard-home__stats mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total de vehículos" value={stats.vehicles.total} />
        <StatCard label="Borradores" value={stats.vehicles.byStatus.draft} />
        <StatCard label="Listos" value={stats.vehicles.byStatus.ready} />
        <StatCard label="Publicados" value={stats.vehicles.byStatus.published} />
        <StatCard
          label="Grupos de publicación"
          value={stats.groups.total}
        />
        <StatCard label="Grupos activos" value={stats.groups.active} />
      </section>

      <section className="dws-dashboard-home__actions mt-8">
        <h2 className="dws-dashboard-home__section-title text-sm font-medium uppercase tracking-wide text-text-muted">
          Acciones rápidas
        </h2>
        <div className="mt-3">
          <QuickActions />
        </div>
      </section>

      <section className="dws-dashboard-home__recent mt-8">
        <div className="dws-dashboard-home__recent-header flex items-center justify-between">
          <h2 className="dws-dashboard-home__section-title text-sm font-medium uppercase tracking-wide text-text-muted">
            Vehículos recientes
          </h2>
          <Link
            href="/dashboard/vehicles"
            className="dws-dashboard-home__recent-all text-sm text-accent transition-colors hover:text-text"
          >
            Ver todos
          </Link>
        </div>

        {recentVehicles.length === 0 ? (
          <div className="dws-dashboard-home__empty mt-3 rounded-lg border border-border bg-surface p-8 text-center">
            <p className="dws-dashboard-home__empty-text text-text">
              Aún no hay vehículos registrados.
            </p>
            <Link
              href="/dashboard/vehicles/new"
              className="dws-dashboard-home__empty-action mt-2 inline-block text-sm text-accent"
            >
              Agregar el primer vehículo
            </Link>
          </div>
        ) : (
          <ul className="dws-dashboard-home__recent-list mt-3 divide-y divide-border rounded-lg border border-border bg-surface">
            {recentVehicles.map((vehicle) => (
              <li key={vehicle.id} className="dws-dashboard-home__recent-item">
                <Link
                  href={`/dashboard/vehicles/${vehicle.id}`}
                  className="dws-dashboard-home__recent-link flex items-center justify-between gap-3 px-4 py-3 text-sm transition-colors hover:bg-surface-muted"
                >
                  <span className="dws-dashboard-home__recent-title truncate text-text">
                    {vehicle.title}
                    <span className="text-text-muted">
                      {" "}
                      · {VEHICLE_STATUS_LABELS[vehicle.status]}
                    </span>
                  </span>
                  <span className="dws-dashboard-home__recent-price shrink-0 text-text-muted">
                    {formatPrice(vehicle.price)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
