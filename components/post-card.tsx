import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import { CATEGORY_LABELS } from "@/lib/post-constants";

type PostCardProps = {
  post: PostMeta;
};

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/posts/${post.slug}`} className="block group">
      <article className="relative p-4 border border-border rounded-lg bg-card overflow-hidden transition-all duration-300 card-hover-lift">
        {/* Accent bar */}
        <div className="absolute top-0 left-0 w-1 h-full tech-gradient opacity-70 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300" />

        <div className="relative pl-3 space-y-2">
          {/* Title + Date */}
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-sm font-bold font-heading group-hover:tech-gradient-text transition-all duration-300 flex-1 leading-snug">
              {post.title}
            </h3>
            <time className="text-xs text-muted-foreground font-mono whitespace-nowrap opacity-70 shrink-0">
              {post.date}
            </time>
          </div>

          {/* Description */}
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
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
