import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllPosts } from "@/lib/posts";
import { Search } from "@/components/search";
import { PageHero } from "@/components/page-hero";
import { BookOpen } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Next.js・React・TypeScript などモダンなフロントエンド技術を使った個人開発の記録・技術メモを発信しています。",
};

export default async function BlogPage() {
  const posts = getAllPosts();
  const products = await prisma.product.findMany({
    where: { isPublic: true },
    select: { slug: true, name: true, iconUrl: true, themeColor: true },
  });
  const productMap = Object.fromEntries(products.map((p) => [p.slug, p]));

  return (
    <div className="space-y-8 pt-6">
      <PageHero
        title="Blog"
        description="Next.jsを中心としたモダンな技術スタックによる個人開発について発信しています。"
        icon={BookOpen}
      />
      <Suspense fallback={null}>
        <Search posts={posts} productMap={productMap} />
      </Suspense>
    </div>
  );
}
