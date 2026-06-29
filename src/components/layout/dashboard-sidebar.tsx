"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType, SVGProps } from "react";
import type { UserRole } from "@/db/types/database";
import { signOutAction } from "@/services/auth/actions";
import {
  IconCalendar,
  IconCar,
  IconDashboard,
  IconGroups,
  IconHistory,
  IconLogout,
  IconPublications,
  IconRoles,
  IconSend,
  IconSettings,
  IconStats,
  IconUser,
} from "@/components/ui/icons";

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

type NavItem = {
  label: string;
  href: string;
  icon: IconType;
  enabled: boolean;
};

const NAV_GROUPS: NavItem[][] = [
  [
    { label: "Panel", href: "/dashboard", icon: IconDashboard, enabled: true },
    { label: "Vehículos", href: "/dashboard/vehicles", icon: IconCar, enabled: true },
    {
      label: "Grupos de publicación",
      href: "/dashboard/publication-groups",
      icon: IconGroups,
      enabled: true,
    },
    {
      label: "Publicaciones",
      href: "/dashboard/publications",
      icon: IconPublications,
      enabled: true,
    },
    {
      label: "Nueva publicación",
      href: "/dashboard/publications/new",
      icon: IconSend,
      enabled: true,
    },
  ],
  [
    { label: "Historial", href: "/dashboard/history", icon: IconHistory, enabled: false },
    { label: "Estadísticas", href: "/dashboard/stats", icon: IconStats, enabled: false },
    { label: "Calendario", href: "/dashboard/calendar", icon: IconCalendar, enabled: false },
  ],
  [
    {
      label: "Configuración",
      href: "/dashboard/settings",
      icon: IconSettings,
      enabled: true,
    },
    { label: "Usuarios", href: "/dashboard/users", icon: IconUser, enabled: false },
    { label: "Roles y permisos", href: "/dashboard/roles", icon: IconRoles, enabled: false },
  ],
];

const ROLE_LABELS: Record<UserRole, string> = {
  owner: "Propietario",
  admin: "Administrador",
  staff: "Personal",
};

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }
  // "Nueva publicación" should not steal the active state from "Publicaciones".
  if (href === "/dashboard/publications/new") {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function initials(value: string): string {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  const first = parts[0];
  if (!first) return "?";
  if (parts.length === 1) return first.slice(0, 2).toUpperCase();
  const last = parts[parts.length - 1] ?? first;
  return (first.charAt(0) + last.charAt(0)).toUpperCase();
}

type SidebarProps = {
  companyName: string;
  fullName: string | null;
  email: string;
  role: UserRole;
  open: boolean;
  onNavigate: () => void;
};

export function DashboardSidebar({
  companyName,
  fullName,
  email,
  role,
  open,
  onNavigate,
}: SidebarProps) {
  const pathname = usePathname();
  const userName = fullName ?? email;

  return (
    <aside
      className={`dws-sidebar fixed inset-y-0 left-0 z-50 flex w-[17rem] flex-col border-r border-border bg-surface p-3 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] md:static md:z-auto md:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="dws-sidebar__brand flex items-center gap-2.5 px-2 pt-1">
        <span
          className="dws-sidebar__brand-bar h-7 w-1 rounded-full bg-primary"
          aria-hidden="true"
        />
        <span className="dws-sidebar__brand-text leading-none">
          <span className="block text-lg font-bold tracking-tight text-primary">
            DWS
          </span>
          <span className="block text-[10px] font-medium tracking-[0.28em] text-text-muted">
            PUBLISHFLOW
          </span>
        </span>
      </div>

      <div className="dws-sidebar__company mt-5 flex items-center gap-3 rounded-xl border border-border bg-surface-muted/60 p-2.5">
        <span className="dws-sidebar__company-mark grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/15 text-[11px] font-bold text-primary">
          DWS
        </span>
        <span className="min-w-0">
          <span className="block truncate text-xs font-semibold uppercase tracking-wide text-text">
            {companyName}
          </span>
          <span className="block text-[11px] text-text-muted">Empresa actual</span>
        </span>
      </div>

      <nav
        className="dws-sidebar__nav mt-5 flex-1 space-y-5 overflow-y-auto"
        aria-label="Navegación principal"
      >
        {NAV_GROUPS.map((group, groupIndex) => (
          <ul
            key={groupIndex}
            className="dws-sidebar__group space-y-1 border-border [&:not(:first-child)]:border-t [&:not(:first-child)]:pt-5"
          >
            {group.map((item) => {
              const active = item.enabled && isActivePath(pathname, item.href);
              const Glyph = item.icon;

              if (!item.enabled) {
                return (
                  <li key={item.href} className="dws-sidebar__item">
                    <span className="dws-sidebar__link dws-sidebar__link--disabled flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-muted/55">
                      <Glyph className="h-5 w-5 shrink-0" />
                      <span className="truncate">{item.label}</span>
                      <span className="dws-sidebar__badge ml-auto rounded border border-border px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-text-muted/70">
                        Pronto
                      </span>
                    </span>
                  </li>
                );
              }

              return (
                <li key={item.href} className="dws-sidebar__item">
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={`dws-sidebar__link group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-200 ${
                      active
                        ? "dws-sidebar__link--active bg-primary/12 font-medium text-text"
                        : "text-text-muted hover:bg-surface-muted hover:text-text"
                    }`}
                  >
                    {active ? (
                      <span
                        className="dws-sidebar__active-bar absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-primary"
                        aria-hidden="true"
                      />
                    ) : null}
                    <Glyph
                      className={`h-5 w-5 shrink-0 transition-colors ${
                        active ? "text-primary" : "text-text-muted group-hover:text-text"
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        ))}
      </nav>

      <div className="dws-sidebar__user mt-4 flex items-center gap-3 rounded-xl border border-border bg-surface-muted/60 p-2.5">
        <span className="dws-sidebar__user-avatar grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
          {initials(userName)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-text">
            {userName}
          </span>
          <span className="block text-xs text-text-muted">{ROLE_LABELS[role]}</span>
        </span>
        <form action={signOutAction}>
          <button
            type="submit"
            aria-label="Cerrar sesión"
            className="dws-sidebar__logout grid h-8 w-8 place-items-center rounded-md text-text-muted transition-colors hover:bg-surface hover:text-text"
          >
            <IconLogout className="h-[18px] w-[18px]" />
          </button>
        </form>
      </div>
    </aside>
  );
}
