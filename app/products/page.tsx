import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/page-hero";
import { ProductCard } from "@/components/product-card";
import { CATEGORY_LABELS } from "@/lib/product-constants";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "プロダクト",
  description: "個人開発したプロダクトの一覧です。",
};

const VALID_CATEGORIES = ["APP", "MCP", "SITE"] as const;
type Category = (typeof VALID_CATEGORIES)[number];

function isValidCategory(value: string): value is Category {
  return (VALID_CATEGORIES as readonly string[]).includes(value);
}

const CATEGORY_FILTERS: { label: string; value: string | null }[] = [
  { label: "すべて", value: null },
  { label: CATEGORY_LABELS.APP, value: "APP" },
  { label: CATEGORY_LABELS.MCP, value: "MCP" },
  { label: CATEGORY_LABELS.SITE, value: "SITE" },
];

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const { category: rawCategory } = await searchParams;
  const activeCategory =
    rawCategory && isValidCategory(rawCategory) ? rawCategory : null;

  const products = await prisma.product.findMany({
    where: {
      isPublic: true,
      ...(activeCategory ? { category: activeCategory } : {}),
    },
    orderBy: { sortOrder: "asc" },
    select: {
      slug: true,
      name: true,
      description: true,
      category: true,
      status: true,
      stacks: true,
      images: {
        where: { isThumbnail: true },
        take: 1,
        select: { url: true, alt: true, isThumbnail: true },
      },
    },
  });

  return (
    <div className="space-y-8">
      <PageHero
        title="プロダクト"
        description="個人開発したプロダクトの一覧です。"
      />

      {/* Category filter */}
      <nav className="flex gap-2 flex-wrap">
        {CATEGORY_FILTERS.map(({ label, value }) => {
          const isActive = activeCategory === value;
          const href =
            value === null ? "/products" : `/products?category=${value}`;
          return (
            <Link
              key={label}
              href={href}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? "tech-gradient text-white"
                  : "border border-border hover:bg-muted text-muted-foreground"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Grid */}
      {products.length === 0 ? (
        <p className="text-sm text-muted-foreground py-12 text-center">
          該当するプロダクトはありません。
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.slug}
              slug={product.slug}
              name={product.name}
              description={product.description}
              category={product.category}
              status={product.status}
              stacks={product.stacks}
              thumbnail={product.images[0] ?? null}
            />
          ))}
        </div>
      )}
    </div>
  );
}
