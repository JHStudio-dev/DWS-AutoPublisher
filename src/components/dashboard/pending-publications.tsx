import Link from "next/link";
import type { PublicationListItem } from "@/services/publications";
import { formatRelativeDateTime } from "@/lib/formatting";

export function PendingPublications({
  items,
}: {
  items: PublicationListItem[];
}) {
  if (items.length === 0) {
    return (
      <div className="dws-pending dws-pending--empty grid h-44 place-items-center rounded-lg border border-dashed border-border text-center text-sm text-text-muted">
        No hay publicaciones pendientes.
      </div>
    );
  }

  return (
    <div className="dws-pending flex h-full flex-col">
      <ul className="dws-pending__list flex-1 space-y-1">
        {items.map((item) => (
          <li key={item.id} className="dws-pending__item">
            <Link
              href={`/dashboard/publications/${item.id}`}
              className="dws-pending__link flex items-start justify-between gap-3 rounded-lg p-2.5 transition-colors hover:bg-surface-muted"
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-text">
                  {item.vehicle?.title ?? "Vehículo eliminado"}
                </span>
                <span className="mt-0.5 block text-xs text-text-muted">
                  {item.targets.length}{" "}
                  {item.targets.length === 1
                    ? "grupo seleccionado"
                    : "grupos seleccionados"}
                </span>
                <span className="dws-pending__badge mt-1.5 inline-block rounded border border-primary/40 bg-primary/10 px-1.5 py-0.5 text-[11px] font-medium text-primary">
                  Pendiente
                </span>
              </span>
              <span className="dws-pending__time shrink-0 text-right text-xs text-text-muted">
                {formatRelativeDateTime(item.created_at)}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href="/dashboard/publications"
        className="dws-pending__all mt-3 block rounded-lg border border-border py-2 text-center text-sm text-text transition-colors hover:bg-surface-muted"
      >
        Ver todas las pendientes
      </Link>
    </div>
  );
}
