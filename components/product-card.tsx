import Link from "next/link";
import { Smartphone, Globe, Plug, Package } from "lucide-react";
import {
  STATUS_LABELS,
  CATEGORY_LABELS,
  STATUS_COLORS,
  CATEGORY_COLORS,
} from "@/lib/product-constants";

interface ProductCardProps {
  slug: string;
  name: string;
  description: string | null;
  category: string;
  status: string;
  iconUrl: string | null;
  themeColor: string | null;
  latestVersion?: string | null;
  latestVersionDate?: string | null;
  compact?: boolean;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  APP: <Smartphone className="w-6 h-6" />,
  MCP: <Plug className="w-6 h-6" />,
  SITE: <Globe className="w-6 h-6" />,
  EXTENSION: <Package className="w-6 h-6" />,
  LIBRARY: <Package className="w-6 h-6" />,
};

export function ProductCard({
  slug,
  name,
  description,
  category,
  status,
  iconUrl,
  themeColor,
  latestVersion,
  latestVersionDate,
  compact = false,
}: ProductCardProps) {

  return (
    <Link
      href={`/products/${slug}`}
      className="group block rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow duration-300"
      style={
        themeColor
          ? { borderLeftColor: themeColor, borderLeftWidth: "3px" }
          : undefined
      }
    >
      <div className={`${compact ? "p-3" : "p-4"} space-y-2.5`}>
        {/* Icon + Badges */}
        <div className="flex items-start gap-3">
          {/* Product icon */}
          <div
            className="flex-shrink-0 w-11 h-11 rounded-lg flex items-center justify-center overflow-hidden"
            style={{
              backgroundColor: themeColor
                ? `${themeColor}20`
                : "var(--color-muted)",
            }}
          >
            {iconUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={iconUrl}
                alt={name}
                className="w-8 h-8 object-contain"
              />
            ) : (
              <span
                className="opacity-60"
                style={{ color: themeColor ?? undefined }}
              >
                {CATEGORY_ICONS[category] ?? <Package className="w-6 h-6" />}
              </span>
            )}
          </div>

          {/* Badges */}
          <div className="flex-1 flex gap-1.5 flex-wrap pt-0.5 min-w-0">
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_COLORS[category] ?? "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"}`}
            >
              {CATEGORY_LABELS[category] ?? category}
            </span>
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[status] ?? "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"}`}
            >
              {STATUS_LABELS[status] ?? status}
            </span>
          </div>
        </div>

        {/* Name */}
        <h2
          className={`font-semibold font-heading text-foreground leading-snug ${compact ? "text-sm" : "text-base"}`}
        >
          {name}
        </h2>

        {/* Description */}
        {!compact && description && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        {/* Latest version */}
        {!compact && (latestVersion || latestVersionDate) && (
          <div className="pt-0.5 border-t border-border/50 flex items-center gap-2 pt-1.5">
            {latestVersion && (
              <span className="inline-flex items-center rounded px-1.5 py-0.5 text-xs bg-muted text-muted-foreground font-mono">
                {latestVersion}
              </span>
            )}
            {latestVersionDate && (
              <span className="text-xs text-muted-foreground">
                {new Date(latestVersionDate).toLocaleDateString("ja-JP")}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
