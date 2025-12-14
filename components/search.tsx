"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { PostCard } from "@/components/post-card";
import type { PostMeta } from "@/lib/posts";
import { Search as SearchIcon } from "lucide-react";

type SearchProps = {
  posts: PostMeta[];
};

export function Search({ posts }: SearchProps) {
  const [query, setQuery] = useState("");

  const filteredPosts = posts.filter((post) => {
    const searchTarget = `${post.title} ${post.description} ${post.tags.join(" ")}`.toLowerCase();
    return searchTarget.includes(query.toLowerCase());
  });

  return (
    <div>
      <div className="relative mb-6">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="記事を検索..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      {filteredPosts.length === 0 ? (
        <p className="text-muted-foreground">
          {query ? "検索結果が見つかりませんでした。" : "記事はまだありません。"}
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
