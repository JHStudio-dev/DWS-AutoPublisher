import type { PlatformCount } from "@/services/dashboard/stats";
import { GROUP_PLATFORM_LABELS } from "@/lib/constants/publication-groups";

export function PlatformBreakdown({ items }: { items: PlatformCount[] }) {
  if (items.length === 0) {
    return (
      <div className="dws-platforms dws-platforms--empty grid h-44 place-items-center rounded-lg border border-dashed border-border text-center text-sm text-text-muted">
        Aún no hay destinos de publicación.
      </div>
    );
  }

  const max = Math.max(...items.map((item) => item.count));

  return (
    <ul className="dws-platforms space-y-4">
      {items.map((item) => {
        const width = max > 0 ? Math.max(4, (item.count / max) * 100) : 0;
        return (
          <li key={item.platform} className="dws-platforms__item">
            <div className="dws-platforms__row flex items-center justify-between text-sm">
              <span className="text-text">
                {GROUP_PLATFORM_LABELS[item.platform]}
              </span>
              <span className="tabular-nums text-text-muted">{item.count}</span>
            </div>
            <div className="dws-platforms__track mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-muted">
              <div
                className="dws-platforms__bar h-full rounded-full bg-primary"
                style={{ width: `${width}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
