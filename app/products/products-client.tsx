"use client";

import { useState, useMemo, useTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { LayoutGrid, List } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import {
  STATUS_LABELS,
  CATEGORY_LABELS,
  STATUS_COLORS,
} from "@/lib/product-constants";

interface Product {
  slug: string;
  name: string;
  description: string;
  category: string;
  status: string;
  stacks: string[];
  lastUpdated: string | null;
  thumbnail: { url: string; alt: string | null; isThumbnail: boolean } | null;
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
const VALID_SORTS = ["updated_desc", "name_asc"] as const;
const VALID_VIEWS = ["grid", "table"] as const;

type Category = (typeof VALID_CATEGORIES)[number];
type Status = (typeof VALID_STATUSES)[number];
type Sort = (typeof VALID_SORTS)[number];
type ViewMode = (typeof VALID_VIEWS)[number];

const SORT_LABELS: Record<Sort, string> = {
  updated_desc: "最終更新日（新しい順）",
  name_asc: "名前順",
};

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

function parseSort(value: string | null): Sort {
  return (VALID_SORTS as readonly string[]).includes(value ?? "")
    ? (value as Sort)
    : "updated_desc";
}

function parseView(value: string | null): ViewMode {
  return value === "table" ? "table" : "grid";
}

function buildQuery(
  category: Category | null,
  status: Status | null,
  sort: Sort,
  view: ViewMode,
): string {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (status) params.set("status", status);
  if (sort !== "updated_desc") params.set("sort", sort);
  if (view !== "grid") params.set("view", view);
  return params.toString();
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ja-JP");
}

interface TableRowProps {
  product: Product;
}

function TableRow({ product }: TableRowProps) {
  const visibleStacks = product.stacks.slice(0, 3);
  const remaining = product.stacks.length - visibleStacks.length;

  return (
    <tr
      className="border-b border-border hover:bg-muted/50 transition-colors cursor-pointer group"
      onClick={() => {
        window.location.href = `/products/${product.slug}`;
      }}
    >
      <td className="px-4 py-3">
        <Link
          href={`/products/${product.slug}`}
          className="font-medium text-foreground group-hover:text-accent transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          {product.name}
        </Link>
      </td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[product.status] ?? "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"}`}
        >
          {STATUS_LABELS[product.status] ?? product.status}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">
        {product.lastUpdated ? formatDate(product.lastUpdated) : "—"}
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-1.5 flex-wrap">
          {visibleStacks.map((stack) => (
            <span
              key={stack}
              className="inline-flex items-center rounded px-1.5 py-0.5 text-xs bg-muted text-muted-foreground font-mono"
            >
              {stack}
            </span>
          ))}
          {remaining > 0 && (
            <span className="inline-flex items-center rounded px-1.5 py-0.5 text-xs bg-muted text-muted-foreground font-mono">
              他{remaining}件
            </span>
          )}
        </div>
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
  const [activeSort, setActiveSort] = useState<Sort>(
    parseSort(searchParams.get("sort")),
  );
  const [viewMode, setViewMode] = useState<ViewMode>(
    parseView(searchParams.get("view")),
  );

  useEffect(() => {
    setActiveCategory(parseCategory(searchParams.get("category")));
    setActiveStatus(parseStatus(searchParams.get("status")));
    setActiveSort(parseSort(searchParams.get("sort")));
    setViewMode(parseView(searchParams.get("view")));
  }, [searchParams]);

  const pushUrl = (
    category: Category | null,
    status: Status | null,
    sort: Sort,
    view: ViewMode,
  ) => {
    const query = buildQuery(category, status, sort, view);
    startTransition(() => {
      router.replace(query ? `/products?${query}` : "/products", {
        scroll: false,
      });
    });
  };

  const handleCategoryChange = (value: Category | null) => {
    setActiveCategory(value);
    pushUrl(value, activeStatus, activeSort, viewMode);
  };

  const handleStatusChange = (value: Status | null) => {
    setActiveStatus(value);
    pushUrl(activeCategory, value, activeSort, viewMode);
  };

  const handleSortChange = (value: Sort) => {
    setActiveSort(value);
    pushUrl(activeCategory, activeStatus, value, viewMode);
  };

  const handleViewChange = (value: ViewMode) => {
    setViewMode(value);
    pushUrl(activeCategory, activeStatus, activeSort, value);
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (activeCategory) {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (activeStatus) {
      result = result.filter((p) => p.status === activeStatus);
    }

    return result;
  }, [products, activeCategory, activeStatus]);

  const hasStatusFilter = activeStatus !== null;
  const activeProducts = hasStatusFilter
    ? filteredProducts
    : filteredProducts.filter((p) => p.status !== "PAUSED");
  const pausedProducts = hasStatusFilter
    ? []
    : filteredProducts.filter((p) => p.status === "PAUSED");

  const gridKey = `${activeCategory ?? "all"}-${activeStatus ?? "all"}-${activeSort}-${viewMode}`;

  return (
    <div className="space-y-6">
      {/* Filter & Sort Bar */}
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

          <div className="flex items-center gap-2">
            {/* Sort */}
            <select
              value={activeSort}
              onChange={(e) => handleSortChange(e.target.value as Sort)}
              className="rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring w-full sm:w-auto cursor-pointer"
            >
              {(Object.entries(SORT_LABELS) as [Sort, string][]).map(
                ([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ),
              )}
            </select>

            {/* View mode toggle (PC only) */}
            <div className="hidden md:flex items-center gap-1 border border-border rounded-lg p-0.5">
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
        {filteredProducts.length}件の制作物
      </p>

      {/* Grid / Table */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center text-sm text-muted-foreground">
          条件に一致する制作物はありません
        </div>
      ) : (
        <div
          key={gridKey}
          className={`space-y-8 animate-in fade-in duration-200 transition-opacity ${
            isPending ? "opacity-50" : "opacity-100"
          }`}
        >
          {/* Table view (PC only — mobile always uses card) */}
          {viewMode === "table" ? (
            <div className="hidden md:block rounded-lg border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                      プロダクト名
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                      ステータス
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                      最終更新
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                      リリース日
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                      技術スタック
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {activeProducts.map((product) => (
                    <TableRow key={product.slug} product={product} />
                  ))}
                  {pausedProducts.length > 0 && (
                    <>
                      <tr>
                        <td colSpan={5} className="px-4 py-2 text-center">
                          <span className="text-xs text-muted-foreground font-medium">
                            休止中の制作物
                          </span>
                        </td>
                      </tr>
                      {pausedProducts.map((product) => (
                        <TableRow key={product.slug} product={product} />
                      ))}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          ) : null}

          {/* Card view (always shown on mobile, shown on PC when viewMode=grid) */}
          <div className={viewMode === "table" ? "md:hidden" : ""}>
            {activeProducts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6">
                {activeProducts.map((product) => (
                  <ProductCard
                    key={product.slug}
                    slug={product.slug}
                    name={product.name}
                    description={product.description}
                    category={product.category}
                    status={product.status}
                    stacks={product.stacks}
                    lastUpdated={product.lastUpdated}
                    thumbnail={product.thumbnail}
                  />
                ))}
              </div>
            )}

            {pausedProducts.length > 0 && (
              <div className="space-y-4 mt-8">
                <div className="flex items-center gap-3">
                  <div className="flex-1 border-t border-border" />
                  <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">
                    休止中の制作物
                  </span>
                  <div className="flex-1 border-t border-border" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 opacity-60">
                  {pausedProducts.map((product) => (
                    <ProductCard
                      key={product.slug}
                      slug={product.slug}
                      name={product.name}
                      description={product.description}
                      category={product.category}
                      status={product.status}
                      stacks={product.stacks}
                      lastUpdated={product.lastUpdated}
                      thumbnail={product.thumbnail}
                      compact
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
