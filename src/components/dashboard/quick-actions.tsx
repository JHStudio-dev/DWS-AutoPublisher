import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import {
  IconCar,
  IconGroups,
  IconPublications,
  IconSend,
} from "@/components/ui/icons";

type QuickAction = {
  label: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const ACTIONS: QuickAction[] = [
  { label: "Agregar vehículo", href: "/dashboard/vehicles/new", icon: IconCar },
  {
    label: "Nuevo grupo",
    href: "/dashboard/publication-groups/new",
    icon: IconGroups,
  },
  {
    label: "Nueva publicación",
    href: "/dashboard/publications/new",
    icon: IconSend,
  },
  {
    label: "Ver publicaciones",
    href: "/dashboard/publications",
    icon: IconPublications,
  },
];

export function QuickActions() {
  return (
    <div className="dws-quick-actions grid grid-cols-2 gap-3">
      {ACTIONS.map((action) => {
        const Glyph = action.icon;
        return (
          <Link
            key={action.href}
            href={action.href}
            className="dws-quick-actions__item group flex flex-col items-center gap-2.5 rounded-xl border border-border bg-surface-muted/40 px-3 py-5 text-center text-sm text-text transition-colors duration-200 hover:border-primary/40 hover:bg-surface-muted"
          >
            <span className="dws-quick-actions__icon grid h-10 w-10 place-items-center rounded-full bg-primary/12 text-primary transition-transform duration-200 group-hover:scale-105">
              <Glyph className="h-5 w-5" />
            </span>
            {action.label}
          </Link>
        );
      })}
    </div>
  );
}
