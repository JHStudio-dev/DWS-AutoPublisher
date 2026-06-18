import Link from "next/link";

const ACTIONS = [
  { label: "Agregar vehículo", href: "/dashboard/vehicles/new" },
  { label: "Ver vehículos", href: "/dashboard/vehicles" },
  {
    label: "Gestionar grupos de publicación",
    href: "/dashboard/publication-groups",
  },
];

export function QuickActions() {
  return (
    <div className="dws-quick-actions grid gap-3 sm:grid-cols-3">
      {ACTIONS.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className="dws-quick-actions__item rounded-lg border border-border bg-surface p-4 text-sm text-text transition-colors hover:border-primary"
        >
          {action.label}
        </Link>
      ))}
    </div>
  );
}
