import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import { Search } from "@/components/search";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "ブログ",
  description: "Next.jsを中心としたモダンな技術スタックによる個人開発について発信しています。",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="space-y-8">
      <PageHero
        title="ブログ"
        description="Next.jsを中心としたモダンな技術スタックによる個人開発について発信しています。"
      />
      <Search posts={posts} />
    </div>
  );
}
