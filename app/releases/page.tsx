import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/page-hero";
import { ReleaseCard } from "@/components/release-card";
import { ReleasesChart } from "./releases-chart";
import { ReleasesFilter } from "./releases-filter";
import { Rocket, Rss, ChevronLeft, ChevronRight } from "lucide-react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Releases",
  description:
    "プロダクトのリリースノート一覧。バージョン・種別・変更内容を時系列で確認できます。",
};

const PAGE_SIZE = 20;

type SearchParams = { [key: string]: string | string[] | undefined };

async function processMarkdown(content: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(content);
  return result.toString();
}

function buildPageUrl(
  productFilter: string | null,
  typeFilter: string | null,
  page: number,
): string {
  const params = new URLSearchParams();
  if (productFilter) params.set("product", productFilter);
  if (typeFilter) params.set("type", typeFilter);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return `/releases${qs ? `?${qs}` : ""}`;
}

export default async function ReleasesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const productFilter =
    typeof params.product === "string" ? params.product : null;
  const typeFilter = typeof params.type === "string" ? params.type : null;
  const page =
    typeof params.page === "string"
      ? Math.max(1, parseInt(params.page) || 1)
      : 1;

  const [allReleases, products] = await Promise.all([
    prisma.release.findMany({
      where: { isDraft: false },
      orderBy: { releaseDate: "desc" },
      select: {
        id: true,
        version: true,
        title: true,
        content: true,
        releaseDate: true,
        type: true,
        product: {
          select: { slug: true, name: true, iconUrl: true, themeColor: true },
        },
      },
    }),
    prisma.product.findMany({
      where: { isPublic: true },
      select: { slug: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  // Build chart data for last 12 months
  const now = new Date();
  const chartData = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
    const key = `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = `${d.getMonth() + 1}月`;
    return { month: key, label, count: 0 };
  });

  for (const r of allReleases) {
    const d = new Date(r.releaseDate);
    const key = `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}`;
    const entry = chartData.find((c) => c.month === key);
    if (entry) entry.count++;
  }

  // Stats
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const recentCount = allReleases.filter(
    (r) => new Date(r.releaseDate) >= thirtyDaysAgo,
  ).length;
  const totalCount = allReleases.length;

  // Filter
  const filtered = allReleases.filter((r) => {
    if (productFilter && r.product.slug !== productFilter) return false;
    if (typeFilter && r.type !== typeFilter) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const safeCurrentPage = Math.min(Math.max(1, page), totalPages || 1);
  const pageReleases = filtered.slice(
    (safeCurrentPage - 1) * PAGE_SIZE,
    safeCurrentPage * PAGE_SIZE,
  );

  // Process markdown server-side
  const releasesWithHtml = await Promise.all(
    pageReleases.map(async (r) => ({
      ...r,
      contentHtml: r.content ? await processMarkdown(r.content) : "",
      releaseDate: r.releaseDate.toISOString(),
    })),
  );

  return (
    <div className="space-y-8 pt-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <PageHero
          title="Releases"
          description="プロダクトのリリースノート一覧"
          icon={Rocket}
        />
        <a
          href="/releases/rss.xml"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent transition-colors mt-2 shrink-0"
          aria-label="RSS フィード"
        >
          <Rss className="w-4 h-4" />
          <span className="hidden sm:inline">RSS</span>
        </a>
      </div>

      {/* Chart + Stats */}
      <ReleasesChart
        chartData={chartData}
        recentCount={recentCount}
        totalCount={totalCount}
      />

      {/* Filters */}
      <Suspense fallback={null}>
        <ReleasesFilter
          products={products}
          currentProduct={productFilter}
          currentType={typeFilter}
        />
      </Suspense>

      {/* Count */}
      <p className="text-sm text-muted-foreground">
        {filtered.length} 件のリリース
        {(productFilter || typeFilter) && (
          <Link
            href="/releases"
            className="ml-2 text-accent hover:underline text-xs"
          >
            フィルターをクリア
          </Link>
        )}
      </p>

      {/* Entry list */}
      <div className="space-y-3">
        {releasesWithHtml.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            条件に一致するリリースはありません
          </div>
        ) : (
          releasesWithHtml.map((release) => (
            <ReleaseCard
              key={release.id}
              version={release.version}
              type={release.type}
              releaseDate={release.releaseDate}
              title={release.title}
              contentHtml={release.contentHtml}
              showContent
              product={{
                slug: release.product.slug,
                name: release.product.name,
                iconUrl: release.product.iconUrl,
                themeColor: release.product.themeColor,
              }}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 py-4">
          {safeCurrentPage > 1 ? (
            <Link
              href={buildPageUrl(productFilter, typeFilter, safeCurrentPage - 1)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm border border-border rounded-lg hover:border-accent hover:text-accent transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              前へ
            </Link>
          ) : (
            <span className="flex items-center gap-1 px-3 py-1.5 text-sm border border-border rounded-lg text-muted-foreground opacity-40">
              <ChevronLeft className="w-4 h-4" />
              前へ
            </span>
          )}

          <span className="text-sm text-muted-foreground tabular-nums">
            {safeCurrentPage} / {totalPages}
          </span>

          {safeCurrentPage < totalPages ? (
            <Link
              href={buildPageUrl(productFilter, typeFilter, safeCurrentPage + 1)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm border border-border rounded-lg hover:border-accent hover:text-accent transition-colors"
            >
              次へ
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <span className="flex items-center gap-1 px-3 py-1.5 text-sm border border-border rounded-lg text-muted-foreground opacity-40">
              次へ
              <ChevronRight className="w-4 h-4" />
            </span>
          )}
        </div>
      )}
    </div>
  );
}
