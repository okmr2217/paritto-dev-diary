import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAllPosts } from "@/lib/posts";
import { PageHero } from "@/components/page-hero";
import { PostCard } from "@/components/post-card";
import {
  STATUS_LABELS,
  CATEGORY_LABELS,
  STATUS_COLORS,
  CATEGORY_COLORS,
  RELEASE_TYPE_LABELS,
} from "@/lib/product-constants";

export const revalidate = 60;

const RELEASE_TYPE_COLORS: Record<string, string> = {
  MAJOR: "bg-red-100 text-red-700",
  MINOR: "bg-blue-100 text-blue-700",
  PATCH: "bg-green-100 text-green-700",
  HOTFIX: "bg-orange-100 text-orange-700",
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: "プロダクトが見つかりません" };
  }

  return {
    title: product.name,
    description: product.description,
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

  return (
    <div className="space-y-12">
      {/* 1. Page header */}
      <PageHero title={product.name}>
        <div className="flex gap-2 flex-wrap">
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
      </PageHero>

      {/* 2. Image gallery */}
      {product.images.length > 0 && (
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {product.images.map((image) => (
            <div
              key={image.id}
              className="relative aspect-video rounded-lg overflow-hidden bg-muted"
            >
              <Image
                src={image.url}
                alt={image.alt ?? product.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
          ))}
        </section>
      )}

      {/* 3. Overview section */}
      <section className="space-y-6">
        <div className="space-y-3">
          <p className="text-foreground leading-relaxed">{product.description}</p>
          {product.longDescription && (
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {product.longDescription}
            </p>
          )}
        </div>

        <dl className="space-y-2 text-sm">
          {product.releaseDate && (
            <div className="flex gap-4">
              <dt className="text-muted-foreground w-24 shrink-0">リリース日</dt>
              <dd className="text-foreground">
                {new Date(product.releaseDate).toLocaleDateString("ja-JP")}
              </dd>
            </div>
          )}
          {product.productUrl && (
            <div className="flex gap-4">
              <dt className="text-muted-foreground w-24 shrink-0">URL</dt>
              <dd>
                <a
                  href={product.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline break-all"
                >
                  {product.productUrl}
                </a>
              </dd>
            </div>
          )}
          {product.repositoryUrl && (
            <div className="flex gap-4">
              <dt className="text-muted-foreground w-24 shrink-0">リポジトリ</dt>
              <dd>
                <a
                  href={product.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline break-all"
                >
                  {product.repositoryUrl}
                </a>
              </dd>
            </div>
          )}
        </dl>

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
      </section>

      {/* 4. Related posts */}
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

      {/* 5. Release notes */}
      {product.releases.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold font-heading">リリースノート</h2>
          <div className="space-y-4">
            {product.releases.map((release) => (
              <div
                key={release.id}
                className="rounded-lg border border-border bg-card p-4 space-y-2"
              >
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-mono font-bold text-foreground">
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
                </div>
                <p className="font-medium text-foreground">{release.title}</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {release.content}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. Status history */}
      {product.statusHistory.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold font-heading">ステータス履歴</h2>
          <div className="relative pl-6 space-y-6">
            {/* Vertical line */}
            <div className="absolute left-2 top-0 bottom-0 w-px bg-border" />

            {product.statusHistory.map((entry) => (
              <div key={entry.id} className="relative">
                {/* Dot */}
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
                    <p className="text-sm text-muted-foreground">{entry.note}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. Footer link */}
      <div>
        <Link
          href="/products"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← プロダクト一覧に戻る
        </Link>
      </div>
    </div>
  );
}
