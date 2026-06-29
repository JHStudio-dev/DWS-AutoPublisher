"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { initialFormState } from "@/lib/errors";
import { FormAlert } from "@/components/ui/form-alert";
import { IconTrash, IconUpload } from "@/components/ui/icons";
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
      className="dws-vehicle-images__upload-submit inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-text transition-colors hover:bg-primary-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <IconUpload className="h-4 w-4" />
      {pending ? "Subiendo…" : "Subir"}
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
      className="dws-vehicle-images__delete inline-flex items-center gap-1.5 rounded-md bg-background/70 px-2 py-1 text-xs font-medium text-text backdrop-blur transition-colors hover:bg-danger/80 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <IconTrash className="h-4 w-4" />
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
        className="dws-vehicle-images__upload flex flex-col gap-3 rounded-lg border border-dashed border-border bg-surface-muted/40 p-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <input type="hidden" name="vehicleId" value={vehicleId} />
        <div className="dws-vehicle-images__field min-w-0">
          <input
            type="file"
            name="images"
            multiple
            accept="image/jpeg,image/png,image/webp"
            className="dws-vehicle-images__input block w-full text-sm text-text-muted file:mr-3 file:rounded-md file:border-0 file:bg-surface file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-text hover:file:bg-border"
          />
          <p className="dws-vehicle-images__hint mt-2 text-xs text-text-muted">
            JPG, PNG o WebP. Máximo 5 MB por imagen.
          </p>
        </div>
        <UploadSubmit />
      </form>

      <FormAlert state={uploadState} />
      <FormAlert state={deleteState} />

      {images.length === 0 ? (
        <div className="dws-vehicle-images__empty grid place-items-center rounded-lg border border-dashed border-border p-8 text-center text-sm text-text-muted">
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
              <div className="dws-vehicle-images__item-actions absolute inset-x-0 top-0 flex justify-end bg-gradient-to-b from-black/50 to-transparent p-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-within:opacity-100">
                <form
                  action={deleteAction}
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
