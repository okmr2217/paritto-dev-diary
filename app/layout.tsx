import type { Metadata } from "next";
import { Noto_Sans_JP, Zen_Maru_Gothic } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp"
});

const zenMaruGothic = Zen_Maru_Gothic({
  subsets: ["latin"],
  variable: "--font-zen-maru-gothic",
  weight: ["700"]
});

export const metadata: Metadata = {
  title: "パリッと開発日記",
  description: "フロントエンドを中心とした開発日記ブログです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning className="scroll-pt-16">
      <body className={`${notoSansJP.variable} ${zenMaruGothic.variable} font-sans antialiased`}>
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="container max-w-172 mx-auto flex-1 p-4 pb-12">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
