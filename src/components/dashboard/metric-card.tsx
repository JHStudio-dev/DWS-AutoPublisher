import type { ComponentType, SVGProps } from "react";

type MetricCardProps = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  value: number;
  hint?: string;
};

export function MetricCard({ icon: Glyph, label, value, hint }: MetricCardProps) {
  return (
    <div className="dws-metric rounded-card border border-border bg-surface p-5 shadow-card transition-colors duration-200 hover:border-primary/40">
      <div className="dws-metric__top flex items-center gap-3">
        <span className="dws-metric__icon grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary">
          <Glyph className="h-5 w-5" />
        </span>
        <p className="dws-metric__label text-sm text-text-muted">{label}</p>
      </div>
      <p className="dws-metric__value mt-4 text-3xl font-semibold tabular-nums tracking-tight text-text">
        {value.toLocaleString("es-HN")}
      </p>
      {hint ? (
        <p className="dws-metric__hint mt-1 text-xs text-text-muted">{hint}</p>
      ) : null}
    </div>
  );
}
