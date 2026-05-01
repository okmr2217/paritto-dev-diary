"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { RELEASE_TYPE_LABELS } from "@/lib/product-constants";

const TYPES = ["MAJOR", "MINOR", "PATCH", "HOTFIX"] as const;

interface Product {
  slug: string;
  name: string;
}

interface ReleasesFilterProps {
  products: Product[];
  currentProduct: string | null;
  currentType: string | null;
}

function buildUrl(product: string | null, type: string | null): string {
  const params = new URLSearchParams();
  if (product) params.set("product", product);
  if (type) params.set("type", type);
  const qs = params.toString();
  return `/releases${qs ? `?${qs}` : ""}`;
}

export function ReleasesFilter({
  products,
  currentProduct,
  currentType,
}: ReleasesFilterProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const navigate = (product: string | null, type: string | null) => {
    startTransition(() => {
      router.replace(buildUrl(product, type), { scroll: false });
    });
  };

  return (
    <div
      className={`space-y-2 transition-opacity ${isPending ? "opacity-50" : ""}`}
    >
      {/* Product filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground shrink-0">プロダクト</span>
        <select
          value={currentProduct ?? ""}
          onChange={(e) => navigate(e.target.value || null, currentType)}
          className="text-xs bg-card border border-border rounded px-2 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
        >
          <option value="">すべて</option>
          {products.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Type filter chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground shrink-0">種類</span>
        <button
          onClick={() => navigate(currentProduct, null)}
          className={`rounded px-2.5 py-0.5 text-xs font-medium transition-colors cursor-pointer ${
            !currentType
              ? "bg-foreground text-background"
              : "border border-border hover:bg-muted text-muted-foreground"
          }`}
        >
          すべて
        </button>
        {TYPES.map((type) => (
          <button
            key={type}
            onClick={() =>
              navigate(currentProduct, currentType === type ? null : type)
            }
            className={`rounded px-2.5 py-0.5 text-xs font-medium transition-colors cursor-pointer ${
              currentType === type
                ? "bg-foreground text-background"
                : "border border-border hover:bg-muted text-muted-foreground"
            }`}
          >
            {RELEASE_TYPE_LABELS[type]}
          </button>
        ))}
      </div>
    </div>
  );
}
