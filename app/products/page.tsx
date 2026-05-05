import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/page-hero";
import { ProductsClient } from "./products-client";
import { Package } from "lucide-react";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Products",
  description:
    "個人開発した Web アプリやツールの一覧。各プロダクトの概要・ステータス・リリース履歴を確認できます。",
};

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: { isPublic: true },
    orderBy: { sortOrder: "asc" },
    select: {
      slug: true,
      name: true,
      description: true,
      category: true,
      status: true,
      iconUrl: true,
      themeColor: true,
      sortOrder: true,
      createdAt: true,
      releases: {
        where: { isDraft: false },
        orderBy: { releaseDate: "desc" },
        take: 1,
        select: { version: true, releaseDate: true },
      },
    },
  });

  const stats = {
    total: products.length,
    released: products.filter((p) =>
      ["RELEASED", "MAINTENANCE"].includes(p.status),
    ).length,
    developing: products.filter((p) =>
      ["DEVELOPING", "IDEA"].includes(p.status),
    ).length,
  };

  const serializedProducts = products.map((p) => ({
    slug: p.slug,
    name: p.name,
    description: p.description,
    category: p.category as string,
    status: p.status as string,
    iconUrl: p.iconUrl ?? null,
    themeColor: p.themeColor ?? null,
    sortOrder: p.sortOrder,
    latestVersion: p.releases[0]?.version ?? null,
    latestVersionDate: p.releases[0]?.releaseDate.toISOString() ?? null,
    createdAt: p.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-8 pt-6">
      {/* Header with stats */}
      <div className="space-y-4">
        <PageHero
          title="Products"
          description="個人開発した制作物の一覧です。"
          icon={Package}
        />
        <div className="flex gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{stats.total}</span>
            プロダクト
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-xs text-green-700 dark:text-green-400">
            <span className="font-semibold">{stats.released}</span>
            リリース済
          </span>
          {stats.developing > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-xs text-blue-700 dark:text-blue-400">
              <span className="font-semibold">{stats.developing}</span>
              開発中
            </span>
          )}
        </div>
      </div>

      {/* Filter and grid (client) — break out of padding for wider layout */}
      <div className="-mx-4 sm:-mx-6 px-4 sm:px-6">
        <Suspense fallback={null}>
          <ProductsClient products={serializedProducts} />
        </Suspense>
      </div>

      {/* Past works archive */}
      <Link
        href="/posts/past-works"
        className="group flex items-center justify-between rounded-xl border border-border bg-muted/30 px-6 py-4 transition-colors hover:border-accent/50 hover:bg-muted/60"
      >
        <div className="space-y-0.5">
          <p className="text-sm font-medium">過去のプロダクト一覧</p>
          <p className="text-xs text-muted-foreground">
            Prisma 移行前に開発したサービスのアーカイブ
          </p>
        </div>
        <span className="text-muted-foreground transition-transform group-hover:translate-x-1">
          →
        </span>
      </Link>
    </div>
  );
}
