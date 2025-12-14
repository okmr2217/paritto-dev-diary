import { getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/post-card";

export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">記事一覧</h1>
      {posts.length === 0 ? (
        <p className="text-muted-foreground">
          記事はまだありません。content/posts ディレクトリにMarkdownファイルを追加してください。
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
