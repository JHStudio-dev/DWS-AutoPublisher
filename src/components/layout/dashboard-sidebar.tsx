import Link from "next/link";

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
  { label: "Configuración", href: "/settings", enabled: false },
];

export function DashboardSidebar({ companyName }: { companyName: string }) {
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
          {NAV_ITEMS.map((item) => (
            <li key={item.href} className="dws-sidebar__item">
              {item.enabled ? (
                <Link
                  href={item.href}
                  className="dws-sidebar__link block rounded-md px-3 py-2 text-sm text-text transition-colors hover:bg-surface-muted"
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
          ))}
        </ul>
      </nav>
    </aside>
  );
}
