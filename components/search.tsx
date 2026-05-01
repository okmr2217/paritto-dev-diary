"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { PostCard } from "@/components/post-card";
import type { PostMeta } from "@/lib/posts";
import type { PostCategory } from "@/lib/post-constants";
import { CATEGORY_LABELS } from "@/lib/post-constants";

type SearchProps = {
  posts: PostMeta[];
};

const ALL_CATEGORY = "all" as const;
type CategoryFilter = PostCategory | typeof ALL_CATEGORY;

const VALID_CATEGORIES: PostCategory[] = ["A", "B", "C", "D"];

const CATEGORY_FILTERS: { value: CategoryFilter; label: string }[] = [
  { value: ALL_CATEGORY, label: "すべて" },
  { value: "A", label: CATEGORY_LABELS["A"] },
  { value: "B", label: CATEGORY_LABELS["B"] },
  { value: "C", label: CATEGORY_LABELS["C"] },
  { value: "D", label: CATEGORY_LABELS["D"] },
];

export function Search({ posts }: SearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const rawCategory = searchParams.get("category");
  const activeCategory: CategoryFilter =
    rawCategory && (VALID_CATEGORIES as string[]).includes(rawCategory)
      ? (rawCategory as PostCategory)
      : ALL_CATEGORY;

  const handleCategoryChange = (value: CategoryFilter) => {
    const params = new URLSearchParams();
    if (value !== ALL_CATEGORY) params.set("category", value);
    const qs = params.toString();
    startTransition(() => {
      router.replace(`/blog${qs ? `?${qs}` : ""}`, { scroll: false });
    });
  };

  const filteredPosts = posts.filter(
    (post) =>
      activeCategory === ALL_CATEGORY || post.category === activeCategory,
  );

  return (
    <div className={`transition-opacity ${isPending ? "opacity-50" : ""}`}>
      {/* Category filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORY_FILTERS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => handleCategoryChange(value)}
            className={`relative px-3 py-1.5 text-xs font-medium font-heading rounded border overflow-hidden transition-all duration-200 cursor-pointer ${
              activeCategory === value
                ? "border-transparent text-foreground"
                : "border-border text-muted-foreground hover:text-foreground hover:border-border/80"
            }`}
          >
            {activeCategory === value && (
              <span className="absolute inset-0 tech-gradient opacity-20" />
            )}
            <span className="relative">{label}</span>
          </button>
        ))}
      </div>

      {filteredPosts.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <p className="text-muted-foreground font-heading">
            {activeCategory !== ALL_CATEGORY
              ? "該当する記事が見つかりませんでした。"
              : "記事はまだありません。"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredPosts.map((post, index) => (
            <div
              key={post.slug}
              className="animate-in fade-in slide-in-from-bottom-4"
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: "both",
              }}
            >
              <PostCard post={post} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
