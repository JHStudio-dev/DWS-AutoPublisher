"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
  enabled: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Panel", href: "/dashboard", enabled: true },
  { label: "Vehículos", href: "/dashboard/vehicles", enabled: true },
  {
    label: "Grupos de publicación",
    href: "/dashboard/publication-groups",
    enabled: true,
  },
  { label: "Publicaciones", href: "/dashboard/publications", enabled: true },
  { label: "Historial", href: "/history", enabled: false },
  { label: "Configuración", href: "/dashboard/settings", enabled: true },
];

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardSidebar({ companyName }: { companyName: string }) {
  const pathname = usePathname();

  return (
    <aside className="dws-sidebar border-b border-border bg-surface p-4 md:min-h-screen md:border-b-0 md:border-r">
      <div className="dws-sidebar__brand mb-6 flex items-center gap-2">
        <span className="dws-sidebar__brand-name font-semibold text-text">
          DWS PublishFlow
        </span>
        <span
          className="dws-sidebar__brand-accent inline-block h-2 w-2 rounded-full bg-accent"
          aria-hidden="true"
        />
      </div>

      <p className="dws-sidebar__company mb-4 text-xs uppercase tracking-wide text-text-muted">
        {companyName}
      </p>

      <nav className="dws-sidebar__nav" aria-label="Navegación principal">
        <ul className="dws-sidebar__list space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = item.enabled && isActivePath(pathname, item.href);

            return (
              <li key={item.href} className="dws-sidebar__item">
                {item.enabled ? (
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`dws-sidebar__link block rounded-md px-3 py-2 text-sm transition-colors ${
                      active
                        ? "dws-sidebar__link--active bg-surface-muted font-medium text-text"
                        : "text-text hover:bg-surface-muted"
                    }`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="dws-sidebar__link dws-sidebar__link--disabled flex items-center justify-between rounded-md px-3 py-2 text-sm text-text-muted">
                    {item.label}
                    <span className="dws-sidebar__badge text-[10px] uppercase tracking-wide text-accent">
                      Pronto
                    </span>
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
