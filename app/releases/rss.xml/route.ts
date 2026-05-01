import { prisma } from "@/lib/prisma";
import { RELEASE_TYPE_LABELS } from "@/lib/product-constants";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://paritto-dev-diary.vercel.app";

export async function GET() {
  const releases = await prisma.release.findMany({
    where: { isDraft: false },
    orderBy: { releaseDate: "desc" },
    take: 50,
    select: {
      id: true,
      version: true,
      title: true,
      content: true,
      releaseDate: true,
      type: true,
      product: { select: { slug: true, name: true } },
    },
  });

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>パリッと開発日記 - Releases</title>
    <link>${BASE_URL}/releases</link>
    <description>個人開発プロダクトのリリースノート</description>
    <language>ja</language>
    <atom:link href="${BASE_URL}/releases/rss.xml" rel="self" type="application/rss+xml"/>
    ${releases
      .map(
        (r) => `<item>
      <title>${escapeXml(r.product.name)} ${escapeXml(r.version)} — ${escapeXml(r.title)} [${RELEASE_TYPE_LABELS[r.type] ?? r.type}]</title>
      <link>${BASE_URL}/products/${r.product.slug}</link>
      <guid isPermaLink="false">${BASE_URL}/releases#${r.id}</guid>
      <pubDate>${new Date(r.releaseDate).toUTCString()}</pubDate>
      <description>${escapeXml(r.content)}</description>
    </item>`,
      )
      .join("\n    ")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
