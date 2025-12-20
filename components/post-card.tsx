import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PostMeta } from "@/lib/posts";
import { getThumbnailUrl } from "@/lib/cloudinary";

type PostCardProps = {
  post: PostMeta;
};

export function PostCard({ post }: PostCardProps) {
  const thumbnailUrl = post.thumbnail ? getThumbnailUrl(post.thumbnail) : null;

  return (
    <Link href={`/posts/${post.slug}`}>
      <Card className="overflow-hidden transition-colors hover:bg-muted/50 pt-0 pb-4 gap-0 h-full">
        {thumbnailUrl && (
          <div className="relative aspect-video w-full">
            <Image
              src={thumbnailUrl}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="eager"
            />
          </div>
        )}
        <CardHeader className="p-4 pb-3">
          <CardTitle className="text-xl">{post.title}</CardTitle>
          <time className="text-sm text-muted-foreground">{post.date}</time>
        </CardHeader>
        <CardContent className="px-4">
          <p className="text-muted-foreground">{post.description}</p>
          {post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
