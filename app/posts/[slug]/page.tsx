import { notFound } from "next/navigation";
import { getPostBySlug, getAllPostSlugs } from "@/lib/posts";
import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { ArticleContent } from "@/components/article-content";
import { StoryImageDownloader } from "@/components/story-image-downloader";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "記事が見つかりません" };
  }

  const description =
    post.description ||
    post.content.replace(/<[^>]*>/g, "").slice(0, 150).trim();
  const url = `https://paritto-dev-diary.vercel.app/posts/${slug}`;

  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      type: "article",
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <PageHero title={post.title}>
        <div className="flex flex-col gap-3 mt-1">
          <time className="text-sm text-muted-foreground/80">{post.date}</time>
        </div>
      </PageHero>
      <ArticleContent html={post.content} />
      <div className="flex justify-center pt-4">
        <StoryImageDownloader
          title={post.title}
          description={post.description}
          firstImageUrl={post.firstImageUrl}
          slug={slug}
        />
      </div>
    </div>
  );
}
