export type DonutSegment = {
  label: string;
  value: number;
  color: string;
};

export function StatusDonut({
  segments,
  total,
}: {
  segments: DonutSegment[];
  total: number;
}) {
  if (total === 0) {
    return (
      <div className="dws-donut dws-donut--empty grid h-44 place-items-center rounded-lg border border-dashed border-border text-sm text-text-muted">
        Aún no hay publicaciones.
      </div>
    );
  }

  let cumulative = 0;

  return (
    <div className="dws-donut flex flex-wrap items-center gap-6">
      <div className="dws-donut__chart relative h-36 w-36 shrink-0">
        <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
          <circle
            cx="18"
            cy="18"
            r="15.915"
            fill="none"
            stroke="var(--dws-color-surface-muted)"
            strokeWidth="3.5"
          />
          {segments
            .filter((segment) => segment.value > 0)
            .map((segment) => {
              const pct = (segment.value / total) * 100;
              const dash = `${pct} ${100 - pct}`;
              const offset = -cumulative;
              cumulative += pct;
              return (
                <circle
                  key={segment.label}
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke={segment.color}
                  strokeWidth="3.5"
                  pathLength={100}
                  strokeDasharray={dash}
                  strokeDashoffset={offset}
                />
              );
            })}
        </svg>
        <div className="dws-donut__center absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold tabular-nums text-text">
            {total.toLocaleString("es-HN")}
          </span>
          <span className="text-xs text-text-muted">Total</span>
        </div>
      </div>

      <ul className="dws-donut__legend flex-1 space-y-2.5">
        {segments.map((segment) => {
          const pct = total > 0 ? Math.round((segment.value / total) * 100) : 0;
          return (
            <li
              key={segment.label}
              className="dws-donut__legend-item flex items-center gap-2.5 text-sm"
            >
              <span
                className="dws-donut__dot h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: segment.color }}
                aria-hidden="true"
              />
              <span className="flex-1 text-text-muted">{segment.label}</span>
              <span className="tabular-nums text-text">{segment.value}</span>
              <span className="w-10 text-right tabular-nums text-text-muted">
                {pct}%
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
