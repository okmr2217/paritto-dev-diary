import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Package } from "lucide-react";
import { ArticleContent } from "@/components/article-content";
import { PageHero } from "@/components/page-hero";
import { prisma } from "@/lib/prisma";
import { STATUS_COLORS, STATUS_LABELS } from "@/lib/product-constants";

const DESCRIPTION =
  "Yarukoto, Peak Log, ツケカン, Stockee などのアプリ群に通底する設計思想。何を、なぜ、どのように記録するのか。";
const URL = "https://paritto-dev-diary.vercel.app/philosophy";

export const metadata: Metadata = {
  title: "設計思想 | パリッと開発日記",
  description: DESCRIPTION,
  openGraph: {
    title: "設計思想 | パリッと開発日記",
    description: DESCRIPTION,
    type: "article",
    url: URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "設計思想 | パリッと開発日記",
    description: DESCRIPTION,
  },
};

async function getPhilosophyContent(): Promise<string> {
  const filePath = path.join(process.cwd(), "content/philosophy.md");
  const raw = fs.readFileSync(filePath, "utf8");
  const { content } = matter(raw);

  const processed = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeStringify)
    .process(content);

  return processed.toString();
}

export default async function PhilosophyPage() {
  const [contentHtml, products] = await Promise.all([
    getPhilosophyContent(),
    prisma.product.findMany({
      where: { isPublic: true, status: { in: ["RELEASED", "MAINTENANCE", "DEVELOPING"] } },
      orderBy: { sortOrder: "asc" },
      select: {
        slug: true,
        name: true,
        description: true,
        status: true,
        iconUrl: true,
        themeColor: true,
      },
    }),
  ]);

  return (
    <div className="space-y-12 pt-6">
      <PageHero
        title="設計思想"
        description="Yarukoto / Peak Log / ツケカン / Stockee / Launchpad に共通する、記録と振り返りの考え方。"
        icon={BookOpen}
      />

      <div className="max-w-2xl mx-auto">
        <ArticleContent html={contentHtml} />
      </div>

      {products.length > 0 && (
        <>
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          <section className="space-y-5">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-lg font-bold font-heading shrink-0">関連プロダクト</h2>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {products.map((product) => (
                <Link
                  key={product.slug}
                  href={`/products/${product.slug}`}
                  className="group flex gap-4 p-4 bg-card border border-border rounded-lg hover:border-accent transition-all duration-200"
                >
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

                  <div className="flex-1 min-w-0 space-y-1.5">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[product.status] ?? "bg-gray-100 text-gray-700"}`}
                    >
                      {STATUS_LABELS[product.status] ?? product.status}
                    </span>
                    <h3 className="font-semibold font-heading leading-snug group-hover:text-accent transition-colors">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
