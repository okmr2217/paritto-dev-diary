import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { prisma } from "@/lib/prisma";
import {
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  STATUS_LABELS,
  STATUS_COLORS,
  RELEASE_TYPE_LABELS,
} from "@/lib/product-constants";
import { PostCard } from "@/components/post-card";
import { ArrowRight, User, Package } from "lucide-react";

export const metadata: Metadata = {
  title: {
    absolute: "パリッと開発日記",
  },
  description:
    "Next.js を中心としたモダンな技術スタックで、個人開発のリアルな試行錯誤を発信する Web Developer Daichi の開発日記ブログです。",
};

const RELEASE_TYPE_COLORS: Record<string, string> = {
  MAJOR: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  MINOR: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  PATCH: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  HOTFIX:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

export default async function Home() {
  const posts = getAllPosts();
  const recentPosts = posts.slice(0, 3);

  const [productCount, featuredProducts, latestReleases] = await Promise.all([
    prisma.product.count({ where: { isPublic: true } }),
    prisma.product.findMany({
      where: { isPublic: true, isFeatured: true },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        slug: true,
        name: true,
        description: true,
        category: true,
        status: true,
        images: {
          where: { isThumbnail: true },
          take: 1,
          select: { url: true, alt: true },
        },
      },
    }),
    prisma.release.findMany({
      where: { isDraft: false },
      orderBy: { releaseDate: "desc" },
      take: 3,
      select: {
        id: true,
        version: true,
        title: true,
        releaseDate: true,
        type: true,
        product: {
          select: { slug: true, name: true },
        },
      },
    }),
  ]);

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
              Personal Dev Blog
            </p>
            <h1 className="text-3xl md:text-4xl font-bold font-heading tech-gradient-text leading-[1.15]">
              パリッと開発日記
            </h1>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-lg">
              Next.js を中心としたモダンな技術スタックで、
              個人開発のリアルな試行錯誤を発信しています。
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
                  {productCount}
                </p>
                <p className="text-xs text-muted-foreground">制作物</p>
              </div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-5 py-2.5 tech-gradient text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              <User className="w-4 h-4" />
              自己紹介を見る
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-card border border-border text-sm font-medium rounded-lg hover:border-accent hover:text-accent transition-colors"
            >
              <Package className="w-4 h-4" />
              制作物一覧
            </Link>
          </div>
        </div>
      </section>

      {/* ── Divider ───────────────────────────────────────── */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* ── Latest Release Notes ──────────────────────────── */}
      {latestReleases.length > 0 && (
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-heading tech-gradient-text">
              最新リリースノート
            </h2>
            <Link
              href="/products"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              すべて見る
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-2">
            {latestReleases.map((release) => (
              <Link
                key={release.id}
                href={`/products/${release.product.slug}`}
                className="group flex items-center gap-3 flex-wrap p-3 bg-card border border-border rounded-lg hover:border-accent/50 transition-colors"
              >
                <span className="font-mono font-bold text-sm text-foreground">
                  {release.version}
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${RELEASE_TYPE_COLORS[release.type] ?? "bg-gray-100 text-gray-700"}`}
                >
                  {RELEASE_TYPE_LABELS[release.type] ?? release.type}
                </span>
                <span className="text-xs text-muted-foreground shrink-0">
                  {new Date(release.releaseDate).toLocaleDateString("ja-JP")}
                </span>
                <span className="text-sm text-foreground font-medium group-hover:text-accent transition-colors flex-1 min-w-0 truncate">
                  {release.title}
                </span>
                <span className="text-xs text-muted-foreground shrink-0 bg-muted px-2 py-0.5 rounded">
                  {release.product.name}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-accent" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Divider ───────────────────────────────────────── */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* ── Featured Products ─────────────────────────────── */}
      {featuredProducts.length > 0 && (
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-heading tech-gradient-text">
              代表的なプロダクト
            </h2>
            <Link
              href="/products"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              すべて見る
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {featuredProducts.map((product) => (
              <Link
                key={product.slug}
                href={`/products/${product.slug}`}
                className="group flex gap-4 p-4 bg-card border border-border rounded-lg card-hover-lift overflow-hidden"
              >
                {/* Thumbnail */}
                <div className="relative w-28 h-28 rounded-lg overflow-hidden bg-muted shrink-0">
                  {product.images[0] ? (
                    <Image
                      src={product.images[0].url}
                      alt={product.images[0].alt ?? product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="112px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground text-xs">
                      No Image
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex gap-1.5 flex-wrap">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_COLORS[product.category] ?? "bg-gray-100 text-gray-700"}`}
                    >
                      {CATEGORY_LABELS[product.category] ?? product.category}
                    </span>
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
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  )}
                </div>

                <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 self-center transition-transform duration-200 group-hover:translate-x-1 group-hover:text-accent" />
              </Link>
            ))}
          </div>
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
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
