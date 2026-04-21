"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Monitor, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

type DeviceType = "PC" | "MOBILE" | "OTHER";

interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  deviceType: DeviceType | null;
}

interface ScreenshotGalleryProps {
  images: ProductImage[];
  productName: string;
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85"
      onClick={onClose}
      role="dialog"
      aria-modal
      aria-label="画像ビューア"
    >
      <div
        className="relative flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={image.url}
          alt={image.alt ?? productName}
          width={1280}
          height={800}
          className="max-w-[90vw] max-h-[85vh] w-auto h-auto rounded-xl shadow-2xl"
          priority
        />
        {image.alt && (
          <p className="mt-3 text-center text-sm text-white/60 max-w-[90vw]">
            {image.alt}
          </p>
        )}
      </div>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white/80 text-xs px-3 py-1 rounded-full pointer-events-none">
        {index + 1} / {images.length}
      </div>

      <button
        className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
        onClick={onClose}
        aria-label="閉じる"
      >
        <X size={20} />
      </button>

      {index > 0 && (
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-lg hover:bg-white/10 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(index - 1);
          }}
          aria-label="前の画像"
        >
          <ChevronLeft size={28} />
        </button>
      )}

      {index < images.length - 1 && (
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-lg hover:bg-white/10 transition-colors"
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

interface PcItemProps {
  image: ProductImage;
  productName: string;
  onClick: () => void;
}

function PcItem({ image, productName, onClick }: PcItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative flex-shrink-0 snap-start aspect-[8/5] rounded-lg overflow-hidden bg-muted",
        "border border-border shadow-sm cursor-pointer",
        "transition-shadow hover:shadow-md",
        "w-[85vw] md:w-[46%]"
      )}
    >
      <div className="absolute inset-0 transition-transform duration-200 group-hover:scale-[1.02]">
        <Image
          src={image.url}
          alt={image.alt ?? productName}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 85vw, 46vw"
          loading="lazy"
        />
      </div>
      {image.alt && (
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-xs text-white/90 truncate">{image.alt}</p>
        </div>
      )}
    </div>
  );
}

interface MobileItemProps {
  image: ProductImage;
  productName: string;
  onClick: () => void;
}

function MobileItem({ image, productName, onClick }: MobileItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative flex-shrink-0 snap-start",
        "w-[130px] md:w-[150px] aspect-[390/844]",
        "rounded-xl overflow-hidden bg-muted",
        "border border-border shadow-sm cursor-pointer",
        "transition-shadow hover:shadow-md"
      )}
    >
      <div className="absolute inset-0 transition-transform duration-200 group-hover:scale-[1.02]">
        <Image
          src={image.url}
          alt={image.alt ?? productName}
          fill
          className="object-cover"
          sizes="150px"
          loading="lazy"
        />
      </div>
    </div>
  );
}

function SectionLabel({
  icon,
  label,
  count,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-muted-foreground">{icon}</span>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <span className="inline-flex items-center rounded-full bg-muted border border-border/60 px-2 py-0.5 text-xs tabular-nums text-muted-foreground font-medium">
        {count}枚
      </span>
    </div>
  );
}

export function ScreenshotGallery({ images, productName }: ScreenshotGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      else if (e.key === "ArrowLeft")
        setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i));
      else if (e.key === "ArrowRight")
        setLightboxIndex((i) =>
          i !== null && i < images.length - 1 ? i + 1 : i
        );
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, images.length]);

  if (images.length === 0) return null;

  const pcImages = images.filter((img) => img.deviceType !== "MOBILE");
  const mobileImages = images.filter((img) => img.deviceType === "MOBILE");
  const hasBoth = pcImages.length > 0 && mobileImages.length > 0;

  if (images.length === 1) {
    return (
      <>
        <div
          className="group relative aspect-[8/5] rounded-lg overflow-hidden bg-muted border border-border shadow-sm cursor-pointer"
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
      </>
    );
  }

  return (
    <div className="space-y-6">
      {/* PC Screenshots */}
      {pcImages.length > 0 && (
        <div className="space-y-3">
          {hasBoth && (
            <SectionLabel icon={<Monitor size={13} />} label="PC" count={pcImages.length} />
          )}

          <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory [scrollbar-width:thin] [scrollbar-color:var(--color-border)_transparent]">
            {pcImages.map((img) => (
              <PcItem
                key={img.id}
                image={img}
                productName={productName}
                onClick={() => setLightboxIndex(images.indexOf(img))}
              />
            ))}
          </div>
        </div>
      )}

      {/* Mobile Screenshots */}
      {mobileImages.length > 0 && (
        <div className="space-y-3">
          {hasBoth && (
            <SectionLabel icon={<Smartphone size={13} />} label="モバイル" count={mobileImages.length} />
          )}
          <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {mobileImages.map((img) => (
              <MobileItem
                key={img.id}
                image={img}
                productName={productName}
                onClick={() => setLightboxIndex(images.indexOf(img))}
              />
            ))}
          </div>
        </div>
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
    </div>
  );
}
