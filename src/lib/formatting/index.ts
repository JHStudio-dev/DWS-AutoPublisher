// Formatting

const priceFormatter = new Intl.NumberFormat("es-HN", {
  style: "currency",
  currency: "HNL",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("es-HN", { dateStyle: "medium" });

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
