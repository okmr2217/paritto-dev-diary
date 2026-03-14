"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";

type Props = {
  title: string;
  description: string;
  firstImageUrl: string | null;
  slug: string;
};

const W = 1080;
const H = 1920;
const PAD = 80;
const CONTENT_W = W - PAD * 2;

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}

function drawRoundedImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number,
) {
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.clip();

  // Cover-fit: fill the draw area while preserving aspect ratio (crop overflow)
  const imgAspect = img.naturalWidth / img.naturalHeight;
  const drawAspect = w / h;
  let sx = 0,
    sy = 0,
    sw = img.naturalWidth,
    sh = img.naturalHeight;
  if (imgAspect > drawAspect) {
    // Image is wider — crop sides
    sw = img.naturalHeight * drawAspect;
    sx = (img.naturalWidth - sw) / 2;
  } else {
    // Image is taller — crop top/bottom
    sh = img.naturalWidth / drawAspect;
    sy = (img.naturalHeight - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);

  ctx.restore();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines?: number,
): string[] {
  const lines: string[] = [];
  const chars = [...text];
  let current = "";

  for (const char of chars) {
    const test = current + char;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = char;
      if (maxLines && lines.length >= maxLines) {
        lines[lines.length - 1] =
          lines[lines.length - 1].slice(0, -1) + "…";
        return lines;
      }
    } else {
      current = test;
    }
  }
  if (current) {
    if (maxLines && lines.length >= maxLines) {
      lines[lines.length - 1] =
        lines[lines.length - 1].slice(0, -1) + "…";
    } else {
      lines.push(current);
    }
  }
  return lines;
}

export function StoryImageDownloader({
  title,
  description,
  firstImageUrl,
  slug,
}: Props) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generate = useCallback(async () => {
    setIsGenerating(true);

    try {
      await document.fonts.ready;

      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // --- White background with subtle warm tint ---
      ctx.fillStyle = "#fafaf9";
      ctx.fillRect(0, 0, W, H);

      // Subtle top accent gradient bar
      const accentGrad = ctx.createLinearGradient(0, 0, W, 0);
      accentGrad.addColorStop(0, "#0ea5e9");
      accentGrad.addColorStop(1, "#6366f1");
      ctx.fillStyle = accentGrad;
      ctx.fillRect(0, 0, W, 6);

      let y = PAD + 20;

      // --- Logo icon + Site name (horizontal) ---
      const logoImg = await loadImage("/icons/android-icon-192x192.png");
      const logoSize = 52;
      const siteNameText = "パリッと開発日記";
      ctx.font = "600 30px 'IBM Plex Sans JP', 'Noto Sans JP', sans-serif";
      const siteNameWidth = ctx.measureText(siteNameText).width;
      const gap = 16;
      const totalHeaderW = logoSize + gap + siteNameWidth;
      const headerStartX = (W - totalHeaderW) / 2;

      if (logoImg) {
        drawRoundedImage(
          ctx,
          logoImg,
          headerStartX,
          y,
          logoSize,
          logoSize,
          12,
        );
      }
      ctx.fillStyle = "#1e293b";
      ctx.textAlign = "left";
      ctx.font = "600 30px 'IBM Plex Sans JP', 'Noto Sans JP', sans-serif";
      const textY = y + logoSize / 2 + 10;
      ctx.fillText(siteNameText, headerStartX + logoSize + gap, textY);

      y += logoSize + 50;

      // --- Thin separator ---
      ctx.fillStyle = "#e2e8f0";
      ctx.fillRect(PAD, y, CONTENT_W, 1);
      y += 50;

      // --- Pre-calculate text heights to maximize image area ---
      const titleFontSize = 58;
      const titleLineH = titleFontSize * 1.45;
      ctx.font = `700 ${titleFontSize}px 'IBM Plex Sans JP', 'Noto Sans JP', sans-serif`;
      const titleLines = wrapText(ctx, title, CONTENT_W);
      const titleBlockH = titleLines.length * titleLineH + 20;

      const descFontSize = 30;
      const descLineH = descFontSize * 1.7;
      let descLines: string[] = [];
      let descBlockH = 0;
      if (description) {
        ctx.font = `400 ${descFontSize}px 'Noto Sans JP', sans-serif`;
        descLines = wrapText(ctx, description, CONTENT_W, 3);
        descBlockH = descLines.length * descLineH;
      }

      // Footer area: accent line + URL + bottom padding
      const footerH = 100;
      // Gaps between sections
      const imgBottomGap = 56;
      const textGap = 20;

      // Available height for image = total - header - separator - texts - footer
      const usedH = y + 50 + titleBlockH + textGap + descBlockH + imgBottomGap + footerH;
      const availableImgH = H - usedH;

      // --- Article image ---
      let articleImg: HTMLImageElement | null = null;
      if (firstImageUrl) {
        articleImg = await loadImage(firstImageUrl);
      }

      if (articleImg) {
        const imgAspect = articleImg.width / articleImg.height;
        const drawW = CONTENT_W;
        // Use natural aspect ratio, capped to available space
        const naturalH = drawW / imgAspect;
        const drawH = Math.min(naturalH, Math.max(availableImgH, 200));

        // Soft shadow behind image
        ctx.save();
        ctx.shadowColor = "rgba(0, 0, 0, 0.08)";
        ctx.shadowBlur = 32;
        ctx.shadowOffsetY = 8;
        ctx.fillStyle = "#ffffff";
        drawRoundedRect(ctx, PAD, y, drawW, drawH, 20);
        ctx.restore();

        drawRoundedImage(ctx, articleImg, PAD, y, drawW, drawH, 20);
        y += drawH + imgBottomGap;
      }

      // --- Title (larger) ---
      ctx.fillStyle = "#0f172a";
      ctx.font = `700 ${titleFontSize}px 'IBM Plex Sans JP', 'Noto Sans JP', sans-serif`;
      ctx.textAlign = "center";
      for (const line of titleLines) {
        ctx.fillText(line, W / 2, y + titleFontSize);
        y += titleLineH;
      }
      y += textGap;

      // --- Description ---
      if (descLines.length > 0) {
        ctx.fillStyle = "#64748b";
        ctx.font = `400 ${descFontSize}px 'Noto Sans JP', sans-serif`;
        for (const line of descLines) {
          ctx.fillText(line, W / 2, y + descFontSize);
          y += descLineH;
        }
      }

      // --- Bottom section ---
      // Gradient accent line
      const lineW = 80;
      const lineX = (W - lineW) / 2;
      const lineY = H - PAD - 70;
      const lineGrad = ctx.createLinearGradient(lineX, 0, lineX + lineW, 0);
      lineGrad.addColorStop(0, "#0ea5e9");
      lineGrad.addColorStop(1, "#6366f1");
      ctx.fillStyle = lineGrad;
      ctx.beginPath();
      ctx.roundRect(lineX, lineY, lineW, 4, 2);
      ctx.fill();

      // Site URL
      ctx.fillStyle = "#94a3b8";
      ctx.font = "400 22px 'Noto Sans JP', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("paritto-dev-diary.vercel.app", W / 2, H - PAD - 20);

      // --- Download ---
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${slug}-story.png`;
        a.click();
        URL.revokeObjectURL(url);
      }, "image/png");
    } catch (error) {
      console.error("Story image generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [title, description, firstImageUrl, slug]);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={generate}
      disabled={isGenerating}
    >
      {isGenerating ? (
        <>
          <Loader2 className="animate-spin" />
          生成中...
        </>
      ) : (
        <>
          <Download />
          ストーリー用画像をダウンロード
        </>
      )}
    </Button>
  );
}
