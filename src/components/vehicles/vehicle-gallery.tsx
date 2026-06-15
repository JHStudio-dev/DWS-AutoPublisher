type GalleryImage = { id: string; url: string | null };

export function VehicleGallery({ images }: { images: GalleryImage[] }) {
  if (images.length === 0) {
    return (
      <div className="dws-vehicle-detail__gallery dws-vehicle-detail__gallery--empty rounded-lg border border-dashed border-border bg-surface p-8 text-center text-sm text-text-muted">
        Sin imágenes
      </div>
    );
  }

  return (
    <div className="dws-vehicle-detail__gallery grid grid-cols-2 gap-3 sm:grid-cols-3">
      {images.map((image) => (
        <div
          key={image.id}
          className="dws-vehicle-detail__gallery-item aspect-video overflow-hidden rounded-lg border border-border bg-surface-muted"
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
        </div>
      ))}
    </div>
  );
}
