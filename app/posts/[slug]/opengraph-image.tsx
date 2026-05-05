import { ImageResponse } from 'next/og'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { CATEGORY_LABELS } from '@/lib/post-constants'
import type { PostCategory } from '@/lib/post-constants'
import { getAllPostSlugs } from '@/lib/posts'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

async function loadFont(weight: 400 | 700): Promise<ArrayBuffer> {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@${weight}`,
    {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1',
      },
    }
  ).then((res) => res.text())

  const url = css.match(/src: url\(([^)]+)\)/)?.[1]
  if (!url) throw new Error(`Font not found (weight: ${weight})`)
  return fetch(url).then((res) => res.arrayBuffer())
}

function getPostMeta(slug: string) {
  const fullPath = path.join(process.cwd(), 'content/posts', `${slug}.md`)
  if (!fs.existsSync(fullPath)) return null

  const { data } = matter(fs.readFileSync(fullPath, 'utf8'))
  if (data.draft === true) return null

  return {
    title: (data.title ?? slug) as string,
    description: (data.description ?? '') as string,
    category: (data.category ?? null) as PostCategory | null,
    date: (data.date ?? '') as string,
  }
}

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostMeta(slug)

  const [fontRegular, fontBold] = await Promise.all([loadFont(400), loadFont(700)])

  const profileImageBuffer = fs.readFileSync(path.join(process.cwd(), 'public/profile.jpg'))
  const profileImageSrc = `data:image/jpeg;base64,${profileImageBuffer.toString('base64')}`

  const title = post?.title ?? 'パリッと開発日記'
  const description = post?.description ?? ''
  const categoryLabel = post?.category ? CATEGORY_LABELS[post.category] : null
  const date = post?.date ?? ''

  let formattedDate = ''
  if (date) {
    const d = new Date(date)
    formattedDate = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          backgroundColor: '#f9fafb',
          display: 'flex',
          flexDirection: 'column',
          padding: '60px',
          fontFamily: 'NotoSansJP',
        }}
      >
        {/* Category + date */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '36px',
          }}
        >
          {categoryLabel ? (
            <div
              style={{
                display: 'flex',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                borderRadius: '9999px',
                padding: '6px 18px',
                fontSize: '16px',
                fontWeight: 500,
                border: '1px solid #bfdbfe',
              }}
            >
              {categoryLabel}
            </div>
          ) : null}
          {formattedDate ? (
            <div style={{ display: 'flex', fontSize: '16px', color: '#9ca3af' }}>
              {formattedDate}
            </div>
          ) : null}
        </div>

        {/* Title + description */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: '48px',
              fontWeight: 700,
              color: '#111827',
              lineHeight: 1.35,
              overflow: 'hidden',
            }}
          >
            {title}
          </div>
          {description ? (
            <div
              style={{
                display: 'flex',
                fontSize: '22px',
                color: '#6b7280',
                lineHeight: 1.6,
                overflow: 'hidden',
              }}
            >
              {description}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid #e5e7eb',
            paddingTop: '24px',
            marginTop: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src={profileImageSrc}
              width={48}
              height={48}
              alt=""
              style={{ borderRadius: '50%' }}
            />
            <div style={{ display: 'flex', fontSize: '18px', fontWeight: 500, color: '#111827' }}>
              Daichi
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '4px',
            }}
          >
            <div style={{ display: 'flex', fontSize: '16px', fontWeight: 500, color: '#374151' }}>
              パリッと開発日記
            </div>
            <div style={{ display: 'flex', fontSize: '14px', color: '#9ca3af' }}>
              paritto-dev-diary.vercel.app
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'NotoSansJP', data: fontRegular, weight: 400 },
        { name: 'NotoSansJP', data: fontBold, weight: 700 },
      ],
    }
  )
}
