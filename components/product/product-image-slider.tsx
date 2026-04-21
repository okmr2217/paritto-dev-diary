"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
}

interface ProductImageSliderProps {
  images: ProductImage[];
  productName: string;
}

export function ProductImageSlider({ images, productName }: ProductImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef<number>(0);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => Math.max(0, i - 1));
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => Math.min(images.length - 1, i + 1));
  }, [images.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightboxOpen, goPrev, goNext]);

  if (images.length === 0) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) goNext();
    else if (diff < -50) goPrev();
  };

  const currentImage = images[currentIndex];

  return (
    <div className="space-y-3">
      {/* Main slider */}
      <div
        className="relative aspect-video rounded-lg overflow-hidden bg-muted cursor-pointer select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={() => setLightboxOpen(true)}
        role="button"
        tabIndex={0}
        aria-label="画像を拡大表示"
        onKeyDown={(e) => e.key === "Enter" && setLightboxOpen(true)}
      >
        {/* Sliding track */}
        <div
          className="absolute inset-0 flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((img, i) => (
            <div key={img.id} className="relative flex-shrink-0 w-full h-full">
              <Image
                src={img.url}
                alt={img.alt ?? productName}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 66vw"
                priority={i === 0}
              />
            </div>
          ))}
        </div>

        {/* PC: Prev/Next buttons */}
        {currentIndex > 0 && (
          <button
            className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-lg transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            aria-label="前の画像"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        {currentIndex < images.length - 1 && (
          <button
            className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-lg transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            aria-label="次の画像"
          >
            <ChevronRight size={20} />
          </button>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/40 text-white/90 text-xs px-2.5 py-1 rounded-full pointer-events-none z-10">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Mobile: dot indicators */}
      {images.length > 1 && (
        <div className="flex md:hidden justify-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                i === currentIndex ? "bg-foreground" : "bg-muted-foreground/30"
              )}
              aria-label={`画像${i + 1}を表示`}
            />
          ))}
        </div>
      )}

      {/* PC: thumbnail strip */}
      {images.length > 1 && (
        <div className="hidden md:flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setCurrentIndex(i)}
              className={cn(
                "relative flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-all",
                i === currentIndex
                  ? "border-accent"
                  : "border-transparent opacity-60 hover:opacity-90"
              )}
              aria-label={`画像${i + 1}を表示`}
            >
              <Image
                src={img.url}
                alt={img.alt ?? productName}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal
          aria-label="画像ビューア"
        >
          <div
            className="relative flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={currentImage.url}
              alt={currentImage.alt ?? productName}
              width={1280}
              height={800}
              className="max-w-[90vw] max-h-[85vh] w-auto h-auto rounded-lg"
              priority
            />
            {currentImage.alt && (
              <p className="mt-2 text-center text-sm text-white/70 max-w-[90vw]">
                {currentImage.alt}
              </p>
            )}
          </div>

          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/40 text-white/90 text-xs px-3 py-1 rounded-full pointer-events-none">
            {currentIndex + 1} / {images.length}
          </div>

          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setLightboxOpen(false)}
            aria-label="閉じる"
          >
            <X size={20} />
          </button>

          {currentIndex > 0 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-lg hover:bg-white/10 transition-colors"
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              aria-label="前の画像"
            >
              <ChevronLeft size={28} />
            </button>
          )}
          {currentIndex < images.length - 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-lg hover:bg-white/10 transition-colors"
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              aria-label="次の画像"
            >
              <ChevronRight size={28} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
