import type { Vehicle } from "@/db/types/database";
import { formatPrice } from "@/lib/formatting";

// Builds an editable publication draft from vehicle data. Plain template — the
// structure is ready for AI-generated text in a later phase.
export function buildPublicationDraft(vehicle: Vehicle): string {
  const lines: string[] = [
    vehicle.title,
    `${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
    `Precio: ${formatPrice(vehicle.price)}`,
  ];

  if (vehicle.mileage != null) {
    lines.push(`Kilometraje: ${vehicle.mileage.toLocaleString("es-HN")} km`);
  }
  if (vehicle.transmission) {
    lines.push(`Transmisión: ${vehicle.transmission}`);
  }
  if (vehicle.fuel_type) {
    lines.push(`Combustible: ${vehicle.fuel_type}`);
  }
  if (vehicle.color) {
    lines.push(`Color: ${vehicle.color}`);
  }
  if (vehicle.description) {
    lines.push("", vehicle.description);
  }

  return lines.join("\n");
}
