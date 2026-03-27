import Image from "next/image";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { prisma } from "@/lib/prisma";
import {
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  STATUS_LABELS,
  STATUS_COLORS,
} from "@/lib/product-constants";
import { PostCard } from "@/components/post-card";
import { ArrowRight, User, Package } from "lucide-react";

export default async function Home() {
  const posts = getAllPosts();
  const recentPosts = posts.slice(0, 3);

  const [productCount, recentProducts] = await Promise.all([
    prisma.product.count({ where: { isPublic: true } }),
    prisma.product.findMany({
      where: { isPublic: true },
      orderBy: { sortOrder: "asc" },
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
  ]);

  return (
    <div className="space-y-10">
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative pt-8 pb-4">
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
            <h1 className="text-4xl md:text-5xl font-bold font-heading tech-gradient-text leading-[1.15]">
              パリッと開発日記
            </h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg">
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
                <p className="text-xl font-bold font-heading tech-gradient-text tabular-nums">
                  {posts.length}
                </p>
                <p className="text-xs text-muted-foreground">記事</p>
              </div>
              <div>
                <p className="text-xl font-bold font-heading tech-gradient-text tabular-nums">
                  {productCount}
                </p>
                <p className="text-xs text-muted-foreground">プロダクト</p>
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
              プロダクト一覧
            </Link>
          </div>
        </div>
      </section>

      {/* ── Divider ───────────────────────────────────────── */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* ── Recent products ───────────────────────────────── */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-heading tech-gradient-text">
            最新プロダクト
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
          {recentProducts.map((product) => (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              className="group flex gap-4 p-4 bg-card border border-border rounded-lg card-hover-lift overflow-hidden"
            >
              {/* Thumbnail */}
              <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
                {product.images[0] ? (
                  <Image
                    src={product.images[0].url}
                    alt={product.images[0].alt ?? product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="80px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground text-xs">
                    No Image
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 space-y-1.5">
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
                <h3 className="font-semibold font-heading text-sm leading-snug group-hover:tech-gradient-text transition-all duration-200">
                  {product.name}
                </h3>
                {product.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                )}
              </div>

              <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 self-center transition-transform duration-200 group-hover:translate-x-1 group-hover:text-accent" />
            </Link>
          ))}
        </div>
      </section>

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
