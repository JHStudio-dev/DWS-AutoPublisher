"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { initialFormState } from "@/lib/errors";
import { FormAlert } from "@/components/ui/form-alert";
import {
  deleteVehicleImageAction,
  uploadVehicleImagesAction,
} from "@/services/vehicles/image-actions";

type GalleryImage = { id: string; url: string | null };

function UploadSubmit() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="dws-button dws-button--primary rounded-md bg-primary px-4 py-2 text-sm font-medium text-text transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Subiendo…" : "Subir imágenes"}
    </button>
  );
}

function DeleteSubmit() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-label="Eliminar imagen"
      className="dws-vehicle-images__delete rounded-md border border-danger/50 bg-surface/90 px-2 py-1 text-xs text-danger transition-colors hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "…" : "Eliminar"}
    </button>
  );
}

export function VehicleImageManager({
  vehicleId,
  images,
}: {
  vehicleId: string;
  images: GalleryImage[];
}) {
  const [uploadState, uploadAction] = useActionState(
    uploadVehicleImagesAction,
    initialFormState,
  );
  const [deleteState, deleteAction] = useActionState(
    deleteVehicleImageAction,
    initialFormState,
  );

  return (
    <div className="dws-vehicle-images space-y-4">
      <form
        action={uploadAction}
        className="dws-vehicle-images__upload flex flex-wrap items-center gap-3"
      >
        <input type="hidden" name="vehicleId" value={vehicleId} />
        <input
          type="file"
          name="images"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="dws-vehicle-images__input block w-full max-w-sm text-sm text-text-muted file:mr-3 file:rounded-md file:border file:border-border file:bg-surface-muted file:px-3 file:py-1.5 file:text-sm file:text-text hover:file:bg-surface"
        />
        <UploadSubmit />
      </form>

      <p className="dws-vehicle-images__hint text-xs text-text-muted">
        JPG, PNG o WebP. Máximo 5 MB por imagen.
      </p>

      <FormAlert state={uploadState} />
      <FormAlert state={deleteState} />

      {images.length === 0 ? (
        <div className="dws-vehicle-images__empty rounded-lg border border-dashed border-border bg-surface p-8 text-center text-sm text-text-muted">
          Sin imágenes
        </div>
      ) : (
        <div className="dws-vehicle-images__grid grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((image) => (
            <div
              key={image.id}
              className="dws-vehicle-images__item group relative aspect-video overflow-hidden rounded-lg border border-border bg-surface-muted"
            >
              {image.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={image.url}
                  alt="Imagen del vehículo"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-text-muted">
                  Imagen no disponible
                </div>
              )}
              <form
                action={deleteAction}
                className="dws-vehicle-images__item-actions absolute right-2 top-2"
                onSubmit={(event) => {
                  if (!window.confirm("¿Eliminar esta imagen?")) {
                    event.preventDefault();
                  }
                }}
              >
                <input type="hidden" name="imageId" value={image.id} />
                <input type="hidden" name="vehicleId" value={vehicleId} />
                <DeleteSubmit />
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
