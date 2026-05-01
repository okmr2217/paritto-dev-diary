"use client";

import { useState, useMemo, useTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { LayoutGrid, List, Smartphone, Globe, Plug, Package } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import {
  STATUS_LABELS,
  CATEGORY_LABELS,
  STATUS_COLORS,
  CATEGORY_COLORS,
} from "@/lib/product-constants";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  APP: <Smartphone className="w-5 h-5" />,
  MCP: <Plug className="w-5 h-5" />,
  SITE: <Globe className="w-5 h-5" />,
  EXTENSION: <Package className="w-5 h-5" />,
  LIBRARY: <Package className="w-5 h-5" />,
};

interface Product {
  slug: string;
  name: string;
  description: string;
  category: string;
  status: string;
  iconUrl: string | null;
  themeColor: string | null;
  latestVersion: string | null;
  latestVersionDate: string | null;
  createdAt: string;
}

interface ProductsClientProps {
  products: Product[];
}

const VALID_CATEGORIES = ["APP", "MCP", "SITE"] as const;
const VALID_STATUSES = [
  "IDEA",
  "DEVELOPING",
  "RELEASED",
  "MAINTENANCE",
  "PAUSED",
] as const;
const VALID_VIEWS = ["grid", "table"] as const;
const VALID_SORTS = ["updated", "created"] as const;

type Category = (typeof VALID_CATEGORIES)[number];
type Status = (typeof VALID_STATUSES)[number];
type ViewMode = (typeof VALID_VIEWS)[number];
type SortOrder = (typeof VALID_SORTS)[number];

const CATEGORY_FILTERS: { label: string; value: Category | null }[] = [
  { label: "すべて", value: null },
  { label: CATEGORY_LABELS.APP, value: "APP" },
  { label: CATEGORY_LABELS.MCP, value: "MCP" },
  { label: CATEGORY_LABELS.SITE, value: "SITE" },
];

const STATUS_FILTERS: { label: string; value: Status | null }[] = [
  { label: "すべて", value: null },
  { label: STATUS_LABELS.RELEASED, value: "RELEASED" },
  { label: STATUS_LABELS.DEVELOPING, value: "DEVELOPING" },
  { label: STATUS_LABELS.MAINTENANCE, value: "MAINTENANCE" },
  { label: STATUS_LABELS.IDEA, value: "IDEA" },
  { label: STATUS_LABELS.PAUSED, value: "PAUSED" },
];

function parseCategory(value: string | null): Category | null {
  return (VALID_CATEGORIES as readonly string[]).includes(value ?? "")
    ? (value as Category)
    : null;
}

function parseStatus(value: string | null): Status | null {
  return (VALID_STATUSES as readonly string[]).includes(value ?? "")
    ? (value as Status)
    : null;
}

function parseView(value: string | null): ViewMode {
  return value === "table" ? "table" : "grid";
}

function parseSort(value: string | null): SortOrder {
  return value === "created" ? "created" : "updated";
}

function buildQuery(
  category: Category | null,
  status: Status | null,
  view: ViewMode,
  sort: SortOrder,
): string {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (status) params.set("status", status);
  if (view !== "grid") params.set("view", view);
  if (sort !== "updated") params.set("sort", sort);
  return params.toString();
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ja-JP");
}

interface TableRowProps {
  product: Product;
}

function TableRow({ product }: TableRowProps) {
  return (
    <tr
      className="border-b border-border hover:bg-muted/50 transition-colors cursor-pointer group"
      onClick={() => {
        window.location.href = `/products/${product.slug}`;
      }}
    >
      {/* Icon + Project name + description */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div
            className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center overflow-hidden"
            style={{
              backgroundColor: product.themeColor
                ? `${product.themeColor}20`
                : "var(--color-muted)",
            }}
          >
            {product.iconUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.iconUrl} alt={product.name} className="w-6 h-6 object-contain" />
            ) : (
              <span
                className="opacity-60"
                style={{ color: product.themeColor ?? undefined }}
              >
                {CATEGORY_ICONS[product.category] ?? <Package className="w-5 h-5" />}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <Link
              href={`/products/${product.slug}`}
              className="font-medium text-foreground group-hover:text-accent transition-colors block"
              onClick={(e) => e.stopPropagation()}
            >
              {product.name}
            </Link>
            {product.description && (
              <p className="text-xs text-muted-foreground truncate max-w-xs mt-0.5">
                {product.description}
              </p>
            )}
          </div>
        </div>
      </td>
      {/* Category */}
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${CATEGORY_COLORS[product.category] ?? "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"}`}
        >
          {CATEGORY_LABELS[product.category] ?? product.category}
        </span>
      </td>
      {/* Status */}
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[product.status] ?? "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"}`}
        >
          {STATUS_LABELS[product.status] ?? product.status}
        </span>
      </td>
      {/* Latest version + date */}
      <td className="px-4 py-3">
        {product.latestVersion ? (
          <div className="space-y-0.5">
            <span className="text-sm font-mono text-foreground">{product.latestVersion}</span>
            {product.latestVersionDate && (
              <p className="text-xs text-muted-foreground">{formatDate(product.latestVersionDate)}</p>
            )}
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        )}
      </td>
    </tr>
  );
}

