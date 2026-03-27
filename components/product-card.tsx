import Image from "next/image";
import Link from "next/link";
import {
  STATUS_LABELS,
  CATEGORY_LABELS,
  STATUS_COLORS,
  CATEGORY_COLORS,
} from "@/lib/product-constants";

interface ProductImage {
  url: string;
  alt: string | null;
  isThumbnail: boolean;
}

interface ProductCardProps {
  name: string;
  description: string | null;
  category: string;
  status: string;
  stacks: string[];
  thumbnail: ProductImage | null;
}

export function ProductCard({
  name,
  description,
  category,
  status,
  stacks,
  thumbnail,
}: ProductCardProps) {
  const visibleStacks = stacks.slice(0, 2);
  const remainingCount = stacks.length - visibleStacks.length;

  return (
    <Link
      href={`/products/${name}`}
      className="group block rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        {thumbnail ? (
          <Image
            src={thumbnail.url}
            alt={thumbnail.alt ?? name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
            No Image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Badges */}
        <div className="flex gap-2 flex-wrap">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${CATEGORY_COLORS[category] ?? "bg-gray-100 text-gray-700"}`}
          >
            {CATEGORY_LABELS[category] ?? category}
          </span>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[status] ?? "bg-gray-100 text-gray-700"}`}
          >
            {STATUS_LABELS[status] ?? status}
          </span>
        </div>

        {/* Name */}
        <h2 className="font-semibold font-heading text-foreground leading-snug">
          {name}
        </h2>

        {/* Description */}
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        {/* Stacks */}
        {stacks.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {visibleStacks.map((stack) => (
              <span
                key={stack}
                className="inline-flex items-center rounded px-1.5 py-0.5 text-xs bg-muted text-muted-foreground font-mono"
              >
                {stack}
              </span>
            ))}
            {remainingCount > 0 && (
              <span className="inline-flex items-center rounded px-1.5 py-0.5 text-xs bg-muted text-muted-foreground font-mono">
                +{remainingCount}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
