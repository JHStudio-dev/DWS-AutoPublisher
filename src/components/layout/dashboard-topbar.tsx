import { signOutAction } from "@/services/auth/actions";
import type { UserRole } from "@/db/types/database";

const ROLE_LABELS: Record<UserRole, string> = {
  owner: "Propietario",
  admin: "Administrador",
  staff: "Personal",
};

type DashboardTopbarProps = {
  fullName: string | null;
  email: string;
  role: UserRole;
};

export function DashboardTopbar({ fullName, email, role }: DashboardTopbarProps) {
  return (
    <header className="dws-topbar flex items-center justify-between border-b border-border bg-surface px-6 py-3">
      <div className="dws-topbar__user">
        <p className="dws-topbar__name text-sm font-medium text-text">
          {fullName ?? email}
        </p>
        <p className="dws-topbar__role text-xs text-text-muted">
          {ROLE_LABELS[role]}
        </p>
      </div>

      <form action={signOutAction}>
        <button
          type="submit"
          className="dws-topbar__logout rounded-md border border-border px-3 py-1.5 text-sm text-text transition-colors hover:bg-surface-muted"
        >
          Cerrar sesión
        </button>
      </form>
    </header>
  );
}
