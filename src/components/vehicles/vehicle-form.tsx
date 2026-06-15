"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { Vehicle } from "@/db/types/database";
import { initialFormState, type FormState } from "@/lib/errors";
import {
  VEHICLE_STATUSES,
  VEHICLE_STATUS_LABELS,
  VEHICLE_VISIBILITIES,
  VEHICLE_VISIBILITY_LABELS,
} from "@/lib/constants/vehicles";
import { TextField } from "@/components/ui/text-field";
import { TextareaField } from "@/components/ui/textarea-field";
import { SelectField } from "@/components/ui/select-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { FormAlert } from "@/components/ui/form-alert";

type VehicleFormAction = (
  prev: FormState,
  formData: FormData,
) => Promise<FormState>;

type VehicleFormProps = {
  action: VehicleFormAction;
  submitLabel: string;
  pendingLabel: string;
  cancelHref: string;
  vehicle?: Vehicle;
};

export function VehicleForm({
  action,
  submitLabel,
  pendingLabel,
  cancelHref,
  vehicle,
}: VehicleFormProps) {
  const [state, formAction] = useActionState(action, initialFormState);

  const statusOptions = VEHICLE_STATUSES.map((value) => ({
    value,
    label: VEHICLE_STATUS_LABELS[value],
  }));
  const visibilityOptions = VEHICLE_VISIBILITIES.map((value) => ({
    value,
    label: VEHICLE_VISIBILITY_LABELS[value],
  }));

  return (
    <form action={formAction} className="dws-vehicle-form space-y-6" noValidate>
      <FormAlert state={state} />

      {vehicle ? <input type="hidden" name="id" value={vehicle.id} /> : null}

      <div className="dws-vehicle-form__grid grid gap-4 sm:grid-cols-2">
        <TextField
          label="Título"
          name="title"
          defaultValue={vehicle?.title ?? ""}
          required
          maxLength={120}
        />
        <TextField
          label="Marca"
          name="brand"
          defaultValue={vehicle?.brand ?? ""}
          required
          maxLength={60}
        />
        <TextField
          label="Modelo"
          name="model"
          defaultValue={vehicle?.model ?? ""}
          required
          maxLength={60}
        />
        <TextField
          label="Año"
          name="year"
          type="number"
          inputMode="numeric"
          defaultValue={vehicle ? String(vehicle.year) : ""}
          required
        />
        <TextField
          label="Precio"
          name="price"
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          defaultValue={vehicle ? String(vehicle.price) : ""}
          required
        />
        <TextField
          label="Kilometraje"
          name="mileage"
          type="number"
          inputMode="numeric"
          min="0"
          defaultValue={vehicle?.mileage != null ? String(vehicle.mileage) : ""}
        />
        <TextField
          label="Transmisión"
          name="transmission"
          defaultValue={vehicle?.transmission ?? ""}
          maxLength={40}
        />
        <TextField
          label="Combustible"
          name="fuel_type"
          defaultValue={vehicle?.fuel_type ?? ""}
          maxLength={40}
        />
        <TextField
          label="Color"
          name="color"
          defaultValue={vehicle?.color ?? ""}
          maxLength={40}
        />
        <SelectField
          label="Estado"
          name="status"
          options={statusOptions}
          defaultValue={vehicle?.status ?? "draft"}
        />
        <SelectField
          label="Visibilidad"
          name="visibility"
          options={visibilityOptions}
          defaultValue={vehicle?.visibility ?? "internal_only"}
        />
      </div>

      <TextareaField
        label="Descripción"
        name="description"
        rows={5}
        maxLength={2000}
        defaultValue={vehicle?.description ?? ""}
      />

      <div className="dws-vehicle-form__actions flex flex-wrap items-center gap-3">
        <SubmitButton pendingLabel={pendingLabel} fullWidth={false}>
          {submitLabel}
        </SubmitButton>
        <Link
          href={cancelHref}
          className="dws-vehicle-form__cancel rounded-md border border-border px-4 py-2 text-sm text-text transition-colors hover:bg-surface-muted"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
