"use client";

import { useEffect, useRef } from "react";

type ArticleContentProps = {
  html: string;
};

export function ArticleContent({ html }: ArticleContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const images = container.querySelectorAll("img");

    const handleLoad = (img: HTMLImageElement) => {
      if (img.naturalHeight > img.naturalWidth) {
        img.classList.add("portrait-image");
      }
    };

    images.forEach((img) => {
      if (img.complete) {
        handleLoad(img);
      } else {
        img.addEventListener("load", () => handleLoad(img), { once: true });
      }
    });
  }, [html]);

  return (
    <div
      ref={contentRef}
      className="prose prose-sm dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
