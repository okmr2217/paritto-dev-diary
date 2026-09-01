import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { prisma } from "@/lib/prisma";
import { STATUS_LABELS, STATUS_COLORS } from "@/lib/product-constants";
import { PostCard } from "@/components/post-card";
import { PROFILE_LINKS } from "@/lib/constants";

export const metadata: Metadata = {
  title: {
    absolute: "paritto.dev",
  },
  description:
    "Next.js を中心としたモダンな技術スタックで、個人開発のリアルな試行錯誤を発信する Web Developer Daichi の開発日記ブログです。",
};

const PROFILE_FACTS = [
  { label: "名前", value: "Daichi" },
  { label: "年齢", value: "19" },
  { label: "都市", value: "名古屋" },
  { label: "趣味", value: "都市地理、個人開発、チェス" },
];

export default async function Home() {
  const posts = getAllPosts();
  const recentPosts = posts.slice(0, 8);

  const recentProducts = await prisma.product.findMany({
    where: { isPublic: true },
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
  });

  const allProductsForMap = await prisma.product.findMany({
    where: { isPublic: true },
    select: { slug: true, name: true, iconUrl: true, themeColor: true },
  });
  const productMap = Object.fromEntries(allProductsForMap.map((p) => [p.slug, p]));

  return (
    <div className="space-y-14">
      {/* ── Hero / self-intro ────────────────────────────────── */}
      <section className="pt-6 space-y-8">
        <div className="space-y-3">
          <p className="text-xs font-mono text-muted-foreground tracking-[0.2em] uppercase">
            paritto.dev
          </p>
          <h1 className="text-3xl md:text-4xl font-bold font-heading leading-[1.15]">
            Daichi の開発日記
          </h1>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-lg">
            Next.js を中心としたモダンな技術スタックで、
            個人開発のリアルな試行錯誤を発信しています。
          </p>
        </div>

        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4 border-t border-b border-border py-5">
          {PROFILE_FACTS.map(({ label, value }) => (
            <div key={label}>
              <dt className="text-xs text-muted-foreground font-mono">{label}</dt>
              <dd className="text-sm font-medium mt-0.5">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-wrap gap-4 text-sm">
          <a
            href={PROFILE_LINKS.contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-muted-foreground transition-colors underline underline-offset-4"
          >
            GitHub
          </a>
          <a
            href={PROFILE_LINKS.contact.x}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-muted-foreground transition-colors underline underline-offset-4"
          >
            X
          </a>
        </div>
      </section>

      {/* ── Divider ───────────────────────────────────────── */}
      <div className="h-px bg-border" />

      {/* ── Products ──────────────────────────────────────── */}
      {recentProducts.length > 0 && (
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-heading">Products</h2>
            <Link
              href="/products"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              すべて見る →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recentProducts.map((product) => (
              <Link
                key={product.slug}
                href={`/products/${product.slug}`}
                className="group flex gap-4 p-4 bg-card border border-border rounded-lg hover:border-foreground/30 transition-colors overflow-hidden"
              >
                <div
                  className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 flex items-center justify-center text-sm font-semibold font-heading"
                  style={{
                    backgroundColor: product.themeColor
                      ? `${product.themeColor}20`
                      : "var(--color-muted)",
                    color: product.themeColor ?? undefined,
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
                    product.name.charAt(0)
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[product.status] ?? "bg-gray-100 text-gray-700"}`}
                    >
                      {STATUS_LABELS[product.status] ?? product.status}
                    </span>
                  </div>
                  <h3 className="font-semibold font-heading leading-snug">
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
        </section>
      )}

      {/* ── Divider ───────────────────────────────────────── */}
      <div className="h-px bg-border" />

      {/* ── Recent posts ──────────────────────────────────── */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-heading">Blog</h2>
          <Link
            href="/blog"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            すべて見る →
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
    </div>
  );
}
