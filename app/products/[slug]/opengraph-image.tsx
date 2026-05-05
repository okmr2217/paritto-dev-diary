import { ImageResponse } from 'next/og'
import { prisma } from '@/lib/prisma'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const revalidate = 60

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

const STATUS_LABELS: Record<string, string> = {
  IDEA: '構想中',
  DEVELOPING: '開発中',
  RELEASED: 'リリース済',
  MAINTENANCE: 'メンテナンス',
  PAUSED: '休止中',
}

const STATUS_BADGE: Record<string, { bg: string; text: string; border: string }> = {
  IDEA: { bg: '#f8fafc', text: '#475569', border: '#e2e8f0' },
  DEVELOPING: { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
  RELEASED: { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
  MAINTENANCE: { bg: '#fefce8', text: '#854d0e', border: '#fef08a' },
  PAUSED: { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca' },
}

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    where: { isPublic: true },
    select: { slug: true },
  })
  return products.map((p) => ({ slug: p.slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const product = await prisma.product.findFirst({
    where: { slug, isPublic: true },
    select: {
      name: true,
      description: true,
      iconUrl: true,
      status: true,
      stacks: true,
      releases: {
        where: { isDraft: false },
        orderBy: { releaseDate: 'asc' },
        select: { releaseDate: true },
      },
    },
  })

  const [fontRegular, fontBold] = await Promise.all([loadFont(400), loadFont(700)])

  const name = product?.name ?? 'プロダクト'
  const description = product?.description ?? ''
  const iconUrl = product?.iconUrl ?? null
  const status = product?.status ?? 'RELEASED'
  const stacks = (product?.stacks ?? []).slice(0, 6)
  const releases = product?.releases ?? []
  const releasesCount = releases.length
  const firstRelease = releases[0] ?? null
  const d = firstRelease ? new Date(firstRelease.releaseDate) : null
  const releaseDateStr = d ? `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}` : null

  const badge = STATUS_BADGE[status] ?? STATUS_BADGE.RELEASED
  const statusLabel = STATUS_LABELS[status] ?? status

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
        {/* Main row */}
        <div style={{ display: 'flex', flex: 1, gap: '48px' }}>
          {/* Left column */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Icon + name + status badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '32px',
                marginBottom: '28px',
              }}
            >
              {iconUrl ? (
                <img
                  src={iconUrl}
                  width={128}
                  height={128}
                  alt=""
                  style={{ borderRadius: '16px', flexShrink: 0 }}
                />
              ) : (
                <div
                  style={{
                    width: '128px',
                    height: '128px',
                    borderRadius: '16px',
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '36px',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {name.charAt(0)}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div
                  style={{
                    display: 'flex',
                    fontSize: '64px',
                    fontWeight: 700,
                    color: '#111827',
                    lineHeight: 1.1,
                  }}
                >
                  {name}
                </div>
                <div
                  style={{
                    display: 'flex',
                    backgroundColor: badge.bg,
                    color: badge.text,
                    borderRadius: '9999px',
                    padding: '5px 14px',
                    fontSize: '15px',
                    fontWeight: 500,
                    border: `1px solid ${badge.border}`,
                    alignSelf: 'flex-start',
                  }}
                >
                  {statusLabel}
                </div>
              </div>
            </div>

            {description ? (
              <div
                style={{
                  display: 'flex',
                  fontSize: '22px',
                  color: '#4b5563',
                  lineHeight: 1.6,
                  marginBottom: '24px',
                }}
              >
                {description}
              </div>
            ) : null}

            <div style={{ display: 'flex', flex: 1 }} />

            {stacks.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {stacks.map((tech) => (
                  <div
                    key={tech}
                    style={{
                      display: 'flex',
                      backgroundColor: '#eff6ff',
                      color: '#2563eb',
                      borderRadius: '9999px',
                      padding: '6px 16px',
                      fontSize: '15px',
                      fontWeight: 500,
                      border: '1px solid #bfdbfe',
                    }}
                  >
                    {tech}
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {/* Right column – stat cards */}
          <div
            style={{
              width: '200px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '20px',
                backgroundColor: '#ffffff',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  fontSize: '48px',
                  fontWeight: 700,
                  color: '#111827',
                  lineHeight: 1,
                }}
              >
                {String(releasesCount)}
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: '15px',
                  color: '#9ca3af',
                  marginTop: '8px',
                }}
              >
                リリース
              </div>
            </div>

            {releaseDateStr ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '20px',
                  backgroundColor: '#ffffff',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#111827',
                    lineHeight: 1.2,
                    textAlign: 'center',
                  }}
                >
                  {releaseDateStr}
                </div>
                <div
                  style={{
                    display: 'flex',
                    fontSize: '13px',
                    color: '#9ca3af',
                    marginTop: '8px',
                  }}
                >
                  初回リリース
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '24px',
          }}
        >
          <div style={{ display: 'flex', fontSize: '16px', color: '#6b7280', fontWeight: 500 }}>
            パリッと開発日記
          </div>
          <div style={{ display: 'flex', fontSize: '14px', color: '#9ca3af' }}>
            {`paritto-dev-diary.vercel.app/products/${slug}`}
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
