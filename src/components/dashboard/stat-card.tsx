export function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="dws-stat-card rounded-lg border border-border bg-surface p-4">
      <p className="dws-stat-card__label text-sm text-text-muted">{label}</p>
      <p className="dws-stat-card__value mt-1 text-2xl font-semibold text-text">
        {value}
      </p>
    </div>
  );
}
