import type { Metadata } from "next";
import type { UserRole } from "@/db/types/database";
import { requireProfile } from "@/lib/auth/session";
import { formatDate } from "@/lib/formatting";
import { CompanySettingsForm } from "@/components/settings/company-settings-form";

export const metadata: Metadata = {
  title: "Configuración · DWS PublishFlow",
};

const ROLE_LABELS: Record<UserRole, string> = {
  owner: "Propietario",
  admin: "Administrador",
  staff: "Personal",
};

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="dws-settings__meta">
      <dt className="dws-settings__meta-label text-xs uppercase tracking-wide text-text-muted">
        {label}
      </dt>
      <dd className="dws-settings__meta-value mt-0.5 text-sm text-text">
        {value}
      </dd>
    </div>
  );
}

export default async function SettingsPage() {
  const { profile, company } = await requireProfile();
  const canEditCompany = profile.role === "owner" || profile.role === "admin";

  return (
    <div className="dws-settings">
      <header className="dws-settings__header">
        <h1 className="dws-settings__title text-2xl font-semibold text-text">
          Configuración
        </h1>
        <p className="dws-settings__subtitle mt-1 text-sm text-text-muted">
          Datos de tu empresa y de tu cuenta.
        </p>
      </header>

      <section className="dws-settings__section mt-8">
        <h2 className="dws-settings__section-title text-sm font-medium uppercase tracking-wide text-text-muted">
          Empresa
        </h2>
        <div className="dws-settings__section-body mt-3 rounded-lg border border-border bg-surface p-4">
          {canEditCompany ? (
            <CompanySettingsForm company={company} />
          ) : (
            <>
              <dl className="grid gap-4 sm:grid-cols-2">
                <InfoItem label="Nombre" value={company.name} />
                <InfoItem label="Identificador" value={company.slug} />
              </dl>
              <p className="dws-settings__note mt-4 text-xs text-text-muted">
                Solo el propietario o un administrador pueden editar la empresa.
              </p>
            </>
          )}
        </div>
      </section>

      <section className="dws-settings__section mt-8">
        <h2 className="dws-settings__section-title text-sm font-medium uppercase tracking-wide text-text-muted">
          Cuenta
        </h2>
        <div className="dws-settings__section-body mt-3 rounded-lg border border-border bg-surface p-4">
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <InfoItem label="Nombre" value={profile.full_name ?? "—"} />
            <InfoItem label="Correo" value={profile.email} />
            <InfoItem label="Rol" value={ROLE_LABELS[profile.role]} />
            <InfoItem label="Empresa" value={company.name} />
            <InfoItem
              label="Miembro desde"
              value={formatDate(profile.created_at)}
            />
          </dl>
        </div>
      </section>
    </div>
  );
}
