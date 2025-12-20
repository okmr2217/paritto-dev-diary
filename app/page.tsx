import { getAllPosts } from "@/lib/posts";
import { Search } from "@/components/search";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "記事一覧",
  description: "技術記事の一覧ページです。",
};

export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="container mx-auto max-w-176 p-4 pb-12">
      <h1 className="mb-8 text-3xl font-bold">記事一覧</h1>
      <Search posts={posts} />
    </div>
  );
}