export function ProductsClient({ products }: ProductsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [activeCategory, setActiveCategory] = useState<Category | null>(
    parseCategory(searchParams.get("category")),
  );
  const [activeStatus, setActiveStatus] = useState<Status | null>(
    parseStatus(searchParams.get("status")),
  );
  const [viewMode, setViewMode] = useState<ViewMode>(
    parseView(searchParams.get("view")),
  );
  const [sortOrder, setSortOrder] = useState<SortOrder>(
    parseSort(searchParams.get("sort")),
  );

  useEffect(() => {
    setActiveCategory(parseCategory(searchParams.get("category")));
    setActiveStatus(parseStatus(searchParams.get("status")));
    setViewMode(parseView(searchParams.get("view")));
    setSortOrder(parseSort(searchParams.get("sort")));
  }, [searchParams]);

  const pushUrl = (
    category: Category | null,
    status: Status | null,
    view: ViewMode,
    sort: SortOrder,
  ) => {
    const query = buildQuery(category, status, view, sort);
    startTransition(() => {
      router.replace(query ? `/products?${query}` : "/products", {
        scroll: false,
      });
    });
  };

  const handleCategoryChange = (value: Category | null) => {
    setActiveCategory(value);
    pushUrl(value, activeStatus, viewMode, sortOrder);
  };

  const handleStatusChange = (value: Status | null) => {
    setActiveStatus(value);
    pushUrl(activeCategory, value, viewMode, sortOrder);
  };

  const handleViewChange = (value: ViewMode) => {
    setViewMode(value);
    pushUrl(activeCategory, activeStatus, value, sortOrder);
  };

  const handleSortChange = (value: SortOrder) => {
    setSortOrder(value);
    pushUrl(activeCategory, activeStatus, viewMode, value);
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (activeCategory) {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (activeStatus) {
      result = result.filter((p) => p.status === activeStatus);
    }
    result.sort((a, b) => {
      if (sortOrder === "created") {
        return b.createdAt > a.createdAt ? 1 : -1;
      }
      // updated: sort by latest release date, fall back to createdAt
      const aDate = a.latestVersionDate ?? a.createdAt;
      const bDate = b.latestVersionDate ?? b.createdAt;
      return bDate > aDate ? 1 : -1;
    });
    return result;
  }, [products, activeCategory, activeStatus, sortOrder]);

  const gridKey = `${activeCategory ?? "all"}-${activeStatus ?? "all"}-${viewMode}-${sortOrder}`;

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          {/* Category tabs */}
          <nav className="flex gap-2 flex-wrap flex-1">
            {CATEGORY_FILTERS.map(({ label, value }) => {
              const isActive = activeCategory === value;
              return (
                <button
                  key={label}
                  onClick={() => handleCategoryChange(value)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? "tech-gradient text-white"
                      : "border border-border hover:bg-muted text-muted-foreground"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </nav>

          {/* Sort order */}
          <select
            value={sortOrder}
            onChange={(e) => handleSortChange(e.target.value as SortOrder)}
            className="text-xs bg-card border border-border rounded px-2 py-1 text-foreground focus:outline-none self-start sm:self-auto"
          >
            <option value="updated">更新順</option>
            <option value="created">公開順</option>
          </select>

          {/* View mode toggle (PC only) */}
          <div className="hidden md:flex items-center gap-1 border border-border rounded-lg p-0.5 self-start sm:self-auto">
            <button
              onClick={() => handleViewChange("grid")}
              className={`p-1.5 rounded transition-colors ${
                viewMode === "grid"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label="カード表示"
            >
              <LayoutGrid size={14} />
            </button>
            <button
              onClick={() => handleViewChange("table")}
              className={`p-1.5 rounded transition-colors ${
                viewMode === "table"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label="テーブル表示"
            >
              <List size={14} />
            </button>
          </div>
        </div>

        {/* Status filter chips */}
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map(({ label, value }) => {
            const isActive = activeStatus === value;
            return (
              <button
                key={label}
                onClick={() => handleStatusChange(value)}
                className={`rounded px-2.5 py-0.5 text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? "bg-foreground text-background"
                    : "border border-border hover:bg-muted text-muted-foreground"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Result count */}
      <p className="text-sm text-muted-foreground">
        {filteredProducts.length}件のプロダクト
      </p>

      {/* Grid / Table */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center text-sm text-muted-foreground">
          条件に一致するプロダクトはありません
        </div>
      ) : (
        <div
          key={gridKey}
          className={`animate-in fade-in duration-200 transition-opacity ${
            isPending ? "opacity-50" : "opacity-100"
          }`}
        >
          {/* Table view (PC only) */}
          {viewMode === "table" ? (
            <div className="hidden md:block rounded-lg border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                      プロジェクト
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                      カテゴリ
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                      ステータス
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                      最新バージョン
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.slug} product={product} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          {/* Card view (always on mobile, on PC when viewMode=grid) */}
          <div className={viewMode === "table" ? "md:hidden" : ""}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.slug}
                  slug={product.slug}
                  name={product.name}
                  description={product.description}
                  category={product.category}
                  status={product.status}
                  latestVersion={product.latestVersion}
                  latestVersionDate={product.latestVersionDate}
                  iconUrl={product.iconUrl}
                  themeColor={product.themeColor}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
