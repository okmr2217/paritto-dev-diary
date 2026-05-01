import Link from "next/link";
import { Package, ChevronRight } from "lucide-react";
import { RELEASE_TYPE_LABELS } from "@/lib/product-constants";

const RELEASE_TYPE_COLORS: Record<string, string> = {
  MAJOR: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  MINOR: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  PATCH:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  HOTFIX:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

export interface ReleaseCardProduct {
  slug: string;
  name: string;
  iconUrl: string | null;
  themeColor: string | null;
}

export interface ReleaseCardProps {
  version: string;
  type: string;
  releaseDate: string;
  title: string;
  contentHtml?: string;
  showContent?: boolean;
  product: ReleaseCardProduct;
}

export function ReleaseCard({
  version,
  type,
  releaseDate,
  title,
  contentHtml,
  showContent = false,
  product,
}: ReleaseCardProps) {
  return (
    <article className="p-4 bg-card border border-border rounded-lg space-y-2.5">
      {/* Meta row */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Product icon */}
        <Link
          href={`/products/${product.slug}`}
          className="shrink-0 flex items-center justify-center w-6 h-6 rounded overflow-hidden hover:opacity-80 transition-opacity"
          style={{
            backgroundColor: product.themeColor
              ? `${product.themeColor}25`
              : "var(--color-muted)",
          }}
          aria-label={product.name}
        >
          {product.iconUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.iconUrl}
              alt={product.name}
              className="w-5 h-5 object-contain"
            />
          ) : (
            <Package className="w-3.5 h-3.5 text-muted-foreground" />
          )}
        </Link>

        <span className="font-mono font-bold text-sm">{version}</span>
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${RELEASE_TYPE_COLORS[type] ?? "bg-gray-100 text-gray-700"}`}
        >
          {RELEASE_TYPE_LABELS[type] ?? type}
        </span>
        <span className="text-xs text-muted-foreground shrink-0">
          {new Date(releaseDate).toLocaleDateString("ja-JP")}
        </span>
        <Link
          href={`/products/${product.slug}`}
          className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded hover:text-accent transition-colors"
        >
          {product.name}
        </Link>
      </div>

      {/* Title */}
      <p className="font-semibold font-heading text-sm">{title}</p>

      {/* Content accordion (releases page only) */}
      {showContent && contentHtml && (
        <details className="group">
          <summary className="flex items-center gap-1 text-xs text-muted-foreground cursor-pointer hover:text-accent list-none select-none">
            <ChevronRight className="w-3 h-3 shrink-0 transition-transform duration-150 group-open:rotate-90" />
            変更内容
          </summary>
          <div
            className="mt-2 prose dark:prose-invert max-w-none prose-p:text-xs prose-p:my-1.5 prose-li:text-xs prose-ul:my-1 prose-ol:my-1 prose-headings:text-sm prose-headings:my-2"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </details>
      )}
    </article>
  );
}
