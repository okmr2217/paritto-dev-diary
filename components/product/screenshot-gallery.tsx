"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
}

type Orientation = "unknown" | "pc" | "mobile";

interface ScreenshotGalleryProps {
  images: ProductImage[];
  productName: string;
}

function HorizontalScroll({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "flex gap-3 overflow-x-auto pb-3",
        "snap-x snap-mandatory",
        "[scrollbar-width:thin] [scrollbar-color:var(--color-border)_transparent]"
      )}
    >
      {children}
    </div>
  );
}

interface GalleryItemProps {
  image: ProductImage;
  productName: string;
  onClick: () => void;
  variant: "pc" | "mobile";
}

function GalleryItem({ image, productName, onClick, variant }: GalleryItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative flex-shrink-0 snap-start rounded-lg overflow-hidden bg-muted cursor-pointer",
        "border border-border",
        variant === "pc"
          ? "w-[65vw] md:w-[62%] aspect-video"
          : "w-[150px] aspect-[9/16]"
      )}
    >
      <div className="absolute inset-0 transition-transform duration-200 group-hover:scale-[1.02]">
        <Image
          src={image.url}
          alt={image.alt ?? productName}
          fill
          className="object-cover"
          sizes={variant === "pc" ? "(max-width: 768px) 85vw, 62vw" : "150px"}
          loading="lazy"
        />
      </div>
    </div>
  );
}

interface LightboxProps {
  images: ProductImage[];
  index: number;
  productName: string;
  onClose: () => void;
  onNavigate: (i: number) => void;
}

function Lightbox({ images, index, productName, onClose, onNavigate }: LightboxProps) {
  const image = images[index];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
      role="dialog"
      aria-modal
      aria-label="画像ビューア"
    >
      <div className="relative flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
        <Image
          src={image.url}
          alt={image.alt ?? productName}
          width={1280}
          height={800}
          className="max-w-[90vw] max-h-[85vh] w-auto h-auto rounded-lg"
          priority
        />
        {image.alt && (
          <p className="mt-2 text-center text-sm text-white/70 max-w-[90vw]">{image.alt}</p>
        )}
      </div>

      {/* Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/40 text-white/90 text-xs px-3 py-1 rounded-full pointer-events-none">
        {index + 1} / {images.length}
      </div>

      {/* Close */}
      <button
        className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
        onClick={onClose}
        aria-label="閉じる"
      >
        <X size={20} />
      </button>

      {/* Prev */}
      {index > 0 && (
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-lg hover:bg-white/10 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(index - 1);
          }}
          aria-label="前の画像"
        >
          <ChevronLeft size={28} />
        </button>
      )}

      {/* Next */}
      {index < images.length - 1 && (
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-lg hover:bg-white/10 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(index + 1);
          }}
          aria-label="次の画像"
        >
          <ChevronRight size={28} />
        </button>
      )}
    </div>
  );
}

export function ScreenshotGallery({ images, productName }: ScreenshotGalleryProps) {
  const [orientations, setOrientations] = useState<Record<string, Orientation>>(
    () => Object.fromEntries(images.map((img) => [img.id, "unknown" as Orientation]))
  );
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const handleDetected = useCallback((id: string, isPC: boolean) => {
    setOrientations((prev) => ({ ...prev, [id]: isPC ? "pc" : "mobile" }));
  }, []);

  useEffect(() => {
    if (lightboxIndex === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      else if (e.key === "ArrowLeft")
        setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i));
      else if (e.key === "ArrowRight")
        setLightboxIndex((i) => (i !== null && i < images.length - 1 ? i + 1 : i));
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, images.length]);

  if (images.length === 0) return null;

  const allClassified = images.every((img) => orientations[img.id] !== "unknown");
  const pcImages = images.filter((img) => orientations[img.id] === "pc");
  const mobileImages = images.filter((img) => orientations[img.id] === "mobile");

  // Single image: plain display
  if (images.length === 1) {
    return (
      <section>
        <div
          className="group relative aspect-video rounded-lg overflow-hidden bg-muted border border-border cursor-pointer"
          onClick={() => setLightboxIndex(0)}
        >
          <div className="absolute inset-0 transition-transform duration-200 group-hover:scale-[1.01]">
            <Image
              src={images[0].url}
              alt={images[0].alt ?? productName}
              fill
              className="object-cover"
              sizes="100vw"
              loading="lazy"
            />
          </div>
        </div>
        {lightboxIndex !== null && (
          <Lightbox
            images={images}
            index={lightboxIndex}
            productName={productName}
            onClose={() => setLightboxIndex(null)}
            onNavigate={setLightboxIndex}
          />
        )}
      </section>
    );
  }

  return (
    <section className="space-y-6">
      {/* Hidden probes for orientation detection */}
      <div className="hidden" aria-hidden="true">
        {images.map((img) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={img.id}
            src={img.url}
            alt=""
            onLoad={(e) =>
              handleDetected(
                img.id,
                e.currentTarget.naturalWidth >= e.currentTarget.naturalHeight
              )
            }
          />
        ))}
      </div>

      {allClassified ? (
        <>
          {pcImages.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                PC
              </p>
              <HorizontalScroll>
                {pcImages.map((img) => (
                  <GalleryItem
                    key={img.id}
                    image={img}
                    productName={productName}
                    variant="pc"
                    onClick={() => setLightboxIndex(images.indexOf(img))}
                  />
                ))}
              </HorizontalScroll>
            </div>
          )}
          {mobileImages.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                モバイル
              </p>
              <HorizontalScroll>
                {mobileImages.map((img) => (
                  <GalleryItem
                    key={img.id}
                    image={img}
                    productName={productName}
                    variant="mobile"
                    onClick={() => setLightboxIndex(images.indexOf(img))}
                  />
                ))}
              </HorizontalScroll>
            </div>
          )}
        </>
      ) : (
        // Pre-classification: render all as PC width
        <HorizontalScroll>
          {images.map((img) => (
            <GalleryItem
              key={img.id}
              image={img}
              productName={productName}
              variant="pc"
              onClick={() => setLightboxIndex(images.indexOf(img))}
            />
          ))}
        </HorizontalScroll>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          index={lightboxIndex}
          productName={productName}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </section>
  );
}
