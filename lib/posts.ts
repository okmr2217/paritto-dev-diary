import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { cache } from "react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import remarkToc from "remark-toc";
import rehypeSlug from "rehype-slug";

export type { PostCategory } from "@/lib/post-constants";
export { CATEGORY_LABELS } from "@/lib/post-constants";
import type { PostCategory } from "@/lib/post-constants";

const postsDirectory = path.join(process.cwd(), "content/posts");

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  description: string;
  category: PostCategory;
  productSlug?: string;
  draft?: boolean;
};

export type Post = PostMeta & {
  content: string;
  firstImageUrl: string | null;
};

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const posts = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);

      return {
        slug,
        title: data.title || slug,
        date: data.date || "",
        description: data.description || "",
        category: (data.category as PostCategory) || "A",
        productSlug: data.productSlug || undefined,
        draft: data.draft === true,
      };
    })
    .filter((post) => !post.draft);

  return posts.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export const getPostBySlug = cache(async function getPostBySlug(
  slug: string,
): Promise<Post | null> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  if (data.draft === true) {
    return null;
  }

  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkToc, { heading: "目次" })
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeStringify)
    .process(content);
  const contentHtml = processedContent.toString();

  const imageMatch = content.match(/!\[.*?\]\((.*?)\)/);
  const firstImageUrl = imageMatch ? imageMatch[1] : null;

  return {
    slug,
    title: data.title || slug,
    date: data.date || "",
    description: data.description || "",
    category: (data.category as PostCategory) || "A",
    content: contentHtml,
    firstImageUrl,
  };
});

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .filter((fileName) => {
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);
      return data.draft !== true;
    })
    .map((fileName) => fileName.replace(/\.md$/, ""));
}
