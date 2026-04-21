import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import { Search } from "@/components/search";
import { PageHero } from "@/components/page-hero";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Next.js・React・TypeScript などモダンなフロントエンド技術を使った個人開発の記録・技術メモを発信しています。",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="space-y-8 pt-6">
      <PageHero
        title="Blog"
        description="Next.jsを中心としたモダンな技術スタックによる個人開発について発信しています。"
        icon={BookOpen}
      />
      <Search posts={posts} />
    </div>
  );
}
