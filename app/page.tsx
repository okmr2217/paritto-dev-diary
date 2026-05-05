import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { getAllPosts } from "@/lib/posts";
import { prisma } from "@/lib/prisma";
import { STATUS_LABELS, STATUS_COLORS } from "@/lib/product-constants";
import { PostCard } from "@/components/post-card";
import { ReleaseCard } from "@/components/release-card";
import { ArrowRight, Package, Rocket } from "lucide-react";

async function processMarkdown(content: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(content);
  return result.toString();
}

export const metadata: Metadata = {
  title: {
    absolute: "パリッと開発日記",
  },
  description:
    "Next.js を中心としたモダンな技術スタックで、個人開発のリアルな試行錯誤を発信する Web Developer Daichi の開発日記ブログです。",
};

export default async function Home() {
  const posts = getAllPosts();
  const recentPosts = posts.slice(0, 3);

  const [totalProductCount, activeProducts, totalReleaseCount, latestReleases, allProductsForMap] =
    await Promise.all([
      prisma.product.count({ where: { isPublic: true } }),
      prisma.product.findMany({
        where: {
          isPublic: true,
          status: { in: ["RELEASED", "MAINTENANCE", "DEVELOPING"] },
        },
        orderBy: { sortOrder: "asc" },
        take: 6,
        select: {
          slug: true,
          name: true,
          description: true,
          status: true,
          stacks: true,
          iconUrl: true,
          themeColor: true,
        },
      }),
      prisma.release.count({ where: { isDraft: false } }),
      prisma.release.findMany({
        where: { isDraft: false },
        orderBy: { releaseDate: "desc" },
        take: 5,
        select: {
          id: true,
          version: true,
          title: true,
          content: true,
          releaseDate: true,
          type: true,
          product: {
            select: {
              slug: true,
              name: true,
              iconUrl: true,
              themeColor: true,
            },
          },
        },
      }),
      prisma.product.findMany({
        where: { isPublic: true },
        select: { slug: true, name: true, iconUrl: true, themeColor: true },
      }),
    ]);

  const productMap = Object.fromEntries(allProductsForMap.map((p) => [p.slug, p]));

  const serializedReleases = await Promise.all(
    latestReleases.map(async (r) => ({
      ...r,
      contentHtml: r.content ? await processMarkdown(r.content) : "",
      releaseDate: r.releaseDate.toISOString(),
    })),
  );

  return (
    <div className="space-y-10">
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative pt-6 pb-4">
        {/* Decorative gradient orbs */}
        <div className="absolute -top-8 -right-16 w-72 h-72 rounded-full tech-gradient opacity-[0.08] blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-8 w-52 h-52 rounded-full bg-primary opacity-[0.07] blur-3xl pointer-events-none" />

        <div className="relative space-y-8">
          {/* Accent bar */}
          <div className="h-1 w-24 tech-gradient rounded-full" />

          {/* Eyebrow + Headline */}
          <div className="space-y-4">
            <p className="text-xs font-mono text-muted-foreground tracking-[0.2em] uppercase">
              Personal Dev Studio
            </p>
            <h1 className="text-3xl md:text-4xl font-bold font-heading tech-gradient-text leading-[1.15]">
              パリッと開発日記
            </h1>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-lg">
              Next.js を中心としたモダンな技術スタックで、
              個人開発のリアルな試行錯誤を発信しています。
            </p>
            <p className="text-xs text-muted-foreground/70 font-mono">
              Next.js / TypeScript / Tailwind CSS / Supabase / Prisma
            </p>
          </div>

          {/* Profile + Stats */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-accent/30 shrink-0">
                <Image
                  src="/profile.jpg"
                  alt="Daichi"
                  width={44}
                  height={44}
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-bold font-heading">Daichi</p>
                <p className="text-xs text-muted-foreground">Web Developer</p>
              </div>
            </div>

            <div className="hidden sm:block w-px h-9 bg-border" />

            <div className="flex gap-5">
              <div>
                <p className="text-lg font-bold font-heading tech-gradient-text tabular-nums">
                  {posts.length}
                </p>
                <p className="text-xs text-muted-foreground">記事</p>
              </div>
              <div>
                <p className="text-lg font-bold font-heading tech-gradient-text tabular-nums">
                  {totalProductCount}
                </p>
                <p className="text-xs text-muted-foreground">プロダクト</p>
              </div>
              <div>
                <p className="text-lg font-bold font-heading tech-gradient-text tabular-nums">
                  {totalReleaseCount}
                </p>
                <p className="text-xs text-muted-foreground">リリース</p>
              </div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 tech-gradient text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              <Package className="w-4 h-4" />
              プロダクトを見る
            </Link>
            <Link
              href="/releases"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-card border border-border text-sm font-medium rounded-lg hover:border-accent hover:text-accent transition-colors"
            >
              <Rocket className="w-4 h-4" />
              リリースノート
            </Link>
          </div>
        </div>
      </section>

      {/* ── Divider ───────────────────────────────────────── */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* ── Latest Release Notes ──────────────────────────── */}
      {serializedReleases.length > 0 && (
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-heading tech-gradient-text">
              リリースノート
            </h2>
            <Link
              href="/releases"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              すべて見る
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-2">
            {serializedReleases.map((release) => (
              <ReleaseCard
                key={release.id}
                version={release.version}
                type={release.type}
                releaseDate={release.releaseDate}
                title={release.title}
                contentHtml={release.contentHtml}
                showContent
                product={release.product}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Divider ───────────────────────────────────────── */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* ── Active Products ───────────────────────────────── */}
      {activeProducts.length > 0 && (
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-heading tech-gradient-text">
              プロダクト
            </h2>
            <Link
              href="/products"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              すべて見る
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeProducts.map((product) => (
              <Link
                key={product.slug}
                href={`/products/${product.slug}`}
                className="group flex gap-4 p-4 bg-card border border-border rounded-lg card-hover-lift overflow-hidden"
              >
                {/* Icon */}
                <div
                  className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
                  style={{
                    backgroundColor: product.themeColor
                      ? `${product.themeColor}20`
                      : "var(--color-muted)",
                  }}
                >
                  {product.iconUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.iconUrl}
                      alt={product.name}
                      className="w-9 h-9 object-contain"
                    />
                  ) : (
                    <Package
                      className="w-6 h-6 text-muted-foreground opacity-60"
                      style={{ color: product.themeColor ?? undefined }}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[product.status] ?? "bg-gray-100 text-gray-700"}`}
                    >
                      {STATUS_LABELS[product.status] ?? product.status}
                    </span>
                  </div>
                  <h3 className="font-semibold font-heading leading-snug group-hover:tech-gradient-text transition-all duration-200">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  )}
                  {product.stacks.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {product.stacks.slice(0, 4).map((stack) => (
                        <span
                          key={stack}
                          className="text-[10px] px-1.5 py-0.5 bg-muted rounded text-muted-foreground"
                        >
                          {stack}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* Archive link */}
          <p className="text-sm text-muted-foreground">
            過去のプロダクト・休止中のプロジェクトは
            <Link
              href="/products?status=PAUSED"
              className="text-accent hover:underline ml-0.5"
            >
              こちら →
            </Link>
          </p>
        </section>
      )}

      {/* ── Divider ───────────────────────────────────────── */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* ── Recent posts ──────────────────────────────────── */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-heading tech-gradient-text">
            最新記事
          </h2>
          <Link
            href="/blog"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition-colors"
          >
            すべて見る
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-3">
          {recentPosts.map((post) => (
            <PostCard
              key={post.slug}
              post={post}
              productInfo={
                post.productSlug ? productMap[post.productSlug] : undefined
              }
            />
          ))}
        </div>
      </section>

      {/* ── Divider ───────────────────────────────────────── */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* ── Philosophy CTA ────────────────────────────────── */}
      <section>
        <div className="relative p-6 bg-card border border-border rounded-xl overflow-hidden">
          <div className="absolute -top-6 -right-10 w-40 h-40 rounded-full tech-gradient opacity-[0.07] blur-2xl pointer-events-none" />
          <div className="relative space-y-3">
            <div className="h-1 w-12 tech-gradient rounded-full" />
            <h2 className="text-lg font-bold font-heading">設計思想</h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">
              Yarukoto, Peak Log, ツケカンなどのアプリ群に共通する、記録と振り返りの考え方をまとめています。
            </p>
            <Link
              href="/philosophy"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
            >
              読む
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
