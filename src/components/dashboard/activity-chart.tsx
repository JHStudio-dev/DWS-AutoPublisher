import type { ActivityPoint } from "@/services/dashboard/stats";

const WIDTH = 720;
const HEIGHT = 200;
const PAD_X = 6;
const PAD_TOP = 14;
const PAD_BOTTOM = 6;

const dayFormatter = new Intl.DateTimeFormat("es-HN", {
  weekday: "short",
  day: "numeric",
});

function dayLabel(iso: string): string {
  const label = dayFormatter.format(new Date(`${iso}T00:00:00`));
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function ActivityChart({ points }: { points: ActivityPoint[] }) {
  const allZero = points.every((point) => point.count === 0);
  if (points.length === 0 || allZero) {
    return (
      <div className="dws-activity dws-activity--empty grid h-48 place-items-center rounded-lg border border-dashed border-border text-sm text-text-muted">
        Sin actividad en este período.
      </div>
    );
  }

  const max = Math.max(...points.map((point) => point.count));
  const innerW = WIDTH - PAD_X * 2;
  const innerH = HEIGHT - PAD_TOP - PAD_BOTTOM;
  const stepX = points.length > 1 ? innerW / (points.length - 1) : 0;

  const coords = points.map((point, index) => ({
    ...point,
    x: PAD_X + stepX * index,
    y: PAD_TOP + innerH * (1 - point.count / max),
  }));

  const line = coords
    .map((c, i) => `${i === 0 ? "M" : "L"}${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
    .join(" ");
  const baseline = HEIGHT - PAD_BOTTOM;
  const area = `${line} L${coords[coords.length - 1]!.x.toFixed(1)} ${baseline} L${coords[0]!.x.toFixed(1)} ${baseline} Z`;

  return (
    <div className="dws-activity">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="dws-activity__svg w-full"
        role="img"
        aria-label="Actividad de publicaciones de los últimos siete días"
      >
        <defs>
          <linearGradient id="dws-activity-fill" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="var(--dws-color-primary)"
              stopOpacity="0.32"
            />
            <stop
              offset="100%"
              stopColor="var(--dws-color-primary)"
              stopOpacity="0"
            />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#dws-activity-fill)" />
        <path
          d={line}
          fill="none"
          stroke="var(--dws-color-primary)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {coords.map((c, i) => {
          const isLast = i === coords.length - 1;
          return (
            <circle
              key={c.date}
              cx={c.x}
              cy={c.y}
              r={isLast ? 4.5 : 3}
              fill={isLast ? "var(--dws-color-background)" : "var(--dws-color-primary)"}
              stroke="var(--dws-color-primary)"
              strokeWidth={isLast ? 2.5 : 0}
            />
          );
        })}
      </svg>
      <div className="dws-activity__labels mt-2 flex justify-between text-[11px] text-text-muted">
        {points.map((point) => (
          <span key={point.date}>{dayLabel(point.date)}</span>
        ))}
      </div>
    </div>
  );
}
