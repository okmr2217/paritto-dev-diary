import { getAllPosts } from "@/lib/posts";
import { Search } from "@/components/search";

export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">記事一覧</h1>
      <Search posts={posts} />
    </div>
  );
}
