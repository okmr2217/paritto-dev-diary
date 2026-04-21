import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Github, ChevronDown } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/post-card";
import { ProductImageSlider } from "@/components/product/product-image-slider";
import {
  STATUS_LABELS,
  CATEGORY_LABELS,
  STATUS_COLORS,
  CATEGORY_COLORS,
  RELEASE_TYPE_LABELS,
} from "@/lib/product-constants";

export const revalidate = 60;

const RELEASE_TYPE_COLORS: Record<string, string> = {
  MAJOR: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  MINOR: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  PATCH: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  HOTFIX:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

const STATUS_DOT_COLORS: Record<string, string> = {
  IDEA: "bg-slate-400",
  DEVELOPING: "bg-blue-500",
  RELEASED: "bg-green-500",
  MAINTENANCE: "bg-yellow-500",
  PAUSED: "bg-red-500",
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  return prisma.product.findFirst({
    where: { slug, isPublic: true },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      releases: {
        where: { isDraft: false },
        orderBy: { releaseDate: "desc" },
      },
      statusHistory: { orderBy: { createdAt: "desc" } },
    },
  });
}

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    where: { isPublic: true },
    select: { slug: true },
  });
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: "制作物が見つかりません" };
  }

  return {
    title: product.name,
    description:
      product.description ??
      `${product.name} の詳細ページ。概要・ステータス・リリース履歴を確認できます。`,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const allPosts = getAllPosts();
  const relatedPosts = allPosts.filter((post) => post.productSlug === slug);

  const hasImages = product.images.length > 0;

  return (
    <div className="space-y-12 pt-6">
      {/* Accent bar */}
      <div className="h-1 w-24 tech-gradient rounded-full" />

      {/* 1. Main section: responsive grid
          PC: image (2/3) | product info (1/3)
          Mobile: image → product info (vertical) */}
      <section
        className={
          hasImages
            ? "grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 md:items-start"
            : "space-y-6"
        }
      >
        {/* Image slider */}
        {hasImages && (
          <div className="md:col-span-2">
            <ProductImageSlider
              images={product.images}
              productName={product.name}
            />
          </div>
        )}

        {/* Product info */}
        <div
          className={`space-y-5 ${hasImages ? "md:col-span-1" : ""} pb-8 border-b border-border`}
        >
          {/* Title + Badges */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${CATEGORY_COLORS[product.category] ?? "bg-gray-100 text-gray-700"}`}
              >
                {CATEGORY_LABELS[product.category] ?? product.category}
              </span>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[product.status] ?? "bg-gray-100 text-gray-700"}`}
              >
                {STATUS_LABELS[product.status] ?? product.status}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold font-heading tech-gradient-text leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <p className="text-base font-semibold text-foreground leading-relaxed">
              {product.description}
            </p>
            {product.longDescription && (
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {product.longDescription}
              </p>
            )}
          </div>

          {/* CTA Buttons */}
          {(product.productUrl || product.repositoryUrl) && (
            <div className="flex gap-3 flex-wrap">
              {product.productUrl && (
                <a
                  href={product.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  アプリを開く
                  <ExternalLink size={14} />
                </a>
              )}
              {product.repositoryUrl && (
                <a
                  href={product.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  <Github size={14} />
                  リポジトリを見る
                </a>
              )}
            </div>
          )}

          {/* Tech Stacks */}
          {product.stacks.length > 0 && (
            <div className="flex gap-1.5 flex-wrap">
              {product.stacks.map((stack) => (
                <span
                  key={stack}
                  className="inline-flex items-center rounded px-1.5 py-0.5 text-xs bg-muted text-muted-foreground font-mono"
                >
                  {stack}
                </span>
              ))}
            </div>
          )}

          {/* Release date (inside info panel) */}
          {product.releaseDate && (
            <div className="inline-flex items-center gap-3 rounded-lg bg-muted px-4 py-3 text-sm">
              <span className="text-muted-foreground">リリース日</span>
              <span className="text-foreground font-medium">
                {new Date(product.releaseDate).toLocaleDateString("ja-JP")}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* 2. Release Notes (Accordion) */}
      {product.releases.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold font-heading">リリースノート</h2>
          <div className="space-y-2">
            {product.releases.map((release, index) => (
              <details
                key={release.id}
                open={index === 0}
                className="group rounded-lg border border-border bg-card overflow-hidden"
              >
                <summary className="flex items-center gap-3 flex-wrap px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors [list-style:none] [&::-webkit-details-marker]:hidden">
                  <span className="font-mono font-bold text-foreground text-sm">
                    {release.version}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${RELEASE_TYPE_COLORS[release.type] ?? "bg-gray-100 text-gray-700"}`}
                  >
                    {RELEASE_TYPE_LABELS[release.type] ?? release.type}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(release.releaseDate).toLocaleDateString("ja-JP")}
                  </span>
                  <span className="font-medium text-foreground text-sm">
                    {release.title}
                  </span>
                  <ChevronDown
                    size={16}
                    className="ml-auto shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                  />
                </summary>
                <div className="px-4 py-3 border-t border-border">
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {release.content}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* 3. Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold font-heading">関連記事</h2>
          <div className="space-y-3">
            {relatedPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* 4. Status History */}
      {product.statusHistory.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold font-heading">ステータス履歴</h2>
          <div className="relative pl-6 space-y-6">
            <div className="absolute left-2 top-0 bottom-0 w-px bg-border" />

            {product.statusHistory.map((entry) => (
              <div key={entry.id} className="relative">
                <div
                  className={`absolute -left-4 top-1 w-2.5 h-2.5 rounded-full ${STATUS_DOT_COLORS[entry.to] ?? "bg-gray-400"}`}
                />
                <div className="space-y-1">
                  <p className="text-sm text-foreground">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium mr-1 ${STATUS_COLORS[entry.to] ?? "bg-gray-100 text-gray-700"}`}
                    >
                      {STATUS_LABELS[entry.to] ?? entry.to}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      ← {STATUS_LABELS[entry.from] ?? entry.from}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(entry.createdAt).toLocaleString("ja-JP")}
                  </p>
                  {entry.note && (
                    <p className="text-sm text-muted-foreground">
                      {entry.note}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Back Link */}
      <div>
        <Link
          href="/products"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← 制作物一覧に戻る
        </Link>
      </div>
    </div>
  );
}
