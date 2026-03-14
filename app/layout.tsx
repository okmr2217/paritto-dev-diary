import type { Metadata } from "next";
import {
  IBM_Plex_Sans_JP,
  Noto_Sans_JP,
  JetBrains_Mono,
} from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";

const ibmPlexSansJP = IBM_Plex_Sans_JP({
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans-jp",
  weight: ["400", "500", "600", "700"],
});

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
  weight: ["400", "500"],
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://paritto-dev-diary.vercel.app",
  ),
  title: {
    default: "パリッと開発日記",
    template: "%s | パリッと開発日記",
  },
  description: "フロントエンドを中心とした開発日記ブログです。",
  openGraph: {
    title: "パリッと開発日記",
    description: "フロントエンドを中心とした開発日記ブログです。",
    type: "website",
    locale: "ja_JP",
    url: "https://paritto-dev-diary.vercel.app/",
    siteName: "パリッと開発日記",
  },
  twitter: {
    card: "summary_large_image",
    title: "パリッと開発日記",
    description: "フロントエンドを中心とした開発日記ブログです。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning className="scroll-pt-16">
      <body
        className={`${ibmPlexSansJP.variable} ${notoSansJP.variable} ${jetBrainsMono.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="container max-w-4xl mx-auto flex-1 p-4 pb-12">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
