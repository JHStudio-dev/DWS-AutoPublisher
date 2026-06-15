import type { Metadata } from "next";
import { requireProfile } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Panel · DWS PublishFlow",
};

export default async function DashboardPage() {
  const { profile, company } = await requireProfile();
  const displayName = profile.full_name ?? profile.email;

  return (
    <div className="dws-dashboard-home">
      <h1 className="dws-dashboard-home__title text-2xl font-semibold text-text">
        Hola, {displayName}
      </h1>
      <p className="dws-dashboard-home__subtitle mt-1 text-text-muted">
        Bienvenido al panel de {company.name}.
      </p>

      <div className="dws-dashboard-home__empty mt-8 rounded-lg border border-border bg-surface p-8 text-center">
        <p className="dws-dashboard-home__empty-title text-text">
          Tu panel está listo.
        </p>
        <p className="dws-dashboard-home__empty-text mt-1 text-sm text-text-muted">
          Los módulos de inventario, grupos y publicaciones aparecerán aquí en
          las próximas etapas.
        </p>
      </div>
    </div>
  );
}
