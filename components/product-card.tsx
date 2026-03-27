import Image from "next/image";
import Link from "next/link";
import { Smartphone, Globe, Plug } from "lucide-react";
import {
  STATUS_LABELS,
  CATEGORY_LABELS,
  STATUS_COLORS,
  CATEGORY_COLORS,
  CATEGORY_PLACEHOLDER_COLORS,
} from "@/lib/product-constants";

interface ProductImage {
  url: string;
  alt: string | null;
  isThumbnail: boolean;
}

interface ProductCardProps {
  slug: string;
  name: string;
  description: string | null;
  category: string;
  status: string;
  stacks: string[];
  thumbnail: ProductImage | null;
  releaseDate?: string | null;
  lastUpdated?: string | null;
  compact?: boolean;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
}

function formatRelative(iso: string): string {
  const diffDays = Math.floor(
    (Date.now() - new Date(iso).getTime()) / 86400000
  );
  if (diffDays === 0) return "今日";
  if (diffDays < 7) return `${diffDays}日前`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}週間前`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}ヶ月前`;
  return `${Math.floor(diffDays / 365)}年前`;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  APP: <Smartphone className="w-7 h-7 opacity-50" />,
  MCP: <Plug className="w-7 h-7 opacity-50" />,
  SITE: <Globe className="w-7 h-7 opacity-50" />,
};

export function ProductCard({
  slug,
  name,
  description,
  category,
  status,
  stacks,
  thumbnail,
  releaseDate,
  lastUpdated,
  compact = false,
}: ProductCardProps) {
  const visibleStacks = stacks.slice(0, 2);
  const remainingCount = stacks.length - visibleStacks.length;
  const initial = name.charAt(0).toUpperCase();
  const placeholderColors =
    CATEGORY_PLACEHOLDER_COLORS[category] ??
    "bg-muted text-muted-foreground";

  return (
    <Link
      href={`/products/${slug}`}
      className="group block rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      {/* Thumbnail (hidden in compact mode) */}
      {!compact && (
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
            <div
              className={`flex h-full flex-col items-center justify-center gap-2 ${placeholderColors}`}
            >
              <span className="text-4xl font-bold leading-none font-heading">
                {initial}
              </span>
              {CATEGORY_ICONS[category]}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className={`${compact ? "p-3" : "p-4"} space-y-2`}>
        {/* Badges */}
        <div className="flex gap-2 flex-wrap">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${CATEGORY_COLORS[category] ?? "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"}`}
          >
            {CATEGORY_LABELS[category] ?? category}
          </span>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[status] ?? "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"}`}
          >
            {STATUS_LABELS[status] ?? status}
          </span>
        </div>

        {/* Name */}
        <h2
          className={`font-semibold font-heading text-foreground leading-snug ${compact ? "text-sm" : ""}`}
        >
          {name}
        </h2>

        {/* Description (hidden in compact mode) */}
        {!compact && description && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        {/* Stacks */}
        {!compact && stacks.length > 0 && (
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

        {/* Dates */}
        {!compact && (releaseDate || lastUpdated) && (
          <div className="flex gap-3 flex-wrap pt-0.5 border-t border-border/50">
            {releaseDate && (
              <span className="text-xs text-muted-foreground pt-1">
                {formatDate(releaseDate)} リリース
              </span>
            )}
            {lastUpdated && (
              <span className="text-xs text-muted-foreground pt-1">
                最終更新: {formatRelative(lastUpdated)}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
