import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import { CATEGORY_LABELS } from "@/lib/post-constants";

type PostCardProps = {
  post: PostMeta;
};

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/posts/${post.slug}`} className="block">
      <article className="relative px-6 pt-5 pb-4 border border-border rounded-xl bg-card overflow-hidden transition-shadow duration-300 hover:shadow-lg">
        <div className="space-y-3">
          {/* Title + Date */}
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-semibold font-heading flex-1 leading-snug">
              {post.title}
            </h3>
            <time className="text-xs text-muted-foreground font-mono whitespace-nowrap opacity-70 shrink-0">
              {post.date}
            </time>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {post.description}
          </p>

          {/* Category */}
          <div>
            <span className="relative px-2 py-0.5 text-xs font-medium font-heading rounded border border-transparent overflow-hidden inline-block">
              <span className="absolute inset-0 tech-gradient opacity-15" />
              <span className="relative text-foreground">
                {CATEGORY_LABELS[post.category]}
              </span>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
