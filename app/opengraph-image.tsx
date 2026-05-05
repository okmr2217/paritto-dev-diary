import { ImageResponse } from 'next/og'

export const runtime = 'edge'
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

const TECH_STACKS = ['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Prisma']
const STATS = [
  { value: '8', label: '記事' },
  { value: '13', label: 'プロダクト' },
  { value: '25', label: 'リリース' },
]

export default async function Image() {
  const [fontRegular, fontBold] = await Promise.all([loadFont(400), loadFont(700)])

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
            <div
              style={{
                display: 'flex',
                fontSize: '52px',
                fontWeight: 700,
                color: '#111827',
                lineHeight: 1.2,
                marginBottom: '16px',
              }}
            >
              パリッと開発日記
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: '24px',
                color: '#4b5563',
                marginBottom: '20px',
              }}
            >
              個人開発のリアルな試行錯誤を発信
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: '18px',
                color: '#6b7280',
                lineHeight: 1.7,
              }}
            >
              Next.js を中心としたモダンな技術スタックで、個人開発のリアルな試行錯誤を発信する Web Developer Daichi の開発日記ブログです。
            </div>
            <div style={{ display: 'flex', flex: 1 }} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {TECH_STACKS.map((tech) => (
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
            {STATS.map(({ value, label }) => (
              <div
                key={label}
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
                  {value}
                </div>
                <div
                  style={{
                    display: 'flex',
                    fontSize: '15px',
                    color: '#9ca3af',
                    marginTop: '8px',
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '24px',
          }}
        >
          <div style={{ display: 'flex', fontSize: '14px', color: '#9ca3af' }}>
            paritto-dev-diary.vercel.app
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
