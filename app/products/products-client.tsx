"use client";

import { useState, useMemo, useTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { STATUS_LABELS, CATEGORY_LABELS } from "@/lib/product-constants";

interface Product {
  slug: string;
  name: string;
  description: string;
  category: string;
  status: string;
  stacks: string[];
  releaseDate: string | null;
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
const VALID_SORTS = [
  "releaseDate_desc",
  "releaseDate_asc",
  "updated_desc",
  "name_asc",
] as const;

type Category = (typeof VALID_CATEGORIES)[number];
type Status = (typeof VALID_STATUSES)[number];
type Sort = (typeof VALID_SORTS)[number];

const SORT_LABELS: Record<Sort, string> = {
  releaseDate_desc: "リリース日（新しい順）",
  releaseDate_asc: "リリース日（古い順）",
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
    : "releaseDate_desc";
}

function buildQuery(
  category: Category | null,
  status: Status | null,
  sort: Sort
): string {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (status) params.set("status", status);
  if (sort !== "releaseDate_desc") params.set("sort", sort);
  return params.toString();
}

export function ProductsClient({ products }: ProductsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [activeCategory, setActiveCategory] = useState<Category | null>(
    parseCategory(searchParams.get("category"))
  );
  const [activeStatus, setActiveStatus] = useState<Status | null>(
    parseStatus(searchParams.get("status"))
  );
  const [activeSort, setActiveSort] = useState<Sort>(
    parseSort(searchParams.get("sort"))
  );

  // Sync from URL on back/forward navigation
  useEffect(() => {
    setActiveCategory(parseCategory(searchParams.get("category")));
    setActiveStatus(parseStatus(searchParams.get("status")));
    setActiveSort(parseSort(searchParams.get("sort")));
  }, [searchParams]);

  const handleCategoryChange = (value: Category | null) => {
    setActiveCategory(value);
    const query = buildQuery(value, activeStatus, activeSort);
    startTransition(() => {
      router.replace(query ? `/products?${query}` : "/products", {
        scroll: false,
      });
    });
  };

  const handleStatusChange = (value: Status | null) => {
    setActiveStatus(value);
    const query = buildQuery(activeCategory, value, activeSort);
    startTransition(() => {
      router.replace(query ? `/products?${query}` : "/products", {
        scroll: false,
      });
    });
  };

  const handleSortChange = (value: Sort) => {
    setActiveSort(value);
    const query = buildQuery(activeCategory, activeStatus, value);
    startTransition(() => {
      router.replace(query ? `/products?${query}` : "/products", {
        scroll: false,
      });
    });
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
      switch (activeSort) {
        case "releaseDate_asc":
          if (!a.releaseDate && !b.releaseDate) return 0;
          if (!a.releaseDate) return 1;
          if (!b.releaseDate) return -1;
          return a.releaseDate.localeCompare(b.releaseDate);
        case "updated_desc": {
          const aDate = a.lastUpdated ?? a.releaseDate ?? "";
          const bDate = b.lastUpdated ?? b.releaseDate ?? "";
          return bDate.localeCompare(aDate);
        }
        case "name_asc":
          return a.name.localeCompare(b.name, "ja");
        default: {
          // releaseDate_desc
          if (!a.releaseDate && !b.releaseDate) return 0;
          if (!a.releaseDate) return 1;
          if (!b.releaseDate) return -1;
          return b.releaseDate.localeCompare(a.releaseDate);
        }
      }
    });

    return result;
  }, [products, activeCategory, activeStatus, activeSort]);

  // Section split (only when no status filter)
  const hasStatusFilter = activeStatus !== null;
  const activeProducts = hasStatusFilter
    ? filteredProducts
    : filteredProducts.filter((p) => p.status !== "PAUSED");
  const pausedProducts = hasStatusFilter
    ? []
    : filteredProducts.filter((p) => p.status === "PAUSED");

  const gridKey = `${activeCategory ?? "all"}-${activeStatus ?? "all"}-${activeSort}`;

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
              )
            )}
          </select>
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

      {/* Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center text-sm text-muted-foreground">
          条件に一致するプロダクトはありません
        </div>
      ) : (
        <div
          key={gridKey}
          className={`space-y-8 animate-in fade-in duration-200 transition-opacity ${
            isPending ? "opacity-50" : "opacity-100"
          }`}
        >
          {/* Active products */}
          {activeProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeProducts.map((product) => (
                <ProductCard
                  key={product.slug}
                  slug={product.slug}
                  name={product.name}
                  description={product.description}
                  category={product.category}
                  status={product.status}
                  stacks={product.stacks}
                  releaseDate={product.releaseDate}
                  lastUpdated={product.lastUpdated}
                  thumbnail={product.thumbnail}
                />
              ))}
            </div>
          )}

          {/* Paused section */}
          {pausedProducts.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex-1 border-t border-border" />
                <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">
                  休止中のプロダクト
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
                    releaseDate={product.releaseDate}
                    lastUpdated={product.lastUpdated}
                    thumbnail={product.thumbnail}
                    compact
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
