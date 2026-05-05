import Link from "next/link";
import { Package } from "lucide-react";
import type { PostMeta } from "@/lib/posts";
import { CATEGORY_LABELS } from "@/lib/post-constants";

export type PostCardProductInfo = {
  slug: string;
  name: string;
  iconUrl: string | null;
  themeColor: string | null;
};

type PostCardProps = {
  post: PostMeta;
  productInfo?: PostCardProductInfo;
};

export function PostCard({ post, productInfo }: PostCardProps) {
  return (
    <Link href={`/posts/${post.slug}`} className="block">
      <article className="relative p-4 border border-border rounded-xl bg-card overflow-hidden transition-shadow duration-300 hover:shadow-lg">
        <div className="space-y-2">
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
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {post.description}
          </p>

          {/* Category + Product */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="relative px-1.5 py-0.5 text-[11px] font-medium font-heading rounded border border-transparent overflow-hidden inline-block">
              <span className="absolute inset-0 tech-gradient opacity-15" />
              <span className="relative text-foreground">
                {CATEGORY_LABELS[post.category]}
              </span>
            </span>
            {productInfo && (
              <div
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium shrink-0"
                style={{
                  backgroundColor: productInfo.themeColor
                    ? `${productInfo.themeColor}18`
                    : "var(--color-muted)",
                  color: productInfo.themeColor ?? "var(--color-foreground)",
                }}
              >
                {productInfo.iconUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={productInfo.iconUrl}
                    alt={productInfo.name}
                    className="w-3.5 h-3.5 object-contain shrink-0"
                  />
                ) : (
                  <Package className="w-3 h-3 shrink-0" />
                )}
                <span>{productInfo.name}</span>
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
