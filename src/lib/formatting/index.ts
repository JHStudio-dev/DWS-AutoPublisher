// Formatting

const priceFormatter = new Intl.NumberFormat("es-HN", {
  style: "currency",
  currency: "HNL",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("es-HN", { dateStyle: "medium" });

const timeFormatter = new Intl.DateTimeFormat("es-HN", {
  hour: "numeric",
  minute: "2-digit",
});

export function formatPrice(value: number): string {
  return priceFormatter.format(value);
}

export function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return dateFormatter.format(date);
}

export function formatRelativeDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const dayDiff = Math.round(
    (startOfToday.getTime() - startOfDate.getTime()) / 86_400_000,
  );
  const time = timeFormatter.format(date);

  if (dayDiff === 0) return `Hoy ${time}`;
  if (dayDiff === 1) return `Ayer ${time}`;
  return `${dateFormatter.format(date)} ${time}`;
}
